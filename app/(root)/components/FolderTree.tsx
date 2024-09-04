// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Treebeard, TreeNode } from 'react-treebeard';
// import { getDataFolder } from '../api/apiMethod';
// import { getCurrentUser } from '@/lib/actions';
// import { AgentRequest } from '@/lib/models/request';



// interface TreeData {
//     name: string; // Ensure name is always a string
//     toggled?: boolean;
//     children?: TreeData[];
// }

// const FolderTree: React.FC<{ project: AgentRequest }> = ({ project }) => {
//     const [data, setData] = useState<TreeData | null>(null);
//     const [cursor, setCursor] = useState<TreeNode | null>(null);
//     const [socket, setSocket] = useState<WebSocket | null>(null);
//     const [message, setMessage] = useState<string>('');


//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         try {
//     //             const { token } = await getCurrentUser();

//     //             const response = await getDataFolder('folder-structure', token, project.entry_path);
//     //             const result = await response.data;
//     //             console.log("Result:" , result)
//     //             setData(convertToTree(result));
//     //         } catch (error) {
//     //             console.error("Error fetching folder structure:", error);
//     //         }
//     //     };
//     //     fetchData();

//     //     const ws = new WebSocket(`ws://localhost:8000/ws/migration?input_path=${encodeURIComponent(project.entry_path)}`);
//     //     ws.onmessage = (event) => {
//     //         setMessage(event.data);
//     //     };
//     //     ws.onclose = () => console.log("WebSocket connection closed");

//     //     setSocket(ws);

//     //     return () => {
//     //         ws.close();
//     //     };
//     // }, [project.entry_path]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Get the current user's token
//                 const { token } = await getCurrentUser();
    
//                 // Fetch the folder structure data using the token
//                 const response = await getDataFolder('folder-structure', token, project.entry_path);
//                 const result = await response.data;
//                 console.log("Result:", result);
    
//                 // Convert the result to a tree structure and set the data state
//                 setData(convertToTree(result));
    
//                 // Initialize WebSocket connection, including the token in the URL
//                 const ws = new WebSocket(`ws://localhost:8000/ws/tree_folder?&token=${token}`);
//                 // const ws = new WebSocket(`ws://localhost:8000/ws/tree_folder?input_path=${encodeURIComponent(project.entry_path)}&token=${token}`);
    
//                 // Handle incoming WebSocket messages
//                 ws.onmessage = (event) => {
//                     setMessage(event.data);
//                 };
    
//                 // Handle WebSocket close event
//                 ws.onclose = () => console.log("WebSocket connection closed");
    
//                 // Store the WebSocket connection in the state
//                 setSocket(ws);
    
//                 // Cleanup function to close the WebSocket when the component unmounts or `project.entry_path` changes
//                 return () => {
//                     ws.close();
//                 };
    
//             } catch (error) {
//                 console.error("Error fetching folder structure or setting up WebSocket:", error);
//             }
//         };
    
//         fetchData();
//     }, [project.entry_path]);
    

//     const convertToTree = (structure: any, isRoot = false): TreeData => {
//         const convert = (folderName: string, folderContent: any, isRootFolder: boolean): TreeData => {
//             const children = [];
    
//             // Handle folders
//             if (folderContent?.folders) {
//                 for (const [subFolderName, subFolderContent] of Object.entries(folderContent.folders)) {
//                     children.push(convert(subFolderName, subFolderContent, false));
//                 }
//             }
    
//             // Handle files
//             if (folderContent?.files) {
//                 for (const fileName of folderContent.files) {
//                     children.push({ name: fileName });
//                 }
//             }
    
//             return {
//                 name: folderName || 'Unnamed Folder', // Ensure name is always a string
//                 toggled: isRootFolder, // Only root folder is toggled by default
//                 children,
//             };
//         };
    
//         // Start conversion from the root, marking it as the root folder
//         return convert("/", structure || {}, true);
//     };
    
    
    

//     const onToggle = (node: TreeNode, toggled: boolean) => {
//         if (cursor) {
//             cursor.active = false;
//         }
//         node.active = true;
//         if (node.children) {
//             node.toggled = toggled;
//         }
//         setCursor(node);
//         setData(data => data ? { ...data } : null); // Ensure data is of correct type
//     };

//     const handleAddToGitignore = () => {
//         if (socket && cursor) {
//             socket.send(JSON.stringify({ type: 'add_to_gitignore', file_path: cursor.name, input_path: project.entry_path }));
//         }
//     };

//     const handleAddToGptignore = () => {
//         if (socket && cursor) {
//             socket.send(JSON.stringify({ type: 'add_to_gptignore', file_path: cursor.name, input_path: project.entry_path }));
//         }
//     };

//     return (
//         <div className='text-white'>
//             <div>
//                 {message && <p>{message}</p>}
//             </div>
//             {data ? (
//                 <Treebeard
//                     data={data}
//                     onToggle={onToggle}
//                     style={treeStyle}
//                 />
//             ) : (
//                 <p>Loading...</p>
//             )}
//             <div className='flex flex-row gap-2 mt-2'>
//                 <button 
//                 onClick={handleAddToGitignore} 
//                 disabled={!cursor}
//                 className='bg-gray-700 text-white p-2 rounded-md'>
//                     Add to .gitignore
//                 </button>
//                 <button 
//                 onClick={handleAddToGptignore} 
//                 disabled={!cursor}
//                 className='bg-gray-700 text-white p-2 rounded-md'>
//                     Add to .gptignore
//                 </button>
//             </div>

//         </div>
//     );
// };

// const treeStyle = {
//     tree: {
//         base: {
//             listStyle: 'none',
//             backgroundColor: '#21252b',
//             margin: 0,
//             padding: 0,
//             color: '#9DA5AB',
//             fontFamily: 'Lato, sans-serif',
//             fontSize: '14px'
//         },
//         node: {
//             base: {
//                 position: 'relative'
//             },
//             link: {
//                 cursor: 'pointer',
//                 position: 'relative',
//                 padding: '0px 5px',
//                 display: 'block'
//             },
//             activeLink: {
//                 background: '#31363f'
//             },
//             toggle: {
//                 base: {
//                     position: 'relative',
//                     display: 'inline-block',
//                     verticalAlign: 'middle',
//                     marginLeft: '-5px',
//                     height: '24px',
//                     width: '24px'
//                 },
//                 wrapper: {
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     margin: '-7px 0 0 -7px',
//                     height: '14px'
//                 },
//                 height: 10,
//                 width: 10,
//                 arrow: {
//                     fill: '#9DA5AB',
//                     strokeWidth: 0
//                 }
//             },
//             header: {
//                 base: {
//                     display: 'inline-block',
//                     verticalAlign: 'middle',
//                     color: '#9DA5AB'
//                 },
//                 connector: {
//                     width: '2px',
//                     height: '12px',
//                     borderLeft: 'solid 2px black',
//                     borderBottom: 'solid 2px black',
//                     position: 'absolute',
//                     top: '0px',
//                     left: '-21px'
//                 },
//                 title: {
//                     lineHeight: '24px',
//                     verticalAlign: 'middle'
//                 }
//             },
//             subtree: {
//                 listStyle: 'none',
//                 paddingLeft: '19px'
//             },
//             loading: {
//                 color: '#E2C089'
//             }
//         }
//     }
// };

// export default FolderTree;


import React, { useState, useEffect } from 'react';
import { Treebeard, TreeNode } from 'react-treebeard';
import { getDataFolder } from '../api/apiMethod';
import { getCurrentUser } from '@/lib/actions';
import { AgentRequest } from '@/lib/models/request';

interface TreeData {
    name: string; // Ensure name is always a string
    toggled?: boolean;
    children?: TreeData[];
}

const FolderTree: React.FC<{ project: AgentRequest }> = ({ project }) => {
    const [data, setData] = useState<TreeData | null>(null);
    const [cursor, setCursor] = useState<TreeNode | null>(null);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get the current user's token
                const { token } = await getCurrentUser();
    
                // Fetch the folder structure data using the token
                const response = await getDataFolder('folder-structure', token, project.entry_path);
                const result = await response.data;
                console.log("Result:", result);
    
                // Convert the result to a tree structure and set the data state
                setData(convertToTree(result));
            } catch (error) {
                console.error("Error fetching folder structure:", error);
            }
        };
    
        fetchData();
    }, [project.entry_path]);

    const convertToTree = (structure: any, isRoot = false): TreeData => {
        const convert = (folderName: string, folderContent: any, isRootFolder: boolean): TreeData => {
            const children = [];
    
            // Handle folders
            if (folderContent?.folders) {
                for (const [subFolderName, subFolderContent] of Object.entries(folderContent.folders)) {
                    children.push(convert(subFolderName, subFolderContent, false));
                }
            }
    
            // Handle files
            if (folderContent?.files) {
                for (const fileName of folderContent.files) {
                    children.push({ name: fileName });
                }
            }
    
            return {
                name: folderName || 'Unnamed Folder', // Ensure name is always a string
                toggled: isRootFolder, // Only root folder is toggled by default
                children,
            };
        };
    
        // Start conversion from the root, marking it as the root folder
        return convert("/", structure || {}, true);
    };
    
    const onToggle = (node: TreeNode, toggled: boolean) => {
        if (cursor) {
            cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        setCursor(node);
        setData(data => data ? { ...data } : null); // Ensure data is of correct type
    };

    const handleWebSocketRequest = (type: string) => {
        if (cursor) {
            const openWebSocket = async () => {
                const { token } = await getCurrentUser();
                const ws = new WebSocket(`ws://localhost:8000/ws/tree_folder?&token=${token}`);
                
                ws.onopen = () => {
                    ws.send(JSON.stringify({ type, file_path: cursor.name, input_path: project.entry_path }));
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
            <div>
                {message && <p>{message}</p>}
            </div>
            {data ? (
                <Treebeard
                    data={data}
                    onToggle={onToggle}
                    style={treeStyle}
                />
            ) : (
                <p>Loading...</p>
            )}
            <div className='flex flex-row gap-2 mt-2'>
                <button 
                onClick={handleAddToGitignore} 
                disabled={!cursor}
                className='bg-gray-700 text-white p-2 rounded-md'>
                    Add to .gitignore
                </button>
                <button 
                onClick={handleAddToGptignore} 
                disabled={!cursor}
                className='bg-gray-700 text-white p-2 rounded-md'>
                    Add to .gptignore
                </button>
            </div>

        </div>
    );
};

const treeStyle = {
    tree: {
        base: {
            listStyle: 'none',
            backgroundColor: '#21252b',
            margin: 0,
            padding: 0,
            color: '#9DA5AB',
            fontFamily: 'Lato, sans-serif',
            fontSize: '14px'
        },
        node: {
            base: {
                position: 'relative'
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                padding: '0px 5px',
                display: 'block'
            },
            activeLink: {
                background: '#31363f'
            },
            toggle: {
                base: {
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginLeft: '-5px',
                    height: '24px',
                    width: '24px'
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 10,
                width: 10,
                arrow: {
                    fill: '#9DA5AB',
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    color: '#9DA5AB'
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px black',
                    borderBottom: 'solid 2px black',
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle'
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#E2C089'
            }
        }
    }
};

export default FolderTree;
