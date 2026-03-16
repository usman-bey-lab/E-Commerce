'use client'
import React, { useState, useContext } from "react";
import "./RelatedProducts.css";
import Item from "@/components/Item/Item";
import { ShopContext } from "@/context/ShopContext";

const SORT_OPTIONS = [
  { label: "Relevance",          value: "default"   },
  { label: "Price: Low to High", value: "price_asc"  },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Discounted",    value: "discount"   },
];

const PAGE_SIZE = 8;

const RelatedProducts = ({ category }) => {
  const { all_product } = useContext(ShopContext);
  const [sortBy, setSortBy]   = useState("default");
  const [showAll, setShowAll] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // ── DEBUG: remove these two lines once working ──
  console.log("RelatedProducts → category prop:", category);
  console.log("RelatedProducts → all_product categories:", [...new Set(all_product.map(p => p.category))]);
  // ────────────────────────────────────────────────

  // Fallback: if category prop is missing, show all products
  const related = category
    ? all_product.filter((p) => p.category === category)
    : all_product;

  const sorted = [...related].sort((a, b) => {
    if (sortBy === "price_asc")  return a.new_price - b.new_price;
    if (sortBy === "price_desc") return b.new_price - a.new_price;
    if (sortBy === "discount") {
      const discA = (a.old_price - a.new_price) / a.old_price;
      const discB = (b.old_price - b.new_price) / b.old_price;
      return discB - discA;
    }
    return 0;
  });

  const visible    = showAll ? sorted : sorted.slice(0, PAGE_SIZE);
  const hasMore    = sorted.length > PAGE_SIZE;
  const activeLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;

  // Loading state — products not fetched yet
  if (all_product.length === 0) {
    return (
      <section className="relatedproducts">
        <div className="rp-header">
          <div className="rp-header-left">
            <p className="rp-tag">You Might Also Like</p>
            <h2>Related Products</h2>
          </div>
        </div>
        <div className="rp-grid">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      </section>
    );
  }

  // Empty state — category matched nothing
  if (sorted.length === 0) {
    return (
      <section className="relatedproducts">
        <div className="rp-header">
          <div className="rp-header-left">
            <p className="rp-tag">You Might Also Like</p>
            <h2>Related Products</h2>
          </div>
        </div>
        <p className="rp-empty">No related products found for category: <strong>{category || "unknown"}</strong></p>
      </section>
    );
  }

  return (
    <section className="relatedproducts">

      {/* ── Header ── */}
      <div className="rp-header">
        <div className="rp-header-left">
          <p className="rp-tag">You Might Also Like</p>
          <h2>Related Products</h2>
        </div>

        {/* Sort dropdown */}
        <div className="rp-sort">
          <button
            className={`rp-sort-btn${sortOpen ? " open" : ""}`}
            onClick={() => setSortOpen((o) => !o)}
          >
            <span>Sort: {activeLabel}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          {sortOpen && (
            <div className="rp-sort-dropdown">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`rp-sort-option${sortBy === opt.value ? " active" : ""}`}
                  onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Count ── */}
      <p className="rp-count">
        Showing {visible.length} of {sorted.length} products
      </p>

      {/* ── Grid ── */}
      <div className="rp-grid">
        {visible.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>

      {/* ── Explore more / Show less ── */}
      {hasMore && (
        <button
          className="rp-explore-btn"
          onClick={() => setShowAll((s) => !s)}
        >
          {showAll ? "Show Less" : `Explore More (${sorted.length - PAGE_SIZE} more)`}
        </button>
      )}

    </section>
  );
};

export default RelatedProducts;