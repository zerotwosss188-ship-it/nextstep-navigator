import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const ROUTE_ORDER = [
  '/',
  '/career-bank',
  '/quiz',
  '/courses',
  '/multimedia',
  '/success-stories',
  '/resources',
  '/admission',
  '/feedback',
  '/bookmarks',
  '/about',
  '/contact',
]

const MIN_X = 80        // minimum horizontal distance (px)
const MAX_Y = 80        // maximum vertical distance (px)
const MAX_TIME = 1200   // ms — must be a quick gesture
const DIRECTION_RATIO = 1.5  // horizontal must be 1.5x vertical

export default function SwipeNavigator() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useUser()
  const stateRef = useRef({ startX: 0, startY: 0, startTime: 0, active: false })

  useEffect(() => {
    if (!user) return

    const isBlockedTarget = (target) => {
      if (!target || !target.closest) return false
      // Block on interactive elements
      if (target.closest('input, textarea, select, button, a')) return true
      // Block on elements explicitly marked
      if (target.closest('[data-no-swipe]')) return true
      return false
    }

    const isModalOpen = () => !!document.querySelector('[data-modal-open="true"]')

    const begin = (x, y, target) => {
      if (isModalOpen()) return
      if (isBlockedTarget(target)) return
      stateRef.current = {
        startX: x,
        startY: y,
        startTime: Date.now(),
        active: true,
      }
      // Debug: uncomment to see if gesture starts
      // console.log('[Swipe] begin', x, y)
    }

    const end = (x, y) => {
      const s = stateRef.current
      if (!s.active) return
      s.active = false

      const deltaX = x - s.startX
      const deltaY = y - s.startY
      const deltaTime = Date.now() - s.startTime

      // Debug: uncomment to see gesture values
      // console.log('[Swipe] end', { deltaX, deltaY, deltaTime })

      if (deltaTime > MAX_TIME) return
      if (Math.abs(deltaX) < MIN_X) return
      if (Math.abs(deltaY) > MAX_Y) return
      if (Math.abs(deltaX) < Math.abs(deltaY) * DIRECTION_RATIO) return

      const currentIndex = ROUTE_ORDER.indexOf(location.pathname)
      if (currentIndex === -1) return

      if (deltaX < 0) {
        const nextIndex = currentIndex + 1
        if (nextIndex < ROUTE_ORDER.length) navigate(ROUTE_ORDER[nextIndex])
      } else {
        const prevIndex = currentIndex - 1
        if (prevIndex >= 0) navigate(ROUTE_ORDER[prevIndex])
      }
    }

    // ---- TOUCH handlers ----
    const onTouchStart = (e) => {
      const t = e.touches[0]
      begin(t.clientX, t.clientY, e.target)
    }
    const onTouchEnd = (e) => {
      const t = e.changedTouches[0]
      end(t.clientX, t.clientY)
    }

    // ---- MOUSE handlers (desktop testing) ----
    const onMouseDown = (e) => {
      // Ignore right-click / middle-click
      if (e.button !== 0) return
      begin(e.clientX, e.clientY, e.target)
    }
    const onMouseUp = (e) => {
      end(e.clientX, e.clientY)
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [location.pathname, navigate, user])

  return null
}