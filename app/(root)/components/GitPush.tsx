'use client';

import React, { useState, ChangeEvent } from "react";
import { postData } from "../api/apiMethod"; // Assuming this is your API method
import { SendAgentRequest } from "@/lib/models/request";

interface GitPushProps {
    project: SendAgentRequest; // Project prop to get the new_language and other project info
}

const GitPush: React.FC<GitPushProps> = ({ project }) => {
    // State for form data
    const [formState, setFormState] = useState({
        username: '',
        token: '',
        branch: 'migrated code', // Default branch
        commit_message: '', // Default commit message
    });

    const [newLanguage] = useState(project.new_language); // Get new_language from project prop
    const [message, setMessage] = useState<string | null>(null);

    const [repo_name] = useState(project.entry_path);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

    // Handle form input change
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle push to GitHub
    const handleGitPush = async () => {
        setIsLoading(true); // Set loading state
        try {
            const data = {
                ...formState,
                repo_name: repo_name,
                new_language: newLanguage, // Include new_language from project
            };

            // Perform the API call to push the changes
            await postData(data, "git/push-changes");

            setMessage('Changes pushed successfully!');
        } catch (err: any) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    // Define form fields
    const inputFields: { label: string; name: keyof typeof formState; type: string }[] = [
        { label: 'GitHub Username', name: 'username', type: 'text' },
        { label: 'GitHub Token', name: 'token', type: 'password' },
        { label: 'Branch', name: 'branch', type: 'text' },
        { label: 'Commit Message', name: 'commit_message', type: 'text' },
    ];

    return (
        <div className="w-full p-4 bg-gray-700 rounded-md shadow-md mb-5">
            <h2 className="text-xl font-bold mb-4 text-white">Push Changes to GitHub</h2>
            {inputFields.map((field) => (
                <div className="mb-4" key={field.name}>
                    <label className="block text-sm font-medium text-white">{field.label}</label>
                    <input
                        type={field.type}
                        name={field.name}
                        value={formState[field.name]}
                        onChange={handleChange}
                        className="w-full p-2 text-black rounded-md"
                        disabled={isLoading} // Disable input while loading
                    />
                </div>
            ))}
            <button
                onClick={handleGitPush}
                className={`bg-green-500 text-white py-2 px-4 rounded-md shadow-md transition ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                disabled={isLoading} // Disable button while loading
            >
                {isLoading ? 'Pushing...' : 'Push Changes'}
            </button>
            {message && <p className="mt-4 text-green-500">{message}</p>}
        </div>
    );
};

export default GitPush;
