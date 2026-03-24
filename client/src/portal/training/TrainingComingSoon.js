import React from 'react'
import { Link } from 'react-router-dom'

export default function TrainingComingSoon({ title }) {
  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">{title || 'Coming Soon'}</h1>
      </div>
      <div
        className="portal-card"
        style={{ textAlign: 'center', padding: '48px 32px' }}
      >
        <p style={{ color: 'var(--color-gray-500)', marginBottom: 24 }}>
          This section will be available after design confirmation.
        </p>
        <Link to="/training" className="btn btn--secondary">
          ← Back to Training Home
        </Link>
      </div>
    </div>
  )
}
