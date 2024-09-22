'use client';

import React, { useState, useEffect } from 'react';
import { postData } from '../api/apiMethod'; 
import { CreateAgentRequest } from '@/lib/models/request';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions';
import { frameworksByLanguage, languages, models } from '@/lib/constants/agentParameter';

interface CreateProjectProps {
  inputPath: string;
}

const initialState: CreateAgentRequest = {
  thread_id: '',
  document: { model: { name: models[0] }, rerun: false },
  planner: { model: { name: models[0] }, rerun: false },
  migrate: { model: { name: models[0] }, rerun: false },
  dir_struct: { model: { name: models[0] }, rerun: false },
  entry_path: '', 
  output_path: '', 
  legacy_language: languages[0],
  legacy_framework: "",
  new_language: languages[0],
  new_framework: "",
  isRanAgent: false
};

const setNestedProperty = <T,>(obj: T, path: string[], value: any): T => {
  const lastKeyIndex = path.length - 1;
  let tempObj: any = obj;

  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = path[i];
    if (!(key in tempObj)) {
      tempObj[key] = {};
    }
    tempObj = tempObj[key];
  }
  tempObj[path[lastKeyIndex]] = value;
  return obj;
};

const CreateProject: React.FC<CreateProjectProps> = ({ inputPath }) => {
  const [formState, setFormState] = useState<CreateAgentRequest>({
    ...initialState,
    entry_path: inputPath,
  });

  const [legacyFrameworkOptions, setLegacyFrameworkOptions] = useState<string[]>([]);
  const [newFrameworkOptions, setNewFrameworkOptions] = useState<string[]>([]);

  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeFormState = async () => {
      const {user} = await getCurrentUser();
  
      setFormState(prevState => ({
        ...prevState,
        thread_id: `${user!.id}-${Math.floor(Math.random() * 1000000)}`,
        entry_path: inputPath,
        output_path: inputPath
      }));
    };
  
    initializeFormState();
  }, [inputPath]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const keys = name.split('.');
    setFormState(prevState => setNestedProperty({ ...prevState }, keys, value));

    // Update framework options when language changes
    if (name === "legacy_language") {
      setLegacyFrameworkOptions(frameworksByLanguage[value] || []);
      setFormState((prevState) => ({
        ...prevState,
        legacy_framework: "",
      }));
    } else if (name === "new_language") {
      setNewFrameworkOptions(frameworksByLanguage[value] || []);
      setFormState((prevState) => ({
        ...prevState,
        new_framework: "",
      }));
    }
  };

  const handleCreateProject = async () => {
    try {
      await postData(formState, "database");  // Adjust this based on your API structure
      setMessage("Project created successfully!");
      setFormState(initialState);  // Reset the form
      router.push("/dashboard");
    } catch (error: any) {
      setMessage(`Error creating project: ${error.message}`);
    }
  };

  const formFields = [
    {
      label: 'Select Document Model',
      name: 'document.model.name',
      options: models,
      value: formState.document.model.name,
    },
    {
      label: 'Select Planner Model',
      name: 'planner.model.name',
      options: models,
      value: formState.planner.model.name,
    },
    {
      label: 'Select Migrate Model',
      name: 'migrate.model.name',
      options: models,
      value: formState.migrate.model.name,
    },
    {
      label: 'Select Directory Structure Model',
      name: 'dir_struct.model.name',
      options: models,
      value: formState.dir_struct.model.name,
    },
    {
      label: 'Legacy Language',
      name: 'legacy_language',
      options: languages,
      value: formState.legacy_language,
    },
    {
      label: 'Legacy Framework',
      name: 'legacy_framework',
      options: legacyFrameworkOptions,
      value: formState.legacy_framework,
    },
    {
      label: 'New Language',
      name: 'new_language',
      options: languages,
      value: formState.new_language,
    },
    {
      label: 'New Framework',
      name: 'new_framework',
      options: newFrameworkOptions,
      value: formState.new_framework,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row p-4 items-center justify-center">
      <div className="p-4 bg-gray-700 rounded-md shadow-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-white">Create New Project</h1>

        {/* Dynamic Form Fields */}
        {formFields.map((field) => (
          <div className="mb-4" key={field.name}>
            <label className="block text-sm font-medium text-white">{field.label}</label>
            <select
              name={field.name}
              value={field.value}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black p-2"
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

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

export default CreateProject;
