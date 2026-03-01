import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success"|"error", message }
  const [errors, setErrors] = useState({});

  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "women",
    old_price: "",
    new_price: "",
  });

  // ── Show toast then auto-dismiss ───────────────────────────
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Image handler ──────────────────────────────────────────
  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const removeImage = () => {
    setImage(null);
  };

  // ── Field change handler ───────────────────────────────────
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Validation ─────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!productDetails.name.trim()) newErrors.name = "Product title is required";
    if (!productDetails.old_price || isNaN(productDetails.old_price) || Number(productDetails.old_price) <= 0)
      newErrors.old_price = "Enter a valid price";
    if (!productDetails.new_price || isNaN(productDetails.new_price) || Number(productDetails.new_price) <= 0)
      newErrors.new_price = "Enter a valid offer price";
    if (Number(productDetails.new_price) > Number(productDetails.old_price))
      newErrors.new_price = "Offer price must be less than original price";
    if (!image) newErrors.image = "Please select a product image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Add product ────────────────────────────────────────────
  const addProduct = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // Step 1: Upload image
      const formData = new FormData();
      formData.append("product", image);

      const uploadRes = await fetch("http://localhost:4000/upload", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        showToast("error", uploadData.error || "Image upload failed");
        setLoading(false);
        return;
      }

      // Step 2: Add product — send prices as NUMBERS, not strings
      const product = {
        name: productDetails.name.trim(),
        image: uploadData.image_url,
        category: productDetails.category,
        old_price: Number(productDetails.old_price),  // ✅ fix: string → number
        new_price: Number(productDetails.new_price),  // ✅ fix: string → number
      };

      const addRes = await fetch("http://localhost:4000/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(product),
      });
      const addData = await addRes.json();

      if (addData.success) {
        showToast("success", `"${product.name}" added successfully!`);
        // ✅ Reset form after success
        setProductDetails({ name: "", category: "women", old_price: "", new_price: "" });
        setImage(null);
        setErrors({});
      } else {
        const msg =
          addData.error ||
          addData.errors?.[0]?.msg ||
          "Failed to add product";
        showToast("error", msg);
      }
    } catch (err) {
      showToast("error", "Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="add-product">
      {/* ── Toast notification ─────────────────────────────── */}
      {toast && (
        <div className={`ap-toast ap-toast-${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}

      <h2 className="ap-title">Add New Product</h2>

      {/* ── Product Title ───────────────────────────────────── */}
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="e.g. Classic Oxford Shirt"
          className={errors.name ? "input-error" : ""}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      {/* ── Prices ─────────────────────────────────────────── */}
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Original Price</p>
          <div className="price-input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              value={productDetails.old_price}
              onChange={changeHandler}
              type="number"
              name="old_price"
              placeholder="0.00"
              min="0"
              className={errors.old_price ? "input-error" : ""}
            />
          </div>
          {errors.old_price && <span className="field-error">{errors.old_price}</span>}
        </div>

        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <div className="price-input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              value={productDetails.new_price}
              onChange={changeHandler}
              type="number"
              name="new_price"
              placeholder="0.00"
              min="0"
              className={errors.new_price ? "input-error" : ""}
            />
          </div>
          {errors.new_price && <span className="field-error">{errors.new_price}</span>}
        </div>
      </div>

      {/* ── Category ────────────────────────────────────────── */}
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      {/* ── Image upload ─────────────────────────────────────── */}
      <div className="addproduct-itemfield">
        <p>Product Image</p>
        <div className="image-upload-area">
          <label htmlFor="file-input" className={`image-upload-label ${image ? "has-image" : ""}`}>
            <img
              src={image ? URL.createObjectURL(image) : upload_area}
              className="add-product-thumbnail-img"
              alt="Upload"
            />
            {!image && <span className="upload-hint">Click to upload image</span>}
          </label>
          {image && (
            <button className="remove-image-btn" onClick={removeImage} type="button">
              ✕ Remove
            </button>
          )}
        </div>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          accept="image/jpeg,image/png,image/webp"
          hidden
        />
        {errors.image && <span className="field-error">{errors.image}</span>}
      </div>

      {/* ── Submit ───────────────────────────────────────────── */}
      <button
        onClick={addProduct}
        className="add-product-btn"
        disabled={loading}
      >
        {loading ? (
          <span className="btn-loading">
            <span className="btn-spinner"></span> Adding...
          </span>
        ) : (
          "ADD PRODUCT"
        )}
      </button>
    </div>
  );
};

export default AddProduct;
