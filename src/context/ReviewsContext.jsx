import { createContext, useContext, useState } from 'react'
import { initialReviews } from '../data/reviews'

const ReviewsContext = createContext()

// Holds all reviews in state so that submitting a new review (from the
// Apartment Detail modal) or deleting one (from the Profile page) re-renders
// the UI. Persisted to localStorage so changes survive a page refresh.
export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('tt_reviews')
    return saved ? JSON.parse(saved) : initialReviews
  })

  function persist(next) {
    setReviews(next)
    localStorage.setItem('tt_reviews', JSON.stringify(next))
  }

  function addReview({ aptId, rating, body, author, userEmail }) {
    const nextId = reviews.length ? Math.max(...reviews.map(r => r.id)) + 1 : 1
    const newReview = {
      id: nextId,
      aptId: Number(aptId),
      rating,
      body,
      date: new Date().toISOString().slice(0, 10),
      author,
      userEmail,
    }
    persist([newReview, ...reviews])
  }

  function deleteReview(reviewId) {
    persist(reviews.filter(r => r.id !== reviewId))
  }

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, deleteReview }}>
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviews() {
  return useContext(ReviewsContext)
}
