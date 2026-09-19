import ThemePicker from '../components/ThemePicker'
import EmptyState from '../components/EmptyState'
import PassportCard from '../components/PassportCard'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User, Mail, Phone, Calendar, Award, Bookmark, Eye,
  GraduationCap, LogOut, TrendingUp, Target, Sparkles,
  ArrowRight, Trash2, Brain
} from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart as PieIcon, BarChart3 } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useBookmarks } from '../context/BookmarkContext'
import careersData from '../data/careers.json'

const QUIZ_KEY = 'nsn-quiz-history'

export default function Profile() {
  const { user, logoutUser } = useUser()
  const { bookmarks, notes, recentlyViewed, clearBookmarks } = useBookmarks()
  const navigate = useNavigate()
  const [quizHistory, setQuizHistory] = useState([])

  // Load quiz history from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(QUIZ_KEY)
      setQuizHistory(raw ? JSON.parse(raw) : [])
    } catch {
      setQuizHistory([])
    }
  }, [])

  if (!user) return null

  const bookmarkedCareers = careersData.filter((c) => bookmarks.includes(c.id))
  const recentCareers = recentlyViewed
    .map((id) => careersData.find((c) => c.id === id))
    .filter(Boolean)

  // Aggregate skills being explored from bookmarked careers
  const skillCounts = {}
  bookmarkedCareers.forEach((c) => {
    c.skills.forEach((s) => {
      skillCounts[s] = (skillCounts[s] || 0) + 1
    })
  })
  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)

  // Industry breakdown from bookmarks
  const industryCounts = {}
  bookmarkedCareers.forEach((c) => {
    industryCounts[c.industry] = (industryCounts[c.industry] || 0) + 1
  })

    // Chart data
  const COLORS = ['#FF8A00', '#00C2A8', '#0B1E3F', '#33CEBB', '#FFA733', '#1A3560', '#CC6E00']
  const pieData = Object.entries(industryCounts).map(([name, value]) => ({ name, value }))
  const barData = bookmarkedCareers.map((c) => ({
  name: c.title.length > 14 ? c.title.slice(0, 13) + '…' : c.title,
  min: c.salaryMin / 1000,
  max: c.salaryMax / 1000,
})).slice(0, 6)

  const handleLogout = () => {
    if (confirm('Log out? Your bookmarks and notes stay saved on this device.')) {
      logoutUser()
      navigate('/')
    }
  }

  const joinedDate = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-PK', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : 'Today'

  // Progress: how much of the app has the user explored?
  const explorationScore = Math.min(
    100,
    bookmarks.length * 5 + recentlyViewed.length * 3 + quizHistory.length * 15
  )

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
            Your Profile
          </p>
          <h1 className="text-4xl font-heading font-bold text-navy">
            {user.name}
          </h1>
          <p className="text-navy/60 mt-1">{user.greeting} · Joined {joinedDate}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 font-semibold text-sm px-5 py-2.5 rounded-xl transition"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
            

      {/* Passport */}
      <div className="mb-10 gradient-border">
        <PassportCard />
      </div>

      {/* Theme Picker */}
      <div className="mb-10">
        <ThemePicker />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Bookmark, label: 'Bookmarks', value: bookmarks.length, color: 'text-saffron' },
          { icon: Eye, label: 'Viewed', value: recentlyViewed.length, color: 'text-teal' },
          { icon: Brain, label: 'Quizzes Taken', value: quizHistory.length, color: 'text-navy' },
          { icon: Award, label: 'Skills Explored', value: topSkills.length, color: 'text-saffron' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-navy/5 shadow-sm p-5"
            >
              <Icon size={20} className={stat.color} />
              <p className="text-3xl font-heading font-bold text-navy mt-3">
                {stat.value}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-navy/50 mt-1">
                {stat.label}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Exploration progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-6 text-white mb-10"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-saffron" />
            <span className="text-xs font-bold uppercase tracking-widest text-saffron">
              Exploration Progress
            </span>
          </div>
          <span className="font-heading font-bold text-2xl">{explorationScore}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-saffron to-teal"
            initial={{ width: 0 }}
            animate={{ width: `${explorationScore}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        <p className="text-xs text-white/60 mt-3">
          {explorationScore < 30 && 'Just getting started — try a few more careers and a quiz.'}
          {explorationScore >= 30 && explorationScore < 70 && 'Good pace! Keep exploring.'}
          {explorationScore >= 70 && 'Excellent — you\'re seriously exploring your options!'}
        </p>
      </motion.div>

      {/* Two-column: Info + Skills */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6 md:col-span-1"
        >
          <h2 className="font-heading font-bold text-lg text-navy mb-4">Account Info</h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <User size={16} className="text-saffron shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Name</p>
                <p className="text-navy font-medium">{user.name}</p>
              </div>
            </div>
            {user.email && (
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-saffron shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Email</p>
                  <p className="text-navy font-medium truncate">{user.email}</p>
                </div>
              </div>
            )}
            {user.contact && (
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-saffron shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Contact</p>
                  <p className="text-navy font-medium">{user.contact}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <GraduationCap size={16} className="text-saffron shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Category</p>
                <p className="text-navy font-medium capitalize">{user.userType}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-saffron shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Joined</p>
                <p className="text-navy font-medium">{joinedDate}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills being explored */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6 md:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-lg text-navy flex items-center gap-2">
              <Target size={18} className="text-teal" /> Skills You're Exploring
            </h2>
            <Link
              to="/career-bank"
              className="text-xs font-semibold text-saffron hover:underline flex items-center gap-1"
            >
              Explore More <ArrowRight size={12} />
            </Link>
          </div>

          {topSkills.length === 0 ? (
            <div className="text-center py-10">
              <Sparkles size={28} className="text-navy/20 mx-auto mb-3" />
              <p className="text-sm text-navy/50 mb-4">
                Bookmark careers to start building your skill map.
              </p>
              <Link
                to="/career-bank"
                className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
              >
                Browse Careers <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-5">
                {topSkills.map(([skill, count]) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 bg-teal/10 text-teal-dark text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    {skill}
                    <span className="bg-teal text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                      {count}
                    </span>
                  </span>
                ))}
              </div>

              {/* Industry breakdown */}
              {Object.keys(industryCounts).length > 0 && (
                <div className="pt-4 border-t border-navy/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-3">
                    Industries You're Interested In
                  </p>
                  <div className="space-y-2.5">
                    {Object.entries(industryCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([ind, count]) => {
                        const pct = (count / bookmarkedCareers.length) * 100
                        return (
                          <div key={ind}>
                            <div className="flex justify-between text-xs font-semibold text-navy mb-1">
                              <span>{ind}</span>
                              <span className="text-navy/50">{count}</span>
                            </div>
                            <div className="w-full h-1.5 bg-navy/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-saffron to-teal rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

              {/* Charts */}
      {bookmarkedCareers.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Industry Pie */}
          {pieData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6"
            >
              <h3 className="font-heading font-bold text-navy mb-4 flex items-center gap-2">
                <PieIcon size={18} className="text-saffron" /> Interest Distribution
              </h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      paddingAngle={3}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: 'none',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-navy/70 font-medium">{d.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Salary Bar */}
          {barData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6"
            >
              <h3 className="font-heading font-bold text-navy mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-teal" /> Salary Ranges ($K)
              </h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <XAxis type="number" tick={{ fontSize: 11 }} stroke="#0B1E3F" opacity={0.4} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      stroke="#0B1E3F"
                      opacity={0.6}
                      width={90}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: 'none',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        fontSize: 12,
                      }}
                      formatter={(val) => `$${val}K`}
                    />
                    <Bar dataKey="min" fill="#00C2A8" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="max" fill="#FF8A00" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-navy/50 mt-2 text-center">
                <span className="inline-block w-2 h-2 bg-teal rounded-full mr-1" /> Entry &nbsp;
                <span className="inline-block w-2 h-2 bg-saffron rounded-full mr-1 ml-3" /> Senior
              </p>
            </motion.div>
          )}
        </div>
      )}         

      {/* Quiz History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-2xl text-navy flex items-center gap-2">
            <Brain size={22} className="text-saffron" /> Learning History
          </h2>
          <Link
            to="/quiz"
            className="text-xs font-semibold text-saffron hover:underline flex items-center gap-1"
          >
            Take a Quiz <ArrowRight size={12} />
          </Link>
        </div>

        {quizHistory.length === 0 ? (
          <EmptyState
            illustration="quiz"
            title="No quizzes taken yet"
            description="Discover your strengths in 2 minutes. Answer 8 questions and get a personalized stream + career recommendations."
            actionLabel="Start First Quiz"
            actionTo="/quiz"
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {[...quizHistory].reverse().map((entry, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-navy/5 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-saffron">
                    {entry.quizLabel}
                  </span>
                  <span className="text-[10px] text-navy/40">
                    {new Date(entry.date).toLocaleDateString('en-PK')}
                  </span>
                </div>
                <p className="font-heading font-bold text-navy text-lg mb-1">
                  {entry.stream}
                </p>
                <p className="text-xs text-navy/60">
                  Top trait: <span className="capitalize font-semibold">{entry.topTrait}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Bookmarks with notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-2xl text-navy flex items-center gap-2">
            <Bookmark size={22} className="text-saffron" /> My Bookmarked Careers
          </h2>
          {bookmarkedCareers.length > 0 && (
            <Link
              to="/bookmarks"
              className="text-xs font-semibold text-saffron hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight size={12} />
            </Link>
          )}
        </div>

        {bookmarkedCareers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-navy/5 p-8 text-center">
            <p className="text-sm text-navy/50 mb-4">
              No bookmarks yet. Tap the heart on any career.
            </p>
            <Link
              to="/career-bank"
              className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
            >
              Explore Careers <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {bookmarkedCareers.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-navy/5 shadow-sm p-5 flex items-start gap-3"
              >
                <span className="text-3xl">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-saffron">
                    {c.industry}
                  </span>
                  <h4 className="font-heading font-bold text-navy truncate">{c.title}</h4>
                  {notes[c.id] && (
                    <p className="text-xs text-navy/60 mt-1 line-clamp-2 italic">
                      "{notes[c.id]}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Danger zone */}
      {bookmarkedCareers.length > 0 && (
        <div className="mt-12 pt-8 border-t border-navy/5">
          <button
            onClick={() => {
              if (confirm('Clear all bookmarks and notes? This cannot be undone.')) {
                clearBookmarks()
              }
            }}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium"
          >
            <Trash2 size={14} /> Clear all bookmarks & notes
          </button>
        </div>
      )}
    </section>
  )
}