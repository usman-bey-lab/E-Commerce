'use client'
import React, { useContext, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "@/context/ShopContext";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const CartItems = () => {
  const {
    getTotalCartAmount,
    all_product,
    cartItems,
    removeFromCart,
    setPromoDiscount,
  } = useContext(ShopContext);

  const [promoCode, setPromoCode]       = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError]     = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = getTotalCartAmount();

  const getDiscount = () => {
    if (!promoApplied) return 0;
    if (promoApplied.type === "percent") {
      return (subtotal * promoApplied.discount) / 100;
    }
    return Math.min(promoApplied.discount, subtotal);
  };

  const discount   = getDiscount();
  const finalTotal = subtotal - discount;

  // Only count new format keys (itemId_size)
  const hasItems = Object.keys(cartItems).some(
    key => key.includes('_') && cartItems[key] > 0
  )

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }
    setPromoLoading(true);
    setPromoError("");
    setPromoApplied(null);

    const res = await fetch(`${API}/validatepromo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode }),
    });

    const data = await res.json();

    if (data.success) {
      setPromoApplied(data);
      setPromoError("");
      const disc = data.type === "percent"
        ? (subtotal * data.discount) / 100
        : Math.min(data.discount, subtotal);
      setPromoDiscount(disc);
    } else {
      setPromoError(data.error || "Invalid promo code");
    }
    setPromoLoading(false);
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoCode("");
    setPromoError("");
    setPromoDiscount(0);
  };

  return (
    <div className="cartitems">

      {/* ── Empty state ── */}
      {!hasItems ? (
        <div className="cartitems-empty">
          <p>Your cart is empty.</p>
          <Link href="/">
            <button className="cartitems-shop-btn">Continue Shopping</button>
          </Link>
        </div>
      ) : (
        <>
          {/* ── Table header ── */}
          <div className="cartitems-header">
            <span>Product</span>
            <span>Name</span>
            <span>Price</span>
            <span>Qty</span>
            <span>Total</span>
            <span>Remove</span>
          </div>
          <hr />

          {/* ── Cart rows ── */}
          {Object.keys(cartItems)
            .filter(key => key.includes('_') && cartItems[key] > 0)
            .map(key => {
              const [itemId, size] = key.split('_')
              const product = all_product.find(p => p.id === Number(itemId))
              if (!product) return null
              return (
                <div key={key}>
                  <div className="cartitems-row">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="cartitems-img"
                    />
                    <div className="cartitems-name-size">
                      <p className="cartitems-name">{product.name}</p>
                      {size && (
                        <span className="cartitems-size-badge">Size: {size}</span>
                      )}
                    </div>
                    <p>${product.new_price}</p>
                    <span className="cartitems-qty">{cartItems[key]}</span>
                    <p>${(product.new_price * cartItems[key]).toFixed(2)}</p>
                    <button
                      className="cartitems-remove"
                      onClick={() => removeFromCart(Number(itemId), size)}
                      aria-label={`Remove ${product.name}`}
                    >
                      ✕
                    </button>
                  </div>
                  <hr />
                </div>
              )
            })
          }

          {/* ── Bottom section ── */}
          <div className="cartitems-bottom">

            {/* ── Order summary ── */}
            <div className="cartitems-summary">
              <h2>Order Summary</h2>

              <div className="cartitems-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {promoApplied && (
                <div className="cartitems-summary-row cartitems-discount-row">
                  <span>
                    Discount
                    <span className="cartitems-promo-tag">
                      {promoCode.toUpperCase()}
                      {promoApplied.type === "percent"
                        ? ` (-${promoApplied.discount}%)`
                        : ` (-$${promoApplied.discount})`}
                    </span>
                  </span>
                  <span className="cartitems-discount-amount">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="cartitems-summary-row">
                <span>Shipping</span>
                <span className="cartitems-free">Free</span>
              </div>

              <hr />

              <div className="cartitems-summary-row cartitems-summary-total">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              <Link href="/checkout">
                <button className="cartitems-checkout-btn">
                  Proceed to Checkout
                </button>
              </Link>
            </div>

            {/* ── Promo code ── */}
            <div className="cartitems-promo">
              <p>Have a promo code?</p>

              {promoApplied ? (
                <div className="cartitems-promo-applied">
                  <span className="cartitems-promo-success">
                    ✓ {promoCode.toUpperCase()} applied!
                    {promoApplied.type === "percent"
                      ? ` ${promoApplied.discount}% off`
                      : ` $${promoApplied.discount} off`}
                  </span>
                  <button
                    className="cartitems-promo-remove"
                    onClick={handleRemovePromo}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="cartitems-promobox">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                  />
                  <button onClick={handleApplyPromo} disabled={promoLoading}>
                    {promoLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}

              {promoError && (
                <p className="cartitems-promo-error">{promoError}</p>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default CartItems;
