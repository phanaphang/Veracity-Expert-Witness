import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function Profile() {
  const { user, profile, fetchProfile } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', bio: '', rate_review_report: '', rate_deposition: '', rate_trial_testimony: '', availability: 'available' });
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [testimony, setTestimony] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = useCallback(async () => {
    if (!user) return;
    const [specRes, selRes, eduRes, expRes, credRes, testRes] = await Promise.all([
      supabase.from('specialties').select('*').order('name'),
      supabase.from('expert_specialties').select('specialty_id').eq('expert_id', user.id),
      supabase.from('education').select('*').eq('expert_id', user.id).order('end_year', { ascending: false }),
      supabase.from('work_experience').select('*').eq('expert_id', user.id).order('start_date', { ascending: false }),
      supabase.from('credentials').select('*').eq('expert_id', user.id),
      supabase.from('prior_testimony').select('*').eq('expert_id', user.id).order('date_of_testimony', { ascending: false }),
    ]);
    setAllSpecialties(specRes.data || []);
    setSelectedSpecialties(selRes.data?.map(s => s.specialty_id) || []);
    setEducation(eduRes.data || []);
    setExperience(expRes.data || []);
    setCredentials(credRes.data || []);
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

  const addEducation = () => setEducation(prev => [...prev, { institution: '', degree: '', field_of_study: '', start_year: '', end_year: '', _new: true }]);
  const addExperience = () => setExperience(prev => [...prev, { organization: '', title: '', description: '', start_date: '', end_date: '', is_current: false, _new: true }]);
  const addCredential = () => setCredentials(prev => [...prev, { credential_type: 'certification', name: '', issuing_body: '', issue_date: '', expiry_date: '', credential_number: '', _new: true }]);
  const addTestimony = () => setTestimony(prev => [...prev, { case_name: '', court: '', jurisdiction: '', date_of_testimony: '', topic: '', retained_by: '', _new: true }]);

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

    const updates = { ...form };
    for (const key of ['rate_review_report', 'rate_deposition', 'rate_trial_testimony']) {
      if (updates[key]) updates[key] = parseFloat(updates[key]);
      else updates[key] = null;
    }
    if (!profile?.onboarded_at) updates.onboarded_at = new Date().toISOString();

    await supabase.from('profiles').update(updates).eq('id', user.id);

    // Specialties
    await supabase.from('expert_specialties').delete().eq('expert_id', user.id);
    if (selectedSpecialties.length > 0) {
      await supabase.from('expert_specialties').insert(
        selectedSpecialties.map(id => ({ expert_id: user.id, specialty_id: id }))
      );
    }

    // Education
    for (const edu of education) {
      const data = { expert_id: user.id, institution: edu.institution, degree: edu.degree, field_of_study: edu.field_of_study, start_year: edu.start_year ? parseInt(edu.start_year) : null, end_year: edu.end_year ? parseInt(edu.end_year) : null };
      if (edu.id && !edu._new) {
        await supabase.from('education').update(data).eq('id', edu.id);
      } else {
        await supabase.from('education').insert(data);
      }
    }

    // Experience
    for (const exp of experience) {
      const data = { expert_id: user.id, organization: exp.organization, title: exp.title, description: exp.description, start_date: exp.start_date || null, end_date: exp.end_date || null, is_current: exp.is_current };
      if (exp.id && !exp._new) {
        await supabase.from('work_experience').update(data).eq('id', exp.id);
      } else {
        await supabase.from('work_experience').insert(data);
      }
    }

    // Credentials
    for (const cred of credentials) {
      const data = { expert_id: user.id, credential_type: cred.credential_type, name: cred.name, issuing_body: cred.issuing_body, issue_date: cred.issue_date || null, expiry_date: cred.expiry_date || null, credential_number: cred.credential_number };
      if (cred.id && !cred._new) {
        await supabase.from('credentials').update(data).eq('id', cred.id);
      } else {
        await supabase.from('credentials').insert(data);
      }
    }

    // Prior Testimony
    for (const test of testimony) {
      const data = { expert_id: user.id, case_name: test.case_name || null, court: test.court || null, jurisdiction: test.jurisdiction || null, date_of_testimony: test.date_of_testimony || null, topic: test.topic || null, retained_by: test.retained_by || null };
      if (test.id && !test._new) {
        await supabase.from('prior_testimony').update(data).eq('id', test.id);
      } else {
        await supabase.from('prior_testimony').insert(data);
      }
    }

    await fetchProfile(user.id);
    await loadData();
    setMessage('Profile saved successfully');
    setSaving(false);
  };

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Edit Profile</h1>
      </div>

      {message && <div className="portal-alert portal-alert--success">{message}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
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
            <label className="portal-field__label">Bio</label>
            <textarea className="portal-field__textarea" name="bio" value={form.bio} onChange={handleChange} rows="4" placeholder="Describe your expertise and experience..." maxLength={5000} />
          </div>
        </div>

        {/* Specialties */}
        <div className="portal-card">
          <h2 className="portal-card__title">Specialties</h2>
          <div className="portal-checkbox-group">
            {allSpecialties.map(s => (
              <label key={s.id} className="portal-checkbox">
                <input type="checkbox" checked={selectedSpecialties.includes(s.id)} onChange={() => toggleSpecialty(s.id)} />
                {s.name}
              </label>
            ))}
          </div>
        </div>

        {/* Credentials */}
        <div className="portal-card">
          <h2 className="portal-card__title">Credentials</h2>
          {credentials.map((cred, i) => (
            <div key={i} className="portal-list-item">
              <button type="button" className="portal-list-item__remove" onClick={() => removeItem(credentials, setCredentials, i, 'credentials')}>Remove</button>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Type</label>
                  <select className="portal-field__select" value={cred.credential_type} onChange={(e) => { const c = [...credentials]; c[i].credential_type = e.target.value; setCredentials(c); }}>
                    <option value="certification">Certification</option>
                    <option value="license">License</option>
                    <option value="board_certification">Board Certification</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Name</label>
                  <input className="portal-field__input" value={cred.name} onChange={(e) => { const c = [...credentials]; c[i].name = e.target.value; setCredentials(c); }} />
                </div>
              </div>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Issuing Body</label>
                  <input className="portal-field__input" value={cred.issuing_body || ''} onChange={(e) => { const c = [...credentials]; c[i].issuing_body = e.target.value; setCredentials(c); }} />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Credential Number</label>
                  <input className="portal-field__input" value={cred.credential_number || ''} onChange={(e) => { const c = [...credentials]; c[i].credential_number = e.target.value; setCredentials(c); }} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="portal-add-btn" onClick={addCredential}>+ Add Credential</button>
        </div>

        {/* Education */}
        <div className="portal-card">
          <h2 className="portal-card__title">Education</h2>
          {education.map((edu, i) => (
            <div key={i} className="portal-list-item">
              <button type="button" className="portal-list-item__remove" onClick={() => removeItem(education, setEducation, i, 'education')}>Remove</button>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Institution</label>
                  <input className="portal-field__input" value={edu.institution} onChange={(e) => { const ed = [...education]; ed[i].institution = e.target.value; setEducation(ed); }} />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Degree</label>
                  <input className="portal-field__input" value={edu.degree} onChange={(e) => { const ed = [...education]; ed[i].degree = e.target.value; setEducation(ed); }} />
                </div>
              </div>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Field of Study</label>
                  <input className="portal-field__input" value={edu.field_of_study || ''} onChange={(e) => { const ed = [...education]; ed[i].field_of_study = e.target.value; setEducation(ed); }} />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Years (Start - End)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="portal-field__input" placeholder="Start" value={edu.start_year || ''} onChange={(e) => { const ed = [...education]; ed[i].start_year = e.target.value; setEducation(ed); }} />
                    <input className="portal-field__input" placeholder="End" value={edu.end_year || ''} onChange={(e) => { const ed = [...education]; ed[i].end_year = e.target.value; setEducation(ed); }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="portal-add-btn" onClick={addEducation}>+ Add Education</button>
        </div>

        {/* Work Experience */}
        <div className="portal-card">
          <h2 className="portal-card__title">Work Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} className="portal-list-item">
              <button type="button" className="portal-list-item__remove" onClick={() => removeItem(experience, setExperience, i, 'work_experience')}>Remove</button>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Organization</label>
                  <input className="portal-field__input" value={exp.organization} onChange={(e) => { const ex = [...experience]; ex[i].organization = e.target.value; setExperience(ex); }} />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Title</label>
                  <input className="portal-field__input" value={exp.title} onChange={(e) => { const ex = [...experience]; ex[i].title = e.target.value; setExperience(ex); }} />
                </div>
              </div>
              <div className="portal-field">
                <label className="portal-field__label">Description</label>
                <textarea className="portal-field__textarea" rows="2" value={exp.description || ''} onChange={(e) => { const ex = [...experience]; ex[i].description = e.target.value; setExperience(ex); }} />
              </div>
              <label className="portal-checkbox">
                <input type="checkbox" checked={exp.is_current || false} onChange={(e) => { const ex = [...experience]; ex[i].is_current = e.target.checked; setExperience(ex); }} />
                Currently working here
              </label>
            </div>
          ))}
          <button type="button" className="portal-add-btn" onClick={addExperience}>+ Add Experience</button>
        </div>

        {/* Prior Expert Testimony */}
        <div className="portal-card">
          <h2 className="portal-card__title">Prior Expert Testimony</h2>
          {testimony.map((test, i) => (
            <div key={i} className="portal-list-item">
              <button type="button" className="portal-list-item__remove" onClick={() => removeItem(testimony, setTestimony, i, 'prior_testimony')}>Remove</button>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Case Name</label>
                  <input className="portal-field__input" value={test.case_name} onChange={(e) => { const t = [...testimony]; t[i].case_name = e.target.value; setTestimony(t); }} maxLength={500} />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Court</label>
                  <input className="portal-field__input" value={test.court || ''} onChange={(e) => { const t = [...testimony]; t[i].court = e.target.value; setTestimony(t); }} maxLength={500} />
                </div>
              </div>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Jurisdiction</label>
                  <input className="portal-field__input" value={test.jurisdiction || ''} onChange={(e) => { const t = [...testimony]; t[i].jurisdiction = e.target.value; setTestimony(t); }} maxLength={500} />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Date of Testimony</label>
                  <input className="portal-field__input" type="date" value={test.date_of_testimony || ''} onChange={(e) => { const t = [...testimony]; t[i].date_of_testimony = e.target.value; setTestimony(t); }} />
                </div>
              </div>
              <div className="portal-list-item__row">
                <div className="portal-field">
                  <label className="portal-field__label">Topic</label>
                  <input className="portal-field__input" value={test.topic || ''} onChange={(e) => { const t = [...testimony]; t[i].topic = e.target.value; setTestimony(t); }} maxLength={500} />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Retained By</label>
                  <select className="portal-field__select" value={test.retained_by || ''} onChange={(e) => { const t = [...testimony]; t[i].retained_by = e.target.value; setTestimony(t); }}>
                    <option value="">-- Select --</option>
                    <option value="plaintiff">Plaintiff</option>
                    <option value="defendant">Defendant</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="portal-add-btn" onClick={addTestimony}>+ Add Testimony</button>
        </div>

        {/* Rate & Availability */}
        <div className="portal-card">
          <h2 className="portal-card__title">Rate & Availability</h2>
          <div className="portal-list-item__row">
            <div className="portal-field">
              <label className="portal-field__label">Review & Report Rate ($/hr)</label>
              <input className="portal-field__input" name="rate_review_report" type="number" value={form.rate_review_report} onChange={handleChange} placeholder="e.g. 500" />
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Deposition Rate ($/hr)</label>
              <input className="portal-field__input" name="rate_deposition" type="number" value={form.rate_deposition} onChange={handleChange} placeholder="e.g. 600" />
            </div>
            <div className="portal-field">
              <label className="portal-field__label">Trial Testimony Rate ($/hr)</label>
              <input className="portal-field__input" name="rate_trial_testimony" type="number" value={form.rate_trial_testimony} onChange={handleChange} placeholder="e.g. 750" />
            </div>
          </div>
          <div className="portal-field" style={{ marginTop: 12 }}>
            <label className="portal-field__label">Availability</label>
            <select className="portal-field__select" name="availability" value={form.availability} onChange={handleChange}>
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn--primary" disabled={saving} style={{ marginTop: 8 }}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
