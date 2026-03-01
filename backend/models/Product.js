import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["men", "women", "kid"],
        message: "Category must be men, women, or kid",
      },
    },
    new_price: {
      type: Number,
      required: [true, "New price is required"],
      min: [0, "Price cannot be negative"],
    },
    old_price: {
      type: Number,
      required: [true, "Old price is required"],
      min: [0, "Price cannot be negative"],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;