'use client'
import { useState, useEffect } from 'react'
import './Reviews.css'

const StarRating = ({ rating, onRate, readonly = false }) => {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`review-star ${star <= (hovered || rating) ? 'filled' : 'empty'} ${!readonly ? 'clickable' : ''}`}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function Reviews({ productId, selectedRating = 0, onRatingChange }) {
  const [reviews, setReviews]           = useState([])  // ← add this
  const [avgRating, setAvgRating]       = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [comment, setComment]           = useState('')
  const [submitting, setSubmitting]     = useState(false)
  const [error, setError]               = useState('')
  const [isLoggedIn, setIsLoggedIn]     = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('auth-token'))
  }, [])

  const fetchReviews = () => {
    fetch(`http://localhost:4000/reviews/${productId}`)
      .then(r => r.json())
      .then(data => {
        setReviews(data.reviews)
        setAvgRating(data.avgRating)
        setTotalReviews(data.totalReviews)
      })
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      setError('Please select a star rating above the product')
      return
    }
    if (!comment.trim()) {
      setError('Please write a comment')
      return
    }
    setError('')
    setSubmitting(true)

    const res = await fetch(`http://localhost:4000/reviews/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token')
      },
      body: JSON.stringify({ rating: selectedRating, comment })
    })

    const data = await res.json()
    if (data.success) {
      setComment('')
      if (onRatingChange) onRatingChange(0)
      fetchReviews()
    }
    setSubmitting(false)
  }

  return (
    <div className="reviews">

      {/* ── Header ── */}
      <div className="reviews-header">
        <h2>Reviews ({totalReviews})</h2>
        <div className="reviews-summary">
          <StarRating rating={Math.round(avgRating)} readonly={true} />
          <span className="reviews-avg-text">{avgRating} out of 5</span>
        </div>
      </div>

      {/* ── Write a Review ── */}
      {isLoggedIn ? (
        <div className="reviews-form">
          <h3>Write a Review</h3>
          {selectedRating > 0 && (
            <p className="reviews-selected-rating">
              Your rating: {'★'.repeat(selectedRating)}{'☆'.repeat(5 - selectedRating)}
            </p>
          )}
          <textarea
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          {error && <p className="reviews-error">{error}</p>}
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      ) : (
        <div className="reviews-login-prompt">
          <p>Please <a href='/login'>sign in</a> to write a review.</p>
        </div>
      )}

      {/* ── Reviews List ── */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="reviews-empty">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <div className="review-header-left">
                  <span className="review-username">{review.username}</span>
                  <div className="star-rating">
                    {[1,2,3,4,5].map(star => (
                      <span
                        key={star}
                        className={`review-star ${star <= review.rating ? 'filled' : 'empty'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>

    </div>
  )
}