// components/LogStream.tsx
import { useEffect, useState, useRef } from 'react';
import { getCurrentUser } from '@/lib/actions';

interface LogStreamProps {
  endpoint: string;
}

const LogStream: React.FC<LogStreamProps> = ({ endpoint }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [token, setToken] = useState<string>(''); 
  const logContainerRef = useRef<HTMLDivElement>(null); // Reference for the log container

  // Effect to fetch the token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { token } = await getCurrentUser();
        if (token) {
          setToken(token);
        } else {
          console.error('No token received');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []); 

  // Effect to handle log streaming
  useEffect(() => {
    if (!token) return; 

    const authEndpoint = `${endpoint}?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(authEndpoint);

    eventSource.onmessage = (event) => {
      setLogs((prevLogs) => [...prevLogs, event.data]);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      console.log('Closing EventSource');
      eventSource.close();
    };
  }, [token, endpoint]); 

  // Effect to automatically scroll to the bottom when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={logContainerRef}
      className="h-1/2 border border-gray-300 p-4 rounded-md overflow-y-scroll bg-gray-100"
    >
      <ul className="space-y-2">
        {logs.map((log, index) => (
          <li 
            key={index} 
            className="w-fit bg-gray-200 px-4 py-2 rounded-lg shadow-sm text-sm text-gray-800 break-words max-w-full"
          >
            {log}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogStream;
