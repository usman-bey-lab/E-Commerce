import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { body, validationResult } from "express-validator";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Multer ────────────────────────────────────────────────────
const ALLOWED_TYPES = /jpeg|jpg|png|webp/;

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../upload/images"),
  filename: (req, file, cb) => {
    cb(null, `product_${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extValid  = ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = ALLOWED_TYPES.test(file.mimetype);
  extValid && mimeValid
    ? cb(null, true)
    : cb(new Error("Only .jpg, .jpeg, .png and .webp files are allowed."), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ── POST /upload ──────────────────────────────────────────────
router.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded." });
  res.json({ success: true, image_url: `${process.env.BASE_URL}/images/${req.file.filename}` });
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes("Only")) {
    return res.status(400).json({ success: false, error: err.message });
  }
  next(err);
});

// ── POST /addproduct ──────────────────────────────────────────
router.post(
  "/addproduct",
  [
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("image").trim().notEmpty().withMessage("Image URL is required"),
    body("category").isIn(["men", "women", "kid"]).withMessage("Category must be men, women, or kid"),
    body("new_price").isFloat({ min: 0 }).withMessage("Valid new price required"),
    body("old_price").isFloat({ min: 0 }).withMessage("Valid old price required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const lastProduct = await Product.findOne().sort({ id: -1 });
      const newId = lastProduct ? lastProduct.id + 1 : 1;

      const product = new Product({
        id: newId,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
      });

      await product.save();
      res.status(201).json({ success: true, name: product.name, id: product.id });
    } catch (error) {
      console.error("Add product error:", error.message);
      res.status(500).json({ success: false, error: "Server error." });
    }
  }
);

// ── POST /removeproduct ───────────────────────────────────────
router.post(
  "/removeproduct",
  [body("id").notEmpty().withMessage("Product ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const deleted = await Product.findOneAndDelete({ id: req.body.id });
      if (!deleted)
        return res.status(404).json({ success: false, error: "Product not found." });
      res.json({ success: true, name: deleted.name });
    } catch (error) {
      console.error("Remove product error:", error.message);
      res.status(500).json({ success: false, error: "Server error." });
    }
  }
);

// ── PUT /editproduct/:id ──────────────────────────────────────
router.put(
  "/editproduct/:id",
  [
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("category").isIn(["men", "women", "kid"]).withMessage("Invalid category"),
    body("new_price").isFloat({ min: 0 }).withMessage("Valid new price required"),
    body("old_price").isFloat({ min: 0 }).withMessage("Valid old price required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const updated = await Product.findOneAndUpdate(
        { id: Number(req.params.id) },
        {
          name: req.body.name,
          category: req.body.category,
          new_price: Number(req.body.new_price),
          old_price: Number(req.body.old_price),
          available: req.body.available !== undefined ? req.body.available : true,
          ...(req.body.image && { image: req.body.image }),
        },
        { new: true }
      );

      if (!updated)
        return res.status(404).json({ success: false, error: "Product not found." });

      res.json({ success: true, product: updated });
    } catch (error) {
      console.error("Edit product error:", error.message);
      res.status(500).json({ success: false, error: "Server error." });
    }
  }
);

// ── GET /allproducts ──────────────────────────────────────────
router.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ id: 1 });
    res.json(products);
  } catch (error) {
    console.error("Fetch products error:", error.message);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ── GET /adminstats ───────────────────────────────────────────
router.get("/adminstats", async (req, res) => {
  try {
    const [totalProducts, menCount, womenCount, kidCount, recentProducts, totalUsers] =
      await Promise.all([
        Product.countDocuments({}),
        Product.countDocuments({ category: "men" }),
        Product.countDocuments({ category: "women" }),
        Product.countDocuments({ category: "kid" }),
        Product.find({}).sort({ createdAt: -1 }).limit(5),
        User.countDocuments({}),
      ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        byCategory: { men: menCount, women: womenCount, kid: kidCount },
        recentProducts,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error.message);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ── GET /newcollection ────────────────────────────────────────
router.get("/newcollection", async (req, res) => {
  try {
    const products = await Product.find({ available: true })
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(products);
  } catch (error) {
    console.error("New collection error:", error.message);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ── GET /popularinwomen ───────────────────────────────────────
router.get("/popularinwomen", async (req, res) => {
  try {
    const products = await Product.find({ category: "women", available: true })
      .sort({ id: 1 })
      .limit(4);
    res.json(products);
  } catch (error) {
    console.error("Popular in women error:", error.message);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

export default router;