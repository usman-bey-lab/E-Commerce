import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="stat-card" style={{ "--accent": color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <p className="stat-value">{value ?? <span className="stat-loading">...</span>}</p>
      <p className="stat-label">{label}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/adminstats")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats(data.stats);
        else setError("Failed to load stats");
      })
      .catch(() => setError("Network error. Is the server running?"))
      .finally(() => setLoading(false));
  }, []);

  const categoryData = stats
    ? [
        { label: "Men",   count: stats.byCategory.men,   color: "#3b82f6", pct: Math.round((stats.byCategory.men   / stats.totalProducts) * 100) || 0 },
        { label: "Women", count: stats.byCategory.women, color: "#ec4899", pct: Math.round((stats.byCategory.women / stats.totalProducts) * 100) || 0 },
        { label: "Kids",  count: stats.byCategory.kid,   color: "#22c55e", pct: Math.round((stats.byCategory.kid   / stats.totalProducts) * 100) || 0 },
      ]
    : [];

  return (
    <div className="dashboard">
      <div className="dash-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening in your store.</p>
      </div>

      {error && <div className="dash-error">{error}</div>}

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="stat-cards">
        <StatCard label="Total Products" value={stats?.totalProducts} icon="📦" color="#6079ff"  />
        <StatCard label="Total Users"    value={stats?.totalUsers}    icon="👥" color="#22c55e"  />
        <StatCard label="Categories"     value={3}                    icon="🏷️" color="#f59e0b"  />
        <StatCard
          label="Men / Women / Kids"
          value={stats ? `${stats.byCategory.men} / ${stats.byCategory.women} / ${stats.byCategory.kid}` : null}
          icon="📊"
          color="#ec4899"
        />
      </div>

      <div className="dash-grid">
        {/* ── Category Breakdown ─────────────────────────── */}
        <div className="dash-card">
          <h2>Products by Category</h2>
          {loading ? (
            <div className="dash-loading">Loading...</div>
          ) : (
            <div className="category-bars">
              {categoryData.map((cat) => (
                <div key={cat.label} className="category-bar-row">
                  <div className="cat-bar-label">
                    <span>{cat.label}</span>
                    <span className="cat-bar-count">{cat.count} products</span>
                  </div>
                  <div className="cat-bar-track">
                    <div
                      className="cat-bar-fill"
                      style={{ width: `${cat.pct}%`, background: cat.color }}
                    ></div>
                  </div>
                  <span className="cat-bar-pct">{cat.pct}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Recent Products ────────────────────────────── */}
        <div className="dash-card">
          <h2>Recently Added</h2>
          {loading ? (
            <div className="dash-loading">Loading...</div>
          ) : stats?.recentProducts?.length === 0 ? (
            <p className="dash-empty">No products yet.</p>
          ) : (
            <div className="recent-list">
              {stats?.recentProducts.map((p) => (
                <div key={p.id} className="recent-item">
                  <img src={p.image} alt={p.name} className="recent-img" />
                  <div className="recent-info">
                    <p className="recent-name">{p.name}</p>
                    <span className={`recent-badge cat-${p.category}`}>{p.category}</span>
                  </div>
                  <div className="recent-prices">
                    <p className="recent-new">${p.new_price}</p>
                    <p className="recent-old">${p.old_price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
