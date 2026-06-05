import { useState } from 'react'

// Star rating input, text area, submit. Receives onClose and onSubmit as props.
function ReviewDialog({ onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }
    if (!body.trim()) {
      setError('Please write a few words about your experience.')
      return
    }
    onSubmit({ rating, body: body.trim() })
    onClose()
  }

  return (
    <div className="review-dialog">
      <h2>Write a Review</h2>

      <label className="dialog-label">Your rating</label>
      <div className="star-input">
        {[1, 2, 3, 4, 5].map(n => (
          <span
            key={n}
            className={n <= (hover || rating) ? 'star-input-on' : 'star-input-off'}
            onClick={() => { setRating(n); setError('') }}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
          >
            {n <= (hover || rating) ? '★' : '☆'}
          </span>
        ))}
      </div>

      <label className="dialog-label" htmlFor="review-body">Your review</label>
      <textarea
        id="review-body"
        value={body}
        onChange={e => { setBody(e.target.value); setError('') }}
        placeholder="Share what it was like living here…"
        rows={5}
      />

      {error && <p className="dialog-error">{error}</p>}

      <div className="dialog-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-submit" onClick={handleSubmit}>Submit Review</button>
      </div>
    </div>
  )
}

export default ReviewDialog
