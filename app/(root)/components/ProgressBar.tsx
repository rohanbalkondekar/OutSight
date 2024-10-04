import { getCurrentUser } from '@/lib/actions';
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import for handling image assets

// Define the structure of incoming messages
interface FolderStructureMessage {
  type: string;
  structure: {
    totalFiles: number;
    generatedFiles: number;
  };
}

const ProgressBar: React.FC<{ isRanAgent: boolean }> = ({ isRanAgent }) => {
  const [progress, setProgress] = useState<number>(0);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [generatedFiles, setGeneratedFiles] = useState<number>(0);

  useEffect(() => {
    const initializeWebSocket = async () => {
      if (isRanAgent) {
        const { token } = await getCurrentUser();

        const ws = new WebSocket(`ws://localhost:8000/agent/ws/progress?token=${token}`);

        ws.onmessage = (event) => {
          const data: FolderStructureMessage = JSON.parse(event.data);

          if (data.type === 'folder_structure') {
            const { totalFiles, generatedFiles } = data.structure;
            setTotalFiles(totalFiles);
            setGeneratedFiles(generatedFiles);
            setProgress((generatedFiles / totalFiles) * 100);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed.');
        };

        return () => {
          ws.close();
        };
      }
    };

    initializeWebSocket();
  }, [isRanAgent]);

  return (
    <div className="p-4">
      {/* Progress Bar Container */}
      <div className="relative w-full bg-gray-200 rounded-full h-8 shadow-lg overflow-hidden">
        {/* Progress Bar */}
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>

        {/* Animated Running Dog (Reversed to Face Right) */}
        <div
          className="absolute top-0 h-full flex items-center animate-dog"
          style={{
            left: `${progress}%`,
            transition: 'left 0.5s ease-out',
          }}
        >
          <div className="relative">
            <span
              role="img"
              aria-label="dog"
              className="dog-emoji text-4xl animate-running transform scale-x-[-1]"  // Reverses the dog
            >
              🐕
            </span>
            {/* Optional: Add a trail effect behind the dog */}
            <div className="absolute top-0 left-0 w-full h-full opacity-50 blur-md bg-blue-400" />
          </div>
        </div>
      </div>

      {/* Progress Text */}
      <p className="pt-4 text-center text-lg font-semibold text-gray-700">
        {progress < 100
          ? 'Files are being generated, lets make a coffee!'
          : 'All files are generated! while your coffee is still hot!'}
      </p>

      <p className="text-center text-sm text-gray-500">
        Generated Files: {generatedFiles} / {totalFiles}
      </p>

      <style jsx>{`
        /* Dog animation */
        .dog-emoji {
          position: relative;
          z-index: 10;
        }

        /* Simulating running effect */
        .animate-running {
          animation: running 0.5s steps(3) infinite;
        }

        /* Running animation steps */
        @keyframes running {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
