import { useEffect, useState } from 'react'

const KEY = 'nsn-visits'

export default function VisitorCounter({ className = '' }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem(KEY) || '0', 10)
      // Seed with a base number so it looks realistic (feels like a real counter)
      const seeded = Math.max(stored, 1247)
      const next = stored + 1
      localStorage.setItem(KEY, String(next))
      setCount(seeded + 1)
    } catch {
      setCount(1247)
    }
  }, [])

  return (
    <span className={className}>
      {count.toLocaleString('en-PK')}
    </span>
  )
}