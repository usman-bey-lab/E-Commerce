'use client'
import Link from 'next/link'
import './order-confirmed.css'

export default function OrderConfirmedPage() {
  return (
    <div className="order-confirmed">
      <div className="order-confirmed-box">
        <div className="order-confirmed-icon">✓</div>
        <h1>Order Placed!</h1>
        <p>Thank you for your purchase. Your order has been received and is being processed.</p>
        <div className="order-confirmed-actions">
          <Link href="/">
            <button className="order-confirmed-btn">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}