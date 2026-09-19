import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bookmark, Heart, Scale, Brain, Eye, Clock, Trash2, ArrowRight,
} from 'lucide-react'
import { getActivity, clearActivity } from '../utils/activityTracker'
import careersData from '../data/careers.json'

const TYPE_CONFIG = {
  'bookmark-add': {
    icon: Heart,
    label: 'Bookmarked',
    color: 'text-saffron',
    bg: 'bg-saffron/10',
  },
  'bookmark-remove': {
    icon: Heart,
    label: 'Removed bookmark',
    color: 'text-navy/50',
    bg: 'bg-navy/5',
  },
  'compare-add': {
    icon: Scale,
    label: 'Added to compare',
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
  },
  quiz: {
    icon: Brain,
    label: 'Took a quiz',
    color: 'text-purple-600',
    bg: 'bg-purple-500/10',
  },
  view: {
    icon: Eye,
    label: 'Viewed',
    color: 'text-teal',
    bg: 'bg-teal/10',
  },
}

function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState([])

  const reload = () => setActivities(getActivity())

  useEffect(() => {
    reload()
    const handler = () => reload()
    window.addEventListener('nsn-activity-updated', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('nsn-activity-updated', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const handleClear = () => {
    if (confirm('Clear your activity history?')) {
      clearActivity()
      reload()
    }
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-teal" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-teal">
            Recent Activity
          </span>
        </div>
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-3">
            <Clock size={20} className="text-navy/30" />
          </div>
          <p className="text-sm text-navy/60 mb-1">No activity yet</p>
          <p className="text-xs text-navy/40">
            Your bookmarks, views, and quizzes will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-teal" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-teal">
            Recent Activity
          </span>
        </div>
        <button
          onClick={handleClear}
          className="text-[10px] font-semibold text-navy/40 hover:text-red-500 transition flex items-center gap-1"
        >
          <Trash2 size={10} /> Clear
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {activities.slice(0, 8).map((activity, i) => {
            const config = TYPE_CONFIG[activity.type] || TYPE_CONFIG.view
            const Icon = config.icon
            const career = activity.payload?.id
              ? careersData.find((c) => c.id === activity.payload.id)
              : null

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-navy/[0.03] transition group"
              >
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={14} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-navy/70">
                    <span className="font-semibold text-navy">{config.label}</span>
                    {career && (
                      <>
                        {' '}
                        <Link
                          to="/career-bank"
                          className="text-saffron hover:underline font-medium"
                        >
                          {career.title}
                        </Link>
                      </>
                    )}
                    {activity.type === 'quiz' && activity.payload?.quizLabel && (
                      <> · <span className="text-navy/60">{activity.payload.quizLabel}</span></>
                    )}
                  </p>
                  {activity.type === 'quiz' && activity.payload?.stream && (
                    <p className="text-[10px] text-navy/50 mt-0.5">
                      Recommended: {activity.payload.stream}
                    </p>
                  )}
                  <p className="text-[10px] text-navy/40 mt-0.5">
                    {timeAgo(activity.date)}
                  </p>
                </div>
                {career && (
                  <div className="text-xl shrink-0 opacity-60 group-hover:opacity-100 transition">
                    {career.icon}
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Footer link */}
      <Link
        to="/profile"
        className="mt-4 pt-4 border-t border-navy/5 flex items-center justify-between text-xs font-semibold text-saffron hover:underline"
      >
        View full history on Profile
        <ArrowRight size={12} />
      </Link>
    </div>
  )
}