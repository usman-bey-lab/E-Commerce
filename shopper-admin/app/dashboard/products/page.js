'use client'
import { useEffect, useState, useCallback } from 'react'
import '../page.css'
import './products.css'

const CATEGORIES = [
  { key: 'all',   label: 'All',   color: '#6079ff' },
  { key: 'men',   label: 'Men',   color: '#3b82f6' },
  { key: 'women', label: 'Women', color: '#ec4899' },
  { key: 'kid',   label: 'Kids',  color: '#22c55e' },
]

const ITEMS_PER_PAGE = 10
const emptyForm = { name: '', category: 'women', new_price: '', old_price: '', available: true }

export default function ProductsPage() {
  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [filterCat, setFilterCat]     = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showForm, setShowForm]       = useState(false)
  const [editing, setEditing]         = useState(null)
  const [form, setForm]               = useState(emptyForm)
  const [image, setImage]             = useState(null)
  const [preview, setPreview]         = useState(null)
  const [submitting, setSubmitting]   = useState(false)
  const [formError, setFormError]     = useState('')
  const [confirmId, setConfirmId]     = useState(null)
  const [toast, setToast]             = useState(null)

  const token = () => localStorage.getItem('admin-token')

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:4000/allproducts')
      const data = await res.json()
      setProducts(data)
    } catch {
      showToast('error', 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    if (!form.name.trim()) { setFormError('Product name is required'); return false }
    if (!form.new_price || Number(form.new_price) <= 0) { setFormError('Enter a valid sale price'); return false }
    if (!form.old_price || Number(form.old_price) <= 0) { setFormError('Enter a valid original price'); return false }
    if (Number(form.new_price) > Number(form.old_price)) { setFormError('Sale price must be less than original price'); return false }
    if (!editing && !image) { setFormError('Please select a product image'); return false }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setFormError('')
    setSubmitting(true)
    try {
      let imageUrl = editing?.image || ''
      if (image) {
        const formData = new FormData()
        formData.append('product', image)
        const uploadRes = await fetch('http://localhost:4000/upload', {
          method: 'POST',
          headers: { 'admin-token': token() },
          body: formData
        })
        const uploadData = await uploadRes.json()
        if (!uploadData.success) { setFormError('Image upload failed'); setSubmitting(false); return }
        imageUrl = uploadData.image_url
      }
      if (editing) {
        await fetch(`http://localhost:4000/editproduct/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'admin-token': token() },
          body: JSON.stringify({ name: form.name, category: form.category, new_price: Number(form.new_price), old_price: Number(form.old_price), available: form.available, image: imageUrl })
        })
        showToast('success', `"${form.name}" updated!`)
      } else {
        await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'admin-token': token() },
          body: JSON.stringify({ name: form.name, category: form.category, new_price: Number(form.new_price), old_price: Number(form.old_price), available: form.available, image: imageUrl })
        })
        showToast('success', `"${form.name}" added!`)
      }
      fetchProducts()
      handleCloseForm()
    } catch {
      setFormError('Something went wrong')
    }
    setSubmitting(false)
  }

  const handleDelete = async (id) => {
    const product = products.find(p => p.id === id)
    try {
      await fetch('http://localhost:4000/removeproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'admin-token': token() },
        body: JSON.stringify({ id })
      })
      showToast('success', `"${product?.name}" deleted`)
      fetchProducts()
    } catch {
      showToast('error', 'Failed to delete')
    }
    setConfirmId(null)
  }

  const handleEdit = (product) => {
    setEditing(product)
    setForm({ name: product.name, category: product.category, new_price: product.new_price, old_price: product.old_price, available: product.available })
    setPreview(product.image)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false); setEditing(null); setForm(emptyForm)
    setImage(null); setPreview(null); setFormError('')
  }

  const filtered    = products
    .filter(p => filterCat === 'all' || p.category === filterCat)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated   = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const handleSearch    = (e) => { setSearch(e.target.value); setCurrentPage(1) }
  const handleCatFilter = (cat) => { setFilterCat(cat); setCurrentPage(1) }

  if (loading) return (
    <div className="dash-loading">
      <div className="lp-spinner" />
      Loading products...
    </div>
  )

  return (
    <div className="products-page">

      {/* ── Toast ── */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}

      {/* ── Delete confirm ── */}
      {confirmId && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <div className="confirm-icon">🗑️</div>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-buttons">
              <button className="confirm-cancel" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="confirm-delete" onClick={() => handleDelete(confirmId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-box product-form-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={handleCloseForm}>✕</button>
            </div>

            <div className="edit-modal-layout">
              {/* Left — image */}
              <div className="edit-modal-left">
                {preview
                  ? <img src={preview} alt="Product" className="edit-modal-img" />
                  : <div className="edit-modal-img-placeholder"><span>📸</span></div>
                }
                <label htmlFor="imgInput" className="btn-change-img">
                  {editing ? 'Change Image' : 'Upload Image'}
                </label>
                <input
                  id="imgInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {!preview && !editing && (
                  <p style={{fontSize:'11px', color:'#bbb', textAlign:'center'}}>
                    Click to upload
                  </p>
                )}
              </div>

              {/* Right — fields */}
              <div className="edit-modal-right">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Classic Oxford Shirt" />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Original Price *</label>
                    <div className="price-input">
                      <span>$</span>
                      <input name="old_price" type="number" value={form.old_price} onChange={handleChange} placeholder="0.00" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Offer Price *</label>
                    <div className="price-input">
                      <span>$</span>
                      <input name="new_price" type="number" value={form.new_price} onChange={handleChange} placeholder="0.00" />
                    </div>
                  </div>
                </div>

                <label className="form-toggle-label">
                  <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
                  <div className="toggle-track"><div className="toggle-thumb" /></div>
                  <span>{form.available ? 'Available in store' : 'Hidden from store'}</span>
                </label>

                {formError && <p className="form-error">⚠ {formError}</p>}
              </div>
            </div>

            <div className="edit-modal-footer">
              <button className="btn-cancel" onClick={handleCloseForm}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="dash-title">Products</h1>
          <p className="dash-sub">{filtered.length} of {products.length} products</p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="products-toolbar">
        <div className="orders-filters">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={`filter-btn${filterCat === c.key ? ' active' : ''}`}
              style={filterCat === c.key ? { background: c.color, borderColor: c.color } : {}}
              onClick={() => handleCatFilter(c.key)}
            >
              {c.label}
              <span className="filter-count">
                {c.key === 'all' ? products.length : products.filter(p => p.category === c.key).length}
              </span>
            </button>
          ))}
        </div>
        <input className="orders-search" placeholder="🔍 Search products..." value={search} onChange={handleSearch} />
      </div>

      {/* ── Table ── */}
      <div className="products-table-box">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Original</th>
              <th>Sale</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={7} className="products-empty">No products found</td></tr>
            ) : (
              paginated.map(product => (
                <tr key={product.id} className="products-row">
                  <td><img src={product.image} alt={product.name} className="product-table-img" /></td>
                  <td className="product-table-name">{product.name}</td>
                  <td><span className={`cat-badge cat-${product.category}`}>{product.category}</span></td>
                  <td className="price-old">${product.old_price}</td>
                  <td className="price-new">${product.new_price}</td>
                  <td>
                    <span className={`status-pill ${product.available ? 'pill-active' : 'pill-hidden'}`}>
                      {product.available ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div className="product-actions">
                      <button className="action-edit" onClick={() => handleEdit(product)}>✏️</button>
                      <button className="action-delete" onClick={() => setConfirmId(product.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>← Prev</button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} className={`page-num${currentPage === page ? ' page-active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
            ))}
          </div>
          <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next →</button>
          <span className="page-info">Page {currentPage} of {totalPages}</span>
        </div>
      )}

    </div>
  )
}