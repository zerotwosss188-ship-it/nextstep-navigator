import { saveUser } from '../lib/saveUser'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, BookOpen, Sparkles, Compass, ArrowRight } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { toast } from '../context/ToastContext'
import ActivityFeed from '../components/ActivityFeed'
import careersData from '../data/careers.json'

const USER_TYPES = [
  {
    id: 'student',
    label: 'Student (Grade 8–12)',
    icon: BookOpen,
    greeting: 'Future Achiever',
    color: 'from-teal to-teal-dark',
  },
  {
    id: 'graduate',
    label: 'Graduate (UG / PG)',
    icon: GraduationCap,
    greeting: 'Future Professional',
    color: 'from-saffron to-saffron-dark',
  },
  {
    id: 'professional',
    label: 'Working Professional',
    icon: Briefcase,
    greeting: 'Career Changer',
    color: 'from-navy-light to-navy',
  },
]

export default function Home() {
  const { user, loginUser, logoutUser } = useUser()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    userType: '',
  })
  const [error, setError] = useState('')
  const heroRef = useRef(null)
  const glowRef = useRef(null)

  // Cursor-following glow
  useEffect(() => {
    const hero = heroRef.current
    const glow = glowRef.current
    if (!hero || !glow) return

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      glow.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,138,0,0.15), rgba(0,194,168,0.08), transparent 40%)`
    }

    hero.addEventListener('mousemove', handleMouseMove)
    return () => hero.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Fire welcome toast ONLY when user transitions from null → object (login)
  const prevUserRef = useRef(null)
  useEffect(() => {
    if (user && !prevUserRef.current) {
      toast(`Welcome, ${user.name.split(' ')[0]}!`, 'success')
    }
    prevUserRef.current = user
  }, [user])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

    const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Please enter your name.')
    if (!form.userType) return setError('Please select a user category.')

    const matched = USER_TYPES.find((t) => t.id === form.userType)
    const userData = {
      ...form,
      greeting: matched?.greeting || 'Explorer',
      joinedAt: new Date().toISOString(),
    }

    // Save to Supabase (non-blocking — user still logs in if this fails)
    saveUser(userData)

    // Login locally
    loginUser(userData)
  }

  const handleReset = () => {
    logoutUser()
    setForm({ name: '', email: '', contact: '', userType: '' })
  }

  // ============================================================
  // DASHBOARD VIEW (after login)
  // ============================================================
  if (user) {
    return (
      <section className="px-6 py-12 max-w-7xl mx-auto">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-navy-light p-8 md:p-10 mb-8 text-white shadow-xl"
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-saffron/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-teal/20 rounded-full blur-3xl" />

          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
                Your Dashboard
              </p>
              <h1 className="text-3xl md:text-5xl font-heading font-bold mb-3">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-white/70 text-lg">
                Signed in as <span className="text-teal font-semibold">{user.greeting}</span>. Ready to explore?
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-white/60 hover:text-saffron underline transition"
            >
              Switch user / Log out
            </button>
          </div>
        </motion.div>

        {/* Quick Actions — 4 equal cards */}
        <div className="mb-12">
          <h2 className="font-heading font-bold text-xl text-navy mb-4">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {[
  { title: 'Career Bank', desc: 'Explore 24 careers with filters.', link: '/career-bank' },
  { title: 'Interest Quiz', desc: 'Discover your ideal stream.', link: '/quiz' },
  { title: 'Courses', desc: 'Learn from Harvard, Google, YC.', link: '/courses' },
  { title: 'Success Stories', desc: 'Real journeys from real people.', link: '/success-stories' },
].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                onClick={() => navigate(card.link)}
                className="cursor-pointer bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border border-navy/5 flex flex-col"
              >
                <h3 className="font-heading font-bold text-lg text-navy mb-1.5">
                  {card.title}
                </h3>
                <p className="text-navy/60 text-sm mb-4 flex-1">{card.desc}</p>
                <span className="text-saffron text-sm font-semibold inline-flex items-center gap-1">
                  Explore <ArrowRight size={14} />
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommended for You — 4 equal cards */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-heading font-bold text-xl text-navy">
              Recommended for You
            </h2>
            <button
              onClick={() => navigate('/career-bank')}
              className="text-xs font-semibold text-saffron hover:underline"
            >
              View All →
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {careersData.slice(0, 4).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                onClick={() => navigate('/career-bank')}
                className="cursor-pointer bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border border-navy/5 flex flex-col"
              >
                <div className="text-3xl mb-2">{c.icon}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-saffron mb-1">
                  {c.industry}
                </span>
                <h3 className="font-heading font-bold text-navy text-sm mb-2 line-clamp-1">
                  {c.title}
                </h3>
                <p className="text-xs text-navy/60 line-clamp-2 flex-1">
                  {c.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="font-heading font-bold text-xl text-navy mb-4">
            Your Activity
          </h2>
          <ActivityFeed />
        </div>
      </section>
    )
  }

  // ============================================================
  // LANDING VIEW (before login)
  // ============================================================
  return (
    <section ref={heroRef} className="relative overflow-hidden">
      {/* Cursor-following glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Static decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-saffron/20 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-navy/5 text-navy rounded-full px-4 py-1.5 text-xs font-semibold mb-6">
            <Sparkles size={14} className="text-saffron" />
            Your Career Passport Awaits
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-navy leading-tight mb-6">
            NextStep <span className="text-saffron">Navigator</span>
          </h1>

          <p className="text-lg md:text-xl text-navy/70 mb-8 leading-relaxed">
            Your guide to the future. Discover careers, take quizzes, and unlock
            your potential — all in one place.
          </p>

          <div className="flex items-center gap-6 text-sm text-navy/60">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-teal" />
              <span>24 Careers</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-saffron" />
              <span>Personalized Path</span>
            </div>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border border-navy/5"
        >
          <h2 className="text-2xl font-heading font-bold text-navy mb-1">
            Let's get started
          </h2>
          <p className="text-navy/60 text-sm mb-6">
            Tell us who you are so we can tailor your journey.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">
                Enter Your Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., John Smith"
                className="w-full border border-navy/15 rounded-xl px-4 py-2.5 text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-navy/15 rounded-xl px-4 py-2.5 text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Contact</label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={(e) => handleChange('contact', e.target.value)}
                  placeholder="+1 ..."
                  className="w-full border border-navy/15 rounded-xl px-4 py-2.5 text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                Select the user category you belong to
              </label>
              <div className="space-y-2">
                {USER_TYPES.map((t) => {
                  const Icon = t.icon
                  const active = form.userType === t.id
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => handleChange('userType', t.id)}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border-2 transition-all text-left ${
                        active
                          ? 'border-saffron bg-saffron/5'
                          : 'border-navy/10 hover:border-navy/25'
                      }`}
                    >
                      <span className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} text-white flex items-center justify-center shrink-0`}>
                        <Icon size={18} />
                      </span>
                      <span className={`text-sm font-semibold ${active ? 'text-navy' : 'text-navy/70'}`}>
                        {t.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full bg-saffron hover:bg-saffron-dark text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
            >
              GO <ArrowRight size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}