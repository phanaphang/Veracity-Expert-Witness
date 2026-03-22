import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const TERMS_VERSION = '1.0';

export default function TrainingTermsModal({ onAccepted }) {
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const contentRef = useRef(null);
  const modalRef = useRef(null);

  // Check if user has already accepted this version
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('training_terms_acceptance')
        .select('id')
        .eq('user_id', user.id)
        .eq('terms_version', TERMS_VERSION)
        .maybeSingle();
      if (data) {
        setAccepted(true);
        onAccepted();
      }
      setChecking(false);
    })();
  }, [user, onAccepted]);

  // Track scroll position
  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setScrolledToBottom(true);
    }
  };

  const handleAccept = async () => {
    setSubmitting(true);
    setError('');
    const { error: insertError } = await supabase
      .from('training_terms_acceptance')
      .insert({
        user_id: user.id,
        terms_version: TERMS_VERSION,
      });
    if (insertError) {
      setError('Unable to record your acceptance. Please try again.');
      setSubmitting(false);
      return;
    }
    setAccepted(true);
    onAccepted();
  };

  // Focus trap and Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') return;
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll('button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  // Lock body scroll and set initial focus when modal opens
  useEffect(() => {
    if (checking || accepted) return;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      if (contentRef.current) contentRef.current.focus();
    }, 50);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, [checking, accepted]);

  if (checking || accepted) return null;

  return (
    <div
      className="training-terms-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="training-terms-title"
      onKeyDown={handleKeyDown}
    >
      <div className="training-terms-modal" ref={modalRef}>
        <h2 id="training-terms-title" className="training-terms-modal__title">Training Materials - Terms of Use</h2>
        <p className="training-terms-modal__subtitle">
          Please review and accept the following terms before accessing training materials and resources.
        </p>

        <div
          className="training-terms-modal__content"
          ref={contentRef}
          onScroll={handleScroll}
          tabIndex={-1}
        >
          <h3>1. Educational Purpose</h3>
          <p>
            All training materials, courses, lessons, quizzes, scenarios, downloadable resources,
            and related content (collectively, &ldquo;Training Materials&rdquo;) provided through the
            Veracity Expert Witness LLC portal are for <strong>educational and informational purposes
            only</strong>. Training Materials do not constitute legal advice, and nothing in these
            materials creates an attorney-client relationship, a professional advisory relationship,
            or any other fiduciary relationship between you and Veracity Expert Witness LLC.
          </p>

          <h3>2. No Guarantee of Outcomes</h3>
          <p>
            Veracity Expert Witness LLC makes no representations or warranties regarding the
            accuracy, completeness, or applicability of any Training Materials to any specific
            legal proceeding, jurisdiction, or factual scenario. Completion of any training module
            or receipt of any certificate does not guarantee qualification as an expert witness,
            admissibility of testimony, or any particular outcome in a legal proceeding.
          </p>

          <h3>3. Professional Responsibility</h3>
          <p>
            You acknowledge and agree that:
          </p>
          <ul>
            <li>
              You are solely responsible for your own professional conduct, testimony, reports,
              and opinions in any legal proceeding.
            </li>
            <li>
              You must independently verify that your testimony and conduct comply with all
              applicable laws, rules of evidence, professional codes of conduct, and licensing
              requirements in each jurisdiction where you provide expert witness services.
            </li>
            <li>
              The Training Materials are general in nature and may not reflect the specific
              rules, standards, or procedures applicable in your jurisdiction or area of expertise.
            </li>
            <li>
              You will exercise your own independent professional judgment and will not rely
              solely on Training Materials as the basis for any professional opinion or testimony.
            </li>
          </ul>

          <h3>4. Indemnification</h3>
          <p>
            You agree to indemnify, defend, and hold harmless Veracity Expert Witness LLC, its
            officers, directors, employees, agents, and affiliates from and against any and all
            claims, liabilities, damages, losses, costs, and expenses (including reasonable
            attorneys&rsquo; fees) arising out of or related to:
          </p>
          <ul>
            <li>Your use of or reliance on any Training Materials;</li>
            <li>
              Your expert witness testimony, reports, or professional conduct in any legal
              proceeding;
            </li>
            <li>
              Any claim that your testimony or professional services were inadequate,
              inaccurate, or otherwise deficient;
            </li>
            <li>Your violation of these Terms of Use or any applicable law or regulation.</li>
          </ul>

          <h3>5. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, Veracity Expert Witness LLC shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages,
            or any loss of profits, revenue, data, or business opportunities, arising out of or
            related to the Training Materials, regardless of the theory of liability. Veracity
            Expert Witness LLC&rsquo;s total aggregate liability for any claim arising from the
            Training Materials shall not exceed the fees you paid for access to the Training
            Materials in the twelve (12) months preceding the claim.
          </p>

          <h3>6. Intellectual Property</h3>
          <p>
            All Training Materials are the proprietary content of Veracity Expert Witness LLC
            and are protected by copyright and other intellectual property laws. You may not
            reproduce, distribute, modify, create derivative works from, or publicly display
            any Training Materials without prior written consent from Veracity Expert Witness LLC.
            Downloaded reference guides are for your personal professional use only.
          </p>

          <h3>7. Confidentiality</h3>
          <p>
            Training Materials may contain proprietary methodologies, strategies, and frameworks
            developed by Veracity Expert Witness LLC. You agree not to share, distribute, or
            disclose Training Materials to third parties without prior written authorization.
          </p>

          <h3>8. Updates to Terms</h3>
          <p>
            Veracity Expert Witness LLC reserves the right to update these Terms of Use at any
            time. If material changes are made, you will be required to re-accept the updated
            terms before continuing to access Training Materials. Your continued use of the
            Training Materials after changes constitutes acceptance of the revised terms.
          </p>

          <h3>9. Governing Law</h3>
          <p>
            These Terms of Use are governed by and construed in accordance with the laws of the
            State of California. Any disputes arising from or related to these terms or the
            Training Materials shall be resolved in the state or federal courts located in
            Los Angeles County, California.
          </p>

          <h3>10. Severability</h3>
          <p>
            If any provision of these Terms of Use is found to be unenforceable, the remaining
            provisions shall continue in full force and effect.
          </p>

          <h3>11. Contact</h3>
          <p>
            If you have questions about these Terms of Use, contact us at{' '}
            <a href="mailto:support@veracityexpertwitness.com">support@veracityexpertwitness.com</a>.
          </p>
        </div>

        {!scrolledToBottom && (
          <p className="training-terms-modal__scroll-hint">
            Scroll to the bottom to enable acceptance
          </p>
        )}

        {error && <p className="training-terms-modal__error">{error}</p>}

        <div className="training-terms-modal__actions">
          <button
            className="btn btn--primary"
            disabled={!scrolledToBottom || submitting}
            onClick={handleAccept}
          >
            {submitting ? 'Recording...' : 'I Acknowledge and Accept These Terms'}
          </button>
        </div>
      </div>
    </div>
  );
}
