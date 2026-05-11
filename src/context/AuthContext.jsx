import { createContext, useContext, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = sessionStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null
  })


  const login = async (username, password) => {
    const encoded = btoa(`${username}:${password}`)
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Basic ${encoded}` }
    })
    if (!res.ok) throw new Error('Credenciales incorrectas')
    const userData = await res.json()
    const user = { ...userData, authHeader: encoded }
    sessionStorage.setItem('currentUser', JSON.stringify(user))
    setCurrentUser(user)
  }

  const logout = () => {
    sessionStorage.removeItem('currentUser')
    setCurrentUser(null)
  }

  const getAuthHeader = () => {
    if (!currentUser) return {}
    return { Authorization: `Basic ${currentUser.authHeader}` }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!currentUser, currentUser, login, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
