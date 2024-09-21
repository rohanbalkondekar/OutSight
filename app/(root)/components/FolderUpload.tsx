'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { postData } from '../api/apiMethod';

interface FolderUploadProps {
    onUploadComplete: (path: string, show: boolean) => void;
}

const FolderUpload: React.FC<FolderUploadProps> = ({ onUploadComplete }) => {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const BASE_URL = "http://localhost:8000";

    const onHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        setSelectedFiles(files);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!selectedFiles || selectedFiles.length === 0) {
            setMessage('Please select a folder to upload.');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();

        Array.from(selectedFiles).forEach((file) => {
            const relativePath = (file as any).webkitRelativePath || file.name;
            formData.append('files', file, relativePath);
        });

        try {
            await postData(formData, "agent/upload-folder");

            const firstFile = selectedFiles[0];
            const folderName = (firstFile as any).webkitRelativePath.split('/')[0];
            const entryPath = `${folderName}`;  
            onUploadComplete(entryPath, true);  // Notify parent component of the entry path
            setMessage('Folder uploaded successfully!');

        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full p-4 bg-gray-700 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4 text-white">Upload Folder</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white">Select Folder</label>
                    <input
                        type="file"
                        name="files"
                        multiple
                        onChange={onHandleChange}
                        className="w-full p-2 text-black rounded-md"
                        ref={(input) => {
                            if (input) {
                                input.setAttribute('webkitdirectory', '');
                                input.setAttribute('directory', '');
                            }
                        }}
                    />
                </div>
                <button
                    type="submit"
                    className={`bg-green-500 text-white py-2 px-4 rounded-md shadow-md transition ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Uploading...' : 'Upload Folder'}
                </button>
            </form>
            {message && <p className="mt-4 text-green-500">{message}</p>}
        </div>
    );
};

export default FolderUpload;
