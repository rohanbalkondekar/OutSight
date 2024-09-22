'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { Project } from '../../../dashboard/page';
import { getData } from '../../../api/apiMethod';
import ProjectMigration from '../../../components/ProjectMigration';
import Topbar from '@/app/(root)/components/Topbar';
import { getCurrentUser } from '@/lib/actions';
import InputFolderTree from '@/app/(root)/components/InputFolderTree';
import ChatWebsocket from '@/app/(root)/components/ChatWebsocket';
import OutputFolderTree from '@/app/(root)/components/OutputFolderTree';
import { SendAgentRequest } from '@/lib/models/request';
import DownloadCode from '@/app/(root)/components/DownloadFolder';
import GitPush from '@/app/(root)/components/GitPush';

interface ProjectPageProps {
  params: {
    id: string; // This will be the dynamic parameter
  };
}


const ProjectPage: React.FC<ProjectPageProps> = ({ params }) => {
  const { id } = params;
  const [project, setProject] = useState<SendAgentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAgentRun, setIsAgentRun] = useState<boolean>(false);
  const [isChatWindowsSelected, setChatWindowsSelected] = useState<boolean>(true);

  const toggleSelection = (isChatWindows: boolean) =>{
    setChatWindowsSelected(isChatWindows);
  }

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
      
        const fetchedProject: SendAgentRequest = await getData(`database/${id}`, token);
        console.log(fetchedProject)
        setIsAgentRun(fetchedProject.isRanAgent);
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
    // { href: `/projects/${id}/migrate`, label: 'Code Migration' },
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
      
      
        {!isAgentRun ? (
          <div className="flex-1 flex flex-col items-center p-4 lg:flex-row">
            <div className="flex-1 flex justify-center items-center lg:w-1/3 h-screen overflow-auto">
                <ProjectMigration project={project} onHandleIsRunAgent={handleIsRunAgent}/>
              <div className="flex-2 justify-end items-ends p-4 lg:w-2/3 px-32">
                <InputFolderTree project={project}/>
              </div>
            </div>
          </div>
        ):(
          <div className="flex-1 flex flex-col  p-1 lg:flex-row">
            <div className="flex-1 flex justify-center  lg:w-1/2 h-screen overflow-auto">
            <OutputFolderTree project={project} isAgentRun = {isAgentRun}/>
            </div>
            <div className="flex-2 justify-center p-5 lg:w-1/2">
            <div className="flex justify-start mb-4">
                        <button
                            className={`px-4 py-2 rounded-md ${isChatWindowsSelected ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
                            onClick={() => toggleSelection(true)}
                        >
                            Chat Agent
                        </button>
                        <button
                            className={`px-4 py-2 ml-2 rounded-md ${!isChatWindowsSelected? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
                            onClick={() => toggleSelection(false)}
                        >
                            Download Code
                        </button>
                    </div>
              {isChatWindowsSelected ?(
              <ChatWebsocket endpoint="http://localhost:8000/agent/ws/chat"/>

              ):(
                <div>
                  <GitPush project={project}/>
                  <DownloadCode project={project}/>
                </div>
                
              )}    
              </div>        
          </div>

        )}
      </div>

  );
};

export default ProjectPage;
