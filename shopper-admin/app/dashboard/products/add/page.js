'use client'
import { useState } from 'react'
import '../../page.css'
import './add.css'

export default function AddProductPage() {
  const [image, setImage]       = useState(null)
  const [preview, setPreview]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState(null)
  const [errors, setErrors]     = useState({})

  const [form, setForm] = useState({
    name: '', category: 'women',
    old_price: '', new_price: '',
  })

  const token = () => localStorage.getItem('admin-token')

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  const imageHandler = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setErrors(prev => ({ ...prev, image: '' }))
  }

  const changeHandler = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Product title is required'
    if (!form.old_price || Number(form.old_price) <= 0) e.old_price = 'Enter a valid price'
    if (!form.new_price || Number(form.new_price) <= 0) e.new_price = 'Enter a valid offer price'
    if (Number(form.new_price) > Number(form.old_price)) e.new_price = 'Offer price must be less than original'
    if (!image) e.image = 'Please select a product image'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAdd = async () => {
    if (!validate()) return
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('product', image)
      const uploadRes = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      const uploadData = await uploadRes.json()
      if (!uploadData.success) {
        showToast('error', 'Image upload failed')
        setLoading(false)
        return
      }

      const addRes = await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:      form.name.trim(),
          image:     uploadData.image_url,
          category:  form.category,
          old_price: Number(form.old_price),
          new_price: Number(form.new_price),
        }),
      })
      const addData = await addRes.json()

      if (addData.success) {
        showToast('success', `"${form.name}" added successfully!`)
        setForm({ name: '', category: 'women', old_price: '', new_price: '' })
        setImage(null)
        setPreview(null)
        setErrors({})
      } else {
        showToast('error', addData.error || 'Failed to add product')
      }
    } catch {
      showToast('error', 'Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="add-product-page">

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="dash-title">Add Product</h1>
          <p className="dash-sub">Add a new product to your store</p>
        </div>
      </div>

      <div className="add-product-box">

        {/* Product Title */}
        <div className="ap-field">
          <p>Product Title</p>
          <input
            name="name"
            value={form.name}
            onChange={changeHandler}
            type="text"
            placeholder="e.g. Classic Oxford Shirt"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        {/* Prices */}
        <div className="ap-prices">
          <div className="ap-field">
            <p>Original Price</p>
            <div className="ap-price-wrap">
              <span>$</span>
              <input
                name="old_price"
                value={form.old_price}
                onChange={changeHandler}
                type="number"
                placeholder="0.00"
                min="0"
                className={errors.old_price ? 'input-error' : ''}
              />
            </div>
            {errors.old_price && <span className="field-error">{errors.old_price}</span>}
          </div>

          <div className="ap-field">
            <p>Offer Price</p>
            <div className="ap-price-wrap">
              <span>$</span>
              <input
                name="new_price"
                value={form.new_price}
                onChange={changeHandler}
                type="number"
                placeholder="0.00"
                min="0"
                className={errors.new_price ? 'input-error' : ''}
              />
            </div>
            {errors.new_price && <span className="field-error">{errors.new_price}</span>}
          </div>
        </div>

        {/* Category */}
        <div className="ap-field">
          <p>Product Category</p>
          <select
            name="category"
            value={form.category}
            onChange={changeHandler}
            className="ap-select"
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
          </select>
        </div>

        {/* Image */}
        <div className="ap-field">
          <p>Product Image</p>
          <div className="ap-image-area">
            <label
              htmlFor="ap-file"
              className={`ap-upload-label ${preview ? 'has-image' : ''}`}
            >
              {preview
                ? <img src={preview} alt="Preview" className="ap-preview-img" />
                : (
                  <div className="ap-upload-hint">
                    <span>📸</span>
                    <p>Click to upload</p>
                  </div>
                )
              }
            </label>
            {preview && (
              <button
                className="ap-remove-btn"
                onClick={() => { setImage(null); setPreview(null) }}
              >
                ✕ Remove
              </button>
            )}
          </div>
          <input
            id="ap-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={imageHandler}
            hidden
          />
          {errors.image && <span className="field-error">{errors.image}</span>}
        </div>

        {/* Submit */}
        <button
          className="ap-submit-btn"
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? (
            <span className="ap-btn-loading">
              <span className="ap-spinner" /> Adding...
            </span>
          ) : 'ADD PRODUCT'}
        </button>

      </div>
    </div>
  )
}