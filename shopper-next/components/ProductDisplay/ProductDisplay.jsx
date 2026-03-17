'use client'
import React, { useState, useContext, useEffect } from "react";
import "./ProductDisplay.css";
import { ShopContext } from "@/context/ShopContext";

const SIZES = ["S", "M", "L", "XL", "XXL"];

// ── Star Rating Component ──
const StarRating = ({ rating, onRate, readonly = false }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="pd-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`pd-star ${star <= (hovered || rating) ? "filled" : "empty"} ${
            !readonly ? "clickable" : ""
          }`}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// ── Main Component ──
const ProductDisplay = ({
  product,
  avgRating = 0,
  totalReviews = 0,
  onRate,
  userRating = 0,
}) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImg,  setSelectedImg]  = useState(product.image);
  const [added,        setAdded]        = useState(false);
  const [sizeError,    setSizeError]    = useState("");
  const [isLoggedIn,   setIsLoggedIn]   = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("auth-token"));
  }, []);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError("");
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError("Please select a size before adding to cart");
      return;
    }
    setSizeError("");
    addToCart(product.id, selectedSize);
    if (isLoggedIn) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  // Star click ONLY updates selectedRating in parent (product/[id]/page.js)
  // The actual review POST is done inside Reviews.jsx "Submit Review" button
  const handleRate = (star) => {
    if (onRate) onRate(star);
  };

  const discount = Math.round(
    ((product.old_price - product.new_price) / product.old_price) * 100
  );

  return (
    <div className="productdisplay">

      {/* ── Left: images ── */}
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {[product.image, product.image, product.image, product.image].map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className={selectedImg === img ? "thumb-active" : ""}
              onClick={() => setSelectedImg(img)}
            />
          ))}
        </div>
        <div className="productdisplay-main-img">
          <img src={selectedImg} alt={product.name} />
        </div>
      </div>

      {/* ── Right: details ── */}
      <div className="productdisplay-right">
        <h1 className="pd-name">{product.name}</h1>

        {/* ── Stars Row ── */}
        <div className="pd-rating-row">
          <StarRating
            rating={userRating || Math.round(avgRating)}
            onRate={handleRate}
            readonly={!isLoggedIn}
          />
          <span className="pd-rating">
            {avgRating > 0 ? avgRating : "No ratings yet"}
          </span>
          <span className="pd-reviews">({totalReviews} reviews)</span>
        </div>

        {/* Star selected hint — no Submit Rating button, submit is in Reviews below */}
        {userRating > 0 && (
          <p className="pd-rating-hint">
            {"★".repeat(userRating)}{"☆".repeat(5 - userRating)} selected —
            scroll down to write your review and submit
          </p>
        )}

        {/* ── Prices ── */}
        <div className="pd-prices">
          <span className="pd-price-new">${product.new_price}</span>
          <span className="pd-price-old">${product.old_price}</span>
          {discount > 0 && (
            <span className="pd-discount">{discount}% off</span>
          )}
        </div>

        {/* ── Description ── */}
        <p className="pd-description">
          A lightweight, usually knitted, pullover shirt, close-fitting and
          with a round neckline and short sleeves, worn as an undershirt or
          outer garment.
        </p>

        {/* ── Size selector ── */}
        <div className="pd-size-section">
          <div className="pd-size-header">
            <span>Select Size</span>
            <button className="pd-size-guide">Size Guide</button>
          </div>
          <div className="pd-sizes">
            {SIZES.map((size) => (
              <button
                key={size}
                className={`pd-size-btn${selectedSize === size ? " active" : ""}${
                  sizeError && !selectedSize ? " pd-size-btn--error" : ""
                }`}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </button>
            ))}
          </div>
          {sizeError && <p className="pd-size-error">{sizeError}</p>}
        </div>

        {/* ── Add to cart ── */}
        <button
          className={`pd-cart-btn${added ? " added" : ""}${
            !isLoggedIn ? " guest" : ""
          }`}
          onClick={handleAddToCart}
        >
          {added
            ? "✓ Added to Cart"
            : isLoggedIn
            ? "Add to Cart"
            : "Sign In to Add to Cart"}
        </button>

        {/* ── Meta ── */}
        <div className="pd-meta">
          <p><span>Category</span> Women, T-Shirt, Crop-Top</p>
          <p><span>Tags</span> Modern, Latest</p>
        </div>

      </div>
    </div>
  );
};

export default ProductDisplay;