import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import promoRoutes from "./routes/promoRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3001", "http://localhost:3002",
    process.env.ADMIN_URL || "http://localhost:5173",
  ],
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "auth-token", "admin-token"],
}));

// ── Body parser MUST come before routes ──────────────────────
app.use(express.json({ limit: "10kb" }));

// ── Connect to MongoDB ───────────────────────────────────────
connectDB();

// ── Static image files ───────────────────────────────────────
app.use("/images", express.static(path.join(__dirname, "upload/images")));

// ── Health check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Shopper API is running." });
});

// ── Routes ── (all AFTER body parser) ────────────────────────
app.use("/", productRoutes);
app.use("/", userRoutes);
app.use("/", cartRoutes);
app.use("/", reviewRoutes);
app.use("/", orderRoutes);  
app.use("/", promoRoutes)
app.use("/", adminRoutes)

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found." });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, error: "Something went wrong." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});