import React, { useContext, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import { Link } from "react-router-dom";

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } =
    useContext(ShopContext);
  const [promoCode, setPromoCode] = useState("");

  const cartProducts = all_product.filter((e) => cartItems[e.id] > 0);

  return (
    <div className="cartitems">

      {/* ── Empty state ── */}
      {cartProducts.length === 0 ? (
        <div className="cartitems-empty">
          <p>Your cart is empty.</p>
          <Link to="/">
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
          {cartProducts.map((e) => (
            <div key={e.id}>
              <div className="cartitems-row">
                <img src={e.image} alt={e.name} className="cartitems-img" />
                <p className="cartitems-name">{e.name}</p>
                <p>${e.new_price}</p>
                <span className="cartitems-qty">{cartItems[e.id]}</span>
                <p>${(e.new_price * cartItems[e.id]).toFixed(2)}</p>
                <button
                  className="cartitems-remove"
                  onClick={() => removeFromCart(e.id)}
                  aria-label={`Remove ${e.name}`}
                >
                  ✕
                </button>
              </div>
              <hr />
            </div>
          ))}

          {/* ── Bottom section ── */}
          <div className="cartitems-bottom">

            {/* Order summary */}
            <div className="cartitems-summary">
              <h2>Order Summary</h2>
              <div className="cartitems-summary-row">
                <span>Subtotal</span>
                <span>${getTotalCartAmount().toFixed(2)}</span>
              </div>
              <div className="cartitems-summary-row">
                <span>Shipping</span>
                <span className="cartitems-free">Free</span>
              </div>
              <hr />
              <div className="cartitems-summary-row cartitems-summary-total">
                <span>Total</span>
                <span>${getTotalCartAmount().toFixed(2)}</span>
              </div>
              <button className="cartitems-checkout-btn">
                Proceed to Checkout
              </button>
            </div>

            {/* Promo code */}
            <div className="cartitems-promo">
              <p>Have a promo code?</p>
              <div className="cartitems-promobox">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button>Apply</button>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default CartItems;