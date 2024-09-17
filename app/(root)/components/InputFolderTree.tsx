import React, { useState, useEffect, useRef } from 'react';
import { Tree, NodeApi } from 'react-arborist';
import { getCurrentUser } from '@/lib/actions';
import { AgentRequest } from '@/lib/models/request';

interface TreeData {
    id: string;
    name: string;
    isOpen?: boolean;
    children?: TreeData[];
}

const InputFolderTree: React.FC<{ project: AgentRequest }> = ({ project }) => {
    const [data, setData] = useState<TreeData[]>([]);
    const [selectedNode, setSelectedNode] = useState<TreeData | null>(null);
    const [message, setMessage] = useState<string>('');
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connectWebSocket = async () => {
            try {
                const { token } = await getCurrentUser();
                ws.current = new WebSocket(`ws://localhost:8000/ws/tree_folder?input_path=${project.entry_path}&token=${token}`);

                // Handle WebSocket messages
                ws.current.onmessage = (event: MessageEvent) => {
                    const data = JSON.parse(event.data);
                    if (data.type === 'folder_structure') {
                        // Update the folder structure when received
                        setData([convertToTree(data.structure)]);
                    } else if (data.type === 'success') {
                        // Handle success messages (e.g., after adding to .gitignore)
                        setMessage(data.message);
                    }
                };

                ws.current.onclose = () => {
                    console.log('WebSocket closed');
                };

                ws.current.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };
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
    }, [project.entry_path]);

    const convertToTree = (structure: any): TreeData => {
        const convert = (
            folderName: string,
            folderContent: any,
            path: string = '',
            isRoot: boolean = false
        ): TreeData => {
            const currentPath = isRoot ? '' : `${path}/${folderName}`;
            const children: TreeData[] = [];

            // Handle folders
            if (folderContent?.folders) {
                for (const [subFolderName, subFolderContent] of Object.entries(folderContent.folders)) {
                    children.push(convert(subFolderName, subFolderContent, currentPath, false));
                }
            }

            // Handle files
            if (folderContent?.files) {
                for (const fileName of folderContent.files) {
                    const filePath = `${currentPath}/${fileName}`;
                    children.push({ id: filePath, name: fileName });
                }
            }

            return {
                id: currentPath || '/input',
                name: isRoot ? '/input' : folderName || 'Unnamed Folder',
                isOpen: isRoot, // Only root folder is open by default
                children,
            };
        };

        return convert('/input', structure || {}, '', true);
    };

    const handleNodeSelect = (nodes: NodeApi<TreeData>[]) => {
        if (nodes.length > 0) {
            setSelectedNode(nodes[0].data);
        } else {
            setSelectedNode(null);
        }
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

    const handleAddToGitignore = () => {
        sendWebSocketMessage('add_to_gitignore');
    };

    const handleAddToGptignore = () => {
        sendWebSocketMessage('add_to_gptignore');
    };

    return (
        <div className="text-white">
            <div>{message && <p>{message}</p>}</div>
            {data.length > 0 ? (
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
            ) : (
                <p>Loading...</p>
            )}
            <div className="flex flex-row gap-2 mt-2">
                <button
                    onClick={handleAddToGitignore}
                    disabled={!selectedNode}
                    className="bg-gray-700 text-white p-2 rounded-md"
                >
                    Add to .gitignore
                </button>
                <button
                    onClick={handleAddToGptignore}
                    disabled={!selectedNode}
                    className="bg-gray-700 text-white p-2 rounded-md"
                >
                    Add to .gptignore
                </button>
            </div>
        </div>
    );
};

export default InputFolderTree;
