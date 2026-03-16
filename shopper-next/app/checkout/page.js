'use client'
import { useContext, useState } from "react"
import { ShopContext } from "@/context/ShopContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import "./checkout.css"

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

  const cartProducts = all_product.filter((p) => cartItems[p.id] > 0)
  const subtotal     = getTotalCartAmount()
  const discount     = promoDiscount || 0
  const finalTotal   = subtotal - discount

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    const required = ["firstName","lastName","email","street","city","state","zip","country","phone"]
    for (const field of required) {
      if (!form[field].trim()) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`)
        return
      }
    }

    setError("")
    setLoading(true)

    const items = cartProducts.map((p) => ({
      productId: p.id,
      name:      p.name,
      price:     p.new_price,
      quantity:  cartItems[p.id],
      image:     p.image,
    }))

    const res = await fetch("http://localhost:4000/orders", {
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
      router.push("/order-confirmed")
    } else {
      setError(data.error || "Something went wrong")
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
              <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
              <input name="lastName"  placeholder="Last Name"  value={form.lastName}  onChange={handleChange} />
            </div>
            <input name="email"  type="email" placeholder="Email Address"  value={form.email}  onChange={handleChange} />
            <input name="street" placeholder="Street Address"               value={form.street} onChange={handleChange} />
            <div className="checkout-row">
              <input name="city"  placeholder="City"  value={form.city}  onChange={handleChange} />
              <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
            </div>
            <div className="checkout-row">
              <input name="zip"     placeholder="ZIP Code" value={form.zip}     onChange={handleChange} />
              <input name="country" placeholder="Country"  value={form.country} onChange={handleChange} />
            </div>
            <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="checkout-right">
          <h2>Order Summary</h2>

          <div className="checkout-items">
            {cartProducts.map((p) => (
              <div key={p.id} className="checkout-item">
                <img src={p.image} alt={p.name} />
                <div className="checkout-item-info">
                  <p>{p.name}</p>
                  <span>Qty: {cartItems[p.id]}</span>
                </div>
                <p>${(p.new_price * cartItems[p.id]).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="checkout-total">
            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {/* Show discount only if promo was applied */}
            {discount > 0 && (
              <div className="checkout-total-row">
                <span>Discount</span>
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
            disabled={loading}
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