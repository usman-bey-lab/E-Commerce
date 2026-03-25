'use client'
import { useEffect, useState } from 'react'
import './page.css'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function DashboardPage() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/admin/stats`, {
      headers: { 'admin-token': localStorage.getItem('admin-token') }
    })
    .then(r => r.json())
    .then(data => {
      setStats(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="dash-loading">Loading dashboard...</div>

  return (
    <div className="dashboard">
      <h1 className="dash-title">Dashboard</h1>
      <p className="dash-sub">Welcome back! Here's what's happening in your store.</p>

      {/* ── Stat cards ── */}
      <div className="dash-cards">
        <div className="dash-card">
          <div className="dash-card-icon" style={{background:'#EEF4FF'}}>📦</div>
          <div className="dash-card-info">
            <p>Total Orders</p>
            <h2>{stats.totalOrders}</h2>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon" style={{background:'#F0FDF4'}}>💰</div>
          <div className="dash-card-info">
            <p>Total Revenue</p>
            <h2>${stats.totalRevenue.toFixed(2)}</h2>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon" style={{background:'#FFF7ED'}}>👥</div>
          <div className="dash-card-info">
            <p>Total Users</p>
            <h2>{stats.totalUsers}</h2>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon" style={{background:'#FDF4FF'}}>👕</div>
          <div className="dash-card-info">
            <p>Total Products</p>
            <h2>{stats.totalProducts}</h2>
          </div>
        </div>
      </div>

      {/* ── Last 7 days chart ── */}
      <div className="dash-chart-box">
        <h3>Last 7 Days Revenue</h3>
        <div className="dash-chart">
          {stats.last7Days.map((day, i) => {
            const maxRevenue = Math.max(...stats.last7Days.map(d => d.revenue))
            const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0
            return (
              <div key={i} className="dash-bar-col">
                <span className="dash-bar-value">
                  {day.revenue > 0 ? `$${day.revenue.toFixed(0)}` : ''}
                </span>
                <div className="dash-bar-track">
                  <div
                    className="dash-bar"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="dash-bar-label">{day.date}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Recent orders ── */}
      <div className="dash-recent">
        <h3>Recent Orders</h3>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.last7Days.length === 0 ? (
              <tr><td colSpan={5}>No orders yet</td></tr>
            ) : (
              <tr><td colSpan={5}>View all orders in Orders section</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}