import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, MessageSquare } from 'lucide-react'

export default function Feedback() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const update = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }))
    setErrors((p) => ({ ...p, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) return setErrors(errs)
    setSubmitted(true)
  }

  const reset = () => {
    setForm({ name: '', email: '', message: '' })
    setErrors({})
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <section className="max-w-xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-lg border border-navy/5 p-10 text-center"
        >
          <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-teal" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-navy mb-3">
            Thank you, {form.name.split(' ')[0]}!
          </h1>
          <p className="text-navy/60 mb-8">
            Your feedback means a lot. We'll read every word and use it to make
            NextStep Navigator better.
          </p>
          <button
            onClick={reset}
            className="bg-saffron hover:bg-saffron-dark text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Send Another Message
          </button>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="max-w-xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
          We're Listening
        </p>
        <h1 className="text-4xl font-heading font-bold text-navy mb-3">
          Share Your Feedback
        </h1>
        <p className="text-navy/60">
          Suggestions? Feature ideas? Something broken? Tell us — we read everything.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg border border-navy/5 p-8 space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g., John Smith"
            className={`w-full border rounded-xl px-4 py-2.5 text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition ${
              errors.name ? 'border-red-300 bg-red-50/50' : 'border-navy/15'
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
            className={`w-full border rounded-xl px-4 py-2.5 text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition ${
              errors.email ? 'border-red-300 bg-red-50/50' : 'border-navy/15'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">
            Your Message
          </label>
          <textarea
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            rows={5}
            placeholder="Tell us what's on your mind..."
            className={`w-full border rounded-xl px-4 py-3 text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition resize-none ${
              errors.message ? 'border-red-300 bg-red-50/50' : 'border-navy/15'
            }`}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-saffron hover:bg-saffron-dark text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          <Send size={16} /> Submit Feedback
        </button>

        <p className="text-[11px] text-navy/40 text-center pt-2 flex items-center justify-center gap-1">
          <MessageSquare size={10} /> This is a demo — feedback is not stored anywhere.
        </p>
      </motion.form>
    </section>
  )
}