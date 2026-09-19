import EmptyState from '../components/EmptyState'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Headphones, Clock, X } from 'lucide-react'
import mediaData from '../data/media.json'

const CATEGORIES = ['All', 'Motivation', 'Job Roles', 'Internships', 'Exam Prep', 'Industry Insights', 'Study Abroad']

export default function Multimedia() {
  const [category, setCategory] = useState('All')
  const [typeFilter, setTypeFilter] = useState('all') // all | video | podcast
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    let list = mediaData
    if (category !== 'All') list = list.filter((m) => m.category === category)
    if (typeFilter !== 'all') list = list.filter((m) => m.type === typeFilter)
    return list
  }, [category, typeFilter])

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
          Watch & Learn
        </p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-3">
          Multimedia Guidance
        </h1>
        <p className="text-navy/60 max-w-2xl mx-auto">
          Videos and podcasts from professionals — filter by category to find what
          speaks to you.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-navy/5 p-4 md:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                category === c
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-navy/70 border-navy/15 hover:border-navy/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Media', icon: null },
            { id: 'video', label: 'Videos', icon: Play },
            { id: 'podcast', label: 'Podcasts', icon: Headphones },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTypeFilter(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                typeFilter === id
                  ? 'bg-saffron text-white'
                  : 'bg-navy/5 text-navy/60 hover:bg-navy/10'
              }`}
            >
              {Icon && <Icon size={12} />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          illustration="filter"
          title="No media matches your filters"
          description="Try a different category or switch between videos and podcasts."
          actionLabel="Show All Media"
          onAction={() => {
            setCategory('All')
            setTypeFilter('all')
          }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((m, i) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                onClick={() => setSelected(m)}
                className="bg-white rounded-2xl border border-navy/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden group"
              >
                {/* Thumbnail area */}
                <div className="relative aspect-video bg-gradient-to-br from-navy to-navy-light flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${m.youtubeId}/hqdefault.jpg`}
                    alt={m.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  <div className="relative z-10 w-14 h-14 rounded-full bg-saffron flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    {m.type === 'podcast' ? (
                      <Headphones size={22} className="text-white" />
                    ) : (
                      <Play size={22} className="text-white ml-0.5" fill="white" />
                    )}
                  </div>
                  <span className="absolute top-3 left-3 bg-navy/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                    {m.type}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-white text-[10px] font-semibold px-2 py-1 rounded flex items-center gap-1">
                    <Clock size={10} /> {m.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-saffron">
                    {m.category}
                  </span>
                  <h3 className="font-heading font-bold text-navy mt-1 mb-1 line-clamp-2">
                    {m.title}
                  </h3>
                  <p className="text-xs text-navy/50 mb-3">by {m.speaker}</p>
                  <p className="text-sm text-navy/60 line-clamp-2">{m.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Player Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-saffron">
                      {selected.category}
                    </span>
                    <h2 className="font-heading font-bold text-xl md:text-2xl text-navy mt-1">
                      {selected.title}
                    </h2>
                    <p className="text-sm text-navy/60 mt-1">by {selected.speaker}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-9 h-9 rounded-full hover:bg-navy/5 flex items-center justify-center transition shrink-0"
                  >
                    <X size={20} className="text-navy/60" />
                  </button>
                </div>

                <div className="aspect-video rounded-2xl overflow-hidden bg-navy mb-5">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selected.youtubeId}?autoplay=1&rel=0`}
                    title={selected.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                <p className="text-navy/70 leading-relaxed">{selected.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}