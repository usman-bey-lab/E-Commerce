'use client'
import { useEffect, useState } from 'react'
import '../page.css'
import './stats.css'

export default function StatsPage() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:4000/admin/stats', {
      headers: { 'admin-token': localStorage.getItem('admin-token') }
    })
    .then(r => r.json())
    .then(data => { setStats(data); setLoading(false) })
  }, [])

  if (loading) return <div className="dash-loading">Loading stats...</div>

  const maxRevenue = Math.max(...stats.last7Days.map(d => d.revenue), 1)

  return (
    <div className="stats-page">
      <h1 className="dash-title">Sales Stats</h1>
      <p className="dash-sub">Revenue and order analytics</p>

      {/* ── Summary cards ── */}
      <div className="stats-cards">
        <div className="stats-card" style={{'--accent':'#6079ff'}}>
          <div className="stats-card-icon">💰</div>
          <div>
            <p className="stats-card-label">Total Revenue</p>
            <h2 className="stats-card-value">${stats.totalRevenue.toFixed(2)}</h2>
          </div>
        </div>
        <div className="stats-card" style={{'--accent':'#22c55e'}}>
          <div className="stats-card-icon">📦</div>
          <div>
            <p className="stats-card-label">Total Orders</p>
            <h2 className="stats-card-value">{stats.totalOrders}</h2>
          </div>
        </div>
        <div className="stats-card" style={{'--accent':'#f59e0b'}}>
          <div className="stats-card-icon">👥</div>
          <div>
            <p className="stats-card-label">Total Users</p>
            <h2 className="stats-card-value">{stats.totalUsers}</h2>
          </div>
        </div>
        <div className="stats-card" style={{'--accent':'#ec4899'}}>
          <div className="stats-card-icon">👕</div>
          <div>
            <p className="stats-card-label">Total Products</p>
            <h2 className="stats-card-value">{stats.totalProducts}</h2>
          </div>
        </div>
      </div>

      {/* ── Revenue chart ── */}
      <div className="stats-chart-box">
        <h3>Revenue — Last 7 Days</h3>
        <div className="stats-chart">
          {stats.last7Days.map((day, i) => {
            const height = (day.revenue / maxRevenue) * 100
            return (
              <div key={i} className="stats-bar-col">
                <div className="stats-bar-value">
                  {day.revenue > 0 ? `$${day.revenue.toFixed(0)}` : ''}
                </div>
                <div className="stats-bar-track">
                  <div
                    className="stats-bar"
                    style={{ height: `${Math.max(height, day.revenue > 0 ? 4 : 0)}%` }}
                  />
                </div>
                <div className="stats-bar-bottom">
                  <span className="stats-bar-label">{day.date}</span>
                  <span className="stats-bar-orders">
                    {day.orders > 0 ? `${day.orders} order${day.orders > 1 ? 's' : ''}` : ''}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Daily breakdown table ── */}
      <div className="stats-table-box">
        <h3>Daily Breakdown</h3>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Orders</th>
              <th>Revenue</th>
              <th>Avg Order Value</th>
            </tr>
          </thead>
          <tbody>
            {stats.last7Days.map((day, i) => (
              <tr key={i}>
                <td style={{fontWeight:'600', color:'#1a1a2e'}}>{day.date}</td>
                <td>{day.orders}</td>
                <td style={{fontWeight:'700', color:'#6079ff'}}>
                  ${day.revenue.toFixed(2)}
                </td>
                <td style={{color:'#777'}}>
                  {day.orders > 0
                    ? `$${(day.revenue / day.orders).toFixed(2)}`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}