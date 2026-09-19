import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen, Plane, MessageSquare, FileText } from 'lucide-react'

const SECTIONS = [
  {
    id: 'stream',
    icon: BookOpen,
    title: 'Stream Selection (Post-10th)',
    color: 'from-teal to-teal-dark',
    content: [
      {
        subtitle: 'Science Stream',
        text: 'Best for students who enjoy Physics, Chemistry, Maths, or Biology and want to pursue Engineering, Medicine, Research, or Data Science. Requires strong analytical skills and 2+ years of focused study.',
      },
      {
        subtitle: 'Commerce Stream',
        text: 'Ideal for those interested in business, finance, accounting, and economics. Leads to CA, CS, BBA, B.Com, and management careers. Strong in numbers + strategic thinking.',
      },
      {
        subtitle: 'Arts / Humanities',
        text: 'For students who love language, history, psychology, design, or social sciences. Leads to Law, Journalism, Design, Psychology, Civil Services, and Teaching.',
      },
      {
        subtitle: 'Vocational Stream',
        text: 'Practical, skill-based path for careers in IT, hospitality, healthcare support, retail, and more. Faster entry to the workforce with hands-on training.',
      },
      {
        subtitle: 'How to Decide?',
        text: 'Ask yourself: What subjects do I genuinely enjoy? What careers excite me? What are my natural strengths? Talk to professionals, take psychometric tests, and don\'t choose based on peer pressure.',
      },
    ],
  },
  {
    id: 'abroad',
    icon: Plane,
    title: 'Study Abroad Guidelines',
    color: 'from-saffron to-saffron-dark',
    content: [
      {
        subtitle: '1. Shortlist Universities',
        text: 'Aim for 6–8 universities: 2 ambitious (reach), 4 moderate (match), and 2 safe (backup). Check rankings, course structure, location, and alumni outcomes.',
      },
      {
        subtitle: '2. Standardized Tests',
        text: 'Undergrad: SAT/ACT + IELTS/TOEFL. Graduate: GRE/GMAT + IELTS/TOEFL. Start prep 6–8 months before application deadlines.',
      },
      {
        subtitle: '3. Application Materials',
        text: 'Statement of Purpose (SOP), Letters of Recommendation (2–3), transcripts, CV, and portfolio (for design/art courses).',
      },
      {
        subtitle: '4. Funding',
        text: 'Explore scholarships, assistantships, education loans, and part-time work options. Total budget should be planned for full duration + living costs.',
      },
      {
        subtitle: '5. Visa Process',
        text: 'After admits, pay deposits, receive I-20/CAS, book visa slots, prepare for the interview. Be honest and clear about your intent to return.',
      },
    ],
  },
  {
    id: 'interview',
    icon: MessageSquare,
    title: 'Interview Tips (Graduates & Professionals)',
    color: 'from-navy to-navy-light',
    content: [
      {
        subtitle: 'Research the Company',
        text: 'Know their products, recent news, competitors, and culture. Reference specifics in your answers — this sets you apart instantly.',
      },
      {
        subtitle: 'STAR Method',
        text: 'For behavioral questions: Situation → Task → Action → Result. Practice 8–10 stories that can flex across different questions.',
      },
      {
        subtitle: 'Common Questions',
        text: '"Tell me about yourself", "Why this role?", "Strengths & weaknesses", "Where do you see yourself in 5 years?" — rehearse but don\'t memorize.',
      },
      {
        subtitle: 'Ask Smart Questions',
        text: 'Prepare 3–4 thoughtful questions about the role, team, and growth. Avoid salary/leave discussions in the first round.',
      },
      {
        subtitle: 'Follow Up',
        text: 'Send a thank-you email within 24 hours. Reference a specific point from the conversation. Keep it short and genuine.',
      },
    ],
  },
  {
    id: 'resume',
    icon: FileText,
    title: 'Resume Guidelines (Graduates & Professionals)',
    color: 'from-teal to-saffron',
    content: [
      {
        subtitle: 'Keep it to 1 Page',
        text: 'Unless you have 10+ years of experience, 1 page is enough. Recruiters spend ~7 seconds on a resume — every word must earn its place.',
      },
      {
        subtitle: 'ATS-Friendly Format',
        text: 'Avoid images, tables, and fancy fonts. Use simple headings: Summary, Skills, Experience, Education, Projects. Save as PDF.',
      },
      {
        subtitle: 'Quantify Achievements',
        text: 'Instead of "Improved sales", write "Increased sales by 32% in 6 months across 4 regions". Numbers make your impact credible.',
      },
      {
        subtitle: 'Tailor Each Resume',
        text: 'Customize keywords to match each job description. Use the exact phrasing from the JD — this passes ATS filters.',
      },
      {
        subtitle: 'Proofread Ruthlessly',
        text: 'A single typo can cost you the interview. Read aloud, use Grammarly, and ask a friend to review.',
      },
    ],
  },
]

export default function Admission() {
  const [openId, setOpenId] = useState('stream')

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
          Guidance
        </p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-3">
          Admission & Coaching
        </h1>
        <p className="text-navy/60 max-w-2xl mx-auto">
          Practical, pre-designed guidance on stream selection, studying abroad,
          interviews, and resumes.
        </p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((s) => {
          const Icon = s.icon
          const open = openId === s.id
          return (
            <motion.div
              key={s.id}
              layout
              className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenId(open ? null : s.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-navy/[0.02] transition"
              >
                <span
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shrink-0`}
                >
                  <Icon size={20} />
                </span>
                <span className="flex-1 font-heading font-bold text-lg text-navy">
                  {s.title}
                </span>
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-navy/40"
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 pt-2 space-y-4 border-t border-navy/5">
                      {s.content.map((c) => (
                        <div key={c.subtitle}>
                          <h4 className="font-heading font-bold text-navy text-sm mb-1">
                            {c.subtitle}
                          </h4>
                          <p className="text-sm text-navy/70 leading-relaxed">
                            {c.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}