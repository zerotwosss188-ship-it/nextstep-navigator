import FAQSection from '../components/FAQSection'
import { motion } from 'framer-motion'
import { Compass, Target, Heart, Sparkles, Users, Rocket } from 'lucide-react'

const VALUES = [
  {
    icon: Target,
    title: 'Clarity First',
    text: 'We believe every student deserves a clear path — not overwhelm, not confusion.',
  },
  {
    icon: Heart,
    title: 'Built With Empathy',
    text: 'We remember what it felt like to be uncertain. Every feature is designed for that moment.',
  },
  {
    icon: Sparkles,
    title: 'Free, Forever',
    text: 'No paywalls, no accounts, no ads. Just structured guidance for everyone.',
  },
]

export default function About() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
          Our Story
        </p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-4">
          About NextStep Navigator
        </h1>
        <p className="text-lg text-navy/60 max-w-2xl mx-auto leading-relaxed">
          A simple idea: give students and professionals a clear, calm, and
          free space to figure out what's next — without pressure, ads, or signups.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-navy to-navy-light rounded-3xl p-8 md:p-12 text-white mb-16 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <Compass size={22} className="text-saffron" />
          <span className="text-xs font-bold uppercase tracking-widest text-saffron">
            Our Mission
          </span>
        </div>
        <p className="text-xl md:text-2xl font-heading font-semibold leading-relaxed">
          To make career exploration accessible, engaging, and judgement-free
          for every learner — regardless of their school, city, or background.
        </p>
      </motion.div>

      {/* Problem + Solution */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-8">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
            <Users size={20} className="text-red-400" />
          </div>
          <h2 className="font-heading font-bold text-xl text-navy mb-3">The Problem</h2>
          <p className="text-navy/70 leading-relaxed">
            Millions of students face overwhelming career choices with scattered
            information, biased advice, and no structured way to explore. Most
            end up choosing paths based on peer pressure rather than self-awareness.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-8">
          <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
            <Rocket size={20} className="text-teal" />
          </div>
          <h2 className="font-heading font-bold text-xl text-navy mb-3">Our Solution</h2>
          <p className="text-navy/70 leading-relaxed">
            A lightweight, browser-based platform that curates careers, quizzes,
            resources, and real stories — designed for institutions, career fairs,
            and offline environments where heavy tools don't work.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="font-heading font-bold text-2xl text-navy mb-6 text-center">
          What We Stand For
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {VALUES.map((v, i) => {
            const Icon = v.icon
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-saffron" />
                </div>
                <h3 className="font-heading font-bold text-navy mb-2">{v.title}</h3>
                <p className="text-sm text-navy/60 leading-relaxed">{v.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Tech + AI attribution */}
      <div className="bg-navy/5 rounded-2xl p-8">
        <h2 className="font-heading font-bold text-xl text-navy mb-4">
          Built With Transparency
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-navy/70 leading-relaxed">
          <div>
            <p className="font-semibold text-navy mb-2">Tech Stack</p>
            <p>
              React 19 + Vite, React Router, Tailwind CSS, Framer Motion, Lucide
              icons. Data served from static JSON — no backend, no database,
              no tracking.
            </p>
          </div>
          <div>
            <p className="font-semibold text-navy mb-2">AI Tools Used</p>
            <p>
              AI was used strictly as a learning and debugging aid. All
              illustrations are hand-drawn or AI-generated with attribution.
              No code was copied from AI tools.
            </p>
          </div>
        </div>
      </div>
     {/* Tech + AI attribution */}
      <div className="bg-navy/5 rounded-2xl p-8">
        {/* ... existing content ... */}
      </div>

      {/* FAQ — NEW */}
      <div className="mt-16 -mx-6">
        <FAQSection />
      </div>
    </section>
  )
}