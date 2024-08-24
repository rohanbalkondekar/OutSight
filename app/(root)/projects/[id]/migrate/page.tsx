'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '../../../dashboard/page';
import { getData } from '../../../api/apiMethod';
import ProjectMigration from '../../../components/ProjectMigration';
import Leftbar from '@/app/(root)/components/Leftbar';
import { getCurrentUser } from '@/lib/actions';
import LogStream from '@/app/(root)/components/LogStream';
import ChatWindows from '@/app/(root)/components/ChatWindow';

interface ProjectPageProps {
  params: {
    id: string; // This will be the dynamic parameter
  };
}

const ProjectPage: React.FC<ProjectPageProps> = ({ params }) => {
  const { id } = params;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { user, token } = await getCurrentUser();
        if (!user) {
          router.push('/signin'); // Client-side redirection
          return;
        }
      
        const fetchedProject: Project = await getData(`database/${id}`, token);
        setProject(fetchedProject);
      } catch (err: any) {
        setError(`Error fetching project data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const leftbarLinks = [
    { href: "/dashboard", label: 'Dashboard' },
    { href: `/projects/${id}/migrate`, label: 'Code Migration' },
    { href: `/projects/${id}/terminal`, label: 'Terminal' },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!project) {
    return <div>No project found</div>;
  }

  return (
    <div className="flex">
      <Leftbar links={leftbarLinks} />
      <div className="flex-1 flex flex-col items-center p-4 lg:flex-row">
      <div className="flex-1 flex justify-center items-center lg:w-1/3 h-screen overflow-auto">
        <ProjectMigration project={project} />
      </div>

        <div className="flex-2 p-4 lg:w-2/3">
          <h2 className="text-2xl font-bold mb-4 text-white">Agent Logs</h2>
          <ChatWindows endpoint="http://localhost:8000/agent/stream_logs" />
          {/* <LogStream endpoint="http://localhost:8000/agent/stream_logs" /> */}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
