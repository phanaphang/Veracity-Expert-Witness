import React, { useState, useRef } from 'react';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
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
            Fill out the form below and our team will find and engage the right expert witness for your case.
          </p>
        </div>

        <form className="contact__form" onSubmit={handleSubmit} noValidate>
          {status === 'success' && (
            <div className="contact__alert contact__alert--success">
              Thank you! Your request has been submitted. We'll be in touch within 24 hours.
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
      </div>
    </section>
  );
}

export default ContactForm;
