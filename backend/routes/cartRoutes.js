import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();

// ── POST /addtocart ──────────────────────────────────────────
router.post(
  "/addtocart",
  fetchUser,
  [body("itemId").notEmpty().withMessage("itemId is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { itemId } = req.body;
      const userData = await User.findById(req.user.id);

      if (!userData) {
        return res.status(404).json({ success: false, error: "User not found." });
      }

      // Ensure the key exists before incrementing
      const current = userData.cartData[itemId] || 0;
      userData.cartData[itemId] = current + 1;

      await User.findByIdAndUpdate(
        req.user.id,
        { cartData: userData.cartData },
        { new: true }
      );

      res.json({ success: true, message: "Item added to cart." });
    } catch (error) {
      console.error("Add to cart error:", error.message);
      res.status(500).json({ success: false, error: "Server error." });
    }
  }
);

// ── POST /removefromcart ─────────────────────────────────────
router.post(
  "/removefromcart",
  fetchUser,
  [body("itemId").notEmpty().withMessage("itemId is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { itemId } = req.body;
      const userData = await User.findById(req.user.id);

      if (!userData) {
        return res.status(404).json({ success: false, error: "User not found." });
      }

      const current = userData.cartData[itemId] || 0;
      if (current > 0) {
        userData.cartData[itemId] = current - 1;
      }

      await User.findByIdAndUpdate(
        req.user.id,
        { cartData: userData.cartData },
        { new: true }
      );

      res.json({ success: true, message: "Item removed from cart." });
    } catch (error) {
      console.error("Remove from cart error:", error.message);
      res.status(500).json({ success: false, error: "Server error." });
    }
  }
);

// ── POST /getcart ────────────────────────────────────────────
router.post("/getcart", fetchUser, async (req, res) => {
  try {
    const userData = await User.findById(req.user.id).select("cartData");

    if (!userData) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.json(userData.cartData);
  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

export default router;