import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, X, Bot, User, ExternalLink, RotateCcw } from 'lucide-react'
import careersData from '../data/careers.json'
import { getAdvisorResponse } from '../utils/advisorEngine'

const WELCOME = {
  role: 'bot',
  text: "Hi! I'm your Career Advisor. Tell me what you enjoy or what you're curious about, and I'll suggest careers that might fit you.",
  careers: [],
  resources: null,
}

const QUICK_PROMPTS = [
  'I love coding',
  'I want to help people',
  'What pays well?',
  'I like design',
  'Which career for me?',
]

export default function AdvisorChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const send = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    // Push user message
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setInput('')
    setTyping(true)

    // Simulate thinking delay
    setTimeout(() => {
      const response = getAdvisorResponse(trimmed)
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: response?.text || 'Hmm, I didn\'t catch that. Try again?',
          careers: response?.careers || [],
          resources: response?.resources || null,
          cta: response?.cta,
        },
      ])
      setTyping(false)
    }, 650)
  }

  const reset = () => setMessages([WELCOME])

  return (
    <>
      {/* Floating trigger button (bottom-right) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-br from-saffron to-saffron-dark text-white rounded-full shadow-2xl px-5 py-3.5 flex items-center gap-2 font-semibold hover:scale-105 transition-transform group"
        aria-label="Open career advisor"
      >
        <span className="relative">
          <Sparkles size={18} />
          <span className="absolute inset-0 bg-white/40 rounded-full animate-ping opacity-75" />
        </span>
        <span className="hidden sm:inline text-sm">AI Advisor</span>
      </motion.button>

      {/* Chat modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop (mobile only) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-[80] md:hidden"
              onClick={() => setOpen(false)}
              data-modal-open="true"
            />

            {/* Chat panel */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="fixed bottom-6 right-6 z-[85] w-[calc(100%-3rem)] max-w-md h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-navy/10"
              data-modal-open="true"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-navy to-navy-light text-white px-5 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm">AI Career Advisor</p>
                    <p className="text-[11px] text-white/60 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                      Online · Always ready
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={reset}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition"
                    aria-label="Reset conversation"
                    title="New conversation"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition"
                    aria-label="Close chat"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-5 py-4 bg-offwhite space-y-4"
              >
                {messages.map((msg, i) => (
                  <Message key={i} msg={msg} />
                ))}
                {typing && <TypingBubble />}

                {/* Quick prompts (only show early) */}
                {messages.length <= 2 && !typing && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-2">
                      Try asking
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((p) => (
                        <button
                          key={p}
                          onClick={() => send(p)}
                          className="text-xs font-medium bg-white border border-navy/10 hover:border-saffron hover:text-saffron text-navy/70 rounded-full px-3 py-1.5 transition"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="bg-white border-t border-navy/5 p-3 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    send(input)
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tell me what you enjoy..."
                    className="flex-1 border border-navy/10 rounded-full px-4 py-2.5 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-10 h-10 rounded-full bg-saffron hover:bg-saffron-dark disabled:bg-navy/10 disabled:cursor-not-allowed text-white flex items-center justify-center transition shrink-0"
                    aria-label="Send"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ---- Message bubble ----
function Message({ msg }) {
  const isBot = msg.role === 'bot'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          isBot ? 'bg-saffron text-white' : 'bg-navy text-white'
        }`}
      >
        {isBot ? <Bot size={14} /> : <User size={14} />}
      </div>

      <div className={`flex-1 min-w-0 ${isBot ? '' : 'flex justify-end'}`}>
        <div
          className={`inline-block max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isBot
              ? 'bg-white border border-navy/5 text-navy/80'
              : 'bg-saffron text-white'
          }`}
        >
          {/* Basic bold markdown (**text**) */}
          <FormattedText text={msg.text} />
        </div>

        {/* Career chips */}
        {msg.careers && msg.careers.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {msg.careers.map((id) => {
              const c = careersData.find((x) => x.id === id)
              if (!c) return null
              return (
                <Link
                  key={id}
                  to="/career-bank"
                  className="flex items-center gap-2 bg-white border border-navy/10 hover:border-saffron rounded-xl px-3 py-2 text-xs transition group"
                >
                  <span className="text-lg">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-navy truncate">
                      {c.title}
                    </p>
                    <p className="text-[10px] text-navy/50">{c.industry}</p>
                  </div>
                  <ExternalLink size={11} className="text-navy/40 group-hover:text-saffron transition shrink-0" />
                </Link>
              )
            })}
          </div>
        )}

        {/* Resource chips */}
        {msg.resources && msg.resources.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {msg.resources.map((r) => (
              <Link
                key={r.id}
                to="/resources"
                className="flex items-center gap-2 bg-teal/5 border border-teal/20 hover:border-teal rounded-xl px-3 py-2 text-xs transition group"
              >
                <span className="text-lg">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-navy truncate">
                    {r.title}
                  </p>
                  <p className="text-[10px] text-navy/50">{r.type}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        {msg.cta && (
          <div className="mt-2">
            <Link
              to={msg.cta.to}
              className="inline-flex items-center gap-1.5 bg-saffron hover:bg-saffron-dark text-white text-xs font-semibold px-3 py-1.5 rounded-full transition"
            >
              {msg.cta.label}
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ---- Simple markdown formatter (just **bold**) ----
function FormattedText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-bold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

// ---- Typing indicator ----
function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2.5"
    >
      <div className="w-7 h-7 rounded-full bg-saffron text-white flex items-center justify-center shrink-0">
        <Bot size={14} />
      </div>
      <div className="bg-white border border-navy/5 rounded-2xl px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-navy/40"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}