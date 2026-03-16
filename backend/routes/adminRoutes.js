import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Admin from "../models/Admin.js"
import fetchAdmin from "../middleware/fetchAdmin.js"
import Order from "../models/Order.js"
import User from "../models/User.js"
import Product from "../models/Product.js"
import PromoCode from "../models/PromoCode.js"

const router = express.Router()

// ── POST /admin/login ──
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin) {
      return res.status(401).json({ success: false, error: "Invalid credentials" })
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" })
    }
    const token = jwt.sign(
      { admin: { id: admin._id, role: admin.role } },
      process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )
    res.json({ success: true, token, name: admin.name, role: admin.role })
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" })
  }
})

// ── GET /admin/stats ── Dashboard numbers
router.get("/admin/stats", fetchAdmin, async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, orders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Order.find().select("totalAmount createdAt status")
    ])

    const totalRevenue = orders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.totalAmount, 0)

    // Last 7 days sales
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0,0,0,0))
      const dayEnd   = new Date(date.setHours(23,59,59,999))
      const dayOrders = orders.filter(o =>
        o.createdAt >= dayStart && o.createdAt <= dayEnd && o.status !== "cancelled"
      )
      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0)
      last7Days.push({
        date:    dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayRevenue,
        orders:  dayOrders.length
      })
    }

    res.json({ totalOrders, totalUsers, totalProducts, totalRevenue, last7Days })
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" })
  }
})

// ── GET /admin/orders ── All orders
router.get("/admin/orders", fetchAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" })
  }
})

// ── PUT /admin/orders/:id ── Update order status
router.put("/admin/orders/:id", fetchAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" })
  }
})

// ── GET /admin/users ── All users
router.get("/admin/users", fetchAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ date: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" })
  }
})

// ── GET /admin/promocodes ── All promo codes
router.get("/admin/promocodes", fetchAdmin, async (req, res) => {
  try {
    const codes = await PromoCode.find().sort({ createdAt: -1 })
    res.json(codes)
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" })
  }
})

router.get("/admin/users/:id/orders", fetchAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" })
  }
})

// ── POST /admin/promocodes ── Create promo code
router.post("/admin/promocodes", fetchAdmin, async (req, res) => {
  try {
    const { code, discount, type, maxUses, expiresAt } = req.body
    const promo = new PromoCode({ code, discount, type, maxUses, expiresAt })
    await promo.save()
    res.status(201).json({ success: true, promo })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: "Code already exists" })
    }
    res.status(500).json({ success: false, error: "Server error" })
  }
})

// ── PUT /admin/promocodes/:id ── Toggle active
router.put("/admin/promocodes/:id", fetchAdmin, async (req, res) => {
  try {
    const promo = await PromoCode.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    )
    res.json({ success: true, promo })
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" })
  }
})

// ── DELETE /admin/promocodes/:id ── Delete promo code
router.delete("/admin/promocodes/:id", fetchAdmin, async (req, res) => {
  try {
    await PromoCode.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" })
  }
})

export default router