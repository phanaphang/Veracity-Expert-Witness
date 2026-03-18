import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';

const MODULE_TITLE = 'Trial Testimony as an Expert Witness';

export default function TrialTestimonyCertificatePage({ onProgressUpdate }) {
  const { user, profile } = useAuth();
  const certRef = useRef(null);

  const [certName, setCertName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  // Load existing certificate data (anchored on the quiz row)
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const { data } = await supabase
          .from('trial_testimony_progress')
          .select('certificate_name, certificate_issued_at')
          .eq('user_id', user.id)
          .eq('lesson_id', 'quiz')
          .maybeSingle();

        if (data?.certificate_name) {
          setCertName(data.certificate_name);
          const d = data.certificate_issued_at
            ? new Date(data.certificate_issued_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              });
          setIssueDate(d);
        } else {
          // Pre-fill with profile name
          const defaultName =
            [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || '';
          setNameInput(defaultName);
        }
      } catch (e) {
        console.error('Certificate load error', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, profile]);

  const handleSaveName = async () => {
    const sanitized = DOMPurify.sanitize(nameInput.trim());
    if (!sanitized) {
      setError('Please enter your preferred display name.');
      return;
    }
    if (sanitized.length > 200) {
      setError('Name is too long (max 200 characters).');
      return;
    }

    setError('');
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const displayDate = new Date(now).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      const { data: existing } = await supabase
        .from('trial_testimony_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', 'quiz')
        .maybeSingle();

      if (existing) {
        await supabase
          .from('trial_testimony_progress')
          .update({ certificate_name: sanitized, certificate_issued_at: now })
          .eq('id', existing.id);
      } else {
        await supabase.from('trial_testimony_progress').insert({
          user_id: user.id,
          lesson_id: 'quiz',
          completed: true,
          certificate_name: sanitized,
          certificate_issued_at: now,
        });
      }

      setCertName(sanitized);
      setIssueDate(displayDate);
      if (onProgressUpdate) onProgressUpdate();

      // Trigger completion emails (non-fatal)
      if (!emailSent) {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (token && profile?.email) {
          try {
            await fetch('/api/training/trial-testimony-certificate-issued', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                certificateName: sanitized,
                completionDate: displayDate,
                expertEmail: profile.email,
              }),
            });
            setEmailSent(true);
          } catch (emailErr) {
            console.error('Certificate email error (non-fatal):', emailErr);
          }
        }
      }
    } catch (e) {
      console.error('Certificate save error', e);
      setError('Could not save your certificate. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pxW = canvas.width / 2;
      const pxH = canvas.height / 2;
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [pxW, pxH] });
      pdf.addImage(imgData, 'PNG', 0, 0, pxW, pxH);
      pdf.save('trial-testimony-certificate.pdf');
    } catch (e) {
      console.error('Download error', e);
      setError('Could not generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="portal-loading">
        <div className="portal-loading__spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Certificate of Completion</h1>
        <p className="portal-page__subtitle">{MODULE_TITLE}</p>
      </div>

      {/* Name prompt */}
      {!certName && (
        <div className="portal-card training-cert-name-prompt">
          <h2 className="training-cert-name-prompt__title">
            How should your name appear on the certificate?
          </h2>
          <p className="training-cert-name-prompt__sub">
            Enter your preferred display name exactly as you want it printed.
          </p>
          {error && <div className="portal-alert portal-alert--error">{error}</div>}
          <div className="portal-field">
            <label className="portal-field__label" htmlFor="certName">
              Display Name
            </label>
            <input
              id="certName"
              className="portal-field__input"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={200}
              placeholder="e.g. Dr. Jane Smith, MD"
            />
          </div>
          <button
            className="btn btn--primary"
            onClick={handleSaveName}
            disabled={saving || !nameInput.trim()}
          >
            {saving ? 'Saving...' : 'Generate Certificate'}
          </button>
        </div>
      )}

      {/* Certificate */}
      {certName && (
        <>
          {error && (
            <div className="portal-alert portal-alert--error" style={{ marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div className="training-certificate-wrapper">
            <div className="training-certificate" ref={certRef}>
              <div className="training-certificate__frame">
                {/* Header */}
                <div className="training-certificate__header">
                  <div className="training-certificate__logo-row">
                    <svg viewBox="0 0 24 24" fill="none" width="36" height="36">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#d36622" />
                      <path d="M2 17l10 5 10-5" stroke="#d36622" strokeWidth="2" fill="none" />
                      <path d="M2 12l10 5 10-5" stroke="#d36622" strokeWidth="2" fill="none" />
                    </svg>
                    <span className="training-certificate__org">Veracity Expert Witness LLC</span>
                  </div>
                  <div className="training-certificate__presents">presents this</div>
                </div>

                {/* Title */}
                <div className="training-certificate__title-block">
                  <div className="training-certificate__cert-label">Certificate of Completion</div>
                  <div className="training-certificate__divider" />
                  <div className="training-certificate__course-name">{MODULE_TITLE}</div>
                </div>

                {/* Recipient */}
                <div className="training-certificate__awarded-to">awarded to</div>
                <div className="training-certificate__name">{certName}</div>

                {/* Details */}
                <div className="training-certificate__details">
                  <div className="training-certificate__detail-row">
                    <span className="training-certificate__detail-label">Completion Date</span>
                    <span className="training-certificate__detail-value">{issueDate}</span>
                  </div>
                  <div className="training-certificate__detail-row">
                    <span className="training-certificate__detail-label">Course Duration</span>
                    <span className="training-certificate__detail-value">
                      ~75 minutes &middot; 10 Lessons &middot; 1 Scenario &middot; 1 Knowledge Check
                    </span>
                  </div>
                  <div className="training-certificate__detail-row">
                    <span className="training-certificate__detail-label">Issued by</span>
                    <span className="training-certificate__detail-value">
                      Veracity Expert Witness LLC &middot; California
                    </span>
                  </div>
                </div>

                {/* Footer seal */}
                <div className="training-certificate__footer">
                  <div className="training-certificate__seal">
                    <svg viewBox="0 0 60 60" fill="none" width="60" height="60">
                      <circle cx="30" cy="30" r="28" stroke="#d36622" strokeWidth="2" />
                      <circle cx="30" cy="30" r="22" stroke="#d36622" strokeWidth="1" />
                      <text
                        x="30"
                        y="27"
                        textAnchor="middle"
                        fill="#1a1f3a"
                        fontSize="7"
                        fontWeight="700"
                        fontFamily="serif"
                      >
                        VERACITY
                      </text>
                      <text
                        x="30"
                        y="36"
                        textAnchor="middle"
                        fill="#d36622"
                        fontSize="5"
                        fontFamily="serif"
                      >
                        EXPERT WITNESS
                      </text>
                    </svg>
                  </div>
                  <p className="training-certificate__footer-text">
                    This certificate confirms the recipient has successfully completed the Trial
                    Testimony as an Expert Witness training module, including all lessons, branching
                    scenario, and knowledge check.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="training-cert-actions">
            <button
              className="btn btn--primary"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'Generating PDF...' : 'Download Certificate (PDF)'}
            </button>
            <Link to="/training/trial-testimony/resources" className="btn btn--secondary">
              View Resources
            </Link>
            <Link to="/training/trial-testimony" className="btn btn--secondary">
              Back to Training
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
