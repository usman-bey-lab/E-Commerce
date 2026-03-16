'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './login.css'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    setError('')
    setLoading(true)

    const res = await fetch('http://localhost:4000/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (data.success) {
      localStorage.setItem('admin-token', data.token)
      localStorage.setItem('admin-name', data.name)
      localStorage.setItem('admin-role', data.role)
      router.push('/dashboard')
    } else {
      setError(data.error || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-box">

        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo-icon">🛍</span>
          <h1>Shopper Admin</h1>
          <p>Sign in to manage your store</p>
        </div>

        {/* Form */}
        <div className="login-form">
          <div className="login-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@shopper.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && <p className="login-error">⚠ {error}</p>}

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p className="login-footer">
          Shopper Admin Panel • Restricted Access
        </p>
      </div>
    </div>
  )
}