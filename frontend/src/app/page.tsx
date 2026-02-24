"use client"

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("")
  const [reply, setReply] = useState("")
  const[messages, setMessages] = useState([])

  const fetchMessages = async () => {
    const response = await fetch("http://localhost:8000/messages")
    const data = await response.json()
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
    <div className="p-6 flex flex-col gap-4">
    <input
      type = "text"
      value = {message}
      onChange = {(e) => setMessage(e.target.value)}
      className="border border-gray p-2 rounded"
      placeholder="Testing"
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
    <div className = "flex flex-col gap-2">
      {messages.map((m: any) => (
        <div key={m.id} className="border border-gray p-2 rounded">
        <p><strong>User:</strong>{ m.message}</p>
        <p><strong>AI:</strong>{ m.reply}</p>
        </div>
      ))}
    </div>
  </div>
  )
}
