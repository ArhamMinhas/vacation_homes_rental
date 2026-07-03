"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Loader2, MapPin, BedDouble, Star } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { formatCurrency } from "@/utils/formatCurrency"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  properties?: Property[]
}

interface Property {
  id: string
  title: string
  location: string
  property_type: string
  price_per_night: number
  bedrooms: number
  max_guests: number
  images: string[]
}

const SUGGESTIONS = [
  "Beach house for 4 people under $300",
  "Mountain cabin with fireplace",
  "Pet friendly villa with pool",
  "Romantic getaway for 2",
]

export default function BookingAssistant() {
  const [open, setOpen]         = useState(false)
  const [input, setInput]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your CoastalHorizon assistant. Tell me what kind of vacation home you're looking for — location, dates, guests, budget — and I'll find the best options for you.",
    },
  ])
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: "user", content: text.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.text ?? "Sorry, I couldn't process that.",
          properties: data.properties ?? [],
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-white shadow-xl shadow-primary/30 flex items-center justify-center"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-900/15 flex flex-col overflow-hidden"
            style={{ height: "520px" }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 bg-[#080d1a] shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">AI Assistant</p>
                <p className="text-[10px] text-white/40">CoastalHorizon · powered by Claude</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-white/50">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[85%] space-y-2")}>
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-sm"
                      )}
                    >
                      {msg.content}
                    </div>

                    {/* Property cards */}
                    {msg.properties && msg.properties.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {msg.properties.map((p) => (
                          <Link key={p.id} href={ROUTES.PROPERTY_DETAIL(p.id)} className="block group">
                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                              {p.images?.[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.images[0]} alt={p.title} className="w-full h-24 object-cover" />
                              ) : (
                                <div className="w-full h-24 bg-gradient-to-br from-orange-50 to-amber-50" />
                              )}
                              <div className="p-2.5">
                                <p className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                                  {p.title}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5 text-gray-400">
                                  <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                                  <span className="text-[10px] truncate">{p.location}</span>
                                </div>
                                <div className="flex items-center justify-between mt-1.5">
                                  <span className="text-xs font-bold text-primary">{formatCurrency(p.price_per_night)}<span className="text-[10px] font-normal text-gray-400">/night</span></span>
                                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                    <span className="flex items-center gap-0.5"><BedDouble className="h-2.5 w-2.5" />{p.bedrooms}</span>
                                    <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />4.9</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-gray-400"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions (only first message) */}
              {messages.length === 1 && !loading && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Try asking</p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full text-left text-xs text-gray-600 bg-gray-50 hover:bg-primary/5 hover:text-primary border border-gray-100 hover:border-primary/20 rounded-xl px-3 py-2 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2.5 border border-gray-200 focus-within:border-primary/40 focus-within:bg-white transition-colors">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
                  placeholder="Ask about properties…"
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400 min-w-0"
                  disabled={loading}
                />
                <motion.button
                  onClick={() => send(input)}
                  disabled={!input.trim() || loading}
                  className="h-7 w-7 rounded-full bg-primary flex items-center justify-center disabled:opacity-40 shrink-0"
                  whileTap={{ scale: 0.9 }}
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5 text-white" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
