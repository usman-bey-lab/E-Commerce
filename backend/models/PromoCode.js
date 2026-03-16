// backend/models/PromoCode.js
import mongoose from "mongoose"

const promoCodeSchema = new mongoose.Schema({
  code:       { type: String, required: true, unique: true, uppercase: true },
  discount:   { type: Number, required: true },
  type:       { type: String, enum: ['percent', 'fixed'], required: true },
  maxUses:    { type: Number, default: null },  // null = unlimited
  usedCount:  { type: Number, default: 0 },
  expiresAt:  { type: Date, default: null },    // null = never expires
  isActive:   { type: Boolean, default: true },
  createdAt:  { type: Date, default: Date.now }
})

export default mongoose.model("PromoCode", promoCodeSchema)