import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { formatName } from '../../utils/formatName';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';

export default function CaseCreate() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    client: '',
    case_type: '',
    jurisdiction: '',
    case_manager: '',
    status: 'open',
  });
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [expandedParents, setExpandedParents] = useState(new Set());
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [managerConfirmTarget, setManagerConfirmTarget] = useState(null);
  const isDirty = form.title !== '' || form.description !== '' || form.client !== '' || form.case_type !== '' || form.jurisdiction !== '';
  const { UnsavedModal, allowNavigation } = useUnsavedChanges(isDirty);

  useEffect(() => {
    Promise.all([
      supabase.from('specialties').select('*').order('name'),
      supabase.from('profiles').select('id, first_name, last_name, email, role').in('role', ['admin', 'staff']).order('first_name'),
    ]).then(([specRes, mgrRes]) => {
      setAllSpecialties(specRes.data || []);
      setManagers(mgrRes.data || []);
    });
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleParent = (parentId) => {
    setExpandedParents(prev => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        const subIds = allSpecialties.filter(s => s.parent_id === parentId).map(s => s.id);
        setSelectedSpecialties(sel => sel.filter(id => !subIds.includes(id)));
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  };

  const toggleSpecialty = (id) => {
    setSelectedSpecialties(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const TAG_MAX_LENGTH = 50;
  const sanitizeTag = (value) => value.replace(/[^a-zA-Z0-9\s\-&().,']/g, '').slice(0, TAG_MAX_LENGTH);
  const addTag = (value) => {
    const tag = sanitizeTag(value).trim();
    if (!tag || tags.includes(tag)) { setTagInput(''); return; }
    setTags(prev => [...prev, tag]);
    setTagInput('');
  };
  const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag));
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const insertData = { ...form, specialty_id: null, specialty_tags: tags };
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

    if (selectedSpecialties.length > 0) {
      await supabase.from('case_specialties').insert(
        selectedSpecialties.map(sid => ({ case_id: data.id, specialty_id: sid }))
      );
    }

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

    allowNavigation();
    navigate(`/admin/cases/${data.id}`);
  };

  const parents = allSpecialties.filter(s => !s.parent_id);
  const hasSubs = allSpecialties.some(s => s.parent_id);

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Create Case</h1>
      </div>

      {error && <div className="portal-alert portal-alert--error">{error}</div>}

      <div className="portal-card" style={{ maxWidth: 640 }}>
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

          {/* Specialties */}
          <div className="portal-field">
            <label className="portal-field__label">Specialties & Subspecialties</label>
            {hasSubs ? (
              <div style={{ border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-gray-500)', margin: '0 0 10px' }}>
                  Select a specialty to expand its subspecialties, then choose the ones that apply.
                </p>
                {parents.map(parent => {
                  const subs = allSpecialties.filter(s => s.parent_id === parent.id);
                  if (subs.length === 0) return null;
                  const isExpanded = expandedParents.has(parent.id);
                  return (
                    <div key={parent.id} style={{ marginBottom: 10, borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 10 }}>
                      <label className="portal-checkbox" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-navy)' }}>
                        <input
                          type="checkbox"
                          checked={isExpanded}
                          onChange={() => toggleParent(parent.id)}
                        />
                        {parent.name}
                      </label>
                      {isExpanded && (
                        <div className="portal-checkbox-group" style={{ marginTop: 8, marginLeft: 24 }}>
                          {subs.map(sub => (
                            <label key={sub.id} className="portal-checkbox">
                              <input
                                type="checkbox"
                                checked={selectedSpecialties.includes(sub.id)}
                                onChange={() => toggleSpecialty(sub.id)}
                              />
                              {sub.name}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {selectedSpecialties.length > 0 && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', margin: '4px 0 0', fontWeight: 500 }}>
                    {selectedSpecialties.length} subspecialt{selectedSpecialties.length === 1 ? 'y' : 'ies'} selected
                  </p>
                )}
                <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 10, marginTop: 10 }}>
                  {tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      {tags.map(tag => (
                        <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#e0e7ff', color: '#3730a3', borderRadius: 999, padding: '3px 10px', fontSize: '0.8rem', fontWeight: 500 }}>
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3730a3', fontSize: '1rem', lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    className="portal-field__input"
                    value={tagInput}
                    onChange={(e) => setTagInput(sanitizeTag(e.target.value))}
                    onKeyDown={handleTagKeyDown}
                    onBlur={() => tagInput.trim() && addTag(tagInput)}
                    placeholder="Other Subspecialty"
                    style={{ marginBottom: 0 }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', marginTop: 4, marginBottom: 0 }}>
                    Press Enter to add. For subspecialties not in the list above.
                  </p>
                </div>
              </div>
            ) : (
              <select className="portal-field__select" value={selectedSpecialties[0] || ''} onChange={(e) => setSelectedSpecialties(e.target.value ? [e.target.value] : [])}>
                <option value="">Select specialty</option>
                {allSpecialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}
          </div>

          <div className="portal-list-item__row">
            <div className="portal-field">
              <label className="portal-field__label">Case Type</label>
              <input className="portal-field__input" name="case_type" value={form.case_type} onChange={handleChange} placeholder="e.g. Medical Malpractice" />
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Jurisdiction</label>
              <input className="portal-field__input" name="jurisdiction" value={form.jurisdiction} onChange={handleChange} placeholder="e.g. California, Federal" />
            </div>
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
      {UnsavedModal}
    </div>
  );
}
