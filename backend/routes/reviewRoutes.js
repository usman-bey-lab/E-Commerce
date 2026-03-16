// backend/routes/reviewRoutes.js
import express from "express";
import Review from "../models/Review.js";
import fetchUser from "../middleware/fetchUser.js";
import User from "../models/User.js";

const router = express.Router();

// GET /reviews/:productId — get all reviews for a product
router.get("/reviews/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ 
      productId: req.params.productId 
    }).sort({ createdAt: -1 })

    // Calculate average rating
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0

    res.json({ reviews, avgRating, totalReviews: reviews.length })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// POST /reviews/:productId — add a review (requires login)
router.post("/reviews/:productId", fetchUser, async (req, res) => {
  try {
    const { rating, comment } = req.body
    const user = await User.findById(req.user.id)

    const review = new Review({
      productId: req.params.productId,
      userId: req.user.id,
      username: user.name,
      rating,
      comment
    })

    await review.save()
    res.status(201).json({ success: true, review })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

export default router