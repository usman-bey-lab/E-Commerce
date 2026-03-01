import React, { useEffect, useState, useCallback } from "react";
import "./ListProduct.css";
import EditProduct from "../EditProduct/EditProduct";

const ITEMS_PER_PAGE = 10;

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // ── Toast ──────────────────────────────────────────────────
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch ──────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/allproducts");
      const data = await res.json();
      setAllProducts(data);
    } catch {
      showToast("error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Delete ─────────────────────────────────────────────────
  const removeProduct = async (id, name) => {
    try {
      const res = await fetch("http://localhost:4000/removeproduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `"${name}" removed`);
        fetchProducts();
      } else {
        showToast("error", "Failed to remove product");
      }
    } catch {
      showToast("error", "Network error");
    }
    setConfirmId(null);
  };

  // ── After edit saved ───────────────────────────────────────
  const handleEditSave = (updatedProduct) => {
    setAllProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showToast("success", `"${updatedProduct.name}" updated!`);
  };

  // ── Filter + Search + Paginate ─────────────────────────────
  const filtered = allProducts.filter((p) => {
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filter/search changes
  const handleSearch = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };
  const handleCategory = (cat) => { setCategoryFilter(cat); setCurrentPage(1); };

  const categories = [
    { key: "all",   label: "All",   color: "#6079ff" },
    { key: "men",   label: "Men",   color: "#3b82f6" },
    { key: "women", label: "Women", color: "#ec4899" },
    { key: "kid",   label: "Kids",  color: "#22c55e" },
  ];

  return (
    <div className="list-product">
      {/* Toast */}
      {toast && (
        <div className={`lp-toast lp-toast-${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}

      {/* Delete Confirm */}
      {confirmId && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <div className="confirm-icon">🗑️</div>
            <h3>Delete Product?</h3>
            <p>This cannot be undone.</p>
            <div className="confirm-buttons">
              <button className="confirm-cancel" onClick={() => setConfirmId(null)}>Cancel</button>
              <button
                className="confirm-delete"
                onClick={() => {
                  const p = allProducts.find((p) => p.id === confirmId);
                  removeProduct(confirmId, p?.name || "Product");
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <EditProduct
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Header */}
      <div className="lp-header">
        <div>
          <h2>All Products</h2>
          <p className="lp-count">{filtered.length} of {allProducts.length} products</p>
        </div>
        <input
          type="text"
          className="lp-search"
          placeholder="🔍  Search products..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Category Filter Tabs */}
      <div className="lp-category-tabs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`lp-tab ${categoryFilter === cat.key ? "lp-tab-active" : ""}`}
            style={categoryFilter === cat.key ? { background: cat.color, borderColor: cat.color } : {}}
            onClick={() => handleCategory(cat.key)}
          >
            {cat.label}
            <span className="lp-tab-count">
              {cat.key === "all"
                ? allProducts.length
                : allProducts.filter((p) => p.category === cat.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="listproduct-format-main listproduct-header">
        <p>Image</p>
        <p>Title</p>
        <p>Category</p>
        <p>Price</p>
        <p>Offer</p>
        <p>Status</p>
        <p>Actions</p>
      </div>

      {/* Products */}
      <div className="listproduct-allproducts">
        {loading ? (
          <div className="lp-loading">
            <div className="lp-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="lp-empty">
            <p>😕 {searchQuery || categoryFilter !== "all" ? "No products match your filters" : "No products found"}</p>
            <button onClick={() => { setSearchQuery(""); setCategoryFilter("all"); }}>
              Clear filters
            </button>
          </div>
        ) : (
          paginated.map((product) => (
            <React.Fragment key={product.id}>
              <div className="listproduct-format-main listproduct-format">
                <img src={product.image} alt={product.name} className="listproduct-product-icon" />
                <p className="product-name">{product.name}</p>
                <span className={`category-badge category-${product.category}`}>
                  {product.category}
                </span>
                <p className="price-old">${product.old_price}</p>
                <p className="price-new">${product.new_price}</p>
                <span className={`status-badge ${product.available ? "status-active" : "status-hidden"}`}>
                  {product.available ? "Active" : "Hidden"}
                </span>
                <div className="lp-actions">
                  <button
                    className="lp-edit-btn"
                    onClick={() => setEditProduct(product)}
                    title="Edit product"
                  >
                    ✏️
                  </button>
                  <button
                    className="lp-remove-btn"
                    onClick={() => setConfirmId(product.id)}
                    title="Delete product"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <hr />
            </React.Fragment>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="lp-pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Prev
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-num ${currentPage === page ? "page-active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="page-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
