import React, { useState, useEffect } from "react";
import "./EditProduct.css";

const EditProduct = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    category: "women",
    old_price: "",
    new_price: "",
    available: true,
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form when product prop arrives
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        old_price: product.old_price,
        new_price: product.new_price,
        available: product.available ?? true,
      });
    }
  }, [product]);

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.old_price || Number(form.old_price) <= 0) e.old_price = "Enter a valid price";
    if (!form.new_price || Number(form.new_price) <= 0) e.new_price = "Enter a valid offer price";
    if (Number(form.new_price) > Number(form.old_price)) e.new_price = "Offer price must be less than original";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      let imageUrl = product.image;

      // Upload new image if selected
      if (newImage) {
        const formData = new FormData();
        formData.append("product", newImage);
        const uploadRes = await fetch("http://localhost:4000/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) imageUrl = uploadData.image_url;
      }

      const res = await fetch(`http://localhost:4000/editproduct/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.category,
          old_price: Number(form.old_price),
          new_price: Number(form.new_price),
          available: form.available,
          image: imageUrl,
        }),
      });
      const data = await res.json();

      if (data.success) {
        onSave(data.product); // pass updated product back to parent
        onClose();
      } else {
        const msg = data.error || data.errors?.[0]?.msg || "Failed to update";
        setErrors({ general: msg });
      }
    } catch {
      setErrors({ general: "Network error. Please try again." });
    }

    setLoading(false);
  };

  if (!product) return null;

  return (
    <div className="edit-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h2>Edit Product</h2>
          <button className="edit-close-btn" onClick={onClose}>✕</button>
        </div>

        {errors.general && <div className="edit-error">{errors.general}</div>}

        <div className="edit-modal-body">
          {/* Image */}
          <div className="edit-image-section">
            <img
              src={newImage ? URL.createObjectURL(newImage) : product.image}
              alt={form.name}
              className="edit-product-img"
            />
            <label htmlFor="edit-file-input" className="edit-change-img-btn">
              Change Image
            </label>
            <input
              id="edit-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => setNewImage(e.target.files[0])}
            />
          </div>

          {/* Fields */}
          <div className="edit-fields">
            <div className="edit-field">
              <label>Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={changeHandler}
                type="text"
                placeholder="Product name"
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="edit-field-error">{errors.name}</span>}
            </div>

            <div className="edit-field">
              <label>Category</label>
              <select name="category" value={form.category} onChange={changeHandler}>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">Kid</option>
              </select>
            </div>

            <div className="edit-price-row">
              <div className="edit-field">
                <label>Original Price</label>
                <div className="edit-price-input">
                  <span>$</span>
                  <input
                    name="old_price"
                    value={form.old_price}
                    onChange={changeHandler}
                    type="number"
                    min="0"
                    className={errors.old_price ? "input-error" : ""}
                  />
                </div>
                {errors.old_price && <span className="edit-field-error">{errors.old_price}</span>}
              </div>

              <div className="edit-field">
                <label>Offer Price</label>
                <div className="edit-price-input">
                  <span>$</span>
                  <input
                    name="new_price"
                    value={form.new_price}
                    onChange={changeHandler}
                    type="number"
                    min="0"
                    className={errors.new_price ? "input-error" : ""}
                  />
                </div>
                {errors.new_price && <span className="edit-field-error">{errors.new_price}</span>}
              </div>
            </div>

            <label className="edit-available-toggle">
              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={changeHandler}
              />
              <span className="toggle-track">
                <span className="toggle-thumb"></span>
              </span>
              <span className="toggle-label">
                {form.available ? "Available in store" : "Hidden from store"}
              </span>
            </label>
          </div>
        </div>

        <div className="edit-modal-footer">
          <button className="edit-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="edit-save-btn" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
