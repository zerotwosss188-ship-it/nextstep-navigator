import { useEffect, useRef, useState } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#________'

export default function ScrambleText({ text, className = '', duration = 900, trigger = 'mount' }) {
  const [display, setDisplay] = useState(text)
  const [hover, setHover] = useState(false)
  const rafRef = useRef(null)
  const frameRef = useRef(0)

  const scramble = () => {
    const start = performance.now()
    const original = text
    const length = original.length

    const update = (now) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / duration)
      const revealed = Math.floor(progress * length)

      let output = ''
      for (let i = 0; i < length; i++) {
        if (i < revealed) {
          output += original[i]
        } else if (original[i] === ' ') {
          output += ' '
        } else {
          output += CHARS[Math.floor(Math.random() * CHARS.length)]
        }
      }
      setDisplay(output)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(update)
      } else {
        setDisplay(original)
      }
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(update)
  }

  useEffect(() => {
    if (trigger === 'mount') {
      const t = setTimeout(scramble, 200)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger])

  return (
    <span
      className={className}
      onMouseEnter={() => {
        setHover(true)
        if (trigger === 'hover') scramble()
      }}
      onMouseLeave={() => setHover(false)}
    >
      {display}
    </span>
  )
}