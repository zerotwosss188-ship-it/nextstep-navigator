import { motion } from 'framer-motion'
import { Flag, Target, Rocket, Award, Sparkles, TrendingUp } from 'lucide-react'

const STAGE_ICONS = [Flag, Target, Rocket, Award, Sparkles, TrendingUp]

export default function CareerTimeline({ roadmap }) {
  if (!roadmap || roadmap.length === 0) return null

  const total = roadmap.length
  const stepWidth = 100 / total

  return (
    <div className="mb-6 bg-gradient-to-br from-navy/5 to-transparent rounded-3xl p-6 border border-navy/5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-saffron mb-1">
            Your Path
          </p>
          <h4 className="font-heading font-bold text-navy text-lg">
            Timeline to Mastery
          </h4>
        </div>
        <span className="text-[10px] font-bold text-navy/40 bg-white/60 px-2.5 py-1 rounded-full">
          {total} stages
        </span>
      </div>

      {/* Horizontal timeline (desktop) */}
      <div className="hidden md:block relative">
        {/* Progress line behind nodes */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-navy/10 rounded-full" />
        <motion.div
          className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-saffron to-teal rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="relative flex justify-between">
          {roadmap.map((step, i) => {
            const Icon = STAGE_ICONS[i % STAGE_ICONS.length]
            const isLast = i === total - 1
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                style={{ width: `${stepWidth}%` }}
                className="flex flex-col items-center text-center"
              >
                {/* Node */}
                <div className="relative mb-3">
                  <div
                    className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                      isLast
                        ? 'bg-gradient-to-br from-saffron to-saffron-dark text-white'
                        : 'bg-white border-2 border-navy/10 text-navy/70'
                    }`}
                  >
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                  <span
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      isLast ? 'bg-navy text-white' : 'bg-navy/10 text-navy/60'
                    }`}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Stage label */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-saffron mb-1">
                  {step.stage}
                </p>

                {/* Action */}
                <p className="text-xs font-semibold text-navy leading-snug mb-1.5 line-clamp-2 min-h-[2.5em]">
                  {step.action}
                </p>

                {/* Resource */}
                <p className="text-[10px] text-navy/50 leading-tight line-clamp-2">
                  📚 {step.resource}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Vertical timeline (mobile) */}
      <div className="md:hidden relative pl-6">
        {/* Vertical line */}
        <div className="absolute top-2 bottom-2 left-2 w-0.5 bg-navy/10 rounded-full" />
        <motion.div
          className="absolute top-2 left-2 w-0.5 bg-gradient-to-b from-saffron to-teal rounded-full"
          initial={{ height: 0 }}
          whileInView={{ height: 'calc(100% - 1rem)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="space-y-4">
          {roadmap.map((step, i) => {
            const Icon = STAGE_ICONS[i % STAGE_ICONS.length]
            const isLast = i === total - 1
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="relative flex gap-3"
              >
                <div
                  className={`relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0 -ml-3 z-10 ${
                    isLast
                      ? 'bg-gradient-to-br from-saffron to-saffron-dark text-white shadow-lg'
                      : 'bg-white border-2 border-navy/10 text-navy/70'
                  }`}
                >
                  <Icon size={14} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-saffron mb-0.5">
                    {step.stage}
                  </p>
                  <p className="text-sm font-semibold text-navy leading-snug mb-1">
                    {step.action}
                  </p>
                  <p className="text-xs text-navy/50">📚 {step.resource}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Footer stat */}
      <div className="mt-6 pt-4 border-t border-navy/5 flex items-center justify-between text-xs">
        <span className="text-navy/50">Estimated journey</span>
        <span className="font-heading font-bold text-navy">
          {total} stages · years of growth
        </span>
      </div>
    </div>
  )
}