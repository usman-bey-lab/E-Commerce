import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

const NAV = [
  { to: "/dashboard",   label: "Dashboard",   icon: "📊" },
  { to: "/addproduct",  label: "Add Product", icon: "➕" },
  { to: "/listproduct", label: "Products",    icon: "📋" },
  { to: "/orders",      label: "Orders",      icon: "🧾" },
  { to: "/users",       label: "Users",       icon: "👥" },
  { to: "/stats",       label: "Sales Stats", icon: "📈" },
];

const Sidebar = () => (
  <div className="sidebar">
    <div className="sidebar-brand">
      <span>Admin Panel</span>
    </div>
    <nav className="sidebar-nav">
      {NAV.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
        >
          <div className="sidebar-icon">{icon}</div>
          <p>{label}</p>
        </NavLink>
      ))}
    </nav>
  </div>
);

export default Sidebar;