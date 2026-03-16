// backend/models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username:  { type: String, required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Review", reviewSchema);  