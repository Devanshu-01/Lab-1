import { Link } from 'react-router-dom'
import './ApartmentCard.css'

function Stars({ rating }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= Math.round(rating) ? 'star filled' : 'star'}>★</span>
      ))}
    </div>
  )
}

function ApartmentCard({ apartment }) {
  const { id, name, address, neighbourhood, rating, reviewCount, tags, imageUrl, noSummary } = apartment
  // An apartment with no reviews has a null rating from the API.
  const safeRating = rating ?? 0

  return (
    <Link to={`/apartment/${id}`} className="apt-card">
      <div className="apt-card-image">
        <img src={imageUrl} alt={name} loading="lazy" />
        <div className="apt-card-rating">
          <span className="rating-star">★</span>
          <span className="rating-num">{safeRating.toFixed(1)}</span>
        </div>
      </div>
      <div className="apt-card-body">
        <h3 className="apt-card-name">{name}</h3>
        <p className="apt-card-address">
          <span className="pin">📍</span> {address} · {neighbourhood}
        </p>
        <div className="apt-card-tags">
          {noSummary
            ? <span className="tag tag-muted">No AI summary yet</span>
            : tags.map(tag => <span key={tag} className="tag">{tag}</span>)
          }
        </div>
        <div className="apt-card-footer">
          <span className="apt-review-count">{reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
          <Stars rating={safeRating} />
        </div>
      </div>
    </Link>
  )
}

export default ApartmentCard
