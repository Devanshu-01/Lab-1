import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import ReviewCard from '../components/ReviewCard'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [myReviews, setMyReviews] = useState([])

  // Load the current user's reviews (apartment name is joined in by the API).
  useEffect(() => {
    let active = true
    api.myReviews()
      .then(data => { if (active) setMyReviews(data) })
      .catch(() => { if (active) setMyReviews([]) })
    return () => { active = false }
  }, [])

  if (!user) return null

  const initials =
    user.initials ||
    user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  async function handleDelete(reviewId) {
    await api.deleteReview(reviewId)
    setMyReviews(prev => prev.filter(r => r.id !== reviewId))
  }

  function handleSignOut() {
    logout()
    navigate('/login')
  }

  return (
    <div className="profile-page">
      <nav className="profile-nav">
        <Link to="/dashboard" className="profile-logo">TenantTrails</Link>
        <div className="profile-nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <button className="btn-signout" onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>

      <main className="profile-main">
        <section className="profile-card">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </section>

        <h2 className="profile-reviews-title">
          My Reviews ({myReviews.length})
        </h2>

        {myReviews.length > 0 ? (
          <div className="profile-reviews">
            {myReviews.map(r => (
              <div key={r.id} className="profile-review-item">
                <Link to={`/apartment/${r.aptId}`} className="profile-review-apt">
                  {r.aptName || 'Unknown apartment'}
                </Link>
                <ReviewCard
                  rating={r.rating}
                  body={r.body}
                  date={r.date}
                  author={r.author}
                  imageUrl={r.imageUrl}
                  onDelete={() => handleDelete(r.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="profile-empty">
            You haven't written any reviews yet.{' '}
            <Link to="/dashboard" className="login-link">Browse apartments</Link> to add one.
          </p>
        )}
      </main>
    </div>
  )
}

export default Profile
