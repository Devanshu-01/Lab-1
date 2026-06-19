import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

// Standalone validation logic, exported so it can be unit tested in isolation.
// Returns an object whose keys are the fields that have errors.
export function validate(email, password) {
  const errors = {}

  if (!email.trim()) {
    errors.email = 'Email is required'
  } else if (!email.includes('@')) {
    errors.email = 'Email must contain "@"'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  return errors
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const signupSuccess = location.state?.signupSuccess

  const DEMO_EMAIL = 'alex@dal.ca'
  const DEMO_PASSWORD = 'password123'

  async function handleSubmit(e) {
    e.preventDefault()
    setGeneralError('')

    const newErrors = validate(email, password)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setSubmitting(true)

    const result = await login(email.trim(), password)
    setSubmitting(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setGeneralError(result.error || 'Invalid email or password.')
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

          <button type="submit" className="btn-signin" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>

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
