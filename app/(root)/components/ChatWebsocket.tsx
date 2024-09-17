import { useEffect, useState, useRef } from 'react';
import { getCurrentUser } from '@/lib/actions';

interface ChatWebsocketProps {
  endpoint: string;  // This will be the WebSocket endpoint, e.g., /ws/chat
}

const ChatWebsocket: React.FC<ChatWebsocketProps> = ({ endpoint }) => {
  const [logs, setLogs] = useState<{ type: 'server' | 'user'; message: string }[]>([]);
  const [token, setToken] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const logContainerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

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

    const ws = new WebSocket(`${endpoint}?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const parse_data = JSON.parse(event.data);
        const splitMessages = parse_data
          .split(/\n\n/)
          .filter((message: string) => message.trim().length > 0);

        setLogs((prevLogs) => [
          ...prevLogs,
          ...splitMessages.map((message: string) => ({ type: 'server', message }))
        ]);
      } catch (err) {
        console.log('Error parsing JSON', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      wsRef.current = null;
    };

    return () => {
      ws.close();
    };
  }, [token, endpoint]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message to the log
    setLogs((prevLogs) => [...prevLogs, { type: 'user', message: inputMessage }]);
    setInputMessage('');

    // Send the message through WebSocket
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ message: inputMessage }));
    }
  };

  const renderMessageWithBoldUnderlineCodeAndBackticks = (message: string) => {
    // Split by code blocks (```bash, ```js, etc.)
    const parts = message.split(/(```[\s\S]*?```)/g);
  
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract the content inside the code block, removing ```bash or ```js, etc.
        const codeContent = part.slice(3, -3).trim(); // Remove the surrounding ```
        const firstLine = codeContent.split('\n')[0]; // First line (could contain the language)
        const language = firstLine.match(/^bash|js|javascript|python/) ? firstLine : null;
        const code = language ? codeContent.split('\n').slice(1).join('\n') : codeContent; // Skip the first line if it's a language identifier
  
        return (
          <pre key={index} className="bg-gray-800 text-white p-2 rounded-md">
            <code>
              {language && <div className="text-xs text-gray-400">{language}</div>}
              {code}
            </code>
          </pre>
        );
      }
  
      // If it's not a code block, apply bold, underline, and backtick formatting
      const formattedParts = part.split(/(\*\*[^*]+\*\*|###.+?###|`[^`]+`|^#{1,2}\s.+$)/gm);
      return formattedParts.map((subPart, subIndex) => {
        if (subPart.startsWith('**') && subPart.endsWith('**')) {
          // Bold text (surrounded by **)
          return <strong key={`${index}-${subIndex}`}>{subPart.slice(2, -2)}</strong>;
        } else if (subPart.startsWith('###') || subPart.endsWith('###')) {
          // Underline text (surrounded by ###)
          return <strong key={`${index}-${subIndex}`}>{subPart.slice(3)}</strong>;
        } else if (subPart.startsWith('`') && subPart.endsWith('`')) {
          // Bold text inside backticks (surrounded by `)
          return <strong key={`${index}-${subIndex}`}>{subPart.slice(1, -1)}</strong>;
        } else if (subPart.startsWith('##')) {
          // Bold and Underline text starting with # or ##
          return (
            <strong key={`${index}-${subIndex}`}>
              <u>{subPart.slice(2)}</u>
            </strong>
          );
        }else if (subPart.startsWith('#')) {
          // Bold and Underline text starting with # or ##
          return (
            <strong key={`${index}-${subIndex}`}>
              <u>{subPart.slice(1)}</u>
            </strong>
          );
        }
        // Regular text
        return subPart;
      });
    });
  };
  
    

  return (
    <div className="flex flex-col h-[700px] border border-gray-300 p-2 rounded-md bg-gray-100">
      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-scroll p-2 mb-2 bg-white rounded-md"
      >
        <ul className="space-y-2">
          {logs.map((log, index) => (
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
                  {renderMessageWithBoldUnderlineCodeAndBackticks (log.message)}
                </p>
              </div>
            </div>
          ))}
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

export default ChatWebsocket;
