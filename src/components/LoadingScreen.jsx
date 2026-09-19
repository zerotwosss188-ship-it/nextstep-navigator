import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = [
  'Fueling up...',
  'Loading 24 careers...',
  'Mapping your future...',
  'Connecting with mentors...',
  'Almost there...',
  'Arriving now!',
]

export default function LoadingScreen({ onComplete, duration = 3000 }) {
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [done, setDone] = useState(false)

  // Throttled progress ticker — React updates only at ~25fps
  // CSS transitions fill the gaps for 60fps visual smoothness
  useEffect(() => {
    const start = performance.now()
    let rafId
    let lastUpdate = -100

    const tick = (now) => {
      const elapsed = now - start
      const pct = Math.min(100, (elapsed / duration) * 100)

      // Update state every ~40ms (25fps) instead of every frame
      if (now - lastUpdate >= 40 || pct >= 100) {
        setProgress(pct)
        lastUpdate = now
      }

      if (pct < 100) {
        rafId = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setDone(true), 500)
        setTimeout(() => onComplete?.(), 1100)
      }
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [duration, onComplete])

  // Cycle messages based on progress
  useEffect(() => {
    const idx = Math.min(
      MESSAGES.length - 1,
      Math.floor((progress / 100) * MESSAGES.length)
    )
    setMessageIndex(idx)
  }, [progress])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[999] bg-navy overflow-hidden flex flex-col justify-between"
        >
          {/* Background dot grid */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #FF8A00 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Decorative glow blobs */}
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-saffron/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-teal/20 rounded-full blur-3xl" />

          {/* TOP: Logo */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-saffron mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
                Loading
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-3 leading-none">
                NextStep <span className="text-saffron">Navigator</span>
              </h1>
              <p className="text-white/40 text-sm tracking-[0.3em] uppercase font-medium">
                Your Guide to the Future
              </p>
            </motion.div>
          </div>

          {/* BOTTOM: Progress + Truck */}
          <div className="relative z-10 w-full max-w-3xl mx-auto px-6 pb-16">
                        {/* Progress + Message (all centered) */}
            <div className="flex flex-col items-center mb-6">
              {/* Status pill */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
                <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">
                  Loading
                </span>
              </div>

              {/* Big number + % — centered */}
              <div className="flex items-baseline gap-1.5 mb-2">
                <span
                  className="font-heading font-bold text-6xl text-white tabular-nums leading-none"
                  style={{ minWidth: '2.5ch', textAlign: 'center' }}
                >
                  {Math.floor(progress)}
                </span>
                <span className="text-saffron font-heading font-bold text-3xl leading-none">
                  %
                </span>
              </div>

              {/* Message — centered under number */}
              <p className="text-white/50 text-sm font-medium leading-tight transition-opacity duration-200 text-center">
                {MESSAGES[messageIndex]}
              </p>
            </div>

            {/* Road + Truck */}
            <div className="relative h-16 mb-1">
              {/* Dashed road — background layer */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-between gap-2">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="h-[3px] flex-1 rounded-full bg-white/15" />
                ))}
              </div>

              {/* Dashed road — saffron overlay, clipped by progress (GPU-smoothed) */}
              <div
                className="absolute bottom-4 left-0 right-0 flex justify-between gap-2"
                style={{
                  clipPath: `inset(0 ${100 - progress}% 0 0)`,
                  transition: 'clip-path 100ms linear',
                }}
              >
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="h-[3px] flex-1 rounded-full bg-saffron" />
                ))}
              </div>

              {/* Truck — left position with CSS transition for smoothness */}
              <div
                className="absolute bottom-6 pointer-events-none"
                style={{
                  left: `calc(${progress}% - 70px)`,
                  transition: 'left 100ms linear',
                  willChange: 'left',
                  width: '140px',
                }}
              >
                <TruckSVG />
              </div>
            </div>

            {/* Progress bar underneath */}
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-saffron to-teal"
                style={{
                  width: `${progress}%`,
                  transition: 'width 100ms linear',
                  willChange: 'width',
                }}
              />
            </div>

            {/* Footer caption */}
            <div className="flex items-center justify-between mt-4 text-white/30 text-[11px] font-medium">
              <span>NextStep Navigator © 2026</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-teal animate-pulse" />
                Building the future...
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---- Truck SVG ----
function TruckSVG() {
  return (
    <motion.svg
      width="140"
      height="80"
      viewBox="0 0 140 80"
      fill="none"
      animate={{ y: [0, -1.5, 0] }}
      transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
    >
      <rect x="5" y="18" width="72" height="42" rx="4" fill="#FF8A00" />
      <rect x="10" y="23" width="62" height="32" rx="2" fill="#CC6E00" opacity="0.35" />
      <line x1="30" y1="23" x2="30" y2="55" stroke="#0B1E3F" strokeWidth="1" opacity="0.3" />
      <line x1="52" y1="23" x2="52" y2="55" stroke="#0B1E3F" strokeWidth="1" opacity="0.3" />
      <path d="M77 24 L108 24 L120 42 L120 60 L77 60 Z" fill="#00C2A8" />
      <path d="M77 24 L108 24 L116 34 L77 34 Z" fill="#009B86" />
      <path d="M82 28 L106 28 L114 42 L82 42 Z" fill="#0B1E3F" opacity="0.7" />
      <path d="M82 28 L92 28 L98 42 L82 42 Z" fill="#33CEBB" opacity="0.25" />
      <circle cx="119" cy="48" r="3" fill="#FFE066" />
      <rect x="3" y="48" width="3" height="8" rx="1" fill="#FF4444" />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '98px 64px' }}
      >
        <circle cx="98" cy="64" r="11" fill="#0B1E3F" />
        <circle cx="98" cy="64" r="6" fill="#FF8A00" />
        <line x1="98" y1="58" x2="98" y2="70" stroke="#0B1E3F" strokeWidth="1.5" />
        <line x1="92" y1="64" x2="104" y2="64" stroke="#0B1E3F" strokeWidth="1.5" />
      </motion.g>

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '30px 64px' }}
      >
        <circle cx="30" cy="64" r="11" fill="#0B1E3F" />
        <circle cx="30" cy="64" r="6" fill="#FF8A00" />
        <line x1="30" y1="58" x2="30" y2="70" stroke="#0B1E3F" strokeWidth="1.5" />
        <line x1="24" y1="64" x2="36" y2="64" stroke="#0B1E3F" strokeWidth="1.5" />
      </motion.g>

      <motion.g
        animate={{ opacity: [0.2, 0.6, 0.2], x: [-4, -10, -4] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <line x1="-2" y1="35" x2="-8" y2="35" stroke="#FF8A00" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-2" y1="45" x2="-12" y2="45" stroke="#00C2A8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-2" y1="52" x2="-6" y2="52" stroke="#FF8A00" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>
    </motion.svg>
  )
}