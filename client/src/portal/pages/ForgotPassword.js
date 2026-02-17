import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../portal.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/accept-invite`,
    });

    if (resetError) {
      setError('Unable to send reset link. Please check your email and try again.');
    } else {
      setSent(true);
    }
    setSubmitting(false);
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
        <h1 className="portal-auth__title">Reset Password</h1>

        {sent ? (
          <div className="portal-alert portal-alert--success">
            Check your email for a password reset link.
          </div>
        ) : (
          <>
            <p className="portal-auth__subtitle">Enter your email and we'll send you a reset link</p>
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
              <button type="submit" className="btn btn--primary portal-auth__submit" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        <div className="portal-auth__links">
          <Link to="/portal/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
