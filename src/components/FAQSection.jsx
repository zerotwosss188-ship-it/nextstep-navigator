import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import faqData from '../data/faqs.json'

const CATEGORIES = ['All', 'Getting Started', 'Features', 'Privacy', 'Content']

export default function FAQSection() {
  const [category, setCategory] = useState('All')
  const [openId, setOpenId] = useState('faq-1')

  const filtered = useMemo(() => {
    if (category === 'All') return faqData.faqs
    return faqData.faqs.filter((f) => f.category === category)
  }, [category])

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-saffron/10 text-saffron rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4">
          <HelpCircle size={14} />
          Frequently Asked
        </div>
        <h2 className="font-heading font-bold text-4xl text-navy mb-3">
          Questions, Answered
        </h2>
        <p className="text-navy/60 max-w-xl mx-auto">
          Everything you need to know about NextStep Navigator — from how it works to how we protect your privacy.
        </p>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              category === c
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-navy/70 border-navy/15 hover:border-navy/40'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* FAQ list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((faq, i) => {
            const isOpen = openId === faq.id
            return (
              <motion.div
                key={faq.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.2) }}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isOpen ? 'border-saffron/30 shadow-lg' : 'border-navy/5 shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-start gap-4 p-5 text-left hover:bg-navy/[0.02] transition"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isOpen ? 'bg-saffron text-white rotate-180' : 'bg-navy/5 text-navy/50'
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-saffron">
                      {faq.category}
                    </span>
                    <h3
                      className={`font-heading font-bold text-navy leading-snug mt-0.5 ${
                        isOpen ? 'text-lg' : 'text-base'
                      }`}
                    >
                      {faq.question}
                    </h3>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pl-17 md:pl-20">
                        <p className="text-sm text-navy/70 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Still have questions CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 bg-gradient-to-r from-navy to-navy-light rounded-3xl p-8 text-center text-white"
      >
        <div className="w-12 h-12 rounded-full bg-saffron/20 flex items-center justify-center mx-auto mb-4">
          <MessageCircle size={22} className="text-saffron" />
        </div>
        <h3 className="font-heading font-bold text-2xl mb-2">Still have questions?</h3>
        <p className="text-white/70 mb-6 max-w-md mx-auto">
          We read every message. Ask us anything — feature ideas, career questions, or just to say hi.
        </p>
        <Link
          to="/feedback"
          className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Send Feedback
        </Link>
      </motion.div>
    </section>
  )
}