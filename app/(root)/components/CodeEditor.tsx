import React, { useEffect, useRef, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

interface CodeEditorProps {
  file: string;
  userId: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file, userId }) => {
  const [code, setCode] = useState<string>('');
  const ws = useRef<WebSocket | null>(null); // WebSocket typed as nullable

  useEffect(() => {
    // Establish a WebSocket connection to listen to file changes
    ws.current = new WebSocket(`ws://localhost:8000/ws/code_editor?file=${file}&userId=${userId}`);

    // Listen for incoming file updates from the server
    ws.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.file === file) {
        setCode(data.content); // Update editor with new file content
      }
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [file, userId]);

  const handleEditorChange = (newCode: string) => {
    setCode(newCode);

    // Send updated code to the server via WebSocket
    if (ws.current) {
      ws.current.send(JSON.stringify({ type: 'update_code', file, content: newCode }));
    }
  };

  return (
    <MonacoEditor
      language="javascript"
      theme="vs-dark"
      value={code}
      onChange={handleEditorChange}
      options={{ automaticLayout: true }}
    />
  );
};

export default CodeEditor;
