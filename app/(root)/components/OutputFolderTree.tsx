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

const OutputFolderTree: React.FC<{ project: SendAgentRequest , isAgentRun: boolean}> = ({ project , isAgentRun}) => {
    const [data, setData] = useState<TreeData[]>([]);
    const [selectedNode, setSelectedNode] = useState<TreeData | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const ws = useRef<WebSocket | null>(null);

    const getLanguageForFile = (fileName: string) => {
        const extension = fileName.split('.').pop();
        switch (extension){
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
                return 'c';          // C language
            case 'cpp':
            case 'cc':
            case 'cxx':
            case 'h':
            case 'hpp':
                return 'cpp';        // C++ language
            case 'cs':
                return 'csharp';     // C# language
            case 'rs':
                return 'rust';
            default:
                return 'plaintext';
        }
    }

    useEffect(() => {
        const connectWebSocket = async () => {
            try {
                if(isAgentRun){
                const { token } = await getCurrentUser();
                ws.current = new WebSocket(`ws://localhost:8000/ws/output_folder?output_path=${project.output_path}&token=${token}`);

                // Handle WebSocket messages
                ws.current.onmessage = (event: MessageEvent) => {
                    const data = JSON.parse(event.data);
                    if (data.type === 'folder_structure') {
                        setData([convertToTree(data.structure)]);
                    } else if (data.type === 'file_content') {
                        console.log(data.content)
                        setFileContent(data.content);
                    } else if (data.type === 'update') {
                        if (selectedNode && data.file_path === selectedNode.id) {
                            setFileContent(data.content);
                        }
                    }
                };

                ws.current.onclose = () => {
                    console.log('WebSocket closed');
                };

                ws.current.onerror = (error) => {
                    console.error('WebSocket error:', error);
                }}
                ;
            } catch (error) {
                console.error('Error setting up WebSocket:', error);
            }
        };

        connectWebSocket();

        // Clean up WebSocket on component unmount
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [project.output_path]);

    const convertToTree = (structure: any): TreeData => {
        const convert = (
            folderName: string,
            folderContent: any,
            path: string = '',
            isRoot: boolean = false
        ): TreeData => {
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
                id: currentPath || '/output',
                name: isRoot ? '/output' : folderName || 'Unnamed Folder',
                isOpen: isRoot,
                children,
            };
        };

        return convert('/output', structure || {}, '', true);
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

    return (
        <div className="text-white md:flex-row h-full pt-5 w-full px-5">
            <div className="rounded-lg h-[500px]">
            <MonacoEditor
                height="100%"
                defaultLanguage={selectedNode?.name ? getLanguageForFile(selectedNode.name) : 'python'}  // Default to 'plaintext' when no file is selected
                value={fileContent || '### No file selected or file not found'}
                onChange={handleEditorChange}
                theme="vs-dark"
                // options={{
                //     minimap: { enabled: false},
                // }}
            />

            </div>
            {data.length > 0 ? (
                <div className="overflow-auto rounded-lg pt-5">
                <Tree<TreeData>
                    data={data}
                    width={600}
                    height={400}
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
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
    
};

export default OutputFolderTree;
