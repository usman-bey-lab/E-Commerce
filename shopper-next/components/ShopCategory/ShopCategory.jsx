'use client'
import React, { useContext, useState } from "react";
import "./ShopCategory.css";
import { ShopContext } from "@/context/ShopContext";
import Item from "@/components/Item/Item";
import PromoBanner from "@/components/PromoBanner/PromoBanner";

const SORT_OPTIONS = [
  { label: "Relevance",          value: "default"   },
  { label: "Price: Low to High", value: "price_asc"  },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Discounted",    value: "discount"   },
];

const PAGE_SIZE = 12;

const ShopCategory = ({ banner, category }) => {
  const { all_product } = useContext(ShopContext);
  const [sortBy, setSortBy]     = useState("default");
  const [showAll, setShowAll]   = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = all_product.filter((item) => item.category === category);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc")  return a.new_price - b.new_price;
    if (sortBy === "price_desc") return b.new_price - a.new_price;
    if (sortBy === "discount") {
      const dA = (a.old_price - a.new_price) / a.old_price;
      const dB = (b.old_price - b.new_price) / b.old_price;
      return dB - dA;
    }
    return 0;
  });

  const visible  = showAll ? sorted : sorted.slice(0, PAGE_SIZE);
  const hasMore  = sorted.length > PAGE_SIZE;
  const activeLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;

  return (
    <div className="shop-category">

      {/* ── Promo banner replaces static img ── */}
      <PromoBanner banner={banner} category={category} />

      {/* ── Toolbar ── */}
      <div className="shopcategory-toolbar">
        <p className="shopcategory-count">
          Showing <strong>{visible.length}</strong> of <strong>{sorted.length}</strong> products
        </p>

        <div className="sc-sort">
          <button
            className={`sc-sort-btn${sortOpen ? " open" : ""}`}
            onClick={() => setSortOpen((o) => !o)}
          >
            <span>Sort: {activeLabel}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          {sortOpen && (
            <div className="sc-sort-dropdown">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`sc-sort-option${sortBy === opt.value ? " active" : ""}`}
                  onClick={() => { setSortBy(opt.value); setSortOpen(false); setShowAll(false); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Products grid ── */}
      {visible.length === 0 ? (
        <div className="shopcategory-empty">
          <p>No products found.</p>
        </div>
      ) : (
        <div className="shopcategory-products">
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
      )}

      {/* ── Explore More ── */}
      {hasMore && (
        <button
          className="shopcategory-loadmore"
          onClick={() => setShowAll((s) => !s)}
        >
          {showAll ? "Show Less" : `Explore More (${sorted.length - PAGE_SIZE} more)`}
        </button>
      )}

    </div>
  );
};

export default ShopCategory;