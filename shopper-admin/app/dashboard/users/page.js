'use client'
import { useEffect, useState } from 'react'
import '../page.css'
import './users.css'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function UsersPage() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [orders, setOrders]   = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  const token = () => localStorage.getItem('admin-token')

  useEffect(() => {
    fetch(`${API}/admin/users`, {
      headers: { 'admin-token': token() }
    })
    .then(r => r.json())
    .then(data => { setUsers(data); setLoading(false) })
  }, [])

  const handleSelectUser = async (user) => {
    setSelected(user)
    setOrdersLoading(true)
    const res = await fetch(`${API}/admin/users/${user._id}/orders`, {
      headers: { 'admin-token': token() }
    })
    const data = await res.json()
    setOrders(data)
    setOrdersLoading(false)
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="dash-loading">Loading users...</div>

  return (
    <div className="users-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="dash-title">Users</h1>
          <p className="dash-sub">{users.length} registered users</p>
        </div>
        <input
          className="orders-search"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="users-table-box">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{textAlign:'center', color:'#999', padding:'40px'}}>
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map(user => (
                <tr key={user._id} className="users-row">
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-date">
                    {user.date
                      ? new Date(user.date).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <button
                      className="btn-view-orders"
                      onClick={() => handleSelectUser(user)}
                    >
                      View Orders
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User orders modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selected.name}</h2>
                <p style={{fontSize:'13px', color:'#777', marginTop:'2px'}}>{selected.email}</p>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <h3>Order History</h3>
                {ordersLoading ? (
                  <p style={{color:'#999'}}>Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p style={{color:'#999', fontSize:'14px'}}>No orders yet.</p>
                ) : (
                  <div className="user-orders-list">
                    {orders.map(order => (
                      <div key={order._id} className="user-order-card">
                        <div className="user-order-top">
                          <span className="user-order-id">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <span
                            className="status-badge"
                            style={STATUS_COLORS[order.status]}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="user-order-details">
                          <span>{order.items?.length} item(s)</span>
                          <span className="user-order-amount">
                            ${order.totalAmount?.toFixed(2)}
                          </span>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const STATUS_COLORS = {
  pending:    { background: '#FFF7ED', color: '#C05000', border: '1px solid #FED7AA' },
  processing: { background: '#EEF4FF', color: '#1A56A0', border: '1px solid #BFDBFE' },
  shipped:    { background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' },
  delivered:  { background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' },
  cancelled:  { background: '#FFF1F2', color: '#BE123C', border: '1px solid #FECDD3' },
}