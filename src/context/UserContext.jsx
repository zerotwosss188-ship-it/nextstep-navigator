import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Load from sessionStorage on first mount
    try {
      const saved = sessionStorage.getItem('nsn-user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Persist to sessionStorage whenever user changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('nsn-user', JSON.stringify(user))
    } else {
      sessionStorage.removeItem('nsn-user')
    }
  }, [user])

  const loginUser = (userData) => setUser(userData)
  const logoutUser = () => setUser(null)

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook for convenience
export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used inside <UserProvider>')
  return ctx
}