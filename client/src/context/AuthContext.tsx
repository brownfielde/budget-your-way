import { createContext, useState, useEffect } from 'react'
import { User } from '../types'

export const AuthContext = createContext<{
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
} | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('user')
    if (s) {
      try { setUser(JSON.parse(s)) }
      catch { localStorage.removeItem('user') }
    }
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1000))
      const u: User = { id: '1', name: email.split('@')[0] || 'User', email }
      setUser(u)
      localStorage.setItem('user', JSON.stringify(u))
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('demoMode')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}