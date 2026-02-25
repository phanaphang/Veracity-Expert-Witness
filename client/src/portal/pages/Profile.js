import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const ALLOWED_TYPES = ['application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024;

export default function Profile() {
  const { user, profile, fetchProfile } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', bio: '', rate_review_report: '', rate_deposition: '', rate_trial_testimony: '' });
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [expandedParents, setExpandedParents] = useState(new Set());
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [testimony, setTestimony] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [cvDocs, setCvDocs] = useState([]);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvError, setCvError] = useState('');
  const cvFileRef = useRef();

  const loadData = useCallback(async () => {
    if (!user) return;
    const [specRes, selRes, testRes] = await Promise.all([
      supabase.from('specialties').select('*').order('name'),
      supabase.from('expert_specialties').select('specialty_id').eq('expert_id', user.id),
      supabase.from('prior_testimony').select('*').eq('expert_id', user.id).order('date_of_testimony', { ascending: false }),
    ]);
    const allSpecs = specRes.data || [];
    const selIds = selRes.data?.map(s => s.specialty_id) || [];
    setAllSpecialties(allSpecs);
    setSelectedSpecialties(selIds);
    // Auto-expand any parent that already has a subspecialty selected
    const autoExpanded = new Set();
    for (const selId of selIds) {
      const spec = allSpecs.find(s => s.id === selId);
      if (spec?.parent_id) autoExpanded.add(spec.parent_id);
    }
    setExpandedParents(autoExpanded);
    setTestimony(testRes.data || []);

    const { data: cvData } = await supabase.from('documents').select('*').eq('expert_id', user.id).eq('document_type', 'cv').order('uploaded_at', { ascending: false });
    setCvDocs(cvData || []);
  }, [user]);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        rate_review_report: profile.rate_review_report || '',
        rate_deposition: profile.rate_deposition || '',
        rate_trial_testimony: profile.rate_trial_testimony || '',
      });
      setTags(profile.tags || []);
    }
    loadData();
  }, [profile, loadData]);

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 1) return digits;
    if (digits.length <= 4) return `${digits[0]}-${digits.slice(1)}`;
    if (digits.length <= 7) return `${digits[0]}-${digits.slice(1, 4)}-${digits.slice(4)}`;
    return `${digits[0]}-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setForm(prev => ({ ...prev, phone: formatPhone(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleSpecialty = (id) => {
    setSelectedSpecialties(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleParent = (parentId) => {
    setExpandedParents(prev => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        // Collapsing: clear any selected subspecialties under this parent
        const subIds = allSpecialties.filter(s => s.parent_id === parentId).map(s => s.id);
        setSelectedSpecialties(sel => sel.filter(id => !subIds.includes(id)));
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  };

  const TAG_MAX_LENGTH = 50;
  const TAG_MAX_COUNT = 20;
  // Allow only letters, numbers, spaces, and common punctuation used in subspecialty names
  const sanitizeTag = (value) => value.replace(/[^a-zA-Z0-9\s\-&().,']/g, '').slice(0, TAG_MAX_LENGTH);

  const addTag = (value) => {
    const tag = sanitizeTag(value).trim();
    if (!tag) { setTagInput(''); return; }
    if (tags.length >= TAG_MAX_COUNT) { setTagInput(''); return; }
    if (!tags.includes(tag)) setTags(prev => [...prev, tag]);
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleTagInput = (e) => setTagInput(sanitizeTag(e.target.value));

  const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag));

  const addTestimony = () => setTestimony(prev => [...prev, { case_name: '', court: '', jurisdiction: '', date_of_testimony: '', topic: '', retained_by: '', outcome: '', _new: true }]);

  const removeItem = (list, setList, index, table) => {
    const item = list[index];
    if (item.id) {
      supabase.from(table).delete().eq('id', item.id);
    }
    setList(prev => prev.filter((_, i) => i !== index));
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCvError('');
    if (!ALLOWED_TYPES.includes(file.type)) { setCvError('Only PDF files are accepted.'); return; }
    if (file.size > MAX_SIZE) { setCvError('File too large. Maximum size is 5MB.'); return; }
    setCvUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
    const filePath = `${user.id}/cv/${Date.now()}_${safeName}`;
    const { error: uploadError } = await supabase.storage.from('expert-documents').upload(filePath, file);
    if (uploadError) { setCvError('Upload failed. Please try again.'); setCvUploading(false); return; }
    await supabase.from('documents').insert({ expert_id: user.id, document_type: 'cv', file_name: file.name, file_path: filePath, file_size: file.size, mime_type: file.type });
    const { data } = await supabase.from('documents').select('*').eq('expert_id', user.id).eq('document_type', 'cv').order('uploaded_at', { ascending: false });
    setCvDocs(data || []);
    setCvUploading(false);
    if (cvFileRef.current) cvFileRef.current.value = '';
  };

  const handleCvDownload = async (doc) => {
    const win = window.open('', '_blank');
    const { data } = await supabase.storage.from('expert-documents').createSignedUrl(doc.file_path, 60);
    if (data?.signedUrl) {
      win.location.href = data.signedUrl;
    } else {
      win.close();
    }
  };

  const handleCvDelete = async (doc) => {
    await supabase.storage.from('expert-documents').remove([doc.file_path]);
    await supabase.from('documents').delete().eq('id', doc.id);
    setCvDocs(prev => prev.filter(d => d.id !== doc.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const errors = [];

    try {
      if (form.phone && !/^1-\d{3}-\d{3}-\d{4}$/.test(form.phone)) {
        setMessage('Phone number must be in the format 1-xxx-xxx-xxxx.');
        setSaving(false);
        return;
      }

      const updates = { ...form, tags };
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
              <input className="portal-field__input" name="first_name" value={form.first_name} onChange={handleChange} required maxLength={50} readOnly={!editing} />
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Last Name</label>
              <input className="portal-field__input" name="last_name" value={form.last_name} onChange={handleChange} required maxLength={50} readOnly={!editing} />
            </div>
          </div>
          <div className="portal-field">
            <label className="portal-field__label">Email</label>
            <input className="portal-field__input" name="email" type="email" value={form.email} onChange={handleChange} maxLength={254} readOnly={!editing} />
          </div>
          <div className="portal-field">
            <label className="portal-field__label">Phone</label>
            <input className="portal-field__input" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="1-xxx-xxx-xxxx" maxLength={14} readOnly={!editing} />
          </div>
          <div className="portal-field">
            <label className="portal-field__label">Bio</label>
            <textarea className="portal-field__textarea" name="bio" value={form.bio} onChange={handleChange} rows="4" placeholder="Describe your expertise and experience..." maxLength={2000} readOnly={!editing} />
          </div>
        </div>

        {/* Specialties & Subspecialties */}
        <div className="portal-card">
          <h2 className="portal-card__title">Specialties & Subspecialties</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-gray-500)', marginBottom: 16 }}>
            Select a specialty to expand its subspecialties, then choose the ones that apply.
          </p>
          {allSpecialties.filter(s => !s.parent_id).map(parent => {
            const subs = allSpecialties.filter(s => s.parent_id === parent.id);
            if (subs.length === 0) return null;
            const isExpanded = expandedParents.has(parent.id);
            return (
              <div key={parent.id} style={{ marginBottom: 12, borderBottom: '1px solid var(--color-gray-200)', paddingBottom: 12 }}>
                <label className="portal-checkbox" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-navy)', cursor: editing ? 'pointer' : 'default' }}>
                  <input
                    type="checkbox"
                    checked={isExpanded}
                    onChange={() => editing && toggleParent(parent.id)}
                    disabled={!editing}
                  />
                  {parent.name}
                </label>
                {isExpanded && (
                  <div className="portal-checkbox-group" style={{ marginTop: 10, marginLeft: 24 }}>
                    {subs.map(sub => (
                      <label key={sub.id} className="portal-checkbox">
                        <input type="checkbox" checked={selectedSpecialties.includes(sub.id)} onChange={() => toggleSpecialty(sub.id)} disabled={!editing} />
                        {sub.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add a Subspecialty */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-gray-200)' }}>
            <label className="portal-field__label">Add a Subspecialty</label>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-gray-500)', marginBottom: 10 }}>
              Add specific areas of expertise (e.g. "Soil and groundwater contamination", "PFAS remediation"). Press Enter or comma to add.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: tags.length > 0 ? 10 : 0 }}>
              {tags.map(tag => (
                <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#e0e7ff', color: '#3730a3', borderRadius: 999, padding: '3px 10px', fontSize: '0.8rem', fontWeight: 500 }}>
                  {tag}
                  {editing && (
                    <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3730a3', fontSize: '1rem', lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button>
                  )}
                </span>
              ))}
            </div>
            {editing && (
              <>
                <input
                  className="portal-field__input"
                  value={tagInput}
                  onChange={handleTagInput}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => tagInput.trim() && addTag(tagInput)}
                  placeholder="Type and press Enter..."
                  disabled={tags.length >= TAG_MAX_COUNT}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-gray-400)', marginTop: 4 }}>
                  <span>{tags.length}/{TAG_MAX_COUNT} added</span>
                  <span>{tagInput.length}/{TAG_MAX_LENGTH} characters</span>
                </div>
              </>
            )}
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
                  <input className="portal-field__input" value={test.case_name} onChange={(e) => { const t = [...testimony]; t[i].case_name = e.target.value; setTestimony(t); }} maxLength={150} readOnly={!editing} />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Court</label>
                  <input className="portal-field__input" value={test.court || ''} onChange={(e) => { const t = [...testimony]; t[i].court = e.target.value; setTestimony(t); }} maxLength={100} readOnly={!editing} />
                </div>
              </div>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Jurisdiction</label>
                  <input className="portal-field__input" value={test.jurisdiction || ''} onChange={(e) => { const t = [...testimony]; t[i].jurisdiction = e.target.value; setTestimony(t); }} maxLength={100} readOnly={!editing} />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Date of Testimony</label>
                  <input className="portal-field__input" type="date" value={test.date_of_testimony || ''} onChange={(e) => { const t = [...testimony]; t[i].date_of_testimony = e.target.value; setTestimony(t); }} readOnly={!editing} />
                </div>
              </div>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Topic</label>
                  <input className="portal-field__input" value={test.topic || ''} onChange={(e) => { const t = [...testimony]; t[i].topic = e.target.value; setTestimony(t); }} maxLength={100} readOnly={!editing} />
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
          <h2 className="portal-card__title">Rates</h2>
          <div className="portal-list-item__row">
            <div className="portal-field">
              <label className="portal-field__label">Review & Report Rate ($/hr)</label>
              <input className="portal-field__input" name="rate_review_report" type="number" value={form.rate_review_report} onChange={handleChange} placeholder="e.g. 500" min={0} max={9999} readOnly={!editing} />
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Deposition Rate ($/hr)</label>
              <input className="portal-field__input" name="rate_deposition" type="number" value={form.rate_deposition} onChange={handleChange} placeholder="e.g. 600" min={0} max={9999} readOnly={!editing} />
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Trial Testimony Rate ($/hr)</label>
              <input className="portal-field__input" name="rate_trial_testimony" type="number" value={form.rate_trial_testimony} onChange={handleChange} placeholder="e.g. 750" min={0} max={9999} readOnly={!editing} />
            </div>
          </div>
        </div>

      </form>

      {/* CV / Resume Upload */}
      <div className="portal-card">
        <h2 className="portal-card__title">CV / Resume</h2>
        {cvError && <div className="portal-alert portal-alert--error" style={{ marginBottom: 12 }}>{cvError}</div>}
        <div className="portal-field" style={{ marginBottom: 12 }}>
          <label className="portal-field__label">Upload CV / Resume</label>
          <input
            ref={cvFileRef}
            type="file"
            accept=".pdf"
            onChange={handleCvUpload}
            disabled={cvUploading}
            className="portal-field__input"
          />
          {cvUploading && <p style={{ fontSize: '0.85rem', color: 'var(--color-accent)', marginTop: 4 }}>Uploading...</p>}
          <p className="portal-upload__hint">PDF only. Max 5MB.</p>
        </div>
        {cvDocs.length > 0 && (
          <div className="portal-doc-grid">
            {cvDocs.map(doc => (
              <div key={doc.id} className="portal-doc-card">
                <div className="portal-doc-card__info">
                  <div className="portal-doc-card__name">{doc.file_name}</div>
                  <div className="portal-doc-card__meta">{new Date(doc.uploaded_at).toLocaleDateString()}</div>
                </div>
                <div className="portal-doc-card__actions">
                  <button className="portal-doc-card__btn" onClick={() => handleCvDownload(doc)} title="Download">
                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="portal-doc-card__btn" onClick={() => handleCvDelete(doc)} title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
