import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import '../portal.css';

export default function AcceptInvite() {
  const navigate = useNavigate();
  const { user, fetchProfile } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must contain uppercase, lowercase, and a number');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError('Unable to set password. Please try again or request a new invitation.');
      setSubmitting(false);
    } else {
      // Mark as onboarded so ProtectedRoute stops redirecting here
      if (user) {
        await supabase.from('profiles').update({ onboarded_at: new Date().toISOString() }).eq('id', user.id);
        await fetchProfile(user.id);
      }
      navigate('/portal/profile', { replace: true });
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
        <h1 className="portal-auth__title">Set Your Password</h1>
        <p className="portal-auth__subtitle">Create a password to complete your account setup</p>

        {error && <div className="portal-alert portal-alert--error">{error}</div>}

        <form onSubmit={handleSubmit} className="portal-auth__form">
          <div className="portal-field">
            <label className="portal-field__label" htmlFor="password">Password</label>
            <input
              className="portal-field__input"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />
          </div>
          <div className="portal-field">
            <label className="portal-field__label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="portal-field__input"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn--primary portal-auth__submit" disabled={submitting}>
            {submitting ? 'Setting password...' : 'Set Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
