import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<string[]>([
    "are madarchodo aao milke bakchodi kare"
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="h-screen bg-zinc-900 flex flex-col text-white">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex">
            <span className="bg-purple-600 px-4 py-2 rounded-xl shadow">
              {message}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="w-full bg-zinc-800 p-4 flex gap-3 border-t border-zinc-700">
        <input
          ref={inputRef}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-lg bg-zinc-700 text-white outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={() => {
            const message = inputRef.current?.value;

            if (!message || !wsRef.current) return;

            wsRef.current.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  message: message,
                },
              })
            );

            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
          className="bg-purple-600 hover:bg-purple-700 transition px-6 rounded-lg font-medium"
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default App;