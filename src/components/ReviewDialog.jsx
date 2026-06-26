import { useState } from 'react'
import { uploadImage } from '../lib/api'
import './reviews.css'

// Star rating input, text area, optional photo, submit.
// Receives onClose and onSubmit as props. When `initial` is passed the dialog
// works in edit mode: it pre-fills the rating/body and titles itself "Edit".
function ReviewDialog({ onClose, onSubmit, initial = null }) {
  const isEdit = Boolean(initial)
  const [rating, setRating] = useState(initial?.rating ?? 0)
  const [hover, setHover] = useState(0)
  const [body, setBody] = useState(initial?.body ?? '')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleFileChange(e) {
    const selected = e.target.files?.[0] || null
    if (selected && !selected.type.startsWith('image/')) {
      setError('Attachment must be an image.')
      return
    }
    setFile(selected)
    setError('')
  }

  async function handleSubmit() {
    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }
    if (!body.trim()) {
      setError('Please write a few words about your experience.')
      return
    }

    setSubmitting(true)
    try {
      // Upload the photo to the CDN first, then attach its URL to the review.
      // (Editing only changes the rating and text, so no upload there.)
      let imageUrl
      if (file && !isEdit) {
        const result = await uploadImage(file)
        imageUrl = result.url
      }
      await onSubmit({ rating, body: body.trim(), imageUrl })
      onClose()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="review-dialog">
      <h2>{isEdit ? 'Edit Your Review' : 'Write a Review'}</h2>

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

      {!isEdit && (
        <>
          <label className="dialog-label" htmlFor="review-photo">Add a photo (optional)</label>
          <input
            id="review-photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {file && <p className="dialog-file-name">{file.name}</p>}
        </>
      )}

      {error && <p className="dialog-error">{error}</p>}

      <div className="dialog-actions">
        <button className="btn-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
        <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? 'Submitting…'
            : isEdit
              ? 'Save Changes'
              : 'Submit Review'}
        </button>
      </div>
    </div>
  )
}

export default ReviewDialog
