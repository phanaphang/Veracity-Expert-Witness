import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { generateExpertPdf } from './generateExpertPdf';
import CalendarView from '../components/CalendarView';

function formatPhone(value) {
  if (!value) return '—';
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 11) return value;
  return `${digits[0]}-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
}

export default function ExpertDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const fromCase = searchParams.get('from') === 'case';
  const caseId = searchParams.get('caseId');
  const [expert, setExpert] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [testimony, setTestimony] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase.from('expert_specialties').select('specialties(name)').eq('expert_id', id),
      supabase.from('prior_testimony').select('*').eq('expert_id', id).order('date_of_testimony', { ascending: false }),
      supabase.from('documents').select('*').eq('expert_id', id).order('uploaded_at', { ascending: false }),
    ]).then(([prof, specs, test, docs]) => {
      setExpert(prof.data);
      setSpecialties(specs.data?.map(s => s.specialties?.name).filter(Boolean) || []);
      setTestimony(test.data || []);
      setDocuments(docs.data || []);
      setLoading(false);
    });
  }, [id]);

  const handleDownload = async (doc) => {
    const { data } = await supabase.storage.from('expert-documents').createSignedUrl(doc.file_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const handleGeneratePdf = async () => {
    setGenerating(true);
    try {
      await generateExpertPdf(expert, specialties, testimony, documents, supabase);
    } catch (e) {
      console.error('PDF generation failed', e);
      alert('Failed to generate PDF. See console for details.');
    } finally {
      setGenerating(false);
    }
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
          {fromCase && caseId ? (
            <Link to={`/admin/cases/${caseId}`} style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textDecoration: 'none', marginBottom: 8, display: 'inline-block' }}>
              &larr; Back to Case
            </Link>
          ) : (
            <Link to="/admin/experts" style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textDecoration: 'none', marginBottom: 8, display: 'inline-block' }}>
              &larr; Back to Experts
            </Link>
          )}
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
          <button className="portal-btn-action" onClick={handleGeneratePdf} disabled={generating}>
            {generating ? 'Generating…' : 'Generate File'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <span className={`portal-badge portal-badge--${expert.profile_status || 'pending'}`}>
          {expert.profile_status || 'pending review'}
        </span>
        {expert.onboarded_at && <span className="portal-badge portal-badge--accepted">onboarded</span>}
      </div>

      {/* Basic Info */}
      <div className="portal-card">
        <h2 className="portal-card__title">Basic Information</h2>
        <div className="portal-list-item__row">
          <div><strong>Email:</strong> {expert.email || '—'}</div>
          <div><strong>Phone:</strong> {formatPhone(expert.phone)}</div>
        </div>
        {(expert.rate_review_report || expert.rate_deposition || expert.rate_trial_testimony) && (
          <div style={{ marginTop: 8 }}>
            <strong>Hourly Rates:</strong>
            <div style={{ display: 'flex', gap: 16, marginTop: 4, fontSize: '0.9rem', color: 'var(--color-gray-600)' }}>
              {expert.rate_review_report && <span>Review & Report: ${expert.rate_review_report}/hr</span>}
              {expert.rate_deposition && <span>Deposition: ${expert.rate_deposition}/hr</span>}
              {expert.rate_trial_testimony && <span>Trial Testimony: ${expert.rate_trial_testimony}/hr</span>}
            </div>
          </div>
        )}
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

      {/* Prior Expert Testimony */}
      <div className="portal-card">
        <h2 className="portal-card__title">Prior Expert Testimony ({testimony.length}){testimony.length > 0 && (() => {
            const total = testimony.filter(t => t.retained_by && t.retained_by !== '').length;
            if (total === 0) return null;
            const counts = { plaintiff: 0, defendant: 0, other: 0 };
            testimony.forEach(t => { if (t.retained_by && counts[t.retained_by] !== undefined) counts[t.retained_by]++; });
            const pct = (n) => Math.round((n / total) * 100);
            return <span style={{ fontSize: '0.75em', fontWeight: 'normal', marginLeft: 12, color: '#6b7280' }}>
              Plaintiff {pct(counts.plaintiff)}% | Defendant {pct(counts.defendant)}% | Other {pct(counts.other)}%
            </span>;
          })()}</h2>
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

      {/* Calendar */}
      <div className="portal-card">
        <h2 className="portal-card__title">Calendar</h2>
        <CalendarView expertId={id} />
      </div>
    </div>
  );
}
