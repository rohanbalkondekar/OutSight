'use client';

import { useState } from 'react';
import { runAgent } from '../api/apiMethod';
import { AgentRequest } from '@/lib/models/request';
import { FaGithub } from 'react-icons/fa'; // Import GitHub icon

const models = ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"]; // Add more models as needed

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

const ProjectMigration: React.FC<{ project: AgentRequest }> = ({ project }) => {
  const [formState, setFormState] = useState<AgentRequest>(project);
  const [logs, setLogs] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const keys = name.split('.');

    setFormState(prevState => {
      const updatedState = { ...prevState };
      setNestedProperty(updatedState, keys, value);
      return updatedState;
    });
  };

  const handleRunAgent = async () => {
    try {
      await runAgent(formState); 
    } catch (error: any) {
      setLogs((prevLogs) => [...prevLogs, `Error running agent: ${error.message}`]);
    }
  };

  return (
      <div className="max-h-[760px] overflow-auto rounded-lg bg-gray-800 p-6 shadow-lg text-white">
        <h1 className="text-2xl font-bold mb-6">Code Migration AI Agent</h1>
        
        {/* Project ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Project ID</label>
          <input
            name="thread_id"
            type="text"
            value={formState.thread_id}
            onChange={handleChange}
            className="mt-1 block w-full bg-white text-black shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Model Selection for each step */}
        {['document', 'planner', 'migrate', 'dir_struct'].map((step) => (
          <div className="mb-4" key={step}>
            <label className="block text-sm font-medium">Select GPT Model for {step.charAt(0).toUpperCase() + step.slice(1)}</label>
            <select
              name={`${step}.model.name`}
              value={(formState as any)[step]?.model?.name || ''}
              onChange={handleChange}
              className="mt-1 block w-full bg-white text-black shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
            >
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Entry Path with GitHub icon inside the input */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium">Entry Path</label>
          <div className="relative flex items-center">
            <FaGithub className="absolute left-3 text-gray-700 w-6 h-6" />
            <input
              name="entry_path"
              type="text"
              value={formState.entry_path}
              onChange={handleChange}
              className="mt-1 block w-full pl-12 bg-white text-black shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Output Path with GitHub icon inside the input */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium">Output Path</label>
          <div className="relative flex items-center">
            <FaGithub className="absolute left-3 text-gray-700 w-6 h-6" />
            <input
              name="output_path"
              type="text"
              value={formState.output_path}
              onChange={handleChange}
              className="mt-1 block w-full pl-12 bg-white text-black shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Legacy Language */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Legacy Language</label>
          <input
            name="legacy_language"
            type="text"
            value={formState.legacy_language}
            onChange={handleChange}
            className="mt-1 block w-full bg-white text-black shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
          />
      </div>
        {/* Legacy Framework */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Legacy Framework</label>
          <input
            name="legacy_framework"
            type="text"
            value={formState.legacy_framework}
            onChange={handleChange}
            className="mt-1 block w-full bg-white text-black shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
          />
        </div>

        {/* New Language */}
        <div className="mb-4">
          <label className="block text-sm font-medium">New Language</label>
          <input
            name="new_language"
            type="text"
            value={formState.new_language}
            onChange={handleChange}
            className="mt-1 block w-full bg-white text-black shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
          />
        </div>

        {/* New Framework */}
        <div className="mb-4">
          <label className="block text-sm font-medium">New Framework</label>
          <input
            name="new_framework"
            type="text"
            value={formState.new_framework}
            onChange={handleChange}
            className="mt-1 block w-full bg-white text-black shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Submit Button */}
        <button onClick={handleRunAgent} className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition">
          Run Agent
        </button>
      </div>
  );
};

export default ProjectMigration;
