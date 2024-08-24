// components/ChatWindows.tsx
import { useEffect, useState, useRef } from 'react';
import { getCurrentUser } from '@/lib/actions';

interface ChatWindowsProps {
  endpoint: string;
}

const ChatWindows: React.FC<ChatWindowsProps> = ({ endpoint }) => {
  const [logs, setLogs] = useState<{ type: 'server' | 'user'; message: string }[]>([]);
  const [token, setToken] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const logContainerRef = useRef<HTMLDivElement>(null);

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
      setLogs((prevLogs) => [...prevLogs, { type: 'server', message: event.data }]);
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return; // Don't send empty messages

    // Add user message to the log
    setLogs((prevLogs) => [...prevLogs, { type: 'user', message: inputMessage }]);
    setInputMessage(''); // Clear input field

    try {
      // Send the message to the server (assuming the server accepts POST requests at the endpoint)
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: inputMessage }),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-[760px] border border-gray-300 p-4 rounded-md bg-gray-100">
      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-scroll p-2 mb-2 bg-white rounded-md"
      >
        {/* <ul className="space-y-2">
          {logs.map((log, index) => {
            console.log(log)
            return(
            <p
              key={index}
              className={`w-fit px-4 py-2 rounded-lg shadow-sm text-sm break-words ${
                log.type === 'user'
                  ? 'bg-blue-500 text-white justify-self-end' 
                  : 'bg-gray-300 text-gray-800 self-start'
              }`}
            >
              {log.message}
            </p>
          )})}
        </ul> */}

<ul className="space-y-2">
  {logs.map((log, index) => {
    console.log(log);
    return (
      <div
        key={index}
        className={`flex items-end ${log.type === 'user' ? 'justify-end' : ''}`}
      >
        <div
          className={`flex flex-col space-y-2 text-sm max-w-7xl mx-2 overflow-x-hidden ${
            log.type === 'user' ? 'order-1 items-end' : 'order-2 items-start'
          }`}
        >
          <p
            className={`px-4 py-2 rounded-lg ${
              log.type === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-800'
            }`}
          >
            {log.message}
          </p>
        </div>
      </div>
    );
  })}
</ul>



      </div>

      <div className="flex items-center p-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-l-md p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindows;
