import { motion } from 'framer-motion'
import { Check, Palette } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const OPTIONS = [
  { id: 'classic', name: 'Classic', tagline: 'Clean & minimal', preview: 'classic' },
  { id: 'glass', name: 'Glassmorphism', tagline: 'Frosted glass', preview: 'glass' },
  { id: 'clay', name: 'Claymorphism', tagline: 'Puffy 3D clay', preview: 'clay' },
]

export default function ThemePicker() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <Palette size={16} className="text-saffron" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-saffron">
          Appearance
        </span>
      </div>
      <h2 className="font-heading font-bold text-lg text-navy mb-4">
        Customize your theme
      </h2>

            <div className="grid grid-cols-3 gap-3">
        {OPTIONS.map((opt) => {
          const active = theme === opt.id
          return (
            <button
              key={opt.id}
              data-theme-picker
              data-active={active}
              onClick={() => setTheme(opt.id)}
              className="text-left rounded-2xl p-3 border-2 border-navy/10"
            >
              <div className={`theme-preview ${opt.preview} mb-3`} />

              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="text-xs font-bold text-navy/70">
                  {opt.name}
                </p>
                {active && (
                  <span className="w-4 h-4 rounded-full bg-saffron text-white flex items-center justify-center shrink-0">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-navy/50">{opt.tagline}</p>
            </button>
          )
        })}
      </div>

      <p className="text-[11px] text-navy/40 mt-4 text-center">
        Your theme is saved to this device.
      </p>
    </motion.div>
  )
} 