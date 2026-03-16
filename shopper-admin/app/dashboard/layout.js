'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import './dashboard.css'

const NAV_ITEMS = [
  { label: 'Dashboard',   path: '/dashboard',           icon: '📊' },
  { label: 'Orders',      path: '/dashboard/orders',    icon: '🧾' },
  { label: 'Add Product', path: '/dashboard/products/add', icon: '➕' },
  { label: 'Products',    path: '/dashboard/products',  icon: '📋' },
  { label: 'Users',       path: '/dashboard/users',     icon: '👥' },
  { label: 'Promo Codes', path: '/dashboard/promos',    icon: '🎟' },
  { label: 'Sales Stats', path: '/dashboard/stats',     icon: '📈' },
]

export default function DashboardLayout({ children }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [adminName, setAdminName] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin-token')
    const name  = localStorage.getItem('admin-name')
    if (!token) { router.push('/login'); return }
    setAdminName(name || 'Admin')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin-token')
    localStorage.removeItem('admin-name')
    localStorage.removeItem('admin-role')
    router.push('/login')
  }

  return (
    <div className="admin-layout">

      {/* ── Top Navbar ── */}
      <header className="admin-navbar">
        <div className="navbar-left">
          <div className="navbar-brand">
            <span className="brand-icon">🛍</span>
            <div>
              <span className="brand-name">SHOPPER</span>
              <span className="brand-sub">Admin Panel</span>
            </div>
          </div>
          <span className="admin-badge">ADMIN</span>
        </div>
        <div className="navbar-right">
          <div className="admin-profile">
            <div className="profile-avatar">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="profile-name">{adminName}</span>
            <span className="profile-dot" />
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-body">

        {/* ── Sidebar ── */}
        <aside className="admin-sidebar">
          <div className="sidebar-brand-section">
            <span>ADMIN PANEL</span>
          </div>
          <nav className="sidebar-nav">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`sidebar-item${pathname === item.path ? ' sidebar-item-active' : ''}`}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* ── Main Content ── */}
        <main className="admin-content">
          {children}
        </main>

      </div>
    </div>
  )
}