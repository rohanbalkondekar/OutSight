// components/LogStream.tsx
import { useEffect, useState } from 'react';

interface LogStreamProps {
  endpoint: string;
}

const LogStream: React.FC<LogStreamProps> = ({ endpoint }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(endpoint);

    eventSource.onmessage = (event) => {
      setLogs((prevLogs) => [...prevLogs, event.data]);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [endpoint]);

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
