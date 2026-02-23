import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function Profile() {
  const { user, profile, fetchProfile } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', bio: '', rate_review_report: '', rate_deposition: '', rate_trial_testimony: '', availability: 'available' });
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [testimony, setTestimony] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [specRes, selRes, testRes] = await Promise.all([
      supabase.from('specialties').select('*').order('name'),
      supabase.from('expert_specialties').select('specialty_id').eq('expert_id', user.id),
      supabase.from('prior_testimony').select('*').eq('expert_id', user.id).order('date_of_testimony', { ascending: false }),
    ]);
    setAllSpecialties(specRes.data || []);
    setSelectedSpecialties(selRes.data?.map(s => s.specialty_id) || []);
    setTestimony(testRes.data || []);
  }, [user]);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        rate_review_report: profile.rate_review_report || '',
        rate_deposition: profile.rate_deposition || '',
        rate_trial_testimony: profile.rate_trial_testimony || '',
        availability: profile.availability || 'available',
      });
    }
    loadData();
  }, [profile, loadData]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSpecialty = (id) => {
    setSelectedSpecialties(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const addTestimony = () => setTestimony(prev => [...prev, { case_name: '', court: '', jurisdiction: '', date_of_testimony: '', topic: '', retained_by: '', outcome: '', _new: true }]);

  const removeItem = (list, setList, index, table) => {
    const item = list[index];
    if (item.id) {
      supabase.from(table).delete().eq('id', item.id);
    }
    setList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const errors = [];

    try {
      const updates = { ...form };
      for (const key of ['rate_review_report', 'rate_deposition', 'rate_trial_testimony']) {
        if (updates[key]) updates[key] = parseFloat(updates[key]);
        else updates[key] = null;
      }
      if (!profile?.onboarded_at) updates.onboarded_at = new Date().toISOString();

      const { error: profileErr } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (profileErr) errors.push('Profile: ' + profileErr.message);

      // Specialties
      await supabase.from('expert_specialties').delete().eq('expert_id', user.id);
      if (selectedSpecialties.length > 0) {
        const { error: specErr } = await supabase.from('expert_specialties').insert(
          selectedSpecialties.map(id => ({ expert_id: user.id, specialty_id: id }))
        );
        if (specErr) errors.push('Specialties: ' + specErr.message);
      }

      // Prior Testimony
      for (const item of testimony) {
        const data = { expert_id: user.id, case_name: item.case_name || '', court: item.court || '', jurisdiction: item.jurisdiction || '', date_of_testimony: item.date_of_testimony || null, topic: item.topic || '', retained_by: item.retained_by || '', outcome: item.outcome || '' };
        if (item.id && !item._new) {
          const { error } = await supabase.from('prior_testimony').update(data).eq('id', item.id);
          if (error) errors.push('Testimony: ' + error.message);
        } else {
          const { error } = await supabase.from('prior_testimony').insert(data);
          if (error) errors.push('Testimony: ' + error.message);
        }
      }

      await fetchProfile(user.id);
      await loadData();
    } catch (err) {
      errors.push(err.message);
    }

    if (errors.length > 0) {
      setMessage('Errors: ' + errors.join('; '));
    } else {
      setMessage('Profile saved successfully');
      setEditing(false);
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">My Profile</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="portal-btn-action" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => setEditing(true)} disabled={editing}>Edit</button>
          <button type="submit" form="profile-form" className="btn btn--primary" disabled={!editing || saving} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {message && <div className={`portal-alert ${message.startsWith('Errors') ? 'portal-alert--error' : 'portal-alert--success'}`}>{message}</div>}

      <form id="profile-form" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="portal-card">
          <h2 className="portal-card__title">Basic Information</h2>
          <div className="portal-list-item__row">
            <div className="portal-field">
              <label className="portal-field__label">First Name</label>
              <input className="portal-field__input" name="first_name" value={form.first_name} onChange={handleChange} required maxLength={200} readOnly={!editing} />
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Last Name</label>
              <input className="portal-field__input" name="last_name" value={form.last_name} onChange={handleChange} required maxLength={200} readOnly={!editing} />
            </div>
          </div>
          <div className="portal-field">
            <label className="portal-field__label">Phone</label>
            <input className="portal-field__input" name="phone" type="tel" value={form.phone} onChange={handleChange} maxLength={30} readOnly={!editing} />
          </div>
          <div className="portal-field">
            <label className="portal-field__label">Bio</label>
            <textarea className="portal-field__textarea" name="bio" value={form.bio} onChange={handleChange} rows="4" placeholder="Describe your expertise and experience..." maxLength={5000} readOnly={!editing} />
          </div>
        </div>

        {/* Specialties */}
        <div className="portal-card">
          <h2 className="portal-card__title">Specialties</h2>
          <div className="portal-checkbox-group">
            {allSpecialties.map(s => (
              <label key={s.id} className="portal-checkbox">
                <input type="checkbox" checked={selectedSpecialties.includes(s.id)} onChange={() => toggleSpecialty(s.id)} disabled={!editing} />
                {s.name}
              </label>
            ))}
          </div>
        </div>

        {/* Prior Expert Testimony */}
        <div className="portal-card">
          <h2 className="portal-card__title">Prior Expert Testimony{testimony.length > 0 && (() => {
            const total = testimony.filter(t => t.retained_by && t.retained_by !== '').length;
            if (total === 0) return null;
            const counts = { plaintiff: 0, defendant: 0, other: 0 };
            testimony.forEach(t => { if (t.retained_by && counts[t.retained_by] !== undefined) counts[t.retained_by]++; });
            const pct = (n) => Math.round((n / total) * 100);
            return <span style={{ fontSize: '0.75em', fontWeight: 'normal', marginLeft: 12, color: '#6b7280' }}>
              Plaintiff {pct(counts.plaintiff)}% | Defendant {pct(counts.defendant)}% | Other {pct(counts.other)}%
            </span>;
          })()}</h2>
          {testimony.map((test, i) => (
            <div key={i} className="portal-list-item">
              {editing && <button type="button" className="portal-list-item__remove" onClick={() => removeItem(testimony, setTestimony, i, 'prior_testimony')}>Remove</button>}
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Case Name</label>
                  <input className="portal-field__input" value={test.case_name} onChange={(e) => { const t = [...testimony]; t[i].case_name = e.target.value; setTestimony(t); }} maxLength={500} readOnly={!editing} />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Court</label>
                  <input className="portal-field__input" value={test.court || ''} onChange={(e) => { const t = [...testimony]; t[i].court = e.target.value; setTestimony(t); }} maxLength={500} readOnly={!editing} />
                </div>
              </div>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Jurisdiction</label>
                  <input className="portal-field__input" value={test.jurisdiction || ''} onChange={(e) => { const t = [...testimony]; t[i].jurisdiction = e.target.value; setTestimony(t); }} maxLength={500} readOnly={!editing} />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Date of Testimony</label>
                  <input className="portal-field__input" type="date" value={test.date_of_testimony || ''} onChange={(e) => { const t = [...testimony]; t[i].date_of_testimony = e.target.value; setTestimony(t); }} readOnly={!editing} />
                </div>
              </div>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Topic</label>
                  <input className="portal-field__input" value={test.topic || ''} onChange={(e) => { const t = [...testimony]; t[i].topic = e.target.value; setTestimony(t); }} maxLength={500} readOnly={!editing} />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Retained By</label>
                  <select className="portal-field__select" value={test.retained_by || ''} onChange={(e) => { const t = [...testimony]; t[i].retained_by = e.target.value; setTestimony(t); }} disabled={!editing}>
                    <option value="">-- Select --</option>
                    <option value="plaintiff">Plaintiff</option>
                    <option value="defendant">Defendant</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Testimony Outcome</label>
                  <select className="portal-field__select" value={test.outcome || ''} onChange={(e) => { const t = [...testimony]; t[i].outcome = e.target.value; setTestimony(t); }} disabled={!editing}>
                    <option value="">-- Select --</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          {editing && <button type="button" className="portal-add-btn" onClick={addTestimony}>+ Add Testimony</button>}
        </div>

        {/* Rate & Availability */}
        <div className="portal-card">
          <h2 className="portal-card__title">Rate & Availability</h2>
          <div className="portal-list-item__row">
            <div className="portal-field">
              <label className="portal-field__label">Review & Report Rate ($/hr)</label>
              <input className="portal-field__input" name="rate_review_report" type="number" value={form.rate_review_report} onChange={handleChange} placeholder="e.g. 500" readOnly={!editing} />
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Deposition Rate ($/hr)</label>
              <input className="portal-field__input" name="rate_deposition" type="number" value={form.rate_deposition} onChange={handleChange} placeholder="e.g. 600" readOnly={!editing} />
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Trial Testimony Rate ($/hr)</label>
              <input className="portal-field__input" name="rate_trial_testimony" type="number" value={form.rate_trial_testimony} onChange={handleChange} placeholder="e.g. 750" readOnly={!editing} />
            </div>
          </div>
          <div className="portal-field" style={{ marginTop: 12 }}>
            <label className="portal-field__label">Availability</label>
            <select className="portal-field__select" name="availability" value={form.availability} onChange={handleChange} disabled={!editing}>
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

      </form>
    </div>
  );
}
