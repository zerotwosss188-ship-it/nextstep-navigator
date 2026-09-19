import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, X } from 'lucide-react'
import { useUser } from '../context/UserContext'

const KEY = 'nsn-swipe-hint-shown'

export default function SwipeHint() {
  const { user } = useUser()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!user) return
    try {
      const shown = localStorage.getItem(KEY)
      if (!shown) {
        const t = setTimeout(() => setShow(true), 1200)
        return () => clearTimeout(t)
      }
    } catch {}
  }, [user])

  const dismiss = () => {
    setShow(false)
    try { localStorage.setItem(KEY, 'true') } catch {}
  }

  // Auto-dismiss after 6s
  useEffect(() => {
    if (!show) return
    const t = setTimeout(dismiss, 6000)
    return () => clearTimeout(t)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          data-no-swipe
        >
          <div className="bg-navy text-white rounded-2xl shadow-2xl px-5 py-3.5 flex items-center gap-3 max-w-md">
            <div className="w-9 h-9 rounded-full bg-saffron flex items-center justify-center shrink-0">
              <Hand size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Swipe or use arrows to navigate</p>
              <p className="text-xs text-white/60">Move between pages left ↔ right</p>
            </div>
            <button
              onClick={dismiss}
              className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition shrink-0"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}