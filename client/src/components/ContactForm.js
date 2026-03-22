import React, { useState, useRef, useEffect, useCallback } from 'react';

const expertiseOptions = [
  'Medical & Healthcare',
  'Financial & Accounting',
  'Technology & Cyber Security',
  'Construction & Engineering',
  'Environmental Science',
  'Intellectual Property',
  'Accident Reconstruction',
  'Forensic Analysis',
  'Other',
];

function TermsOfServiceModal({ open, onAccept, onDecline }) {
  const acceptBtnRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (open && acceptBtnRef.current) {
      acceptBtnRef.current.focus();
    }
  }, [open]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onDecline();
    }
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll('button, a[href]');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onDecline]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="tos-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="tos-title">
      <div className="tos-modal" ref={modalRef}>
        <h3 className="tos-modal__title" id="tos-title">Terms of Service</h3>
        <p className="tos-modal__subtitle">Please review and accept our terms before submitting.</p>
        <div className="tos-modal__content">
          <h4>1. Services</h4>
          <p>
            Veracity Expert Witness, LLC (&quot;Veracity,&quot; &quot;we,&quot; &quot;us&quot;) provides expert witness
            sourcing and management services. By submitting this form, you are requesting that Veracity
            identify and propose qualified expert witnesses for your matter.
          </p>

          <h4>2. No Attorney-Client Relationship</h4>
          <p>
            Submitting a request through this form does not create an attorney-client relationship
            between you and Veracity. Veracity is not a law firm and does not provide legal advice.
          </p>

          <h4>3. Confidentiality</h4>
          <p>
            We treat all information submitted through this form as confidential. Your case details
            will only be shared with potential expert witnesses under consideration for your engagement
            and with Veracity personnel involved in fulfilling your request.
          </p>

          <h4>4. No Guarantee of Results</h4>
          <p>
            While we strive to match you with the most qualified experts, Veracity does not guarantee
            any particular outcome for your case or that an expert will be available for your specific needs.
          </p>

          <h4>5. Use of Information</h4>
          <p>
            The information you provide will be used solely for the purpose of processing your expert
            witness request and communicating with you about our services. We will not sell or share
            your information with unrelated third parties.
          </p>

          <h4>6. Communication Consent</h4>
          <p>
            By submitting this form, you consent to receive communications from Veracity regarding
            your request via the email address and phone number provided. You may opt out of
            non-essential communications at any time.
          </p>

          <h4>7. Limitation of Liability</h4>
          <p>
            Veracity&apos;s liability in connection with services provided shall be limited to the fees
            paid for such services. Veracity shall not be liable for any indirect, incidental, or
            consequential damages.
          </p>
        </div>
        <div className="tos-modal__actions">
          <button type="button" className="btn btn--secondary" onClick={onDecline}>
            Cancel
          </button>
          <button type="button" className="btn btn--primary" ref={acceptBtnRef} onClick={onAccept}>
            I Agree &amp; Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    email: '',
    phone: '',
    expertise: '',
    details: '',
  });

  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'
  const [showTos, setShowTos] = useState(false);
  const renderTime = useRef(Date.now());

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.firm.trim()) newErrors.firm = 'Firm name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.expertise) newErrors.expertise = 'Please select an area of expertise';
    if (!formData.details.trim()) newErrors.details = 'Please describe your case';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setShowTos(true);
  };

  const submitForm = async () => {
    setShowTos(false);
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        ...formData,
        website,
        _elapsed: (Date.now() - renderTime.current) / 1000,
        tos_accepted_at: new Date().toISOString(),
      }),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', firm: '', email: '', phone: '', expertise: '', details: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="section__container">
        <div className="section__header">
          <span className="section__badge">Contact Us</span>
          <h2 className="section__title">
            Get Started <span className="text--accent">Today</span>
          </h2>
          <p className="section__subtitle">
            Fill out the form and we&apos;ll take it from there: finding, vetting, and managing the right expert for your case.
          </p>
        </div>

        <form className="contact__form" onSubmit={handleSubmit} noValidate>
          {status === 'success' && (
            <div className="contact__alert contact__alert--success">
              Thank you! Your request has been submitted. We&apos;ll be in touch within 24 hours.
            </div>
          )}
          {status === 'error' && (
            <div className="contact__alert contact__alert--error">
              Something went wrong. Please try again or email us directly.
            </div>
          )}

          <div className="contact__honeypot" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="contact__row">
            <div className="contact__field">
              <label className="contact__label" htmlFor="name">Full Name</label>
              <input
                className={`contact__input ${errors.name ? 'contact__input--error' : ''}`}
                id="name"
                name="name"
                type="text"
                placeholder="John Smith"
                value={formData.name}
                onChange={handleChange}
                maxLength={500}
              />
              {errors.name && <span className="contact__error">{errors.name}</span>}
            </div>
            <div className="contact__field">
              <label className="contact__label" htmlFor="firm">Law Firm / Organization</label>
              <input
                className={`contact__input ${errors.firm ? 'contact__input--error' : ''}`}
                id="firm"
                name="firm"
                type="text"
                placeholder="Smith & Associates"
                value={formData.firm}
                onChange={handleChange}
                maxLength={500}
              />
              {errors.firm && <span className="contact__error">{errors.firm}</span>}
            </div>
          </div>

          <div className="contact__row">
            <div className="contact__field">
              <label className="contact__label" htmlFor="email">Email Address</label>
              <input
                className={`contact__input ${errors.email ? 'contact__input--error' : ''}`}
                id="email"
                name="email"
                type="email"
                placeholder="john@smithlaw.com"
                value={formData.email}
                onChange={handleChange}
                maxLength={500}
              />
              {errors.email && <span className="contact__error">{errors.email}</span>}
            </div>
            <div className="contact__field">
              <label className="contact__label" htmlFor="phone">Phone Number</label>
              <input
                className={`contact__input ${errors.phone ? 'contact__input--error' : ''}`}
                id="phone"
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                maxLength={30}
              />
              {errors.phone && <span className="contact__error">{errors.phone}</span>}
            </div>
          </div>

          <div className="contact__field">
            <label className="contact__label" htmlFor="expertise">Area of Expertise Needed</label>
            <select
              className={`contact__input contact__select ${errors.expertise ? 'contact__input--error' : ''}`}
              id="expertise"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
            >
              <option value="">Select an area of expertise</option>
              {expertiseOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.expertise && <span className="contact__error">{errors.expertise}</span>}
          </div>

          <div className="contact__field">
            <label className="contact__label" htmlFor="details">Case Details</label>
            <textarea
              className={`contact__input contact__textarea ${errors.details ? 'contact__input--error' : ''}`}
              id="details"
              name="details"
              placeholder="Please describe your case and the type of expert witness you need..."
              rows="5"
              value={formData.details}
              onChange={handleChange}
              maxLength={5000}
            />
            <span className={`portal-char-count${formData.details.length >= 4500 ? (formData.details.length >= 5000 ? ' portal-char-count--limit' : ' portal-char-count--warn') : ''}`}>{formData.details.length} / 5000</span>
            {errors.details && <span className="contact__error">{errors.details}</span>}
          </div>

          <button
            type="submit"
            className="btn btn--primary contact__submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Submitting...' : 'Submit Request'}
            {status !== 'sending' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </form>

        <TermsOfServiceModal
          open={showTos}
          onAccept={submitForm}
          onDecline={() => setShowTos(false)}
        />
      </div>
    </section>
  );
}

export default ContactForm;
