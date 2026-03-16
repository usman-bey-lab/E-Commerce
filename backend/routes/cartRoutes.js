import express from "express";
import User from "../models/User.js";
import fetchUser from "../middleware/fetchUser.js";
import PromoCode from "../models/PromoCode.js";

const router = express.Router();

// ── Helper: build default cart ──
const buildDefaultCart = () => {
  const cart = {};
  for (let i = 0; i < 301; i++) cart[i] = 0;
  return cart;
};

// ── POST /addtocart ──
router.post("/addtocart", fetchUser, async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const cartKey = size ? `${itemId}_${size}` : String(itemId);

    const userData = await User.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const current = userData.cartData[cartKey] || 0;
    userData.cartData[cartKey] = current + 1;

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
});

// ── POST /removefromcart ──
router.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const cartKey = size ? `${itemId}_${size}` : String(itemId);

    const userData = await User.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const current = userData.cartData[cartKey] || 0;
    if (current > 0) {
      userData.cartData[cartKey] = current - 1;
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
});

// ── POST /clearcart ──
router.post("/clearcart", fetchUser, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      cartData: buildDefaultCart()
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ── POST /getcart ──
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

// ── POST /validatepromo ──
router.post('/validatepromo', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Please enter a promo code' });
    }

    const promo = await PromoCode.findOne({
      code: code.toUpperCase().trim()
    });

    if (!promo) {
      return res.status(404).json({ success: false, error: 'Invalid promo code' });
    }

    if (!promo.isActive) {
      return res.status(400).json({ success: false, error: 'This promo code is no longer active' });
    }

    if (promo.expiresAt && new Date() > promo.expiresAt) {
      return res.status(400).json({ success: false, error: 'This promo code has expired' });
    }

    if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ success: false, error: 'This promo code has reached its usage limit' });
    }

    res.json({
      success: true,
      discount: promo.discount,
      type: promo.type
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;