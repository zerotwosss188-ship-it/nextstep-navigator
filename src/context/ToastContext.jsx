import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X, AlertCircle, Info } from 'lucide-react'

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info }
const COLORS = {
  success: 'bg-teal text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-navy text-white',
}

// Call this from anywhere: toast('Message', 'success')
// Fires on next tick to avoid React's "setState during render" warning
export function toast(message, type = 'success', duration = 2500) {
  const id = Date.now() + Math.random()
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('nsn-toast', {
      detail: { message, type, duration, id }
    }))
  }, 0)
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handler = (e) => {
      const { id, message, type, duration } = e.detail
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    window.addEventListener('nsn-toast', handler)
    return () => window.removeEventListener('nsn-toast', handler)
  }, [])

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || ICONS.info
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className={`${COLORS[t.type]} rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 min-w-[240px] max-w-sm pointer-events-auto`}
            >
              <Icon size={18} className="shrink-0" />
              <p className="text-sm font-medium flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="w-5 h-5 rounded-full hover:bg-white/20 flex items-center justify-center shrink-0 transition"
                aria-label="Dismiss"
              >
                <X size={12} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}