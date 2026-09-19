import EmptyState from '../components/EmptyState'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, Download, Share2, Trash2, Heart, ArrowRight, FileText } from 'lucide-react'
import careersData from '../data/careers.json'
import { useBookmarks } from '../context/BookmarkContext'
import { toast } from '../context/ToastContext'

export default function Bookmarks() {
  const {
    bookmarks,
    notes,
    recentlyViewed,
    setNote,
    removeBookmark,
    clearBookmarks,
    exportBookmarks,
    shareBookmarks,
  } = useBookmarks()

  const bookmarkedCareers = careersData.filter((c) => bookmarks.includes(c.id))
  const recentCareers = recentlyViewed
    .map((id) => careersData.find((c) => c.id === id))
    .filter(Boolean)

  const formatSalary = (n) => {
  if (n === 0) return 'Variable'
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">Your Passport</p>
          <h1 className="text-4xl font-heading font-bold text-navy mb-2">My Bookmarks</h1>
          <p className="text-navy/60">
            {bookmarkedCareers.length === 0
              ? 'You haven\'t bookmarked any careers yet.'
              : `You've saved ${bookmarkedCareers.length} career${bookmarkedCareers.length !== 1 ? 's' : ''}.`}
          </p>
        </div>

        {bookmarkedCareers.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => exportBookmarks(careersData)}
              className="flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
            >
              <Download size={16} /> Export .txt
            </button>
            <button
              onClick={() => shareBookmarks(careersData)}
              className="flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
            >
              <Share2 size={16} /> Share
            </button>
            <button
              onClick={() => {
                if (confirm('Remove all bookmarks and notes? This cannot be undone.')) {
                  clearBookmarks()
                }
              }}
              className="flex items-center gap-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold px-4 py-2.5 rounded-xl transition"
            >
              <Trash2 size={16} /> Clear
            </button>
          </div>
        )}
      </div>

      {/* EMPTY STATE */}
        {bookmarkedCareers.length === 0 ? (
        <EmptyState
          illustration="bookmark"
          title="No bookmarks yet"
          description="Tap the heart icon on any career card to save it here. You can also add personal notes to remember why it caught your eye."
          actionLabel="Explore Careers"
          actionTo="/career-bank"
          secondaryLabel="Take a Quiz"
          secondaryTo="/quiz"
        />
      ) : (
        <div className="space-y-4">
          {bookmarkedCareers.map((career, i) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6"
            >
              <div className="flex items-start gap-4 flex-wrap">
                <div className="text-4xl shrink-0">{career.icon}</div>
                <div className="flex-1 min-w-[240px]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-saffron">
                    {career.industry}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-navy">{career.title}</h3>
                  <p className="text-sm text-navy/60 mt-1 line-clamp-2">{career.description}</p>
                  <p className="text-xs text-navy/50 mt-2">
                    {formatSalary(career.salaryMin)} – {formatSalary(career.salaryMax)} p.a.
                  </p>
                </div>
                <button
                    onClick={() => removeBookmark(career.id)}
                    className="w-9 h-9 rounded-full bg-saffron flex items-center justify-center shrink-0 hover:scale-105 transition"
                    title="Remove bookmark"
                    aria-label={`Remove bookmark for ${career.title}`}
                  >
                  <Heart size={16} className="fill-white text-white" />
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-navy/5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-navy/50 mb-2">
                  <FileText size={12} /> My Notes
                </label>
                <textarea
                  value={notes[career.id] || ''}
                  onChange={(e) => setNote(career.id, e.target.value)}
                  onBlur={() => toast('Note saved', 'success')}
                  placeholder="Why does this career interest you? Add next steps, contacts, links..."
                  rows={2}
                  className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition resize-none"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* RECENTLY VIEWED */}
      {recentCareers.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-heading font-bold text-2xl text-navy">Recently Viewed</h2>
            <span className="text-xs font-semibold text-navy/40 bg-navy/5 px-2 py-0.5 rounded-full">
              {recentCareers.length}
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6" data-no-swipe>
            {recentCareers.map((c) => (
              <Link
                key={c.id}
                to="/career-bank"
                className="shrink-0 w-56 bg-white border border-navy/5 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="text-3xl mb-2">{c.icon}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-saffron">
                  {c.industry}
                </span>
                <h4 className="font-heading font-semibold text-navy text-sm mt-0.5">{c.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}