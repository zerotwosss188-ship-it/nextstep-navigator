import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ExternalLink, Clock, Star, Users, BookOpen,
  CheckCircle2, Play, Award, Filter
} from 'lucide-react'
import coursesData from '../data/courses.json'
import EmptyState from '../components/EmptyState'
import { toast } from '../context/ToastContext'

const PROGRESS_KEY = 'nsn-course-progress'

export default function Courses() {
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')
  const [query, setQuery] = useState('')
  const [progress, setProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  }, [progress])

  const filtered = useMemo(() => {
    let list = coursesData.courses
    if (category !== 'All') list = list.filter((c) => c.category === category)
    if (level !== 'All') list = list.filter((c) => c.level === level)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.provider.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      )
    }
    return list
  }, [category, level, query])

  const toggleProgress = (courseId, e) => {
    e.stopPropagation()
    setProgress((prev) => {
      const next = { ...prev }
      if (next[courseId]) {
        delete next[courseId]
        toast('Removed from learning', 'info')
      } else {
        next[courseId] = new Date().toISOString()
        toast('Marked as learning ✓', 'success')
      }
      return next
    })
  }

  const learningCount = Object.keys(progress).length

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
          Learn
        </p>
        <h1 className="text-4xl font-heading font-bold text-navy mb-2">
          Courses to Level Up
        </h1>
        <p className="text-navy/60">
          {coursesData.courses.length} free & low-cost courses from Harvard, Google, Kaggle, YC, and more.
          {learningCount > 0 && (
            <span className="text-saffron font-medium ml-1">
              · You're learning {learningCount} course{learningCount !== 1 ? 's' : ''} ✓
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy/5 p-4 md:p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="relative md:col-span-2">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, skills, providers..."
              className="w-full border border-navy/15 rounded-xl pl-10 pr-4 py-2.5 text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition"
            />
          </div>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border border-navy/15 rounded-xl px-4 py-2.5 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition bg-white"
          >
            {coursesData.levels.map((l) => (
              <option key={l} value={l}>
                {l === 'All' ? 'All Levels' : l}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {coursesData.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                category === cat
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-navy/70 border-navy/15 hover:border-navy/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-navy/50 mb-4">
        Showing <span className="font-semibold text-navy">{filtered.length}</span> course
        {filtered.length !== 1 ? 's' : ''}
        {category !== 'All' && ` in ${category}`}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          illustration="search"
          title="No courses match your filters"
          description={`We couldn't find any courses matching "${query}". Try a different search or clear your filters.`}
          actionLabel="Clear Filters"
          onAction={() => {
            setQuery('')
            setCategory('All')
            setLevel('All')
          }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((course, i) => {
              const isLearning = !!progress[course.id]
              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                  className={`relative bg-white rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden ${
                    isLearning ? 'border-saffron/40' : 'border-navy/5'
                  }`}
                >
                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    isLearning ? 'bg-saffron' : 'bg-navy/20'
                  } opacity-60 group-hover:opacity-100 transition-opacity`} />

                  <div className="p-6">
                    {/* Top-right: Progress toggle */}
                    <button
                      onClick={(e) => toggleProgress(course.id, e)}
                      className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isLearning
                          ? 'bg-saffron text-white'
                          : 'bg-navy/5 hover:bg-navy/10 text-navy/50 hover:text-saffron'
                      }`}
                      title={isLearning ? 'Remove from learning' : 'Mark as learning'}
                      aria-label={isLearning ? 'Remove from learning' : 'Mark as learning'}
                    >
                      {isLearning ? <CheckCircle2 size={18} /> : <Play size={16} />}
                    </button>

                    {/* Icon */}
                    <div className="text-4xl mb-3">{course.icon}</div>

                    {/* Provider + Category */}
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-saffron">{course.provider}</span>
                      <span className="w-1 h-1 rounded-full bg-navy/30" />
                      <span className="text-navy/50">{course.category}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-bold text-lg text-navy mb-2 leading-snug line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-navy/60 line-clamp-2 mb-4">
                      {course.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {course.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-medium px-2 py-1 rounded-full bg-teal/10 text-teal-dark"
                        >
                          {skill}
                        </span>
                      ))}
                      {course.skills.length > 3 && (
                        <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-navy/5 text-navy/50">
                          +{course.skills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 text-[11px] text-navy/50 mb-4 pb-4 border-b border-navy/5">
                      <span className="flex items-center gap-1">
                        <Star size={11} className="fill-saffron text-saffron" />
                        <span className="font-semibold text-navy">{course.rating}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {(course.students / 1000000).toFixed(1)}M
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {course.duration}
                      </span>
                    </div>

                    {/* Footer: level + link */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                        course.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600' :
                        course.level === 'Intermediate' ? 'bg-saffron/10 text-saffron' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {course.level}
                      </span>
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-saffron hover:underline flex items-center gap-1"
                      >
                        {course.price === 'Free' ? 'Start Free' : 'View'}
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Learning Summary */}
      {learningCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-r from-navy to-navy-light rounded-3xl p-8 text-white shadow-xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <Award size={22} className="text-saffron" />
            <span className="text-xs font-bold uppercase tracking-widest text-saffron">
              Your Learning Journey
            </span>
          </div>
          <p className="text-2xl font-heading font-semibold mb-2">
            You're enrolled in {learningCount} course{learningCount !== 1 ? 's' : ''}
          </p>
          <p className="text-white/70 text-sm">
            Track your progress by clicking the play button on any course. Keep going!
          </p>
        </motion.div>
      )}
    </section>
  )
}