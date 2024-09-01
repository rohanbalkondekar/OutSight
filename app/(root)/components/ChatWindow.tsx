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
      try {
        
        const parse_data = JSON.parse(event.data);
    
        // Split the message by double newlines first, then by single newlines
        const splitMessages = parse_data
          .split(/\n\n|\n/) // Regex to split on either '\n\n' or '\n'
          .filter((message: string) => message.trim().length > 0); // Remove any empty lines

          console.log(parse_data)
    
        // Add each split message as a new log entry
        setLogs((prevLogs) => [
          ...prevLogs,
          ...splitMessages.map((message: string) => ({ type: 'server', message }))
        ]);
      } catch (err) {
        console.log('Error parsing JSON', err);
      }
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

  // Function to parse and render messages with bold text
const renderMessageWithBold = (message: string) => {
  // Regular expression to match text enclosed in **
  const parts = message.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove the ** and wrap the text in <strong> for bold styling
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

return (
  <div className="flex flex-col h-[760px] border border-gray-300 p-4 rounded-md bg-gray-100">
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
                {/* Render the message with bold text where applicable */}
                {renderMessageWithBold(log.message)}
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


//   return (
//     <div className="flex flex-col h-[760px] border border-gray-300 p-4 rounded-md bg-gray-100">
//       <div
//         ref={logContainerRef}
//         className="flex-1 overflow-y-scroll p-2 mb-2 bg-white rounded-md"
//       >
//       <ul className="space-y-2">
//         {logs.map((log, index) => {
//           console.log(log);
//           return (
//             <div
//               key={index}
//               className={`flex items-end ${log.type === 'user' ? 'justify-end' : ''}`}
//             >
//               <div
//                 className={`flex flex-col space-y-2 text-sm max-w-7xl mx-2 overflow-x-hidden ${
//                   log.type === 'user' ? 'order-1 items-end' : 'order-2 items-start'
//                 }`}
//               >
//                 <p
//                   className={`px-4 py-2 rounded-lg ${
//                     log.type === 'user'
//                       ? 'bg-blue-500 text-white'
//                       : 'bg-gray-300 text-gray-800'
//                   }`}
//                 >
//                   {log.message}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </ul>



//       </div>

//       <div className="flex items-center p-2">
//         <input
//           type="text"
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//           className="flex-1 border border-gray-300 rounded-l-md p-2"
//           placeholder="Type your message..."
//         />
//         <button
//           onClick={handleSendMessage}
//           className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
};

export default ChatWindows;
