import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useUser } from '../context/UserContext'

// Must match the order in SwipeNavigator.jsx
const ROUTE_ORDER = [
  '/',
  '/career-bank',
  '/quiz',
  '/courses',
  '/multimedia',
  '/success-stories',
  '/resources',
  '/admission',
  '/feedback',
  '/bookmarks',
  '/about',
  '/contact',
]

// Labels shown as tooltips
const ROUTE_LABELS = {
  '/': 'Home',
  '/career-bank': 'Career Bank',
  '/quiz': 'Interest Quiz',
  '/courses': 'Courses',      // ⬅️ ADD THIS
  '/multimedia': 'Multimedia',
  '/success-stories': 'Success Stories',
  '/resources': 'Resource Library',
  '/admission': 'Admission & Coaching',
  '/feedback': 'Feedback',
  '/bookmarks': 'Bookmarks',
  '/about': 'About Us',
  '/contact': 'Contact',
}
export default function SwipeArrows() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useUser()

  // Only show when logged in
  if (!user) return null

  // Don't show inside modals or quiz-taking
  if (typeof document !== 'undefined' && document.querySelector('[data-modal-open="true"]')) {
    return null
  }

  const currentIndex = ROUTE_ORDER.indexOf(pathname)
  if (currentIndex === -1) return null

  const prevRoute = currentIndex > 0 ? ROUTE_ORDER[currentIndex - 1] : null
  const nextRoute = currentIndex < ROUTE_ORDER.length - 1 ? ROUTE_ORDER[currentIndex + 1] : null

  return (
    <>
      {/* LEFT ARROW (Previous page) */}
      <AnimatePresence>
        {prevRoute && (
          <motion.button
            key="left-arrow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            onClick={() => navigate(prevRoute)}
            data-no-swipe
            className="fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 group"
            aria-label={`Go to ${ROUTE_LABELS[prevRoute]}`}
            title={`← ${ROUTE_LABELS[prevRoute]}`}
          >
            <div className="relative">
              {/* Glow on hover */}
              <div className="absolute inset-0 bg-saffron/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Button */}
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md border border-navy/10 shadow-lg flex items-center justify-center text-navy/60 group-hover:text-white group-hover:bg-saffron group-hover:border-saffron group-hover:scale-110 transition-all">
                <ChevronLeft size={20} strokeWidth={2.5} />
              </div>

              {/* Tooltip (desktop only) */}
              <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                <div className="bg-navy text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">
                  {ROUTE_LABELS[prevRoute]}
                </div>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* RIGHT ARROW (Next page) */}
      <AnimatePresence>
        {nextRoute && (
          <motion.button
            key="right-arrow"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            onClick={() => navigate(nextRoute)}
            data-no-swipe
            className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 group"
            aria-label={`Go to ${ROUTE_LABELS[nextRoute]}`}
            title={`${ROUTE_LABELS[nextRoute]} →`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-saffron/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md border border-navy/10 shadow-lg flex items-center justify-center text-navy/60 group-hover:text-white group-hover:bg-saffron group-hover:border-saffron group-hover:scale-110 transition-all">
                <ChevronRight size={20} strokeWidth={2.5} />
              </div>

              <div className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                <div className="bg-navy text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">
                  {ROUTE_LABELS[nextRoute]}
                </div>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}