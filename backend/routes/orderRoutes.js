import express from "express";
import Order from "../models/Order.js";
import PromoCode from "../models/PromoCode.js"
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();

router.post("/orders", fetchUser, async (req, res) => {
  try {
    const { items, delivery, totalAmount, promoCode } = req.body;

    // Validate delivery fields
    if (!delivery.firstName || !delivery.email || !delivery.street) {
      return res.status(400).json({
        success: false,
        error: "Please fill all delivery fields",
      });
    }

    const order = new Order({
      userId: req.user.id,
      items,
      delivery,
      totalAmount,
    });

    await order.save();

    if (promoCode) {
      await PromoCode.findOneAndUpdate(
        { code: promoCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
      )
    }

    res.status(201).json({ success: true, orderId: order._id });
  } catch (error) {
    console.error("Order error:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET /orders — get user's orders
router.get("/orders", fetchUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
