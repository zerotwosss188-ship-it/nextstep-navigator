import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()
const KEY = 'nsn-theme'
const THEMES = ['classic', 'glass', 'neu', 'clay']

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(KEY)
      return THEMES.includes(stored) ? stored : 'classic'
    } catch {
      return 'classic'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, theme)
      // Apply theme class to <html> for global CSS overrides
      const root = document.documentElement
      THEMES.forEach((t) => root.classList.remove(`theme-${t}`))
      if (theme !== 'classic') {
        root.classList.add(`theme-${theme}`)
      }
    } catch {}
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}