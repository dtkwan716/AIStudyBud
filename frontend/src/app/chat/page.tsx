"use client"

import { useEffect, useState, useRef } from "react";

type Message = {
  id: number;
  chat_id: number;
  role: string;
  content: string;
  created_at: string;
};

const personas = [
  {
    id: "Ed",
    name: "Explaining Eddie",
    badge: "Concept Coach",
    description: "Breaks topics into clear, memorable steps.",
  },
  {
    id: "Quin",
    name: "Quizzing Quincy",
    badge: "Active Recall",
    description: "Turns study time into quick, focused practice.",
  },
  {
    id: "Theo",
    name: "Tutoring Theodore",
    badge: "Deep Tutor",
    description: "Guides you through problems with patient feedback.",
  },
] as const;

export default function Home() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const chatRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const[error, setError] = useState<string>("")
  const [selectedPersona, setSelectedPersona] = useState("Ed")

  const activePersona =
    personas.find((persona) => persona.id === selectedPersona) ?? personas[0];

  const fetchMessages = async (personaId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/messages/${personaId}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.75),_transparent_38%),linear-gradient(180deg,_#f7f1e8_0%,_#efe7db_100%)] p-4 md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col overflow-hidden rounded-[32px] border border-border bg-surface shadow-[var(--shadow-soft)] md:min-h-[calc(100vh-3rem)] md:flex-row">
        <aside className="w-full border-b border-border bg-surface-muted/80 md:w-[340px] md:border-r md:border-b-0">
          <div className="border-b border-border-strong px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              AI Study Buddies
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-foreground">
              Home of Your AI Study Buddies
            </h1>
          </div>
          <div className="flex flex-col gap-3 p-4 md:p-5">
            {personas.map((persona) => {
              const isSelected = persona.id === selectedPersona;

              return (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id)}
                  className={`rounded-[24px] border px-4 py-4 text-left transition duration-200 ${
                    isSelected
                      ? "border-accent bg-white shadow-[var(--shadow-card)]"
                      : "border-transparent bg-white/55 hover:border-border-strong hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-foreground">{persona.name}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-accent">
                        {persona.badge}
                      </p>
                    </div>
                    <div
                      className={`h-3 w-3 rounded-full transition ${
                        isSelected ? "bg-accent shadow-[0_0_0_6px_rgba(31,111,120,0.12)]" : "bg-surface-strong"
                      }`}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-text-muted">
                    {persona.description}
                  </p>
                </button>
              );
            })}
          </div> 
        </aside>
        <section className="flex flex-1 flex-col bg-[linear-gradient(180deg,_rgba(255,255,255,0.72),_rgba(247,241,232,0.45))]">
          <div className="border-b border-border-strong px-6 py-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  {activePersona.badge}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  {activePersona.name}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-text-muted">
                {activePersona.description}
              </p>
            </div>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
              {messages.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-border-strong bg-white/70 p-8 text-center shadow-[var(--shadow-card)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Start Here
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-foreground">
                    Ask {activePersona.name.split(" ")[0]} anything you&apos;re studying
                  </h3>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-text-muted">
                    Try a topic, paste a question, or ask for a quiz. This space is designed to feel focused and calm instead of cluttered.
                  </p>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[85%] md:max-w-[72%]">
                      <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                        m.role === "user" ? "text-right text-accent-strong" : "text-text-muted"
                      }`}>
                        {m.role === "user" ? "You" : activePersona.name}
                      </p>
                      <div className={`rounded-[26px] border px-5 py-4 text-[15px] leading-7 shadow-[var(--shadow-card)] ${
                        m.role === "user"
                          ? "border-accent/20 bg-accent text-white"
                          : "border-white/80 bg-white text-foreground"
                      }`}>
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="border-t border-border-strong px-4 py-4 md:px-6 md:py-5">
            <div className="mx-auto max-w-4xl rounded-[28px] border border-white/80 bg-white/80 p-3 shadow-[var(--shadow-card)] backdrop-blur">
              { error && (
                <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <input
                  onKeyDown={(e) => {
                    if(e.key === "Enter" && !loading){
                      sendMessage()
                    }
                  }}
                  disabled={loading}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-w-0 flex-1 rounded-full border border-border bg-surface px-5 py-3 text-[15px] text-foreground outline-none transition placeholder:text-text-muted focus:border-accent focus:ring-4 focus:ring-accent/10"
                  placeholder={`Message ${activePersona.name}...`}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="inline-flex min-w-[128px] items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-accent/60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"></span>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
