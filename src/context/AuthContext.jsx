import { createContext, useContext, useState } from 'react'
import { api, setToken } from '../lib/api'

const AuthContext = createContext()

// Auth now talks to the backend API. The JWT is stored in localStorage (via the
// api client) and the current user is cached so a refresh keeps you signed in.
export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    const saved = localStorage.getItem('tt_current_user')
    return saved ? JSON.parse(saved) : null
  })

  function setUser(userData) {
    setUserState(userData)
    if (userData) {
      localStorage.setItem('tt_current_user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('tt_current_user')
    }
  }

  function storeSession({ token, user: u }) {
    setToken(token)
    const withInitials = {
      ...u,
      initials:
        u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US',
    }
    setUser(withInitials)
    return withInitials
  }

  // Returns { success, error }.
  async function login(email, password) {
    try {
      const data = await api.login({ email, password })
      storeSession(data)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' }
    }
  }

  // Returns { success, error }. Creates the account on the server.
  async function registerUser({ name, email, password }) {
    try {
      await api.signup({ name, email, password })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Signup failed' }
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
