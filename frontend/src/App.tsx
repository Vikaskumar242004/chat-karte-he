import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState(["are madarchodo aao milke bakchodi kare "]);
  const wsRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080");
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data])
    }
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }
    return () => {
      ws.close()
    }
  }, []);

  return (
    <div className='h-screen bg-zinc-900 flex flex-col text-white'>

      {/* Chat Messages */}
      <div className='flex-1 overflow-y-auto p-6 space-y-4'>
        {messages.map((message, index) => (
          <div key={index} className='flex'>
            <div className='bg-purple-600 px-4 py-2 rounded-xl max-w-xs shadow'>
              {message}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className='w-full bg-zinc-800 p-4 flex gap-3 border-t border-zinc-700'>
        <input
          ref={inputRef}
          id="message"
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-lg bg-zinc-700 text-white outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={() => {
            const message = inputRef.current?.value;
            wsRef.current.send(JSON.stringify({
              type: "chat",
              payload: {
                message: message
              }
            }))
          }}
          className='bg-purple-600 hover:bg-purple-700 transition px-6 rounded-lg font-medium'
        >
          Send
        </button>
      </div>

    </div>
  )
}

export default App