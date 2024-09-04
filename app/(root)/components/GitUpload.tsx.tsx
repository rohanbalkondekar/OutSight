'use client';

import React, { useState, ChangeEvent } from "react";
import { CloneRepoRequest } from "@/lib/models/cloneRepoRequest";
import { postData } from "../api/apiMethod";

interface GitUploadProps {
    onInputPathChange: (path: string, show: boolean) => void;
}

const GitUpload: React.FC<GitUploadProps> = ({ onInputPathChange }) => {
    const [formState, setFormState] = useState<CloneRepoRequest>({
        username: '',
        token: '',
        repo_name: ''
    });

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);  // Loading state

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleGitClone = async () => {
        setIsLoading(true);
        try {
            // Perform the API call to clone the repository
            const result = await postData(formState, "agent/clone-repo");

            onInputPathChange(formState.repo_name, true);  // Set showCreateProject to true
            setMessage('Repository cloned successfully!');
        } catch (err: any) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);  // Stop loading
        }
    };

    const inputFields: { label: string; name: keyof CloneRepoRequest; type: string }[] = [
        { label: 'GitHub Username', name: 'username', type: 'text' },
        { label: 'GitHub Token', name: 'token', type: 'password' },
        { label: 'Repository Name', name: 'repo_name', type: 'text' },
    ];

    return (
        <div className="w-full p-4 bg-gray-700 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4 text-white">Clone Git Repository</h2>
            {inputFields.map((field) => (
                <div className="mb-4" key={field.name}>
                    <label className="block text-sm font-medium text-white">{field.label}</label>
                    <input
                        type={field.type}
                        name={field.name}
                        value={formState[field.name]}
                        onChange={handleChange}
                        className="w-full p-2 text-black rounded-md"
                        disabled={isLoading}  // Disable input while loading
                    />
                </div>
            ))}
            <button
                onClick={handleGitClone}
                className={`bg-green-500 text-white py-2 px-4 rounded-md shadow-md transition ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                disabled={isLoading}  // Disable button while loading
            >
                {isLoading ? 'Cloning...' : 'Clone Repository'}
            </button>
            {message && <p className="mt-4 text-green-500">{message}</p>}
        </div>
    );
};

export default GitUpload;
