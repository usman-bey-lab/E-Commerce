import React, { useState } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImg, setSelectedImg] = useState(product.image);
  const [added, setAdded] = useState(false);

  const isLoggedIn = !!localStorage.getItem("auth-token");

  const handleAddToCart = () => {
    addToCart(product.id);
    if (isLoggedIn) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
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

        {/* Stars */}
        <div className="pd-stars">
          {[...Array(4)].map((_, i) => <img key={i} src={star_icon} alt="" />)}
          <img src={star_dull_icon} alt="" />
          <span className="pd-rating">4.0</span>
          <span className="pd-reviews">(122 reviews)</span>
        </div>

        {/* Prices */}
        <div className="pd-prices">
          <span className="pd-price-new">${product.new_price}</span>
          <span className="pd-price-old">${product.old_price}</span>
          {discount > 0 && (
            <span className="pd-discount">{discount}% off</span>
          )}
        </div>

        {/* Description */}
        <p className="pd-description">
          A lightweight, usually knitted, pullover shirt, close-fitting and with
          a round neckline and short sleeves, worn as an undershirt or outer garment.
        </p>

        {/* Size selector */}
        <div className="pd-size-section">
          <div className="pd-size-header">
            <span>Select Size</span>
            <button className="pd-size-guide">Size Guide</button>
          </div>
          <div className="pd-sizes">
            {SIZES.map((size) => (
              <button
                key={size}
                className={`pd-size-btn${selectedSize === size ? " active" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to cart */}
        <button
          className={`pd-cart-btn${added ? " added" : ""}${!isLoggedIn ? " guest" : ""}`}
          onClick={handleAddToCart}
        >
          {added
            ? "✓ Added to Cart"
            : isLoggedIn
            ? "Add to Cart"
            : "Sign In to Add to Cart"}
        </button>

        {/* Meta */}
        <div className="pd-meta">
          <p><span>Category</span> Women, T-Shirt, Crop-Top</p>
          <p><span>Tags</span> Modern, Latest</p>
        </div>

      </div>
    </div>
  );
};

export default ProductDisplay;