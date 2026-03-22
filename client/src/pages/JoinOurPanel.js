import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const specialtyOptions = [
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

const benefits = [
  {
    title: 'Training Resources',
    description: 'Access curated training materials, deposition preparation guides, and courtroom best practices to sharpen your skills as an expert witness.',
  },
  {
    title: 'Full Administrative Support',
    description: 'Our team handles the administrative and logistics work so you can focus on what you do best: providing expert analysis and testimony.',
  },
  {
    title: 'Scheduling & Compliance',
    description: 'We coordinate scheduling, compliance requirements, and document management on your behalf for every engagement.',
  },
  {
    title: 'Flexible Engagement',
    description: 'Choose the cases that fit your expertise and availability. You decide which engagements to accept.',
  },
  {
    title: 'Secure Expert Portal',
    description: 'Manage your profile, review case invitations, and communicate with our team through a secure online platform.',
  },
  {
    title: 'Professional Onboarding',
    description: 'Confidential conflict screening and a streamlined onboarding process designed to respect your time and credentials.',
  },
];

const steps = [
  { number: '1', title: 'Apply', description: 'Submit your application with your credentials and area of expertise.' },
  { number: '2', title: 'Get Vetted', description: 'Our team reviews your qualifications, experience, and professional background.' },
  { number: '3', title: 'Receive Cases', description: 'Once approved, start receiving case assignment opportunities matched to your specialty.' },
];

function JoinOurPanel() {
  const [formData, setFormData] = useState({
    name: '',
    credentials: '',
    email: '',
    phone: '',
    specialty: '',
    bio: '',
  });

  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [showTosModal, setShowTosModal] = useState(false);
  const renderTime = useRef(Date.now());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentYear = new Date().getFullYear();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.credentials.trim()) newErrors.credentials = 'Credentials/title is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.specialty) newErrors.specialty = 'Please select a specialty';
    if (!formData.bio.trim()) newErrors.bio = 'Please provide a brief bio';
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
    setShowTosModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowTosModal(false);
    setStatus('sending');
    try {
      const res = await fetch('/api/join-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          website,
          _elapsed: (Date.now() - renderTime.current) / 1000,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', credentials: '', email: '', phone: '', specialty: '', bio: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="legal-page">
      <SEO
        title="Join Our Expert Panel"
        description="Join the Veracity expert witness network. Receive case assignment opportunities, full administrative support, and access to a secure Expert Portal. Apply today."
        path="/join-our-panel"
      />
      <nav className="navbar navbar--scrolled">
        <div className="navbar__container">
          <Link to="/" className="navbar__logo">
            <svg className="navbar__logo-icon" viewBox="0 0 24 24" fill="none" width="28" height="28" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--color-accent)" />
              <path d="M2 17l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
              <path d="M2 12l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
            </svg>
            <span>Veracity</span>
          </Link>
          <Link to="/" className="navbar__btn navbar__btn--cta">Back to Home</Link>
        </div>
      </nav>

      <header className="legal-header">
        <div className="section__container">
          <Link to="/" className="legal-header__back">&larr; Back to Home</Link>
          <h1 className="legal-header__title">Join Our Expert Panel</h1>
          <p className="legal-header__subtitle">
            Grow your practice by joining our network of expert witnesses. Receive case assignment opportunities, administrative support, and a secure platform to manage your engagements.
          </p>
        </div>
      </header>

      <main className="legal-content">
        <section className="join-panel-section">
          <h2 className="join-panel-section__title">Why join Veracity?</h2>
          <div className="join-panel-benefits">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="join-panel-benefit">
                <h3 className="join-panel-benefit__title">{benefit.title}</h3>
                <p className="join-panel-benefit__text">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="join-panel-section">
          <h2 className="join-panel-section__title">How It Works</h2>
          <div className="join-panel-steps">
            {steps.map((step) => (
              <div key={step.number} className="join-panel-step">
                <span className="join-panel-step__number">{step.number}</span>
                <h3 className="join-panel-step__title">{step.title}</h3>
                <p className="join-panel-step__text">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="join-panel-section">
          <h2 className="join-panel-section__title">Apply Now</h2>
          <p className="join-panel-section__subtitle">
            Fill out the form below and our team will review your application. We will be in touch within a few business days.
          </p>

          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            {status === 'success' && (
              <div className="contact__alert contact__alert--success">
                Thank you for your application! Our team will review your information and be in touch within 1-2 business days.
              </div>
            )}
            {status === 'error' && (
              <div className="contact__alert contact__alert--error">
                Something went wrong. Please try again or email us at info@veracityexpertwitness.com.
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
                  placeholder="Dr. Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={500}
                />
                {errors.name && <span className="contact__error">{errors.name}</span>}
              </div>
              <div className="contact__field">
                <label className="contact__label" htmlFor="credentials">Credentials / Title</label>
                <input
                  className={`contact__input ${errors.credentials ? 'contact__input--error' : ''}`}
                  id="credentials"
                  name="credentials"
                  type="text"
                  placeholder="MD, FACS — Orthopedic Surgeon"
                  value={formData.credentials}
                  onChange={handleChange}
                  maxLength={500}
                />
                {errors.credentials && <span className="contact__error">{errors.credentials}</span>}
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
                  placeholder="jane@example.com"
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
              <label className="contact__label" htmlFor="specialty">Primary Specialty</label>
              <select
                className={`contact__input contact__select ${errors.specialty ? 'contact__input--error' : ''}`}
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
              >
                <option value="">Select your primary specialty</option>
                {specialtyOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.specialty && <span className="contact__error">{errors.specialty}</span>}
            </div>

            <div className="contact__field">
              <label className="contact__label" htmlFor="bio">Brief Bio / Experience</label>
              <textarea
                className={`contact__input contact__textarea ${errors.bio ? 'contact__input--error' : ''}`}
                id="bio"
                name="bio"
                placeholder="Please describe your professional background, areas of expertise, and any prior expert witness experience..."
                rows="5"
                value={formData.bio}
                onChange={handleChange}
                maxLength={5000}
              />
              <span className={`portal-char-count${formData.bio.length >= 4500 ? (formData.bio.length >= 5000 ? ' portal-char-count--limit' : ' portal-char-count--warn') : ''}`}>{formData.bio.length} / 5000</span>
              {errors.bio && <span className="contact__error">{errors.bio}</span>}
            </div>

            <button
              type="submit"
              className="btn btn--primary contact__submit"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Submitting...' : 'Submit Application'}
              {status !== 'sending' && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <div className="section__container">
          <div className="legal-footer__inner">
            <p>&copy; {currentYear} Veracity Expert Witness LLC. All rights reserved.</p>
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </footer>

      {showTosModal && (
        <div className="tos-modal-overlay" onClick={() => setShowTosModal(false)}>
          <div className="tos-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="tos-modal__title">Terms of Service</h2>
            <p className="tos-modal__subtitle">Please review and accept the terms before submitting your application.</p>
            <div className="tos-modal__content">
              <h4>1. Panel Membership</h4>
              <p>
                By submitting this application, you are applying to join the Veracity Expert Witness panel.
                Acceptance is at the sole discretion of Veracity Expert Witness LLC. Panel membership does not
                guarantee case assignments or compensation.
              </p>
              <h4>2. Accuracy of Information</h4>
              <p>
                You confirm that all information provided in this application is accurate and complete.
                You agree to promptly notify Veracity of any changes to your credentials, contact information,
                or professional standing.
              </p>
              <h4>3. Confidentiality</h4>
              <p>
                You agree to maintain strict confidentiality regarding all case information, client details,
                and proprietary materials shared with you through Veracity. This obligation survives the
                termination of your panel membership.
              </p>
              <h4>4. Professional Conduct</h4>
              <p>
                You agree to maintain the highest standards of professional conduct and ethics in all
                engagements coordinated through Veracity. You will provide honest, objective, and unbiased
                expert opinions based on your professional expertise.
              </p>
              <h4>5. Conflict of Interest</h4>
              <p>
                You agree to disclose any potential conflicts of interest before accepting a case assignment.
                You will not accept engagements where a conflict exists or could reasonably be perceived.
              </p>
              <h4>6. Independent Contractor Status</h4>
              <p>
                Panel members are independent contractors, not employees of Veracity Expert Witness LLC.
                You are responsible for your own taxes, insurance, and professional licensing.
              </p>
              <h4>7. Full Terms</h4>
              <p>
                This summary highlights key terms. The complete <Link to="/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</Link> and <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link> govern
                your use of our services and platform.
              </p>
            </div>
            <div className="tos-modal__actions">
              <button className="btn btn--outline" type="button" onClick={() => setShowTosModal(false)}>
                Cancel
              </button>
              <button className="btn btn--primary" type="button" onClick={handleConfirmSubmit}>
                Agree &amp; Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinOurPanel;
