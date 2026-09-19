import { logActivity } from '../utils/activityTracker'
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from './ToastContext'

const CompareContext = createContext()
const KEY = 'nsn-compare'
const MAX = 3

function readStorage() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CompareProvider({ children }) {
  const [compareIds, setCompareIds] = useState(readStorage)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(compareIds))
  }, [compareIds])

  const isComparing = (id) => compareIds.includes(id)

  const toggleCompare = (id) => {
  setCompareIds((prev) => {
    if (prev.includes(id)) {
      toast('Removed from compare', 'info')
      return prev.filter((x) => x !== id)
    }
    if (prev.length >= MAX) {
      toast(`Max ${MAX} careers to compare`, 'error')
      return prev
    }
    logActivity('compare-add', { id })
    toast('Added to compare', 'success')
    return [...prev, id]
  })
}

  const clearCompare = () => setCompareIds([])

  const removeCompare = (id) => setCompareIds((prev) => prev.filter((x) => x !== id))

  return (
    <CompareContext.Provider
      value={{ compareIds, isComparing, toggleCompare, clearCompare, removeCompare, MAX }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used inside <CompareProvider>')
  return ctx
}