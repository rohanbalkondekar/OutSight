'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '../../../dashboard/page';
import { getData } from '../../../api/apiMethod';
import ProjectMigration from '../../../components/ProjectMigration';
import Topbar from '@/app/(root)/components/Topbar';
import { getCurrentUser } from '@/lib/actions';
import FolderTree from '@/app/(root)/components/FolderTree';
import ChatWebsocket from '@/app/(root)/components/ChatWebsocket';

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
  const [isAgentRun, setIsAgentRun] = useState<boolean>(false);

  const handleIsRunAgent = (show: boolean) => {
    setIsAgentRun(show);
  }

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

  const topbarLinks = [
    { href: "/dashboard", label: 'Dashboard' },
    // { href: `/projects/${id}/setup`, label: 'Setup' },
    { href: `/projects/${id}/migrate`, label: 'Code Migration' },
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
    <div>
      <Topbar links={topbarLinks} />
      <div className="flex-1 flex flex-col items-center p-4 lg:flex-row">
      <div className="flex-1 flex justify-center items-center lg:w-1/3 h-screen overflow-auto">
        <ProjectMigration project={project} onHandleIsRunAgent={handleIsRunAgent}/>
      </div>

        <div className="flex-2 p-4 lg:w-2/3">
        {!isAgentRun ? (
          <FolderTree project={project}/>
        ):(
          <ChatWebsocket endpoint="http://localhost:8000/agent/ws/chat"/>
        )}
          
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
