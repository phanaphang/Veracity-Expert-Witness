import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';

export default function InviteExpert() {
  const { session } = useAuth();
  const [form, setForm] = useState({ email: '', first_name: '', last_name: '' });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const isDirty = form.email !== '' || form.first_name !== '' || form.last_name !== '';
  const { UnsavedModal } = useUnsavedChanges(isDirty);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage('');
    setError('');

    try {
      // Get a fresh access token (the stored session token may have expired)
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const token = currentSession?.access_token || session?.access_token;

      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send invitation');
        setSending(false);
        return;
      }

      setMessage(`Invitation sent to ${form.email}`);
      setForm({ email: '', first_name: '', last_name: '' });
    } catch (err) {
      setError('Failed to send invitation. Please try again.');
    }

    setSending(false);
  };

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Invite Expert</h1>
      </div>

      {message && <div className="portal-alert portal-alert--success">{message}</div>}
      {error && <div className="portal-alert portal-alert--error">{error}</div>}

      <div className="portal-card" style={{ maxWidth: 500 }}>
        <form onSubmit={handleSubmit}>
          <div className="portal-field">
            <label className="portal-field__label">Email Address *</label>
            <input
              className="portal-field__input"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="expert@example.com"
            />
          </div>
          <div className="portal-list-item__row">
            <div className="portal-field">
              <label className="portal-field__label">First Name</label>
              <input
                className="portal-field__input"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Last Name</label>
              <input
                className="portal-field__input"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
          </div>
          <button type="submit" className="btn btn--primary" disabled={sending} style={{ marginTop: 8, padding: '10px 24px' }}>
            {sending ? 'Sending...' : 'Send Invitation'}
          </button>
        </form>
      </div>

      <div className="portal-card" style={{ marginTop: 24 }}>
        <h2 className="portal-card__title">How It Works</h2>
        <ol style={{ paddingLeft: 20, lineHeight: 2, fontSize: '0.9rem', color: 'var(--color-gray-600)' }}>
          <li>Enter the expert's email address above</li>
          <li>They'll receive an invitation email with a link to set their password</li>
          <li>After signing in, they'll be prompted to complete their profile</li>
          <li>You can then review their profile and invite them to cases</li>
        </ol>
      </div>
      {UnsavedModal}
    </div>
  );
}
