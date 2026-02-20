import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { formatName } from '../../utils/formatName';

export default function CaseCreate() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [specialties, setSpecialties] = useState([]);
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    client: '',
    specialty_id: '',
    case_type: '',
    jurisdiction: '',
    case_manager: '',
    status: 'open',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [managerConfirmTarget, setManagerConfirmTarget] = useState(null);

  useEffect(() => {
    Promise.all([
      supabase.from('specialties').select('*').order('name'),
      supabase.from('profiles').select('id, first_name, last_name, email, role').in('role', ['admin', 'staff']).order('first_name'),
    ]).then(([specRes, mgrRes]) => {
      setSpecialties(specRes.data || []);
      setManagers(mgrRes.data || []);
    });
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const insertData = { ...form };
    if (!insertData.specialty_id) insertData.specialty_id = null;
    if (!insertData.case_manager) insertData.case_manager = null;

    const { data, error: insertError } = await supabase
      .from('cases')
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      setError('Failed to create case. Please check your input and try again.');
      setSaving(false);
      return;
    }

    // Send notification email to assigned case manager
    if (data.case_manager) {
      fetch('/api/notify-case-manager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          caseManagerId: data.case_manager,
          caseTitle: data.title,
          caseId: data.id,
        }),
      }).catch(() => {});
    }

    navigate(`/admin/cases/${data.id}`);
  };

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Create Case</h1>
      </div>

      {error && <div className="portal-alert portal-alert--error">{error}</div>}

      <div className="portal-card" style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div className="portal-field">
            <label className="portal-field__label">Case Title *</label>
            <input className="portal-field__input" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Medical Malpractice — Smith v. Hospital" />
          </div>
          <div className="portal-field">
            <label className="portal-field__label">Description *</label>
            <textarea className="portal-field__textarea" name="description" value={form.description} onChange={handleChange} required rows="4" placeholder="Describe the case details and what type of expert is needed..." />
          </div>
          <div className="portal-field">
            <label className="portal-field__label">Client</label>
            <input className="portal-field__input" name="client" value={form.client} onChange={handleChange} placeholder="e.g. Smith & Associates Law Firm" />
          </div>
          <div className="portal-list-item__row">
            <div className="portal-field">
              <label className="portal-field__label">Specialty</label>
              <select className="portal-field__select" name="specialty_id" value={form.specialty_id} onChange={handleChange}>
                <option value="">Select specialty</option>
                {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Case Type</label>
              <input className="portal-field__input" name="case_type" value={form.case_type} onChange={handleChange} placeholder="e.g. Medical Malpractice" />
            </div>
          </div>
          <div className="portal-list-item__row">
            <div className="portal-field">
              <label className="portal-field__label">Jurisdiction</label>
              <input className="portal-field__input" name="jurisdiction" value={form.jurisdiction} onChange={handleChange} placeholder="e.g. California, Federal" />
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Case Manager</label>
              <select
                className="portal-field__select"
                name="case_manager"
                value={form.case_manager}
                onChange={(e) => {
                  const value = e.target.value || '';
                  const selected = managers.find(m => m.id === value);
                  setManagerConfirmTarget({ id: value, profile: selected });
                }}
              >
                <option value="">Select case manager</option>
                {managers.map(m => (
                  <option key={m.id} value={m.id}>
                    {formatName(m)} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn--primary" disabled={saving} style={{ marginTop: 8, padding: '10px 24px' }}>
            {saving ? 'Creating...' : 'Create Case'}
          </button>
        </form>
      </div>

      {managerConfirmTarget && (
        <div className="portal-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="portal-card" style={{ maxWidth: 440, width: '90%', padding: 24 }}>
            <h3 style={{ margin: '0 0 8px', color: 'var(--color-gray-800)' }}>
              {managerConfirmTarget.id ? 'Assign Case Manager' : 'Remove Case Manager'}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
              {managerConfirmTarget.id ? (
                <>Are you sure you want to assign <strong>{formatName(managerConfirmTarget.profile)}</strong> as the case manager?</>
              ) : (
                <>Are you sure you want to remove the current case manager?</>
              )}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn--secondary" onClick={() => setManagerConfirmTarget(null)}>Cancel</button>
              <button
                className="btn btn--primary"
                onClick={() => {
                  setForm(prev => ({ ...prev, case_manager: managerConfirmTarget.id }));
                  setManagerConfirmTarget(null);
                }}
              >
                {managerConfirmTarget.id ? 'Assign Manager' : 'Remove Manager'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
