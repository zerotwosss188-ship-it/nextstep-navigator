import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'
import { getPassportStats } from '../utils/passportEngine'
import { useBookmarks } from '../context/BookmarkContext'
import { useUser } from '../context/UserContext'

export default function PassportCard() {
  const { user } = useUser()
  const { bookmarks, recentlyViewed } = useBookmarks()
  const { badges, total, unlocked } = getPassportStats(bookmarks, recentlyViewed)
  const pct = Math.round((unlocked / total) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="passport-card bg-gradient-to-br from-navy to-navy-light rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden"
    >
      {/* Decorative corner */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-saffron/20 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-saffron" />
              <span className="text-xs font-bold uppercase tracking-widest text-saffron">
                Career Passport
              </span>
            </div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-1">
              {user?.name || 'Explorer'}
            </h2>
            <p className="text-white/60 text-sm">{user?.greeting || ''}</p>
          </div>
          <div className="text-right">
            <p className="font-heading font-bold text-3xl text-saffron">{unlocked}<span className="text-white/40 text-xl">/{total}</span></p>
            <p className="text-xs uppercase tracking-widest text-white/50 mt-1">Stamps Collected</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-saffron to-teal"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <p className="text-xs text-white/60 mt-2">
            {pct}% complete — {pct < 50 ? 'keep exploring' : pct < 100 ? 'almost there' : 'passport full!'}
          </p>
        </div>

        {/* Badges grid */}
        <div className="grid grid-cols-4 gap-3">
          {badges.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="relative group"
              title={b.unlocked ? b.description : `Locked: ${b.description}`}
            >
              <div
                className={`aspect-square rounded-2xl flex items-center justify-center text-3xl relative transition-all ${
                  b.unlocked
                    ? `bg-gradient-to-br ${b.color} shadow-lg group-hover:scale-105`
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {b.unlocked ? (
                  <span>{b.icon}</span>
                ) : (
                  <Lock size={20} className="text-white/30" />
                )}
              </div>
              <p
                className={`text-[9px] font-bold uppercase tracking-wider text-center mt-1.5 ${
                  b.unlocked ? 'text-white' : 'text-white/30'
                }`}
              >
                {b.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}