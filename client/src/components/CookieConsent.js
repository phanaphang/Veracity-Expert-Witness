import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#1a1a2e',
        color: '#e2e8f0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        flexWrap: 'wrap',
        fontSize: '0.88rem',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.2)',
      }}
    >
      <p style={{ margin: 0, maxWidth: 600 }}>
        We use essential cookies to keep the site running. No tracking or
        advertising cookies are used.{' '}
        <Link
          to="/cookie-policy"
          style={{ color: '#93c5fd', textDecoration: 'underline' }}
        >
          Learn more
        </Link>
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={accept}
          style={{
            padding: '8px 20px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          Accept
        </button>
        <button
          onClick={decline}
          style={{
            padding: '8px 20px',
            background: 'transparent',
            color: '#94a3b8',
            border: '1px solid #475569',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Decline
        </button>
      </div>
    </div>
  )
}
