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
          className={`review-star ${star <= (hovered || rating) ? 'filled' : 'empty'} ${
            !readonly ? 'clickable' : ''
          }`}
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

export default function Reviews({
  productId,
  selectedRating = 0,   // star rating selected in ProductDisplay, passed down from page.js
  onRatingChange,       // resets star to 0 after submit
  onReviewSubmitted,    // refreshes avgRating in page.js after submit
}) {
  const [reviews,      setReviews]      = useState([])
  const [avgRating,    setAvgRating]    = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [comment,      setComment]      = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [error,        setError]        = useState('')
  const [successMsg,   setSuccessMsg]   = useState('')
  const [isLoggedIn,   setIsLoggedIn]   = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('auth-token'))
  }, [])

  const fetchReviews = () => {
    fetch(`http://localhost:4000/reviews/${productId}`)
      .then(r => r.json())
      .then(data => {
        setReviews(data.reviews       ?? [])
        setAvgRating(data.avgRating   ?? 0)
        setTotalReviews(data.totalReviews ?? 0)
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  // ── This is the ONLY place a review is POSTed to the API ──
  const handleSubmit = async () => {
    if (!selectedRating || selectedRating === 0) {
      setError('Please click a star above the product image to set your rating first')
      return
    }
    if (!comment.trim()) {
      setError('Please write a comment before submitting')
      return
    }

    setError('')
    setSuccessMsg('')
    setSubmitting(true)

    try {
      const res = await fetch(`http://localhost:4000/reviews/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({
          rating:  selectedRating,
          comment: comment.trim(),
        }),
      })

      const data = await res.json()

      if (data.success) {
        setComment('')
        setSuccessMsg('✓ Your review has been submitted!')
        if (onRatingChange)     onRatingChange(0)      // reset star selection
        if (onReviewSubmitted)  onReviewSubmitted()    // refresh avgRating in page.js
        fetchReviews()                                 // refresh review list
        setTimeout(() => setSuccessMsg(''), 3500)
      } else {
        setError(data.error || 'Failed to submit. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection.')
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
          <span className="reviews-avg-text">
            {avgRating > 0 ? `${avgRating} out of 5` : 'No ratings yet'}
          </span>
        </div>
      </div>

      {/* ── Write a Review ── */}
      {isLoggedIn ? (
        <div className="reviews-form">
          <h3>Write a Review</h3>

          {/* Shows star rating selected from ProductDisplay above */}
          {selectedRating > 0 ? (
            <p className="reviews-selected-rating">
              Your rating: {'★'.repeat(selectedRating)}{'☆'.repeat(5 - selectedRating)} ({selectedRating}/5)
            </p>
          ) : (
            <p className="reviews-rating-prompt">
             
            </p>
          )}

          <textarea
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />

          {error      && <p className="reviews-error">{error}</p>}
          {successMsg && <p className="reviews-success">{successMsg}</p>}

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
          <p className="reviews-empty">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <div className="review-header-left">
                  <span className="review-username">{review.username}</span>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
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