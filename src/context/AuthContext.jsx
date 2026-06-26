import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext()

// Adds initials used by the avatar UI.
function decorate(u) {
  if (!u) return null
  return {
    ...u,
    initials:
      u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US',
  }
}

// Auth talks to the backend over an httpOnly cookie. The token is never stored
// in JavaScript; on load we ask the API who we are (the cookie rides along), so
// a refresh keeps the user signed in without any localStorage token.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true until the /me check resolves

  // On first load, ask the API who you are. The cookie is sent automatically.
  useEffect(() => {
    let active = true
    api.me()
      .then(data => { if (active) setUser(decorate(data?.user ?? null)) })
      .catch(() => { if (active) setUser(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  // Returns { success, error }.
  async function login(email, password) {
    try {
      const data = await api.login({ email, password })
      setUser(decorate(data.user))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' }
    }
  }

  // Returns { success, error }. Creates the account on the server.
  // Signup also sets the cookie, but we keep the existing "log in after signup"
  // flow, so we clear it and let the user sign in explicitly.
  async function registerUser({ name, email, password }) {
    try {
      await api.signup({ name, email, password })
      await api.logout().catch(() => {})
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Signup failed' }
    }
  }

  async function logout() {
    try {
      await api.logout()
    } catch {
      // ignore network errors on logout
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, registerUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
