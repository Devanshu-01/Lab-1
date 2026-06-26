import StarRating from './StarRating'
import { optimized } from '../lib/images'
import './reviews.css'

// Displays a single review. Receives all data as props. The optional onDelete
// and onEdit props add the corresponding buttons (used on the Profile page).
function ReviewCard({ rating, body, date, author, imageUrl, onDelete, onEdit }) {
  return (
    <div className="review-card">
      <div className="review-header">
        <StarRating rating={rating} />
        <span className="review-date">{date}</span>
      </div>
      <p className="review-body">{body}</p>
      {imageUrl && (
        <img
          className="review-image"
          src={optimized(imageUrl)}
          alt="Review attachment"
          loading="lazy"
        />
      )}
      <div className="review-footer">
        <span className="review-author">{author}</span>
        <div className="review-actions">
          {onEdit && (
            <button className="review-edit" onClick={onEdit}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="review-delete" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
