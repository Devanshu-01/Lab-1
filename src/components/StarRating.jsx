// Pure display component. Receives a number, renders filled and empty stars.
function StarRating({ rating, max = 5 }) {
  const full = Math.round(rating)
  return (
    <span className="stars" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < full ? 'star-filled' : 'star-empty'}>
          {i < full ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}

export default StarRating
