import React, { useState, useEffect } from 'react';
import { Tree, NodeApi } from 'react-arborist';
import { getDataFolder } from '../api/apiMethod';
import { getCurrentUser } from '@/lib/actions';
import { AgentRequest } from '@/lib/models/request';

interface TreeData {
    id: string;
    name: string;
    toggled?: boolean; // Add toggled property to control node's default open state
    children?: TreeData[];
}

const FolderTree: React.FC<{ project: AgentRequest }> = ({ project }) => {
    const [data, setData] = useState<TreeData[]>([]);
    const [selectedNode, setSelectedNode] = useState<TreeData | null>(null);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { token } = await getCurrentUser();
                const response = await getDataFolder('folder-structure', token, project.entry_path);
                const result = await response.data;

                setData([convertToTree(result)]);
            } catch (error) {
                console.error("Error fetching folder structure:", error);
            }
        };

        fetchData();
    }, [project.entry_path]);

    const convertToTree = (structure: any): TreeData => {
        const convert = (folderName: string, folderContent: any, isRoot: boolean = false): TreeData => {
            const children: TreeData[] = [];

            // Handle folders
            if (folderContent?.folders) {
                for (const [subFolderName, subFolderContent] of Object.entries(folderContent.folders)) {
                    children.push(convert(subFolderName, subFolderContent, false)); // subfolders are not root
                }
            }

            // Handle files
            if (folderContent?.files) {
                for (const fileName of folderContent.files) {
                    children.push({ id: fileName, name: fileName });
                }
            }

            return {
                id: folderName,
                name: folderName || 'Unnamed Folder',
                toggled: isRoot, // Only root folder is toggled by default
                children,
            };
        };

        return convert("/", structure || {}, true); // Root folder is toggled open
    };

    const handleNodeSelect = (nodes: NodeApi<TreeData>[]) => {
        if (nodes.length > 0) {
            setSelectedNode(nodes[0].data); // Access the TreeData object through node.data
        } else {
            setSelectedNode(null);
        }
    };

    const handleWebSocketRequest = (type: string) => {
        if (selectedNode) {
            const openWebSocket = async () => {
                const { token } = await getCurrentUser();
                const ws = new WebSocket(`ws://localhost:8000/ws/tree_folder?&token=${token}`);
                
                ws.onopen = () => {
                    ws.send(JSON.stringify({ type, file_path: selectedNode.name, input_path: project.entry_path }));
                };
                
                ws.onmessage = (event) => {
                    setMessage(event.data);
                    ws.close(); // Close the WebSocket after receiving the message
                };
                
                ws.onclose = () => console.log("WebSocket connection closed");
            };

            openWebSocket();
        }
    };

    const handleAddToGitignore = () => {
        handleWebSocketRequest('add_to_gitignore');
    };

    const handleAddToGptignore = () => {
        handleWebSocketRequest('add_to_gptignore');
    };

    return (
        <div className='text-white'>
            <div>{message && <p>{message}</p>}</div>
            {data.length > 0 ? (
                <Tree<TreeData>
                    data={data}
                    width={600}
                    height={400}
                    onSelect={handleNodeSelect}
                    openByDefault={false}
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
                                setSelectedNode(node.data); // Set the node as selected when clicked
                            }}
                        >
                            {node.isLeaf ? '📄' : '📂'} {node.data.name}
                        </div>
                    )}
                </Tree>
            ) : (
                <p>Loading...</p>
            )}
            <div className='flex flex-row gap-2 mt-2'>
                <button
                    onClick={handleAddToGitignore}
                    disabled={!selectedNode}
                    className='bg-gray-700 text-white p-2 rounded-md'
                >
                    Add to .gitignore
                </button>
                <button
                    onClick={handleAddToGptignore}
                    disabled={!selectedNode}
                    className='bg-gray-700 text-white p-2 rounded-md'
                >
                    Add to .gptignore
                </button>
            </div>
        </div>
    );
};

export default FolderTree;
