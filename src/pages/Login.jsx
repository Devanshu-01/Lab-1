import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser, users } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')

  const signupSuccess = location.state?.signupSuccess

  const DEMO_EMAIL = 'alex@dal.ca'
  const DEMO_PASSWORD = 'password123'

  function validate() {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!email.includes('@')) {
      newErrors.email = 'Email must contain "@"'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    setGeneralError('')
    
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    )

    if (foundUser) {
      setUser({
        name: foundUser.name,
        email: foundUser.email,
        initials: foundUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US'
      })
      navigate('/dashboard')
    } else {
      setGeneralError('Invalid email or password.')
    }
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setErrors({})
    setGeneralError('')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-logo">TenantTrails</Link>
        <p className="login-tagline">See what past tenants had to say, before you sign.</p>

        {signupSuccess && (
          <p className="login-success-alert" style={{
            fontSize: '13px',
            color: '#16a34a',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            Account created successfully! Please sign in.
          </p>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="alex@dal.ca"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); setGeneralError('') }}
            />
            {errors.email && <p className="login-error" style={{ marginTop: '4px' }}>{errors.email}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); setGeneralError('') }}
            />
            {errors.password && <p className="login-error" style={{ marginTop: '4px' }}>{errors.password}</p>}
          </div>

          {generalError && <p className="login-error">{generalError}</p>}

          <button type="submit" className="btn-signin">Sign In</button>

          <p className="login-footer">
            Don't have an account? <Link to="/signup" className="login-link">Create one</Link>
          </p>

          <div className="demo-hint" onClick={fillDemo}>
            Demo: <strong>{DEMO_EMAIL}</strong> / <strong>{DEMO_PASSWORD}</strong>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
