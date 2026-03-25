'use client'
import { useEffect, useState } from 'react'
import '../page.css'
import './promos.css'
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const emptyForm = {
  code: '', discount: '', type: 'percent',
  maxUses: '', expiresAt: ''
}

export default function PromosPage() {
  const [promos, setPromos]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError]   = useState('')
  const [confirmId, setConfirmId]   = useState(null)
  const [toast, setToast]           = useState(null)

  const token = () => localStorage.getItem('admin-token')

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchPromos = () => {
    fetch(`${API}/admin/promocodes`, {
      headers: { 'admin-token': token() }
    })
    .then(r => r.json())
    .then(data => { setPromos(data); setLoading(false) })
  }

  useEffect(() => { fetchPromos() }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.code.trim()) { setFormError('Code is required'); return }
    if (!form.discount || Number(form.discount) <= 0) { setFormError('Enter a valid discount'); return }
    setFormError('')
    setSubmitting(true)

    const res = await fetch(`${API}/admin/promocodes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'admin-token': token()
      },
      body: JSON.stringify({
        code:      form.code.toUpperCase().trim(),
        discount:  Number(form.discount),
        type:      form.type,
        maxUses:   form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null
      })
    })

    const data = await res.json()
    if (data.success) {
      showToast('success', `Code "${form.code.toUpperCase()}" created!`)
      setForm(emptyForm)
      setShowForm(false)
      fetchPromos()
    } else {
      setFormError(data.error || 'Failed to create code')
    }
    setSubmitting(false)
  }

  const handleToggle = async (promo) => {
    await fetch(`${API}/admin/promocodes/${promo._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'admin-token': token()
      },
      body: JSON.stringify({ isActive: !promo.isActive })
    })
    showToast('success', `Code ${promo.isActive ? 'disabled' : 'enabled'}`)
    fetchPromos()
  }

  const handleDelete = async (id) => {
    await fetch(`${API}/admin/promocodes/${id}`, {
      method: 'DELETE',
      headers: { 'admin-token': token() }
    })
    showToast('success', 'Promo code deleted')
    fetchPromos()
    setConfirmId(null)
  }

  if (loading) return <div className="dash-loading">Loading promo codes...</div>

  return (
    <div className="promos-page">

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}

      {confirmId && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <div className="confirm-icon">🎟</div>
            <h3>Delete Promo Code?</h3>
            <p>This cannot be undone.</p>
            <div className="confirm-buttons">
              <button className="confirm-cancel" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="confirm-delete" onClick={() => handleDelete(confirmId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="dash-title">Promo Codes</h1>
          <p className="dash-sub">{promos.length} codes total</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕ Cancel' : '+ New Code'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="promo-form-box">
          <h3>Create Promo Code</h3>
          <div className="promo-form-grid">
            <div className="form-group">
              <label>Code *</label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="e.g. SAVE20"
                style={{textTransform:'uppercase'}}
              />
            </div>
            <div className="form-group">
              <label>Discount *</label>
              <input
                name="discount"
                type="number"
                value={form.discount}
                onChange={handleChange}
                placeholder="e.g. 20"
              />
            </div>
            <div className="form-group">
              <label>Type *</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Max Uses (leave blank = unlimited)</label>
              <input
                name="maxUses"
                type="number"
                value={form.maxUses}
                onChange={handleChange}
                placeholder="e.g. 100"
              />
            </div>
            <div className="form-group">
              <label>Expires At (leave blank = never)</label>
              <input
                name="expiresAt"
                type="date"
                value={form.expiresAt}
                onChange={handleChange}
              />
            </div>
          </div>
          {formError && <p className="form-error">⚠ {formError}</p>}
          <div className="form-actions" style={{marginTop:'16px'}}>
            <button className="btn-cancel" onClick={() => { setShowForm(false); setForm(emptyForm); setFormError('') }}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Code'}
            </button>
          </div>
        </div>
      )}

      {/* Promos table */}
      <div className="promos-table-box">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Type</th>
              <th>Used</th>
              <th>Max Uses</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.length === 0 ? (
              <tr>
                <td colSpan={8} style={{textAlign:'center', color:'#999', padding:'40px'}}>
                  No promo codes yet. Create one above.
                </td>
              </tr>
            ) : (
              promos.map(promo => (
                <tr key={promo._id} className="promos-row">
                  <td>
                    <span className="promo-code-badge">{promo.code}</span>
                  </td>
                  <td className="promo-discount">
                    {promo.type === 'percent' ? `${promo.discount}%` : `$${promo.discount}`}
                  </td>
                  <td>
                    <span className={`promo-type-badge ${promo.type}`}>
                      {promo.type}
                    </span>
                  </td>
                  <td>{promo.usedCount || 0}</td>
                  <td>{promo.maxUses ?? '∞'}</td>
                  <td className="promo-expires">
                    {promo.expiresAt
                      ? new Date(promo.expiresAt).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={promo.isActive}
                        onChange={() => handleToggle(promo)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </td>
                  <td>
                    <button
                      className="action-delete"
                      onClick={() => setConfirmId(promo._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}