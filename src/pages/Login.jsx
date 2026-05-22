import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const DEMO_EMAIL = 'alex@dal.ca'
  const DEMO_PASSWORD = 'password123'

  function handleSubmit(e) {
    e.preventDefault()
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      onLogin({ name: 'Alex', email, initials: 'AM' })
      navigate('/dashboard')
    } else {
      setError('Invalid email or password. Try the demo credentials below.')
    }
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-logo">TenantTrails</Link>
        <p className="login-tagline">See what past tenants had to say, before you sign.</p>

        <div className="login-form">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="alex@dal.ca"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="btn-signin" onClick={handleSubmit}>Sign In</button>

          <p className="login-footer">
            Don't have an account? <span className="login-link" onClick={() => {}}>Create one</span>
          </p>

          <div className="demo-hint" onClick={fillDemo}>
            Demo: <strong>alex@dal.ca</strong> / <strong>password123</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
