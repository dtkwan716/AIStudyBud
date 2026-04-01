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
  const[error, setError] = useState<string>("")
  const [selectedPersona, setSelectedPersona] = useState("Ed")

  const personaSelected = selectedPersona === "Ed" ? "Explaining Eddie" : selectedPersona === "Quin" ? "Quizzing Quincy" : "Tutoring Theodore"

  const fetchMessages = async (personaId: string) => {
    try {
    const response = await fetch(`http://localhost:8000/messages/${personaId}`)
    const data = await response.json()
    if (!response.ok) {
      throw new Error("Failed to fetch messages")
    }
    console.log(data)
    setMessages(data)
  } catch (error){
    console.error("Error fetching messages:", error)
    setError("Backend is not running please try again later.")
  }
  }

  useEffect(() => {
    fetchMessages(selectedPersona)
  }, [selectedPersona])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
   if(message.trim() === ""){
    return
   }
    setError("")
    setLoading(true)
    try{
    const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona_id: selectedPersona, message })
      })
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      await fetchMessages(selectedPersona)
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Backend is not running please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return(
    <div className="h-screen bg-[#f2f2f5] p-4">
      <div className="mx-auto flex h-full max-w-7xl overflow-hidden rounded-3xl border border-black/5 bg-white shadow-lg">
        <aside className="w-[320px] border-r border-black/5 bg-[#f2f2f2]">
          <div className="p-4 border-b font-bold">
            Study Buddies
          </div>
          <div className="p-4 flex flex-col gap-2">
            <button
              onClick={() => setSelectedPersona("Ed")}
              className={`rounded-xl px-3 py-2 text-left ${
                selectedPersona === "Ed" ? "bg-black/10" : "hover:bg-black/5"
              }`}
              > Explaining Eddie
            </button>
            <button
              onClick={() => setSelectedPersona("Quin")}
              className={`rounded-xl px-3 py-2 text-left ${
                selectedPersona === "Quin" ? "bg-black/10" : "hover:bg-black/5"
              }`}
            >
              Quizzing Quincy
            </button>
            <button
              onClick={() => setSelectedPersona("Theo")}
              className={`rounded-xl px-3 py-2 text-left ${
                selectedPersona === "Theo" ? "bg-black/10" : "hover:bg-black/5"
              }`}
              >Tutoring Theodore
            </button>
          </div> 
        </aside>
        <section className="flex flex-1 flex-col">
          <div className="p-4 border-b font-semibold text-neutral-700">
            {selectedPersona === "Ed" ? "Explaining Eddie" : selectedPersona === "Quin" ? "Quizzing Quincy" : "Tutoring Theodore"}
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 bg-neutral-100">
            {messages.map((m) => (
              <div key={m.id} className={`flex mb-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl border border-black/10 shadow-lg ${m.role === "user" ? "bg-blue-500 text-white" : "bg-white text-black"}`}>
                <p>{m.content}</p>
              </div>
            </div>
            ))}
          </div>
          <div className="p-6 flex gap-3 border-t">
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
              className="flex-1 border border-gray-300 px-4 p-2 rounded-full shadow-sm text-neutral-800"
              placeholder="Enter your message..."
            />
            { error && (
              <p style={{ color: "red" }}>{error}</p>
            )}
            <button 
              style={{
                backgroundColor: 'white',
                color: 'black',
                padding: '10px 20px',
                border: '1px solid black',
                borderRadius: '9999px',
                borderWidth: '2px',
                cursor: 'pointer',
              }}
              onClick={sendMessage}
              disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
                    Sending...
                  </span>
                ) : ("Send"
                )}
            </button>
          </div>
        </section>
    </div>
    </div>
)
}
