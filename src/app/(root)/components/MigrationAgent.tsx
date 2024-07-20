'use client'

import { useState } from 'react';
import { runAgent } from '../api/apiMethod'; // Adjust the import based on your project structure
import LogStream from '../components/LogStream';
import { AgentRequest } from '../../../../models/request';
const models = ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo (deprecated)", "gpt-3.5-turbo (deprecated)"]; // Add more models as needed

const initialState: AgentRequest = {
  document: { model: { name: models[0] }, rerun: false },
  planner: { model: { name: models[0] }, rerun: false },
  migrate: { model: { name: models[0] }, rerun: false },
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

const MigrationAgent: React.FC = () => {
  const [formState, setFormState] = useState<AgentRequest>(initialState);
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
      await runAgent({
        document: formState.document,
        planner: formState.planner,
        migrate: formState.migrate,
        entry_path: formState.entry_path,
        output_path: formState.output_path,
        legacy_language: formState.legacy_language,
        legacy_framework: formState.legacy_framework,
        new_language: formState.new_language,
        new_framework: formState.new_framework
      });
    } catch (error: any) {
      setLogs((prevLogs) => [...prevLogs, `Error running agent: ${error.message}`]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-4 h-screen">
      <div className="md:w-1/3 p-4">
        <h1 className="text-2xl font-bold mb-4">Code Migration AI Agent</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select GPT Model</label>
          <select
            name="document.model.name"
            value={formState.document.model.name}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-black"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Entry Path</label>
          <input
            name="entry_path"
            type="text"
            value={formState.entry_path}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Output Path</label>
          <input
            name="output_path"
            type="text"
            value={formState.output_path}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Legacy Language</label>
          <input
            name="legacy_language"
            type="text"
            value={formState.legacy_language}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Legacy Framework</label>
          <input
            name="legacy_framework"
            type="text"
            value={formState.legacy_framework}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">New Language</label>
          <input
            name="new_language"
            type="text"
            value={formState.new_language}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">New Framework</label>
          <input
            name="new_framework"
            type="text"
            value={formState.new_framework}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>
        <button
          onClick={handleRunAgent}
          className="button"
        >
          Run Agent
        </button>
      </div>
      <div className="md:w-2/3 p-4">
        <h2 className="text-xl font-bold mb-4">Agent Logs</h2>
        <div className="h-1/2 border border-gray-300 p-2 rounded-md overflow-y-scroll bg-gray-100">
          {logs.map((log, index) => (
            <p key={index} className="text-sm text-gray-800">
              {log}
            </p>
          ))}
            <LogStream endpoint="http://localhost:8000/agent/stream_logs" />
        </div>
      </div>
    </div>
  );
};

export default MigrationAgent;
