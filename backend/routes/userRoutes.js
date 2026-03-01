import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";

const router = express.Router();

// ── Rate limiter: max 10 auth attempts per 15 minutes per IP ──
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: "Too many attempts. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Helper: build default cart ──────────────────────────────
const buildDefaultCart = () => {
  const cart = {};
  for (let i = 0; i < 301; i++) cart[i] = 0;
  return cart;
};

// ── POST /signup ─────────────────────────────────────────────
router.post(
  "/signup",
  authLimiter,
  [
    body("username")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be 2–50 characters"),
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    // Return validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      // Check if email already exists
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ success: false, error: "An account with this email already exists." });
      }

      // Hash password
      const salt = await bcrypt.genSalt(12); // 12 rounds is the recommended balance
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = new User({
        name: username,
        email: email.toLowerCase(),
        password: hashedPassword,
        cartData: buildDefaultCart(),
      });
      await user.save();

      // Sign token with expiry
      const token = jwt.sign(
        { user: { id: user._id } },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.status(201).json({ success: true, token });
    } catch (error) {
      console.error("Signup error:", error.message);
      res.status(500).json({ success: false, error: "Server error. Please try again." });
    }
  }
);

// ── POST /login ──────────────────────────────────────────────
router.post(
  "/login",
  authLimiter,
  [
    body("email").trim().isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Generic message — don't reveal whether the email exists
        return res.status(401).json({ success: false, error: "Invalid email or password." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: "Invalid email or password." });
      }

      const token = jwt.sign(
        { user: { id: user._id } },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.json({ success: true, token });
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({ success: false, error: "Server error. Please try again." });
    }
  }
);

export default router;