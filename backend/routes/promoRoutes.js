// backend/routes/promoRoutes.js
import express from "express"
import PromoCode from "../models/PromoCode.js"

const router = express.Router()

// GET all promo codes
router.get("/admin/promocodes", async (req, res) => {
  const codes = await PromoCode.find().sort({ createdAt: -1 })
  res.json(codes)
})

// POST create promo code
router.post("/admin/promocodes", async (req, res) => {
  try {
    const { code, discount, type, maxUses, expiresAt } = req.body
    const promo = new PromoCode({ code, discount, type, maxUses, expiresAt })
    await promo.save()
    res.status(201).json({ success: true, promo })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Code already exists' })
    }
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// PUT toggle active/inactive
router.put("/admin/promocodes/:id", async (req, res) => {
  try {
    const promo = await PromoCode.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    )
    res.json({ success: true, promo })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// DELETE promo code
router.delete("/admin/promocodes/:id", async (req, res) => {
  try {
    await PromoCode.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

export default router