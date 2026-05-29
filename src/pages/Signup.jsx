import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Signup() {
  const navigate = useNavigate()
  const { registerUser } = useAuth()
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})

  function validate() {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!form.email.includes('@')) {
      newErrors.email = 'Email must contain "@"'
    }

    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
    }

    const result = registerUser(newUser)
    if (!result.success) {
      setErrors({ email: result.error })
      return
    }

    navigate('/login', { state: { signupSuccess: true } })
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-logo">TenantTrails</Link>
        <p className="login-tagline">Create an account to start reviewing apartments.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Alex Smith"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className="login-error" style={{ marginTop: '4px' }}>{errors.name}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="alex@dal.ca"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="login-error" style={{ marginTop: '4px' }}>{errors.email}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <p className="login-error" style={{ marginTop: '4px' }}>{errors.password}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="login-error" style={{ marginTop: '4px' }}>{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn-signin" style={{ marginTop: '8px' }}>Create Account</button>

          <p className="login-footer">
            Already have an account? <Link to="/login" className="login-link">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
