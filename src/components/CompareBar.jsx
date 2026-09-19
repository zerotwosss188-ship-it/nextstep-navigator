import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Scale } from 'lucide-react'
import { useCompare } from '../context/CompareContext'
import careersData from '../data/careers.json'

export default function CompareBar() {
  const { compareIds, removeCompare, clearCompare } = useCompare()
  const location = useLocation()

  // Hide on compare page itself and when list is empty
  if (compareIds.length === 0 || location.pathname === '/compare') return null

  const careers = compareIds
    .map((id) => careersData.find((c) => c.id === id))
    .filter(Boolean)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-navy text-white rounded-2xl shadow-2xl px-5 py-3 max-w-3xl w-[calc(100%-2rem)]"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron shrink-0">
            <Scale size={14} /> Compare
          </div>

          <div className="flex-1 flex items-center gap-2 flex-wrap min-w-0">
            {careers.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 bg-white/10 rounded-full pl-2 pr-1 py-1 text-xs shrink-0"
              >
                <span>{c.icon}</span>
                <span className="font-medium truncate max-w-[120px]">{c.title}</span>
                <button
                  onClick={() => removeCompare(c.id)}
                  className="w-5 h-5 rounded-full hover:bg-white/20 flex items-center justify-center transition"
                  aria-label={`Remove ${c.title}`}
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearCompare}
              className="text-xs text-white/60 hover:text-white transition"
            >
              Clear
            </button>
            <Link
              to="/compare"
              className="bg-saffron hover:bg-saffron-dark text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 transition"
            >
              Compare {careers.length} <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}