'use client'
import { useEffect, useState } from 'react'
import '../page.css'
import './orders.css'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS = {
  pending:    { bg: '#FFF7ED', color: '#C05000', border: '#FED7AA' },
  processing: { bg: '#EEF4FF', color: '#1A56A0', border: '#BFDBFE' },
  shipped:    { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' },
  delivered:  { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' },
  cancelled:  { bg: '#FFF1F2', color: '#BE123C', border: '#FECDD3' },
}

export default function OrdersPage() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)

  const fetchOrders = () => {
    fetch(`${API}/admin/orders`, {
      headers: { 'admin-token': localStorage.getItem('admin-token') }
    })
    .then(r => r.json())
    .then(data => {
      setOrders(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (orderId, status) => {
    await fetch(`${API}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'admin-token': localStorage.getItem('admin-token')
      },
      body: JSON.stringify({ status })
    })
    fetchOrders()
    if (selected?._id === orderId) {
      setSelected(prev => ({ ...prev, status }))
    }
  }

  const filtered = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => {
      if (!search) return true
      const name = o.userId?.name?.toLowerCase() || ''
      const email = o.userId?.email?.toLowerCase() || ''
      const id = o._id.toLowerCase()
      return name.includes(search.toLowerCase()) ||
             email.includes(search.toLowerCase()) ||
             id.includes(search.toLowerCase())
    })

  if (loading) return <div className="dash-loading">Loading orders...</div>

  return (
    <div className="orders-page">

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="dash-title">Orders</h1>
          <p className="dash-sub">{orders.length} total orders</p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="orders-toolbar">
        <div className="orders-filters">
          {['all', ...STATUS_OPTIONS].map(s => (
            <button
              key={s}
              className={`filter-btn${filter === s ? ' active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="filter-count">
                {s === 'all'
                  ? orders.length
                  : orders.filter(o => o.status === s).length}
              </span>
            </button>
          ))}
        </div>

        <input
          className="orders-search"
          placeholder="Search by name, email or order ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Orders table ── */}
      <div className="orders-table-box">
        <table className="dash-table orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{textAlign:'center', color:'#999', padding:'40px'}}>
                  No orders found
                </td>
              </tr>
            ) : (
              filtered.map(order => (
                <tr
                  key={order._id}
                  className="orders-row"
                  onClick={() => setSelected(order)}
                >
                  <td className="order-id">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td>
                    <p className="order-customer-name">
                      {order.userId?.name || order.delivery?.firstName + ' ' + order.delivery?.lastName}
                    </p>
                    <p className="order-customer-email">
                      {order.userId?.email || order.delivery?.email}
                    </p>
                  </td>
                  <td>{order.items?.length} item(s)</td>
                  <td className="order-total">${order.totalAmount?.toFixed(2)}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={STATUS_COLORS[order.status]}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={e => updateStatus(order._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Order detail modal ── */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order #{selected._id.slice(-8).toUpperCase()}</h2>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="modal-body">

              {/* Status */}
              <div className="modal-section">
                <h3>Status</h3>
                <div className="modal-status-row">
                  <span className="status-badge" style={STATUS_COLORS[selected.status]}>
                    {selected.status}
                  </span>
                  <select
                    className="status-select"
                    value={selected.status}
                    onChange={e => updateStatus(selected._id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer */}
              <div className="modal-section">
                <h3>Customer</h3>
                <p>{selected.userId?.name || `${selected.delivery?.firstName} ${selected.delivery?.lastName}`}</p>
                <p>{selected.userId?.email || selected.delivery?.email}</p>
              </div>

              {/* Delivery */}
              <div className="modal-section">
                <h3>Delivery Address</h3>
                <p>{selected.delivery?.street}</p>
                <p>{selected.delivery?.city}, {selected.delivery?.state} {selected.delivery?.zip}</p>
                <p>{selected.delivery?.country}</p>
                <p>📞 {selected.delivery?.phone}</p>
              </div>

              {/* Items */}
              <div className="modal-section">
                <h3>Items Ordered</h3>
                <div className="modal-items">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="modal-item">
                      <img src={item.image} alt={item.name} />
                      <div className="modal-item-info">
                        <p>{item.name}</p>
                        <span>Size: {item.size || 'N/A'} • Qty: {item.quantity}</span>
                      </div>
                      <p className="modal-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="modal-total">
                <span>Total Amount</span>
                <span>${selected.totalAmount?.toFixed(2)}</span>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}