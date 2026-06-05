import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useReviews } from '../context/ReviewsContext'
import { apartments } from '../data/apartments'
import ApartmentHeader from '../components/ApartmentHeader'
import AISummary from '../components/AISummary'
import ReviewCard from '../components/ReviewCard'
import ReviewDialog from '../components/ReviewDialog'
import './ApartmentDetail.css'

function ApartmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { reviews, addReview } = useReviews()
  const [showReview, setShowReview] = useState(false)

  const apt = apartments.find(a => a.id === Number(id))

  if (!apt) {
    return (
      <div className="detail-page">
        <div className="detail-notfound">
          <h2>Apartment not found</h2>
          <Link to="/dashboard" className="back-link">← Back to dashboard</Link>
        </div>
      </div>
    )
  }

  const aptReviews = reviews
    .filter(r => r.aptId === apt.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  function handleSubmit({ rating, body }) {
    addReview({
      aptId: apt.id,
      rating,
      body,
      author: user.name,
      userEmail: user.email,
    })
  }

  return (
    <div className="detail-page">
      <nav className="detail-nav">
        <Link to="/dashboard" className="detail-logo">TenantTrails</Link>
        <div className="detail-nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/profile" className="nav-link">My Profile</Link>
        </div>
      </nav>

      <main className="detail-main">
        <button className="back-link" onClick={() => navigate('/dashboard')}>
          ← Back to apartments
        </button>

        <ApartmentHeader apartment={{ ...apt, reviewCount: aptReviews.length }} />

        {!apt.noSummary && apt.aiSummary && (
          <AISummary summary={apt.aiSummary} issues={apt.tags} />
        )}

        <div className="reviews-section">
          <div className="reviews-head">
            <h2>{aptReviews.length} Review{aptReviews.length !== 1 ? 's' : ''}</h2>
            <button className="btn-write-review" onClick={() => setShowReview(true)}>
              Write a Review
            </button>
          </div>

          {aptReviews.length > 0 ? (
            <div className="reviews-list">
              {aptReviews.map(r => (
                <ReviewCard
                  key={r.id}
                  rating={r.rating}
                  body={r.body}
                  date={r.date}
                  author={r.author}
                />
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to write one.</p>
          )}
        </div>
      </main>

      {showReview && (
        <div className="modal-overlay" onClick={() => setShowReview(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <ReviewDialog
              onClose={() => setShowReview(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ApartmentDetail
