import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function ExpertDetail() {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [testimony, setTestimony] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase.from('expert_specialties').select('specialties(name)').eq('expert_id', id),
      supabase.from('education').select('*').eq('expert_id', id).order('end_year', { ascending: false }),
      supabase.from('work_experience').select('*').eq('expert_id', id).order('start_date', { ascending: false }),
      supabase.from('credentials').select('*').eq('expert_id', id),
      supabase.from('prior_testimony').select('*').eq('expert_id', id).order('date_of_testimony', { ascending: false }),
      supabase.from('documents').select('*').eq('expert_id', id).order('uploaded_at', { ascending: false }),
    ]).then(([prof, specs, edu, exp, creds, test, docs]) => {
      setExpert(prof.data);
      setSpecialties(specs.data?.map(s => s.specialties?.name).filter(Boolean) || []);
      setEducation(edu.data || []);
      setExperience(exp.data || []);
      setCredentials(creds.data || []);
      setTestimony(test.data || []);
      setDocuments(docs.data || []);
      setLoading(false);
    });
  }, [id]);

  const handleDownload = async (doc) => {
    const { data } = await supabase.storage.from('expert-documents').createSignedUrl(doc.file_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const updateStatus = async (status) => {
    await supabase.from('profiles').update({ profile_status: status }).eq('id', id);
    setExpert(prev => ({ ...prev, profile_status: status }));
  };

  if (loading) return <div className="portal-loading"><div className="portal-loading__spinner"></div></div>;
  if (!expert) return <div className="portal-empty"><p className="portal-empty__text">Expert not found</p></div>;

  return (
    <div>
      <div className="portal-page__header">
        <div>
          <Link to="/admin/experts" style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textDecoration: 'none', marginBottom: 8, display: 'inline-block' }}>
            &larr; Back to Experts
          </Link>
          <h1 className="portal-page__title">
            {expert.first_name ? `${expert.first_name} ${expert.last_name || ''}`.trim() : expert.email}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--primary" onClick={() => updateStatus('approved')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Approve
          </button>
          <button className="portal-btn-action" onClick={() => updateStatus('rejected')}>
            Reject
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <span className={`portal-badge portal-badge--${expert.profile_status || 'pending'}`}>
          {expert.profile_status || 'pending review'}
        </span>
        <span className={`portal-badge portal-badge--${expert.availability || 'pending'}`}>
          {expert.availability || 'not set'}
        </span>
        {expert.onboarded_at && <span className="portal-badge portal-badge--accepted">onboarded</span>}
      </div>

      {/* Basic Info */}
      <div className="portal-card">
        <h2 className="portal-card__title">Basic Information</h2>
        <div className="portal-list-item__row">
          <div><strong>Email:</strong> {expert.email}</div>
          <div><strong>Phone:</strong> {expert.phone || '—'}</div>
        </div>
        {expert.hourly_rate && <p><strong>Hourly Rate:</strong> ${expert.hourly_rate}</p>}
        {expert.bio && (
          <div style={{ marginTop: 12 }}>
            <strong>Bio:</strong>
            <p style={{ marginTop: 4, lineHeight: 1.6, color: 'var(--color-gray-600)' }}>{expert.bio}</p>
          </div>
        )}
      </div>

      {/* Specialties */}
      {specialties.length > 0 && (
        <div className="portal-card">
          <h2 className="portal-card__title">Specialties</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {specialties.map((name, i) => (
              <span key={i} className="portal-badge portal-badge--open">{name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Credentials */}
      {credentials.length > 0 && (
        <div className="portal-card">
          <h2 className="portal-card__title">Credentials</h2>
          {credentials.map(cred => (
            <div key={cred.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--color-gray-200)' }}>
              <strong>{cred.name}</strong> <span className="portal-badge portal-badge--open">{cred.credential_type}</span>
              {cred.issuing_body && <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>{cred.issuing_body}</p>}
              {cred.credential_number && <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)' }}>#{cred.credential_number}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="portal-card">
          <h2 className="portal-card__title">Education</h2>
          {education.map(edu => (
            <div key={edu.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--color-gray-200)' }}>
              <strong>{edu.degree}</strong> — {edu.institution}
              {edu.field_of_study && <span>, {edu.field_of_study}</span>}
              <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)' }}>
                {edu.start_year && `${edu.start_year} – `}{edu.end_year || 'Present'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="portal-card">
          <h2 className="portal-card__title">Work Experience</h2>
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--color-gray-200)' }}>
              <strong>{exp.title}</strong> at {exp.organization}
              {exp.is_current && <span className="portal-badge portal-badge--accepted" style={{ marginLeft: 8 }}>Current</span>}
              {exp.description && <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', marginTop: 4 }}>{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Prior Expert Testimony */}
      <div className="portal-card">
        <h2 className="portal-card__title">Prior Expert Testimony ({testimony.length})</h2>
        {testimony.length === 0 ? (
          <p style={{ color: 'var(--color-gray-400)', fontSize: '0.85rem' }}>No prior testimony on record</p>
        ) : (
          testimony.map(test => (
            <div key={test.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--color-gray-200)' }}>
              <strong>{test.case_name}</strong>
              {test.retained_by && <span className="portal-badge portal-badge--open" style={{ marginLeft: 8 }}>{test.retained_by}</span>}
              {test.court && <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>{test.court}{test.jurisdiction && ` — ${test.jurisdiction}`}</p>}
              {!test.court && test.jurisdiction && <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>{test.jurisdiction}</p>}
              {test.topic && <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>Topic: {test.topic}</p>}
              {test.date_of_testimony && <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)' }}>{new Date(test.date_of_testimony).toLocaleDateString()}</p>}
            </div>
          ))
        )}
      </div>

      {/* Documents */}
      <div className="portal-card">
        <h2 className="portal-card__title">Documents ({documents.length})</h2>
        {documents.length === 0 ? (
          <p style={{ color: 'var(--color-gray-400)', fontSize: '0.85rem' }}>No documents uploaded</p>
        ) : (
          <div className="portal-doc-grid">
            {documents.map(doc => (
              <div key={doc.id} className="portal-doc-card">
                <div className="portal-doc-card__info">
                  <div className="portal-doc-card__name">{doc.file_name}</div>
                  <div className="portal-doc-card__meta">{doc.document_type} &middot; {new Date(doc.uploaded_at).toLocaleDateString()}</div>
                </div>
                <button className="portal-doc-card__btn" onClick={() => handleDownload(doc)} title="Download">
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
