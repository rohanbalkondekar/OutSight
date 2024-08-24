'use client';

import React, { useState } from 'react';
import { postData } from '../api/apiMethod'; // Adjust the import based on your project structure
import { AgentRequest } from '@/lib/models/request';
import { useRouter } from 'next/navigation';

const models = ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"]; // Add more models as needed

const initialState: AgentRequest = {
  project_id: "",
  document: { model: { name: models[0] }, rerun: false },
  planner: { model: { name: models[0] }, rerun: false },
  migrate: { model: { name: models[0] }, rerun: false },
  dir_struct: { model: { name: models[0] }, rerun: false },
  entry_path: '',
  output_path: '',
  legacy_language: '',
  legacy_framework: '',
  new_language: '',
  new_framework: '',
};

const setNestedProperty = (obj: any, path: string[], value: any) => {
  const lastKeyIndex = path.length - 1;
  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = path[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  obj[path[lastKeyIndex]] = value;
};

const NewProject: React.FC = () => {
  const [formState, setFormState] = useState<AgentRequest>(initialState);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const keys = name.split('.');
    setFormState(prevState => {
      const updatedState = { ...prevState };
      setNestedProperty(updatedState, keys, value);
      return updatedState;
    });
  };

  const handleCreateProject = async () => {
    try {
      await postData(formState, "database"); // Adjust this based on your API structure
      setMessage("Project created successfully!");
      setFormState(initialState); // Reset the form
      router.push("/dashboard");
    } catch (error: any) {
      setMessage(`Error creating project: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-4 h-screen items-center justify-center">
      <div className="md:w-1/3 p-4 bg-gray-700 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-white">Create New Project</h1>

        {/* Project ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Project ID</label>
          <input
            name="project_id"
            type="text"
            value={formState.project_id}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>

        {/* Document Model Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Select Document Model</label>
          <select
            name="document.model.name"
            value={formState.document.model.name}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Planner Model Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Select Planner Model</label>
          <select
            name="planner.model.name"
            value={formState.planner.model.name}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Migrate Model Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Select Migrate Model</label>
          <select
            name="migrate.model.name"
            value={formState.migrate.model.name}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Directory Structure Model Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Select Directory Structure Model</label>
          <select
            name="dir_struct.model.name"
            value={formState.dir_struct.model.name}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Entry Path */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Entry Path</label>
          <input
            name="entry_path"
            type="text"
            value={formState.entry_path}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>

        {/* Output Path */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Output Path</label>
          <input
            name="output_path"
            type="text"
            value={formState.output_path}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>

        {/* Legacy Language */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Legacy Language</label>
          <input
            name="legacy_language"
            type="text"
            value={formState.legacy_language}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>

        {/* Legacy Framework */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">Legacy Framework</label>
          <input
            name="legacy_framework"
            type="text"
            value={formState.legacy_framework}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>

        {/* New Language */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">New Language</label>
          <input
            name="new_language"
            type="text"
            value={formState.new_language}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>

        {/* New Framework */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white">New Framework</label>
          <input
            name="new_framework"
            type="text"
            value={formState.new_framework}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
            <button
                onClick={handleCreateProject}
                className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
            >
                Create Project
            </button>
        </div>


        {/* Success/Error Message */}
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default NewProject;
