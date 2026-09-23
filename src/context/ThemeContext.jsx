import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()
const KEY_THEME = 'nsn-theme'
const KEY_MODE = 'nsn-mode' // 'light' | 'dark' | 'auto'
const THEMES = ['classic', 'glass', 'clay']

function getSystemPrefersDark() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(KEY_THEME)
      return THEMES.includes(stored) ? stored : 'classic'
    } catch {
      return 'classic'
    }
  })

  const [mode, setMode] = useState(() => {
    try {
      const stored = localStorage.getItem(KEY_MODE)
      return ['light', 'dark', 'auto'].includes(stored) ? stored : 'auto'
    } catch {
      return 'auto'
    }
  })

  const [systemDark, setSystemDark] = useState(getSystemPrefersDark)

  // Listen for OS preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Compute actual dark state
  const dark = mode === 'dark' || (mode === 'auto' && systemDark)

  // Apply theme class
  useEffect(() => {
    try {
      const root = document.documentElement
      THEMES.forEach((t) => root.classList.remove(`theme-${t}`))
      if (theme !== 'classic') root.classList.add(`theme-${theme}`)
    } catch {}
  }, [theme])

  // Apply dark class
  useEffect(() => {
    try {
      const root = document.documentElement
      if (dark) root.classList.add('dark')
      else root.classList.remove('dark')
    } catch {}
  }, [dark])

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(KEY_THEME, theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem(KEY_MODE, mode)
    } catch {}
  }, [mode])

  // Cycle: light → dark → auto → light
  const cycleMode = () => {
    setMode((m) => (m === 'light' ? 'dark' : m === 'dark' ? 'auto' : 'light'))
  }

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, themes: THEMES, dark, mode, setMode, cycleMode }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}