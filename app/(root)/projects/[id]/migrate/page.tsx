'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getData } from '../../../api/apiMethod';
import ProjectMigration from '../../../components/ProjectMigration';
import Topbar from '@/app/(root)/components/Topbar';
import { getCurrentUser } from '@/lib/actions';
import { SendAgentRequest } from '@/lib/models/request';
import DownloadCode from '@/app/(root)/components/DownloadFolder';
import GitPush from '@/app/(root)/components/GitPush';
import TreeFolder from '@/app/(root)/components/TreeFolder';
import ProgressBar from '@/app/(root)/components/ProgressBar';

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

  const toggleSelection = (isChatWindows: boolean) => {
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

        const fetchedProject: SendAgentRequest = await getData(`database/${id}`, token!);
        console.log(fetchedProject)
        // setIsAgentRun(fetchedProject.isRanAgent);    //Comment out for development and testing only, not for production
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
        <div>
          {/* <div className="flex-1 flex justify-center items-center lg:w-1/3 h-screen overflow-auto"> */}
          <ProjectMigration project={project} onHandleIsRunAgent={handleIsRunAgent} />

          <div className="justify-end items-ends lg:w-full px-10">
            <TreeFolder project={project} isAgentRun={isAgentRun} inputType='input' />
          </div>
        </div>
        // </div>
      ) : (
        <div className="flex-2 justify-center p-8">
          <div className='py-8 text-white'>
            <ProgressBar isRanAgent={isAgentRun} />
          </div>

          <div className="flex flex-col items-center justify-start mb-4">
            <div>
            <button
              className={`px-4 py-2 rounded-md ${isChatWindowsSelected ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => toggleSelection(true)}
            >
              Code Editor
            </button>
            <button
              className={`px-4 py-2 ml-2 rounded-md ${!isChatWindowsSelected ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => toggleSelection(false)}
            >
              Download Code
            </button>
            </div>

          </div>
          {isChatWindowsSelected ? (
          <div className="flex-1 flex justify-center">
            <TreeFolder project={project} isAgentRun={isAgentRun} inputType="output" />
          </div>

          ) : (
            <div className="flex flex-col items-center">
              <GitPush project={project} />
              <DownloadCode project={project} />
            </div>
          )}
        </div>

      )}
    </div>

  );
};

export default ProjectPage;
