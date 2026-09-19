import EmptyState from '../components/EmptyState'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Briefcase, Calendar } from 'lucide-react'
import storiesData from '../data/stories.json'

const DOMAINS = ['All', 'Engineering', 'Medicine', 'Technology', 'Business', 'Arts', 'Creative', 'Healthcare', 'Government']

export default function SuccessStories() {
  const [domain, setDomain] = useState('All')

  const filtered = useMemo(() => {
    if (domain === 'All') return storiesData
    return storiesData.filter((s) => s.domain === domain)
  }, [domain])

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
          Inspiration
        </p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-3">
          Success Stories
        </h1>
        <p className="text-navy/60 max-w-2xl mx-auto">
          Real journeys from real people — showing that every path has its ups, downs,
          and breakthroughs.
        </p>
      </div>

      {/* Domain filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {DOMAINS.map((d) => (
          <button
            key={d}
            onClick={() => setDomain(d)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              domain === d
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-navy/70 border-navy/15 hover:border-navy/40'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          illustration="story"
          title="No stories in this domain yet"
          description="We're constantly adding new success stories. Try a different domain to explore other journeys."
          actionLabel="Show All Stories"
          onAction={() => setDomain('All')}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((story, i) => (
              <motion.article
                key={story.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
                className="bg-white rounded-2xl border border-navy/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group flex flex-col"
              >
                {/* Top: photo + identity */}
                <div className="relative p-6 pb-0">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={story.photo}
                        alt={story.name}
                        loading="lazy"
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-saffron/20"
                      />
                      <span className="absolute -bottom-1 -right-1 text-[9px] font-bold uppercase tracking-widest bg-saffron text-white px-2 py-0.5 rounded-full">
                        {story.domain}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-navy truncate">
                        {story.name}
                      </h3>
                      <p className="text-xs text-navy/60 flex items-center gap-1 mt-0.5">
                        <Briefcase size={11} />
                        <span className="truncate">{story.role}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Journey */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-navy/70 leading-relaxed mb-4 flex-1">
                    {story.journey}
                  </p>

                  <div className="border-t border-navy/5 pt-4">
                    <div className="flex items-start gap-2">
                      <Quote size={14} className="text-saffron shrink-0 mt-0.5" />
                      <p className="text-sm italic text-navy font-medium">
                        "{story.quote}"
                      </p>
                    </div>
                    <p className="text-[11px] text-navy/40 mt-3 flex items-center gap-1">
                      <Calendar size={10} /> {story.yearsInField} years in field
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}