"use client"

import { useEffect, useState, useRef } from "react";


type Message = {
  id: number;
  chat_id: number;
  role: string;
  content: string;
  created_at: string;
};

export default function Home() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const chatRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const chatId = 1
  const fetchMessages = async () => {
    const response = await fetch(`http://localhost:8000/messages/${chatId}`)
    const data = await response.json()
    console.log(data)
    setMessages(data)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
   if(message.trim() === ""){
    return
   }
    setLoading(true)
    try{
    await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, message })
      })
    
      await fetchMessages()
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  return(
    <div className="flex flex-col h-screen">
      <div 
      ref={chatRef}
      className="flex-1 overflow-y-auto">
      {messages.map((m) => (
        <div key={m.id} className={`flex mb-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-xs px-4 py-2 rounded-xl border-2 border-black ${m.role === "user" ? "bg-blue-500 text-white" : "bg-white text-black"}`}>
          <p>{m.content}</p>
        </div>
      </div>
      ))}
    </div>


    <div className="p-6 flex flex-col gap-4">
    <input
    onKeyDown={(e) => {
      if(e.key === "Enter" && !loading){
        sendMessage()
      }
    }}
    disabled={loading}
      type = "text"
      value = {message}
      onChange = {(e) => setMessage(e.target.value)}
      className="border border-gray-300 p-2 rounded"
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
    onClick={sendMessage}
    disabled={loading}>
      {loading ? "Sending..." : "Send"}
    </button>
    </div>
    </div>
)
}
