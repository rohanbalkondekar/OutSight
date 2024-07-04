'use client'

import { useState } from 'react';
import { runAgent } from '../api/apiMethod'; // Adjust the import based on your project structure

const models = ["gpt-3.5-turbo", "GPT-4", "Gemini"]; // Add more models as needed

const MigrationAgent: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo"); // Default to "GPT-3.5"
  const [sourcePath, setSourcePath] = useState('/Users/anugrahkuantanu/Desktop/migrate_agent/input/mern-admin');
  const [outputPath, setOutputPath] = useState('/Users/anugrahkuantanu/Desktop/migrate_agent/output');
  const [legacyCodeName, setLegacyCodeName] = useState('nodeJs');
  const [legacyFrameworkName, setLegacyFrameworkName] = useState('express.js');
  const [logs, setLogs] = useState<string[]>([]);

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  const handleSourcePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourcePath(event.target.value);
  };

  const handleOutputPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOutputPath(event.target.value);
  };

  const handleLegacyCodeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLegacyCodeName(event.target.value);
  };

  const handleLegacyFrameworkNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLegacyFrameworkName(event.target.value);
  };

  const handleRunAgent = async () => {
    try {
      const response = await runAgent({
        model: selectedModel,
        inputPath: sourcePath,
        outputPath: outputPath,
        legacyCodeName:legacyCodeName,
        legacyFrameworkName:legacyFrameworkName,
      });
      setLogs([...logs, `Agent run successfully: ${response.message}`]);
    } catch (error:any) {
      setLogs([...logs, `Error running agent: ${error.message}`]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-4 h-screen">
      <div className="md:w-1/3 p-4">
        <h1 className="text-2xl font-bold mb-4">Code Migration AI Agent</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select GPT Model</label>
          <select
            value={selectedModel}
            onChange={handleModelChange}
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
          <label className="block text-sm font-medium text-gray-700">Source Code Path</label>
          <input
            type="text"
            value={sourcePath}
            onChange={handleSourcePathChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Output Path</label>
          <input
            type="text"
            value={outputPath}
            onChange={handleOutputPathChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name of Legacy Code</label>
          <input
            type="text"
            value={legacyCodeName}
            onChange={handleLegacyCodeNameChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name of Legacy Framework</label>
          <input
            type="text"
            value={legacyFrameworkName}
            onChange={handleLegacyFrameworkNameChange}
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
        </div>
      </div>
    </div>
  );
};

export default MigrationAgent;
