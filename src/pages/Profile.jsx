import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useReviews } from '../context/ReviewsContext'
import { apartments } from '../data/apartments'
import ReviewCard from '../components/ReviewCard'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { reviews, deleteReview } = useReviews()

  if (!user) return null

  const myReviews = reviews
    .filter(r => r.userEmail === user.email)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const initials =
    user.initials ||
    user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  function aptName(aptId) {
    const apt = apartments.find(a => a.id === aptId)
    return apt ? apt.name : 'Unknown apartment'
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
                  {aptName(r.aptId)}
                </Link>
                <ReviewCard
                  rating={r.rating}
                  body={r.body}
                  date={r.date}
                  author={r.author}
                  onDelete={() => deleteReview(r.id)}
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
