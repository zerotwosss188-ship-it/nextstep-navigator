import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X, ArrowRight, DollarSign, GraduationCap, Award, AlertCircle } from 'lucide-react'
import { useCompare } from '../context/CompareContext'
import careersData from '../data/careers.json'

export default function Compare() {
  const { compareIds, removeCompare, clearCompare } = useCompare()

  const careers = compareIds
    .map((id) => careersData.find((c) => c.id === id))
    .filter(Boolean)

  if (careers.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-white rounded-3xl border border-navy/5 p-12">
          <h1 className="font-heading font-bold text-2xl text-navy mb-3">
            Nothing to compare yet
          </h1>
          <p className="text-navy/60 mb-6">
            Go to Career Bank and click "Compare" on 2–3 careers to see them side-by-side.
          </p>
          <Link
            to="/career-bank"
            className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Browse Careers <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    )
  }

  const formatSalary = (n) =>
    n >= 100000 ? `$${(n / 100000).toFixed(1)}L` : `$${(n / 1000).toFixed(0)}K`

  const rows = [
    { label: 'Industry', icon: null, render: (c) => c.industry },
    { label: 'Salary Range', icon: DollarSign, render: (c) => `${formatSalary(c.salaryMin)} – ${formatSalary(c.salaryMax)}` },
    { label: 'Required Skills', icon: Award, render: (c) => c.skills.slice(0, 4).join(', ') },
    { label: 'Education', icon: GraduationCap, render: (c) => c.educationPath },
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
        <div>
          <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
            Side by Side
          </p>
          <h1 className="text-4xl font-heading font-bold text-navy mb-1">
            Compare Careers
          </h1>
          <p className="text-navy/60">
            {careers.length} career{careers.length !== 1 ? 's' : ''} selected
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="text-sm font-semibold text-red-500 hover:text-red-600 transition"
        >
          Clear all
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-navy/5 shadow-sm overflow-hidden"
      >
        {/* Header row */}
        <div
          className="grid border-b border-navy/5"
          style={{ gridTemplateColumns: `180px repeat(${careers.length}, 1fr)` }}
        >
          <div className="p-5 bg-navy/5" />
          {careers.map((c) => (
            <div key={c.id} className="p-5 border-l border-navy/5 text-center relative">
              <button
                onClick={() => removeCompare(c.id)}
                className="absolute top-3 right-3 w-6 h-6 rounded-full hover:bg-navy/10 flex items-center justify-center transition"
                aria-label={`Remove ${c.title}`}
              >
                <X size={14} className="text-navy/50" />
              </button>
              <div className="text-4xl mb-2">{c.icon}</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-saffron">
                {c.industry}
              </span>
              <h3 className="font-heading font-bold text-navy text-lg">{c.title}</h3>
            </div>
          ))}
        </div>

        {/* Data rows */}
        {rows.map((row, ri) => {
          const Icon = row.icon
          return (
            <div
              key={row.label}
              className={`grid border-b border-navy/5 last:border-b-0 ${
                ri % 2 === 0 ? 'bg-navy/[0.02]' : ''
              }`}
              style={{ gridTemplateColumns: `180px repeat(${careers.length}, 1fr)` }}
            >
              <div className="p-5 flex items-center gap-2 bg-navy/5">
                {Icon && <Icon size={14} className="text-saffron shrink-0" />}
                <span className="text-xs font-bold uppercase tracking-widest text-navy">
                  {row.label}
                </span>
              </div>
              {careers.map((c) => (
                <div key={c.id} className="p-5 border-l border-navy/5">
                  <p className="text-sm text-navy/80 leading-relaxed">{row.render(c)}</p>
                </div>
              ))}
            </div>
          )
        })}
      </motion.div>

      {careers.length < 3 && (
        <div className="mt-6 text-center">
          <Link
            to="/career-bank"
            className="inline-flex items-center gap-2 text-sm font-semibold text-saffron hover:underline"
          >
            + Add another career to compare <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </section>
  )
}