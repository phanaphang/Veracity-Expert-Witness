import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function AdminProfile() {
  const { user, profile, fetchProfile } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase.from('profiles').update(form).eq('id', user.id);
      if (error) {
        setMessage('Error: ' + error.message);
      } else {
        await fetchProfile(user.id);
        setMessage('Profile saved successfully');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }

    setSaving(false);
  };

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Edit Profile</h1>
      </div>

      {message && <div className={`portal-alert ${message.startsWith('Error') ? 'portal-alert--error' : 'portal-alert--success'}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="portal-card">
          <h2 className="portal-card__title">Basic Information</h2>
          <div className="portal-list-item__row">
            <div className="portal-field">
              <label className="portal-field__label">First Name</label>
              <input className="portal-field__input" name="first_name" value={form.first_name} onChange={handleChange} required maxLength={200} />
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Last Name</label>
              <input className="portal-field__input" name="last_name" value={form.last_name} onChange={handleChange} required maxLength={200} />
            </div>
          </div>
          <div className="portal-field">
            <label className="portal-field__label">Phone</label>
            <input className="portal-field__input" name="phone" type="tel" value={form.phone} onChange={handleChange} maxLength={30} />
          </div>
          <div className="portal-field">
            <label className="portal-field__label">Email</label>
            <input className="portal-field__input" value={user?.email || ''} disabled />
          </div>
        </div>

        <button type="submit" className="btn btn--primary" disabled={saving} style={{ marginTop: 8 }}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
