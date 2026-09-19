import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

// Built-in illustration variants
const ILLUSTRATIONS = {
  bookmark: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="bk-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF8A00" />
          <stop offset="100%" stopColor="#00C2A8" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="70" fill="url(#bk-grad)" opacity="0.12" />
      <path
        d="M70 60 h60 a10 10 0 0 1 10 10 v80 l-40-20 -40 20 v-80 a10 10 0 0 1 10-10 z"
        fill="url(#bk-grad)"
        stroke="#0B1E3F"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="90" r="6" fill="#FF8A00" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="s-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00C2A8" />
          <stop offset="100%" stopColor="#FF8A00" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="70" fill="url(#s-grad)" opacity="0.12" />
      <circle cx="90" cy="90" r="35" stroke="#0B1E3F" strokeWidth="3" fill="white" fillOpacity="0.4" />
      <line x1="115" y1="115" x2="140" y2="140" stroke="#0B1E3F" strokeWidth="4" strokeLinecap="round" />
      <circle cx="90" cy="90" r="18" fill="#00C2A8" opacity="0.35" />
    </svg>
  ),
  quiz: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="q-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF8A00" />
          <stop offset="100%" stopColor="#CC6E00" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="70" fill="url(#q-grad)" opacity="0.12" />
      <circle cx="100" cy="100" r="50" fill="white" stroke="#0B1E3F" strokeWidth="2.5" />
      <text x="100" y="122" textAnchor="middle" fontSize="58" fontWeight="800" fill="#0B1E3F" fontFamily="system-ui">?</text>
      <circle cx="140" cy="60" r="10" fill="#FF8A00" />
      <circle cx="60" cy="140" r="8" fill="#00C2A8" />
    </svg>
  ),
  filter: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="f-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF8A00" />
          <stop offset="100%" stopColor="#00C2A8" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="70" fill="url(#f-grad)" opacity="0.12" />
      <path d="M60 70 L140 70 L115 105 L115 140 L85 130 L85 105 Z"
        fill="url(#f-grad)" stroke="#0B1E3F" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),
  story: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="st-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00C2A8" />
          <stop offset="100%" stopColor="#FF8A00" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="70" fill="url(#st-grad)" opacity="0.12" />
      <path d="M70 60 h60 v80 h-60 z" fill="white" stroke="#0B1E3F" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="82" y1="80" x2="118" y2="80" stroke="#FF8A00" strokeWidth="3" strokeLinecap="round" />
      <line x1="82" y1="95" x2="118" y2="95" stroke="#0B1E3F" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="82" y1="108" x2="105" y2="108" stroke="#0B1E3F" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
}

export default function EmptyState({
  illustration = 'search',
  title = 'Nothing here yet',
  description = 'Try adjusting your search or explore something new.',
  actionLabel,
  actionTo,
  onAction,
  secondaryLabel,
  secondaryTo,
}) {
  const art = ILLUSTRATIONS[illustration] || ILLUSTRATIONS.search

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl border border-navy/5 shadow-sm px-6 py-16 text-center"
    >
      <div className="w-32 h-32 mx-auto mb-5">
        {art}
      </div>

      <h3 className="font-heading font-bold text-xl text-navy mb-2">{title}</h3>
      <p className="text-navy/60 text-sm max-w-sm mx-auto mb-6">{description}</p>

      <div className="flex flex-wrap gap-3 justify-center">
        {actionLabel && (actionTo || onAction) && (
          actionTo ? (
            <Link
              to={actionTo}
              className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
            >
              {actionLabel} <ArrowRight size={14} />
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
            >
              {actionLabel} <ArrowRight size={14} />
            </button>
          )
        )}

        {secondaryLabel && secondaryTo && (
          <Link
            to={secondaryTo}
            className="inline-flex items-center gap-2 bg-white border border-navy/15 hover:border-navy/40 text-navy font-semibold px-5 py-2.5 rounded-xl transition text-sm"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </motion.div>
  )
}