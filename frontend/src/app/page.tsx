"use client"

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("")
  const [reply, setReply] = useState("")
  const[messages, setMessages] = useState([])

  const fetchMessages = async () => {
    const response = await fetch("http://localhost:8000/messages")
    const data = await response.json()
    console.log(data)
    setMessages(data)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const sendMessage = async () => {
   await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    })
    await fetchMessages()
    setMessage("")
  }

  return(
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
      {messages.map((m: any) => (
        <div key={m.id} className="flex flex-col gap-4 p-6">
          <div className="self-end max-w-xs bg-blue-500 text-white px-4 py-2 rounded-xl"
            style={{  
              border: "1px solid black",
              borderRadius: "10px",
              borderWidth: "2px",
              padding: "10px",
            }}>
              <p>{m.message}</p>
          </div>
          <div className="self-start max-w-xs bg-white border px-4 py-2 rounded-xl"
            style={{
              border: "1px solid black",
              borderRadius: "10px",
              borderWidth: "2px",
              padding: "10px",
            }}>
            <p className="self-start">{m.reply}</p>
          </div>
      </div>
      ))}
  </div>
    <div className="p-6 flex flex-col gap-4">
    <input
      type = "text"
      value = {message}
      onChange = {(e) => setMessage(e.target.value)}
      className="border border-gray 300 p-2 rounded"
      placeholder="Enter your message..."
    />
     <button 
    style={{
        backgroundColor: 'white',
        color: 'black',
        padding: '10px 20px',
        border: '1px solid black',
        borderRadius: '10px',
        borderWidth: '2px',
        cursor: 'pointer',
    }}
    onClick={sendMessage}>
      Send
    </button>
    </div>
    </div>
)
}
