import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../portal.css';

export default function Login() {
  const { user, profile, signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="portal-loading"><div className="portal-loading__spinner"></div></div>;
  if (user && !profile) return <div className="portal-loading"><div className="portal-loading__spinner"></div></div>;
  if (user && ['admin', 'staff'].includes(profile?.role)) return <Navigate to="/admin/dashboard" replace />;
  if (user) return <Navigate to="/portal/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: authError } = await signIn(email, password);
    if (authError) {
      setError('Invalid email or password. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-auth">
      <div className="portal-auth__card">
        <Link to="/" className="portal-auth__logo">
          <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--color-accent)" />
            <path d="M2 17l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
            <path d="M2 12l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
          </svg>
          <span>Veracity</span>
        </Link>
        <h1 className="portal-auth__title">Expert Portal Login</h1>
        <p className="portal-auth__subtitle">Sign in to access your portal</p>

        {error && <div className="portal-alert portal-alert--error">{error}</div>}

        <form onSubmit={handleSubmit} className="portal-auth__form">
          <div className="portal-field">
            <label className="portal-field__label" htmlFor="email">Email</label>
            <input
              className="portal-field__input"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="portal-field">
            <label className="portal-field__label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="portal-field__input"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: 40 }}
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-gray-400)' }} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn--primary portal-auth__submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="portal-auth__links">
          <Link to="/portal/forgot-password">Forgot password?</Link>
          <Link to="/">Back to website</Link>
        </div>
      </div>
    </div>
  );
}
