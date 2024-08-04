// components/LogStream.tsx
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../../../lib/actions';

interface LogStreamProps {
  endpoint: string;
}

const LogStream: React.FC<LogStreamProps> = ({ endpoint }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [token, setToken] = useState<string>(''); 

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
  }, [token, endpoint]); // This effect depends on `token` and `endpoint`

  return (
    <div>
      <ul className="text-sm text-gray-800">
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default LogStream;
