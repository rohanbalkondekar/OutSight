'use client'

import React, { useState, useEffect } from 'react';
import { getData } from '../api/apiMethod';
import { AgentParams } from '@/lib/models/request';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions';
import { redirect, useRouter } from 'next/navigation';
import UserProfile from '@/components/auth/user-profile';
import { FaPlus, FaGithub } from 'react-icons/fa'; // Add icons

export interface Project {
  id: number;
  project_id: string;
  document: AgentParams;
  planner: AgentParams;
  migrate: AgentParams;
  dir_struct: AgentParams;
  entry_path: string;
  output_path: string;
  legacy_language: string;
  legacy_framework: string;
  new_language: string;
  new_framework: string;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const { user, token } = await getCurrentUser();

      if (!user) {
        redirect("/signin");
      }

      const data = await getData('database', token);
      setProjects(data);
    } catch (error: any) {
      console.error(`Error fetching projects: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleNewProjectClick = () => {
      router.push("/create-project")
  };

  return (
    <div className="flex flex-col p-16 h-screen bg-gray-900">
      <UserProfile />
      <h1 className="text-3xl font-bold mb-4 text-white pt-16 mb-16">My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* New Project Card */}
        <div
          onClick={handleNewProjectClick}
          className="bg-green-500 text-white shadow-lg rounded-lg p-6 hover:bg-green-600 transition cursor-pointer flex items-center space-x-4 w-full max-w-md mx-auto"
        >
          <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-md">
            <FaPlus className="text-green-500 w-8 h-8" />
          </div>
          <div className="text-left flex-grow text-center">
            <h2 className="text-xl font-bold mb-2">New Project</h2>
            <p className="text-sm">Click to create a new project</p>
          </div>
        </div>

        {/* Existing Projects */}
        {loading ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-white">
            Loading projects...
          </div>
        ) : (
          projects
          .slice()
          .reverse()
          .map((project) => {
            console.log(project)
              return(
            <Link
              key={project.id}
              href={`/projects/${project.id}/migrate`}
              className="bg-white shadow-lg rounded-lg p-6 hover:bg-gray-100 transition cursor-pointer flex items-center space-x-4 w-full max-w-md mx-auto"
            >
              <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full shadow-md">
                <FaGithub className="text-gray-600 w-8 h-8" /> {/* Replace with your logo */}
              </div>
              <div className="text-left flex-grow">
                <h2 className="text-xl font-bold mb-2 text-gray-800">Project ID: {project.project_id}</h2>
                <p className="text-sm text-gray-600 mb-1"><strong>Legacy Language:</strong> {project.legacy_language}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Legacy Framework:</strong> {project.legacy_framework}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>New Language:</strong> {project.new_language}</p>
                <p className="text-sm text-gray-600"><strong>New Framework:</strong> {project.new_framework}</p>
              </div>
            </Link>
          )})
        )}
      </div>
    </div>
  );
};

export default Dashboard;
