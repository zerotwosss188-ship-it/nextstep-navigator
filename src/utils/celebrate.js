import confetti from 'canvas-confetti'

export function celebrate() {
  // Primary burst
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF8A00', '#00C2A8', '#0B1E3F', '#FFA733'],
  })

  // Side cannons
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#FF8A00', '#00C2A8'],
    })
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#FF8A00', '#00C2A8'],
    })
  }, 150)
}

export function celebrateBig() {
  const duration = 2500
  const end = Date.now() + duration

  const interval = setInterval(() => {
    if (Date.now() > end) return clearInterval(interval)
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FF8A00', '#00C2A8', '#0B1E3F'],
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FF8A00', '#00C2A8', '#0B1E3F'],
    })
  }, 50)
}