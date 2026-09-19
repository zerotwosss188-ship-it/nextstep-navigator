import { useSpotlight } from '../hooks/useSpotlight'
import CareerTimeline from '../components/CareerTimeline'
import {
  Search, X, Heart, DollarSign, GraduationCap, Award,
  Briefcase, BookOpen, AlertCircle, AlertTriangle, RefreshCw
} from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import careersData from '../data/careers.json'
import { useBookmarks } from '../context/BookmarkContext'
import { useCompare } from '../context/CompareContext'
import EmptyState from '../components/EmptyState'
import { computeCareerMatch, getMatchTier } from '../utils/matchScore'

// Industry-specific gradient + accent colors
const INDUSTRY_STYLES = {
  Technology: {
    gradient: 'from-blue-500/10 to-cyan-500/10',
    accent: 'text-blue-600',
    bgAccent: 'bg-blue-500/10',
    bar: 'bg-blue-500',
    glow: 'shadow-blue-500/20',
    border: 'hover:border-blue-400/40',
  },
  Healthcare: {
    gradient: 'from-rose-500/10 to-pink-500/10',
    accent: 'text-rose-600',
    bgAccent: 'bg-rose-500/10',
    bar: 'bg-rose-500',
    glow: 'shadow-rose-500/20',
    border: 'hover:border-rose-400/40',
  },
  Business: {
    gradient: 'from-emerald-500/10 to-teal-500/10',
    accent: 'text-emerald-600',
    bgAccent: 'bg-emerald-500/10',
    bar: 'bg-emerald-500',
    glow: 'shadow-emerald-500/20',
    border: 'hover:border-emerald-400/40',
  },
  Creative: {
    gradient: 'from-purple-500/10 to-fuchsia-500/10',
    accent: 'text-purple-600',
    bgAccent: 'bg-purple-500/10',
    bar: 'bg-purple-500',
    glow: 'shadow-purple-500/20',
    border: 'hover:border-purple-400/40',
  },
  Engineering: {
    gradient: 'from-amber-500/10 to-orange-500/10',
    accent: 'text-amber-600',
    bgAccent: 'bg-amber-500/10',
    bar: 'bg-amber-500',
    glow: 'shadow-amber-500/20',
    border: 'hover:border-amber-400/40',
  },
  Education: {
    gradient: 'from-indigo-500/10 to-violet-500/10',
    accent: 'text-indigo-600',
    bgAccent: 'bg-indigo-500/10',
    bar: 'bg-indigo-500',
    glow: 'shadow-indigo-500/20',
    border: 'hover:border-indigo-400/40',
  },
  Government: {
    gradient: 'from-slate-500/10 to-gray-500/10',
    accent: 'text-slate-600',
    bgAccent: 'bg-slate-500/10',
    bar: 'bg-slate-500',
    glow: 'shadow-slate-500/20',
    border: 'hover:border-slate-400/40',
  },
}

const DEFAULT_STYLE = {
  gradient: 'from-saffron/10 to-teal/10',
  accent: 'text-saffron',
  bgAccent: 'bg-saffron/10',
  bar: 'bg-saffron',
  glow: 'shadow-saffron/20',
  border: 'hover:border-saffron/40',
}

const INDUSTRIES = ['All', 'Technology', 'Healthcare', 'Business', 'Creative', 'Engineering', 'Education', 'Government']

export default function CareerBank() {
  const [industry, setIndustry] = useState('All')
  const [sortBy, setSortBy] = useState('alpha-asc')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [userTraits, setUserTraits] = useState({})
  const [modalTab, setModalTab] = useState('overview')     // ⬅️ MOVED HERE

  const spotlight = useSpotlight()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nsn-user-traits')
      setUserTraits(raw ? JSON.parse(raw) : {})
    } catch {
      setUserTraits({})
    }
  }, [])

  // Reset modal tab when opening a new career
  useEffect(() => {
    if (selected) setModalTab('overview')
  }, [selected])

  const hasTraits = Object.keys(userTraits).length > 0
  const { isComparing, toggleCompare } = useCompare()
  const { isBookmarked, toggleBookmark, addRecent } = useBookmarks()

  const filtered = useMemo(() => {
    let list = careersData
    if (industry !== 'All') list = list.filter((c) => c.industry === industry)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      )
    }
    const sorted = [...list]
    switch (sortBy) {
      case 'alpha-asc': sorted.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'alpha-desc': sorted.sort((a, b) => b.title.localeCompare(a.title)); break
      case 'salary-high': sorted.sort((a, b) => b.salaryMax - a.salaryMax); break
      case 'salary-low': sorted.sort((a, b) => a.salaryMin - b.salaryMin); break
      case 'match-high': {
        sorted.sort((a, b) => {
          const ma = computeCareerMatch(a.id, userTraits)?.score || 0
          const mb = computeCareerMatch(b.id, userTraits)?.score || 0
          return mb - ma
        })
        break
      }
    }
    return sorted
  }, [industry, sortBy, query, userTraits])

  const openCareer = (career) => {
    setSelected(career)
    addRecent(career.id)
  }

  const formatSalary = (n) => {
    if (n === 0) return 'Variable'
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
    return `$${n}`
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">Explore</p>
        <h1 className="text-4xl font-heading font-bold text-navy mb-2">Career Bank</h1>
        <p className="text-navy/60">
          Browse {careersData.length} careers across {INDUSTRIES.length - 1} industries.
          {hasTraits && <span className="text-saffron font-medium ml-1">Match scores active ✓</span>}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-navy/5 p-4 md:p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="relative md:col-span-2">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search careers, skills..."
              className="w-full border border-navy/15 rounded-xl pl-10 pr-4 py-2.5 text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-navy/15 rounded-xl px-4 py-2.5 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition bg-white"
          >
            {hasTraits && <option value="match-high">Match: Best First</option>}
            <option value="alpha-asc">A → Z</option>
            <option value="alpha-desc">Z → A</option>
            <option value="salary-high">Salary: High → Low</option>
            <option value="salary-low">Salary: Low → High</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustry(ind)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                industry === ind
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-navy/70 border-navy/15 hover:border-navy/40'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-navy/50 mb-4">
        Showing <span className="font-semibold text-navy">{filtered.length}</span> career
        {filtered.length !== 1 ? 's' : ''}
        {industry !== 'All' && ` in ${industry}`}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          illustration="filter"
          title="No careers match your filters"
          description={`We couldn't find any ${industry !== 'All' ? industry + ' ' : ''}careers matching "${query}". Try a different search or clear your filters.`}
          actionLabel="Clear Filters"
          onAction={() => {
            setQuery('')
            setIndustry('All')
            setSortBy('alpha-asc')
          }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((career, i) => {
              const bookmarked = isBookmarked(career.id)
              const style = INDUSTRY_STYLES[career.industry] || DEFAULT_STYLE
              return (
                <motion.div
                  key={career.id}
                  ref={spotlight.ref}
                  onMouseMove={spotlight.onMouseMove}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                  onClick={() => openCareer(career)}
                  className={`spotlight-card relative bg-white rounded-2xl border border-navy/5 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group overflow-hidden ${style.border}`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 ${style.bar} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative p-6">
                    <div className="absolute top-4 right-4 flex gap-1 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleCompare(career.id) }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all text-[10px] font-bold border-2 ${
                          isComparing(career.id)
                            ? 'bg-navy text-white border-navy'
                            : 'bg-white/90 backdrop-blur border-navy/10 text-navy/50 opacity-0 group-hover:opacity-100 hover:border-navy/40'
                        }`}
                        aria-label="Compare"
                      >
                        ⚖
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(career.id) }}
                        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all hover:bg-white hover:scale-110"
                        aria-label="Bookmark"
                      >
                        <Heart
                          size={18}
                          className={bookmarked ? 'fill-saffron text-saffron' : 'text-navy/30 group-hover:text-navy/60'}
                        />
                      </button>
                    </div>

                    <div className="relative mb-4 inline-block">
                      <div className={`absolute inset-0 ${style.bar} opacity-20 blur-xl rounded-full scale-150 group-hover:scale-[2] group-hover:opacity-40 transition-all duration-500`} />
                      <div className="relative text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 origin-bottom-left">
                        {career.icon}
                      </div>
                    </div>

                    {/* Industry + Match */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${style.bar}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${style.accent}`}>
                          {career.industry}
                        </span>
                      </div>
                      {(() => {
                        const match = computeCareerMatch(career.id, userTraits)
                        if (!match) return null
                        const tier = getMatchTier(match.score)
                        return (
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tier.bg} ${tier.color}`}>
                            {match.score}% Match
                          </span>
                        )
                      })()}
                    </div>

                    <h3 className="font-heading font-bold text-xl text-navy mb-2 group-hover:translate-x-0.5 transition-transform">
                      {career.title}
                    </h3>

                    <p className="text-sm text-navy/60 line-clamp-2 mb-4">
                      {career.description}
                    </p>

                    {career.skills && career.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {career.skills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className={`text-[10px] font-medium px-2 py-1 rounded-full ${style.bgAccent} ${style.accent}`}
                          >
                            {skill}
                          </span>
                        ))}
                        {career.skills.length > 2 && (
                          <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-navy/5 text-navy/50">
                            +{career.skills.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-navy/5">
                      <span className="text-navy/50 flex items-center gap-1">
                        <DollarSign size={12} />
                        {formatSalary(career.salaryMin).replace('$', '')} – {formatSalary(career.salaryMax)}
                      </span>
                      <span className={`${style.accent} font-semibold flex items-center gap-1 group-hover:gap-2 transition-all`}>
                        Details →
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
            data-modal-open="true"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{selected.icon}</div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-saffron">{selected.industry}</span>
                      <h2 className="font-heading font-bold text-2xl text-navy">{selected.title}</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-9 h-9 rounded-full hover:bg-navy/5 flex items-center justify-center transition shrink-0"
                  >
                    <X size={20} className="text-navy/60" />
                  </button>
                </div>

                <p className="text-navy/70 mb-6 leading-relaxed">{selected.description}</p>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-navy/10 mb-6 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'roadmap', label: 'Roadmap' },
                    { id: 'reality', label: 'Reality Check' },
                    { id: 'resources', label: 'Resources' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setModalTab(tab.id)}
                      className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                        modalTab === tab.id
                          ? 'border-saffron text-saffron'
                          : 'border-transparent text-navy/50 hover:text-navy'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* ============ OVERVIEW TAB ============ */}
                {modalTab === 'overview' && (
                  <>
                    {/* Match explanation */}
                    {(() => {
                      const match = computeCareerMatch(selected.id, userTraits)
                      if (!match) return null
                      const tier = getMatchTier(match.score)
                      return (
                        <div className={`mb-6 rounded-2xl p-4 border ${tier.bg.replace('/10', '/30')}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${tier.color}`}>
                              {tier.label} Match
                            </span>
                            <span className={`font-heading font-bold text-2xl ${tier.color}`}>
                              {match.score}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden mb-3">
                            <div className={`h-full ${tier.bar}`} style={{ width: `${match.score}%` }} />
                          </div>
                          <p className="text-xs text-navy/70">
                            Matches your strengths in <span className="font-semibold capitalize">{match.traits.slice(0, 3).join(', ')}</span>
                          </p>
                        </div>
                      )
                    })()}

                    {/* What You'll Actually Do */}
                    {selected.whatYouDo && (
                      <div className="mb-6">
                        <h4 className="font-heading font-bold text-navy mb-3 flex items-center gap-2">
                          <Briefcase size={16} className="text-teal" /> What You'll Actually Do
                        </h4>
                        <ul className="space-y-1.5">
                          {selected.whatYouDo.map((item, i) => (
                            <li key={i} className="text-sm text-navy/70 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Skills + Education */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="flex items-center gap-2 font-heading font-bold text-navy mb-3">
                          <Award size={16} className="text-teal" /> Required Skills
                        </h4>
                        <ul className="space-y-1.5">
                          {selected.skills.map((s) => (
                            <li key={s} className="text-sm text-navy/70 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="flex items-center gap-2 font-heading font-bold text-navy mb-3">
                          <GraduationCap size={16} className="text-saffron" /> Educational Path
                        </h4>
                        <p className="text-sm text-navy/70 leading-relaxed">{selected.educationPath}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* ============ ROADMAP TAB ============ */}
                {modalTab === 'roadmap' && (
                  <>
                    {selected.roadmap ? (
                      <CareerTimeline roadmap={selected.roadmap} />
                    ) : (
                      <p className="text-sm text-navy/50 text-center py-8">
                        Detailed roadmap coming soon for this career.
                      </p>
                    )}

                    {selected.careerChangerPath && (
                      <div className="mt-6 bg-teal/5 border-l-4 border-teal rounded-r-xl p-4">
                        <h4 className="font-heading font-bold text-navy mb-2 flex items-center gap-2 text-sm">
                          <RefreshCw size={14} className="text-teal" /> Career Changer Path
                        </h4>
                        <p className="text-sm text-navy/70 leading-relaxed">{selected.careerChangerPath}</p>
                      </div>
                    )}
                  </>
                )}

                {/* ============ REALITY TAB ============ */}
                {modalTab === 'reality' && (
                  <>
                    {selected.reality ? (
                      <div className="mb-6">
                        <h4 className="font-heading font-bold text-navy mb-3 flex items-center gap-2">
                          <AlertCircle size={16} className="text-saffron" /> Reality Check
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Work-Life', value: selected.reality.workLife },
                            { label: 'Stress Level', value: selected.reality.stress },
                            { label: 'Remote Friendly', value: selected.reality.remote },
                            { label: 'Future Outlook', value: selected.reality.future },
                          ].map((item) => (
                            <div key={item.label} className="bg-navy/5 rounded-xl p-3">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1">
                                {item.label}
                              </p>
                              <p className="text-xs text-navy/80 leading-snug">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-navy/50 text-center py-4 mb-6">
                        Reality check coming soon.
                      </p>
                    )}

                    {selected.costAndTime && (
                      <div className="mb-6">
                        <h4 className="font-heading font-bold text-navy mb-3 flex items-center gap-2">
                          <DollarSign size={16} className="text-teal" /> Cost & Time Investment
                        </h4>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className="bg-saffron/5 rounded-xl p-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-saffron mb-1">Time</p>
                            <p className="text-xs text-navy/80 leading-snug">{selected.costAndTime.time}</p>
                          </div>
                          <div className="bg-saffron/5 rounded-xl p-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-saffron mb-1">Money</p>
                            <p className="text-xs text-navy/80 leading-snug">{selected.costAndTime.money}</p>
                          </div>
                          <div className="bg-saffron/5 rounded-xl p-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-saffron mb-1">Hidden</p>
                            <p className="text-xs text-navy/80 leading-snug">{selected.costAndTime.hidden}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selected.commonMistakes && (
                      <div>
                        <h4 className="font-heading font-bold text-navy mb-3 flex items-center gap-2">
                          <AlertTriangle size={16} className="text-red-400" /> Common Mistakes to Avoid
                        </h4>
                        <ul className="space-y-1.5">
                          {selected.commonMistakes.map((m, i) => (
                            <li key={i} className="text-sm text-navy/70 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {/* ============ RESOURCES TAB ============ */}
                {modalTab === 'resources' && (
                  <>
                    {selected.freeResources ? (
                      <div>
                        <h4 className="font-heading font-bold text-navy mb-3 flex items-center gap-2">
                          <BookOpen size={16} className="text-teal" /> Free Learning Resources
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selected.freeResources.map((r, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 bg-teal/10 text-teal-dark text-xs font-semibold px-3 py-1.5 rounded-full"
                            >
                              {r.name}
                              <span className="text-[10px] opacity-60">· {r.type}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-navy/50 text-center py-8">
                        Free resources coming soon for this career.
                      </p>
                    )}
                  </>
                )}

                {/* Salary + Bookmark — always visible */}
                <div className="mt-6 bg-navy/5 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-navy/50 font-bold mb-1">Salary Range</p>
                    <p className="font-heading font-bold text-xl text-navy">
                      ${selected.salaryMin.toLocaleString('en-US')} – ${selected.salaryMax.toLocaleString('en-US')}
                    </p>
                    <p className="text-xs text-navy/50 mt-1">per annum (US, entry to senior)</p>
                  </div>
                  <button
                    onClick={() => toggleBookmark(selected.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                      isBookmarked(selected.id)
                        ? 'bg-saffron text-white'
                        : 'bg-white border border-navy/15 text-navy hover:border-saffron'
                    }`}
                  >
                    <Heart size={14} className={isBookmarked(selected.id) ? 'fill-white' : ''} />
                    {isBookmarked(selected.id) ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>

                {/* Related Careers — always visible */}
                {(() => {
                  const related = careersData
                    .filter((c) => c.industry === selected.industry && c.id !== selected.id)
                    .slice(0, 3)
                  if (related.length === 0) return null
                  return (
                    <div className="mt-6 pt-6 border-t border-navy/5">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-navy/50 mb-3">
                        Related Careers in {selected.industry}
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {related.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => setSelected(r)}
                            className="text-left bg-navy/5 hover:bg-saffron/10 rounded-xl p-3 transition-all"
                          >
                            <div className="text-2xl mb-1">{r.icon}</div>
                            <p className="text-xs font-heading font-semibold text-navy line-clamp-2">
                              {r.title}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}