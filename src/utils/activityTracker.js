const KEY = 'nsn-activity'
const MAX = 30

export function logActivity(type, payload = {}) {
  try {
    const raw = localStorage.getItem(KEY)
    const list = raw ? JSON.parse(raw) : []
    const event = {
      id: Date.now() + Math.random(),
      type, // 'bookmark-add' | 'bookmark-remove' | 'compare-add' | 'quiz' | 'view'
      payload,
      date: new Date().toISOString(),
    }
    const next = [event, ...list].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('nsn-activity-updated'))
  } catch {}
}

export function getActivity() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function clearActivity() {
  try {
    localStorage.removeItem(KEY)
    window.dispatchEvent(new CustomEvent('nsn-activity-updated'))
  } catch {}
}