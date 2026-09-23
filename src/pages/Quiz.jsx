import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, RotateCcw, Sparkles, TrendingUp, Award } from 'lucide-react'
import quizData from '../data/quiz.json'
import { computeResult } from '../utils/recommendation'
import { logActivity } from '../utils/activityTracker'

export default function Quiz() {
  const [stage, setStage] = useState('select') // select | taking | result
  const [quizId, setQuizId] = useState('')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)

  const quiz = quizData.quizzes.find((q) => q.id === quizId)

  const startQuiz = () => {
    if (!quizId) return
    setStage('taking')
    setCurrent(0)
    setAnswers([])
    setResult(null)
  }

  const pickOption = (optionIndex) => {
    if (!quiz) return
    const next = [...answers]
    next[current] = optionIndex
    setAnswers(next)

    if (current < quiz.questions.length - 1) {
      setTimeout(() => setCurrent((c) => c + 1), 150)
    } else {
      const computed = computeResult(next, quiz)
      setResult(computed)
      setStage('result')

      // Celebrate
      import('../utils/celebrate').then((m) => m.celebrate())

      // Save trait scores for match computation
      try {
        const traitScores = {}
        computed.ranked.forEach((r) => {
          traitScores[r.trait] = r.score
        })
        localStorage.setItem('nsn-user-traits', JSON.stringify(traitScores))
      } catch {}

      // Save to learning history
      try {
        const KEY = 'nsn-quiz-history'
        const raw = localStorage.getItem(KEY)
        const history = raw ? JSON.parse(raw) : []
        history.push({
          quizId: quiz.id,
          quizLabel: quiz.label,
          stream: computed.stream,
          topTrait: computed.topTrait,
          date: new Date().toISOString(),
        })
        localStorage.setItem(KEY, JSON.stringify(history.slice(-20)))
      } catch {}

      // Log activity
      logActivity('quiz', {
        quizId: quiz.id,
        quizLabel: quiz.label,
        stream: computed.stream,
        topTrait: computed.topTrait,
      })
    }
  }

  const restart = () => {
    setStage('select')
    setQuizId('')
    setCurrent(0)
    setAnswers([])
    setResult(null)
  }

  const progress =
    quiz && quiz.questions
      ? ((current + (answers[current] !== undefined ? 1 : 0)) /
          quiz.questions.length) *
        100
      : 0

  // ---------- SELECT STAGE ----------
  if (stage === 'select') {
    return (
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
            Self Discovery
          </p>
          <h1 className="text-4xl font-heading font-bold text-navy mb-3">
            Interest-Based Quiz
          </h1>
          <p className="text-navy/60 max-w-xl mx-auto">
            Answer 8 quick questions. We'll match your interests to a stream and
            suggest careers that fit you best.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-navy/5 p-8">
          <label className="block text-sm font-bold text-navy mb-3">
            Select your area of interest
          </label>
          <select
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            className="w-full border border-navy/15 rounded-xl px-4 py-3 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition bg-white mb-6"
          >
            <option value="">— Choose an interest —</option>
            {quizData.quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.icon}  {q.label}
              </option>
            ))}
          </select>

          {quizId && quiz && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-navy/5 rounded-2xl p-5 mb-6"
            >
              <p className="text-sm text-navy/70">{quiz.description}</p>
              <p className="text-xs text-navy/50 mt-2">
                📝 {quiz.questions.length} questions · ⏱ ~2 minutes
              </p>
            </motion.div>
          )}

          <button
            onClick={startQuiz}
            disabled={!quizId}
            className="w-full bg-saffron hover:bg-saffron-dark disabled:bg-navy/20 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            Start Quiz <ArrowRight size={18} />
          </button>
        </div>
      </section>
    )
  }

  // ---------- TAKING STAGE ----------
  if (stage === 'taking' && quiz && quiz.questions) {
    const q = quiz.questions[current]

    if (!q) {
      // Safety guard — if q is somehow undefined, reset
      return (
        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <p className="text-navy/60 mb-4">Something went wrong.</p>
          <button
            onClick={restart}
            className="bg-saffron hover:bg-saffron-dark text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Restart Quiz
          </button>
        </section>
      )
    }

    return (
      <section className="max-w-3xl mx-auto px-6 py-16" data-no-swipe>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-navy/50">
              Question {current + 1} / {quiz.questions.length}
            </span>
            <span className="text-xs font-bold text-saffron">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-navy/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-saffron to-teal"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl shadow-lg border border-navy/5 p-8"
          >
            <h2 className="font-heading font-bold text-2xl text-navy mb-6">
              {q.q}
            </h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isPicked = answers[current] === i
                return (
                  <button
                    key={i}
                    onClick={() => pickOption(i)}
                    className={`quiz-option w-full text-left rounded-xl px-5 py-4 border-2 transition-all font-medium flex items-center gap-3 ${
                      isPicked
                        ? 'border-saffron bg-saffron/10 text-navy selected'
                        : 'border-navy/10 hover:border-navy/30 text-navy/80'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                        isPicked
                          ? 'border-saffron bg-saffron text-white'
                          : 'border-navy/20 text-navy/50'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt.text}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={restart}
          className="mt-6 text-sm text-navy/50 hover:text-saffron transition flex items-center gap-1.5"
        >
          <RotateCcw size={14} /> Restart
        </button>
      </section>
    )
  }

  // ---------- RESULT STAGE ----------
  if (stage === 'result' && result) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-saffron to-teal rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles size={36} className="text-white" />
          </div>
          <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
            Your Result
          </p>
          <h1 className="text-4xl font-heading font-bold text-navy mb-3">
            You're a{' '}
            <span className="text-saffron capitalize">{result.topTrait}</span>{' '}
            Thinker
          </h1>
          <p className="text-navy/60 max-w-xl mx-auto">
            Based on your answers, here's the stream and careers that best match
            your natural strengths.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-navy to-navy-light rounded-3xl p-8 text-white mb-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <Award size={20} className="text-saffron" />
            <span className="text-xs font-bold uppercase tracking-widest text-saffron">
              Recommended Stream
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl mb-2">
            {result.stream}
          </h2>
          <p className="text-white/70 text-sm">
            Top 3 traits:{' '}
            {result.ranked
              .slice(0, 3)
              .map((r) => r.trait)
              .join(' · ')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-navy/5 p-6 mb-8"
        >
          <h3 className="flex items-center gap-2 font-heading font-bold text-navy mb-4">
            <TrendingUp size={16} className="text-teal" /> Your Trait Profile
          </h3>
          <div className="space-y-3">
            {result.ranked.map((r) => {
              const pct = (r.score / result.totalScore) * 100
              return (
                <div key={r.trait}>
                  <div className="flex justify-between text-xs font-semibold text-navy mb-1 capitalize">
                    <span>{r.trait}</span>
                    <span className="text-navy/50">{r.score} pts</span>
                  </div>
                  <div className="w-full h-2 bg-navy/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-saffron to-teal"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-heading font-bold text-2xl text-navy mb-4">
            Careers That Fit You
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {result.careers.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="bg-white rounded-2xl p-5 border border-navy/5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{c.icon}</div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-saffron">
                      {c.industry}
                    </span>
                    <h4 className="font-heading font-bold text-navy">
                      {c.title}
                    </h4>
                    <p className="text-xs text-navy/60 mt-1 line-clamp-2">
                      {c.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/career-bank"
              className="bg-saffron hover:bg-saffron-dark text-white font-semibold px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-lg"
            >
              Explore All Careers <ArrowRight size={16} />
            </Link>
            <button
              onClick={restart}
              className="bg-white border border-navy/15 text-navy hover:border-navy/40 font-semibold px-6 py-3 rounded-xl transition flex items-center gap-2"
            >
              <RotateCcw size={16} /> Take Another Quiz
            </button>
          </div>
        </motion.div>
      </section>
    )
  }

  // Fallback
  return (
    <section className="max-w-3xl mx-auto px-6 py-16 text-center">
      <p className="text-navy/60 mb-4">Something went wrong.</p>
      <button
        onClick={restart}
        className="bg-saffron hover:bg-saffron-dark text-white font-semibold px-6 py-3 rounded-xl transition"
      >
        Restart Quiz
      </button>
    </section>
  )
}