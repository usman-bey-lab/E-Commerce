'use client'
import { useContext, useState } from "react"
import { ShopContext } from "@/context/ShopContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import "./checkout.css"

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function CheckoutPage() {
  const {
    cartItems,
    all_product,
    getTotalCartAmount,
    clearCart,
    promoDiscount,
  } = useContext(ShopContext)

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  const [form, setForm] = useState({
    firstName: "", lastName: "",
    email: "",    street: "",
    city: "",     state: "",
    zip: "",      country: "",
    phone: "",
  })

  // ── Build cart entries from new "itemId_size" key format ──
  const cartEntries = Object.keys(cartItems)
    .filter(key => key.includes('_') && cartItems[key] > 0)
    .map(key => {
      const [itemId, size] = key.split('_')
      const product = all_product.find(p => p.id === Number(itemId))
      if (!product) return null
      return { product, size, quantity: cartItems[key] }
    })
    .filter(Boolean)

  const subtotal   = getTotalCartAmount()
  const discount   = promoDiscount || 0
  const finalTotal = subtotal - discount

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    // ── Validation ──
    const required = ["firstName","lastName","email","street","city","state","zip","country","phone"]
    for (const field of required) {
      if (!form[field].trim()) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`)
        return
      }
    }

    // Basic email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address")
      return
    }

    if (cartEntries.length === 0) {
      setError("Your cart is empty")
      return
    }

    setError("")
    setLoading(true)

    const items = cartEntries.map(({ product, size, quantity }) => ({
      productId: product.id,
      name:      product.name,
      price:     product.new_price,
      quantity,
      size,
      image:     product.image,
    }))

    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({
          items,
          delivery:    form,
          totalAmount: finalTotal,
          promoCode:   localStorage.getItem("appliedPromoCode") || null,
        }),
      })

      const data = await res.json()

      if (data.success) {
        clearCart()
        localStorage.removeItem("appliedPromoCode")
        router.push("/order-confirmed")
      } else {
        setError(data.error || "Something went wrong. Please try again.")
      }
    } catch {
      setError("Network error. Please check your connection and try again.")
    }

    setLoading(false)
  }

  return (
    <div className="checkout">
      <h1>Checkout</h1>

      <div className="checkout-container">

        {/* ── Left: Delivery Form ── */}
        <div className="checkout-left">
          <h2>Delivery Information</h2>
          <div className="checkout-form">
            <div className="checkout-row">
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="street"
              placeholder="Street Address"
              value={form.street}
              onChange={handleChange}
            />
            <div className="checkout-row">
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
              />
            </div>
            <div className="checkout-row">
              <input
                name="zip"
                placeholder="ZIP Code"
                value={form.zip}
                onChange={handleChange}
              />
              <input
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
              />
            </div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="checkout-right">
          <h2>Order Summary</h2>

          {/* ── Cart Items ── */}
          <div className="checkout-items">
            {cartEntries.length === 0 ? (
              <p className="checkout-empty">No items in cart.</p>
            ) : (
              cartEntries.map(({ product, size, quantity }) => (
                <div key={`${product.id}_${size}`} className="checkout-item">
                  <img src={product.image} alt={product.name} />
                  <div className="checkout-item-info">
                    <p>{product.name}</p>
                    <span>Size: {size}</span>
                    <span>Qty: {quantity}</span>
                  </div>
                  <p>${(product.new_price * quantity).toFixed(2)}</p>
                </div>
              ))
            )}
          </div>

          {/* ── Totals ── */}
          <div className="checkout-total">
            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="checkout-total-row">
                <span>
                  Discount
                  {localStorage.getItem("appliedPromoCode") && (
                    <span className="checkout-promo-tag">
                      {" "}({localStorage.getItem("appliedPromoCode").toUpperCase()})
                    </span>
                  )}
                </span>
                <span className="checkout-discount">-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="checkout-total-row">
              <span>Shipping</span>
              <span className="checkout-free">Free</span>
            </div>

            <hr />

            <div className="checkout-total-row checkout-grand">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {error && <p className="checkout-error">{error}</p>}

          <button
            className="checkout-pay-btn"
            onClick={handlePlaceOrder}
            disabled={loading || cartEntries.length === 0}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

          <Link href="/cart" className="checkout-back">
            ← Back to Cart
          </Link>
        </div>

      </div>
    </div>
  )
}