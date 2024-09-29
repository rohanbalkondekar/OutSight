import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Tree, NodeApi } from 'react-arborist';
import { getCurrentUser } from '@/lib/actions';
import { SendAgentRequest } from '@/lib/models/request';

// Dynamically import the Monaco editor for client-side only rendering
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface TreeData {
    id: string;
    name: string;
    isOpen?: boolean;
    children?: TreeData[];
}

interface FolderTreeProps {
    project: SendAgentRequest;
    isAgentRun: boolean;
    inputType: 'input' | 'output';
}

const TreeFolder: React.FC<FolderTreeProps> = ({ project, isAgentRun, inputType }) => {
    const [data, setData] = useState<TreeData[]>([]);
    const [selectedNode, setSelectedNode] = useState<TreeData | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('');
    const ws = useRef<WebSocket | null>(null);

    const getLanguageForFile = (fileName: string) => {
        const extension = fileName.split('.').pop();
        switch (extension) {
            case 'js':
                return 'javascript';
            case 'ts':
                return 'typescript';
            case 'py':
                return 'python';
            case 'html':
                return 'html';
            case 'css':
                return 'css';
            case 'json':
                return 'json';
            case 'md':
                return 'markdown';
            case 'c':
                return 'c'; // C language
            case 'cpp':
            case 'cc':
            case 'cxx':
            case 'h':
            case 'hpp':
                return 'cpp'; // C++ language
            case 'cs':
                return 'csharp'; // C# language
            case 'rs':
                return 'rust';
            default:
                return 'plaintext';
        }
    };

    useEffect(() => {
        const connectWebSocket = async () => {
            try {
                const { token } = await getCurrentUser();

                // Build pathParam and endpoint based on inputType and isAgentRun
                const pathParam = isAgentRun
                    ? `output_path=${project.output_path}`
                    : `input_path=${project.entry_path}`;
                const endpoint = isAgentRun ? "output_folder" : "input_folder";

                // WebSocket connection URL
                ws.current = new WebSocket(`ws://localhost:8000/tree/${endpoint}?${pathParam}&token=${token}`);

                // Handle WebSocket messages
                ws.current.onmessage = (event: MessageEvent) => {
                    const data = JSON.parse(event.data);
                    if (data.type === 'folder_structure') {
                        setData([convertToTree(data.structure, `/${inputType}`)]);
                    } else if (data.type === 'file_content') {
                        setFileContent(data.content);
                    } else if (data.type === 'success') {
                        setMessage(data.message);
                    } else if (data.type === 'update') {
                        if (selectedNode && data.file_path === selectedNode.id) {
                            setFileContent(data.content);
                        }
                    }
                };

                ws.current.onclose = () => {
                    console.log(`${inputType} WebSocket closed`);
                };

                ws.current.onerror = (error) => {
                    console.error(`${inputType} WebSocket error:`, error);
                };
            } catch (error) {
                console.error(`Error setting up ${inputType} WebSocket:`, error);
            }
        };

        connectWebSocket();

        // Clean up WebSocket on component unmount
        return () => {
            if (ws.current) ws.current.close();
        };
    }, [project.entry_path, project.output_path, isAgentRun, inputType]);

    const convertToTree = (structure: any, rootName: string): TreeData => {
        const convert = (folderName: string, folderContent: any, path: string = '', isRoot: boolean = false): TreeData => {
            const currentPath = isRoot ? '' : `${path}/${folderName}`;
            const children: TreeData[] = [];

            if (folderContent?.folders) {
                for (const [subFolderName, subFolderContent] of Object.entries(folderContent.folders)) {
                    children.push(convert(subFolderName, subFolderContent, currentPath, false));
                }
            }

            if (folderContent?.files) {
                for (const fileName of folderContent.files) {
                    const filePath = `${currentPath}/${fileName}`;
                    children.push({ id: filePath, name: fileName });
                }
            }

            return {
                id: currentPath || rootName,
                name: isRoot ? rootName : folderName || 'Unnamed Folder',
                isOpen: isRoot,
                children,
            };
        };

        return convert(rootName, structure || {}, '', true);
    };

    const handleNodeSelect = (nodes: NodeApi<TreeData>[]) => {
        if (nodes.length > 0) {
            setSelectedNode(nodes[0].data);
            if (nodes[0].data.id && ws.current) {
                ws.current.send(
                    JSON.stringify({
                        type: 'open_file',
                        file_path: nodes[0].data.id,
                        output_path: project.output_path,
                    })
                );
            }
        } else {
            setSelectedNode(null);
            setFileContent(null);
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        if (selectedNode && ws.current) {
            const message = {
                type: 'update_file',
                file_path: selectedNode.id,
                content: value,
                output_path: project.output_path,
            };
            ws.current.send(JSON.stringify(message));
        }
    };

    const handleAddToGitignore = () => {
        sendWebSocketMessage('add_to_gitignore');
    };

    const handleAddToGptignore = () => {
        sendWebSocketMessage('add_to_gptignore');
    };

    const sendWebSocketMessage = (type: string) => {
        if (selectedNode && ws.current) {
            const message = {
                type,
                file_path: selectedNode.id,
                input_path: project.entry_path,
            };
            ws.current.send(JSON.stringify(message));
        }
    };

    return (
        <div className="flex h-full w-full">    
            {/* Folder Tree and Buttons on the Left */}
            <div className="flex-1 flex flex-col justify-between text-white w-1/3">
                {/* Folder Tree */}
                <div className="overflow-auto rounded-lg pt-5">
                    <Tree<TreeData>
                        data={data}
                        width={400}
                        height={500}
                        onSelect={handleNodeSelect}
                        indent={24}
                        rowHeight={36}
                    >
                        {({ node, style, dragHandle }) => (
                            <div
                                style={style}
                                ref={dragHandle}
                                className={`tree-node ${node.data === selectedNode ? 'selected' : ''}`}
                                onClick={() => {
                                    node.toggle();
                                    setSelectedNode(node.data);
                                }}
                            >
                                {node.isLeaf ? '📄' : '📂'} {node.data.name}
                            </div>
                        )}
                    </Tree>

                    {/* Buttons for .gitignore and .gptignore */}
                    <div className="flex flex-row gap-2 mt-2">
                        <button
                            onClick={handleAddToGitignore}
                            disabled={!selectedNode}
                            className="bg-gray-700 text-white p-2 rounded-md"
                        >
                            Add to .gitignore
                        </button>
                        {!isAgentRun && (
                            <button
                                onClick={handleAddToGptignore}
                                disabled={!selectedNode}
                                className="bg-gray-700 text-white p-2 rounded-md"
                            >
                                Add to .gptignore
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Monaco Editor for file editing on the Right */}
            <div className="flex-2 h-screen md:h-[600px] w-2/3 rounded-lg mb-4 md:mb-0 md:mr-4">
                <MonacoEditor
                    height="100%"
                    defaultLanguage={selectedNode?.name ? getLanguageForFile(selectedNode.name) : 'python'}
                    value={fileContent || '### No file selected or file not found'}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                />
            </div>
        </div>
    );
};

export default TreeFolder;
