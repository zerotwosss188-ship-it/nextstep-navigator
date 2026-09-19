import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, CornerDownLeft, ArrowUp, ArrowDown, FileText,
  Briefcase, Compass, Bookmark, User, HelpCircle, X
} from 'lucide-react'
import careersData from '../data/careers.json'
import resourcesData from '../data/resources.json'
import storiesData from '../data/stories.json'
import { useUser } from '../context/UserContext'

// ---- Pages you can jump to ----
const PAGES = [
  { id: 'page-home', label: 'Home', to: '/', icon: Compass, keywords: 'dashboard home landing' },
  { id: 'page-career-bank', label: 'Career Bank', to: '/career-bank', icon: Briefcase, keywords: 'careers jobs professions' },
  { id: 'page-quiz', label: 'Interest Quiz', to: '/quiz', icon: HelpCircle, keywords: 'quiz test interests' },
  { id: 'page-multimedia', label: 'Multimedia', to: '/multimedia', icon: Compass, keywords: 'videos podcasts' },
  { id: 'page-stories', label: 'Success Stories', to: '/success-stories', icon: User, keywords: 'inspiration journeys' },
  { id: 'page-resources', label: 'Resource Library', to: '/resources', icon: FileText, keywords: 'ebooks articles checklists' },
  { id: 'page-admission', label: 'Admission & Coaching', to: '/admission', icon: Compass, keywords: 'guidance interview resume study abroad' },
  { id: 'page-bookmarks', label: 'My Bookmarks', to: '/bookmarks', icon: Bookmark, keywords: 'saved favorites' },
  { id: 'page-profile', label: 'My Profile', to: '/profile', icon: User, keywords: 'account passport skills' },
  { id: 'page-about', label: 'About Us', to: '/about', icon: Compass, keywords: 'mission team story' },
  { id: 'page-contact', label: 'Contact Us', to: '/contact', icon: Compass, keywords: 'email phone help' },
  { id: 'page-feedback', label: 'Feedback', to: '/feedback', icon: HelpCircle, keywords: 'suggestions ideas' },
  { id: 'page-compare', label: 'Compare Careers', to: '/compare', icon: Briefcase, keywords: 'side by side comparison' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const { user } = useUser()

  // ---- Keyboard shortcut: Ctrl+K / Cmd+K ----
    // ---- Keyboard shortcut: Ctrl+K / Cmd+K + external trigger ----
  useEffect(() => {
    const onKeyDown = (e) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      // Esc to close
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    const onExternalOpen = () => setOpen(true)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('nsn-open-palette', onExternalOpen)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('nsn-open-palette', onExternalOpen)
    }
  }, [open])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // ---- Build searchable items ----
  const allItems = useMemo(() => {
    const pages = PAGES.map((p) => ({
      type: 'page',
      id: p.id,
      label: p.label,
      subtitle: 'Navigate',
      to: p.to,
      icon: p.icon,
      searchText: `${p.label} ${p.keywords}`.toLowerCase(),
    }))

    const careers = careersData.map((c) => ({
      type: 'career',
      id: `career-${c.id}`,
      label: c.title,
      subtitle: `${c.icon} ${c.industry}`,
      to: '/career-bank',
      icon: Briefcase,
      searchText: `${c.title} ${c.industry} ${c.skills.join(' ')} ${c.description}`.toLowerCase(),
    }))

    const resources = (resourcesData.resources || []).map((r) => ({
      type: 'resource',
      id: `res-${r.id}`,
      label: r.title,
      subtitle: `${r.icon} ${r.type} · ${r.category}`,
      to: '/resources',
      icon: FileText,
      searchText: `${r.title} ${r.category} ${r.description}`.toLowerCase(),
    }))

    const stories = storiesData.map((s) => ({
      type: 'story',
      id: `story-${s.id}`,
      label: s.name,
      subtitle: `${s.domain} · ${s.role}`,
      to: '/success-stories',
      icon: User,
      searchText: `${s.name} ${s.domain} ${s.role} ${s.journey}`.toLowerCase(),
    }))

    return [...pages, ...careers, ...resources, ...stories]
  }, [])

  // ---- Filter by query ----
  const results = useMemo(() => {
    if (!query.trim()) {
      // Show pages first when empty
      return allItems.filter((i) => i.type === 'page').slice(0, 8)
    }
    const q = query.toLowerCase().trim()
    return allItems
      .filter((item) => item.searchText.includes(q))
      .slice(0, 20)
  }, [query, allItems])

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0)
  }, [results.length])

  // ---- Keyboard navigation ----
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = results[activeIndex]
      if (item) {
        handleSelect(item)
      }
    }
  }

  const handleSelect = (item) => {
    setOpen(false)
    // If it's a career, open career bank (and let the user click into it)
    // All others → go to page
    navigate(item.to)
  }

  // Only show for logged-in users
  if (!user) return null

  // Group results by type for display
  const grouped = results.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = []
    acc[item.type].push(item)
    return acc
  }, {})

  const TYPE_LABELS = {
    page: 'Pages',
    career: 'Careers',
    resource: 'Resources',
    story: 'Stories',
  }

    return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[90]"
              onClick={() => setOpen(false)}
              data-modal-open="true"
            />

            {/* Centering container */}
            <div
              className="fixed inset-0 z-[95] flex items-start justify-center pt-[10vh] px-4 pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.18 }}
                className="w-full max-w-xl pointer-events-auto"
              >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-navy/10">
                  {/* Input row */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-navy/5">
                    <Search size={18} className="text-navy/40 shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Search careers, pages, resources..."
                      className="flex-1 bg-transparent text-navy placeholder:text-navy/30 text-base focus:outline-none"
                    />
                    <button
                      onClick={() => setOpen(false)}
                      className="text-[10px] font-mono bg-navy/5 hover:bg-navy/10 text-navy/50 px-2 py-1 rounded transition"
                    >
                      ESC
                    </button>
                  </div>

                  {/* Results */}
                  <div className="max-h-[60vh] overflow-y-auto">
                    {results.length === 0 ? (
                      <div className="px-6 py-12 text-center">
                        <Search size={28} className="text-navy/20 mx-auto mb-3" />
                        <p className="text-sm text-navy/60">
                          No results for "<span className="font-semibold">{query}</span>"
                        </p>
                        <p className="text-xs text-navy/40 mt-1">
                          Try "Software Engineer", "Quiz", or "eBooks"
                        </p>
                      </div>
                    ) : (
                      <>
                        {Object.keys(grouped).map((type) => (
                          <div key={type} className="py-2">
                            <p className="px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-navy/40">
                              {TYPE_LABELS[type]}
                            </p>
                            {grouped[type].map((item) => {
                              const Icon = item.icon
                              const globalIndex = results.indexOf(item)
                              const isActive = globalIndex === activeIndex
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => handleSelect(item)}
                                  onMouseEnter={() => setActiveIndex(globalIndex)}
                                  className={`w-full text-left px-5 py-2.5 flex items-center gap-3 transition-colors ${
                                    isActive ? 'bg-saffron/10' : 'hover:bg-navy/5'
                                  }`}
                                >
                                  <span
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                      isActive ? 'bg-saffron text-white' : 'bg-navy/5 text-navy/50'
                                    }`}
                                  >
                                    <Icon size={14} />
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-navy truncate">
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-navy/50 truncate">
                                      {item.subtitle}
                                    </p>
                                  </div>
                                  {isActive && (
                                    <CornerDownLeft size={14} className="text-saffron shrink-0" />
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Footer hints */}
                  <div className="px-5 py-3 border-t border-navy/5 flex items-center justify-between text-[10px] text-navy/40 font-medium">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <ArrowUp size={11} className="border border-navy/20 rounded p-0.5" />
                        <ArrowDown size={11} className="border border-navy/20 rounded p-0.5" />
                        navigate
                      </span>
                      <span className="flex items-center gap-1">
                        <CornerDownLeft size={11} className="border border-navy/20 rounded p-0.5" />
                        select
                      </span>
                    </div>
                    <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}