import EmptyState from '../components/EmptyState'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, BookOpen, CheckSquare, Video, ExternalLink, Clock } from 'lucide-react'
import resourcesData from '../data/resources.json'

const TYPES = [
  { id: 'All', label: 'All', icon: null },
  { id: 'Articles', label: 'Articles', icon: FileText },
  { id: 'eBooks', label: 'eBooks', icon: BookOpen },
  { id: 'Checklists', label: 'Checklists', icon: CheckSquare },
  { id: 'Webinars', label: 'Webinars', icon: Video },
]

export default function ResourceLibrary() {
  const [type, setType] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    let list = resourcesData.resources
    if (type !== 'All') list = list.filter((r) => r.type === type)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [type, query])

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
          Learn More
        </p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-3">
          Resource Library
        </h1>
        <p className="text-navy/60 max-w-2xl mx-auto">
          Curated guides, eBooks, checklists, and webinar recordings to fuel your journey.
        </p>
      </div>

      {/* Type tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {TYPES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setType(id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 border ${
              type === id
                ? 'bg-navy text-white border-navy shadow-lg'
                : 'bg-white text-navy/70 border-navy/15 hover:border-navy/40'
            }`}
          >
            {Icon && <Icon size={14} />}
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search resources..."
          className="w-full border border-navy/15 rounded-xl px-5 py-3 text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition bg-white"
        />
      </div>

      {/* Results count */}
      <p className="text-sm text-navy/50 mb-4 text-center">
        <span className="font-semibold text-navy">{filtered.length}</span> resource
        {filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          illustration="search"
          title="No resources found"
          description={`We couldn't find any resources matching "${query}". Try different keywords or browse a different category.`}
          actionLabel="Reset Search"
          onAction={() => {
            setQuery('')
            setType('All')
          }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((r, i) => (
              <motion.a
                key={r.id}
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                className="group bg-white rounded-2xl border border-navy/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{r.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-saffron bg-saffron/10 px-2 py-1 rounded">
                    {r.type}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-navy leading-snug mb-2 group-hover:text-saffron transition">
                  {r.title}
                </h3>
                <p className="text-sm text-navy/60 mb-4 flex-1 line-clamp-3">
                  {r.description}
                </p>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-navy/5">
                  <span className="text-navy/50 flex items-center gap-1">
                    <Clock size={11} /> {r.readTime}
                  </span>
                  <span className="text-saffron font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Open <ExternalLink size={11} />
                  </span>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}