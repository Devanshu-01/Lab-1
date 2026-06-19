import StarRating from './StarRating'

// Displays a single review. Receives all data as props. The optional onDelete
// prop adds a delete button (used on the Profile page).
function ReviewCard({ rating, body, date, author, imageUrl, onDelete }) {
  return (
    <div className="review-card">
      <div className="review-header">
        <StarRating rating={rating} />
        <span className="review-date">{date}</span>
      </div>
      <p className="review-body">{body}</p>
      {imageUrl && (
        <img className="review-image" src={imageUrl} alt="Review attachment" loading="lazy" />
      )}
      <div className="review-footer">
        <span className="review-author">{author}</span>
        {onDelete && (
          <button className="review-delete" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default ReviewCard
