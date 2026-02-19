import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setMessage('Password updated successfully.');
      setPassword('');
      setConfirm('');
    }
  };

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Change Password</h1>
      </div>

      <div className="portal-card" style={{ maxWidth: 480 }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="form-message form-message--error" style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--color-error-bg, #fef2f2)', color: 'var(--color-error, #dc2626)', borderRadius: 8, fontSize: '0.85rem' }}>
              {error}
            </div>
          )}
          {message && (
            <div className="form-message form-message--success" style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--color-success-bg, #f0fdf4)', color: 'var(--color-success, #16a34a)', borderRadius: 8, fontSize: '0.85rem' }}>
              {message}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 500 }}>
              New Password
            </label>
            <input
              type="password"
              className="portal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Enter new password"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 500 }}>
              Confirm New Password
            </label>
            <input
              type="password"
              className="portal-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" className="portal-btn portal-btn--primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
