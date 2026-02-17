import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const expertiseAreas = [
  {
    title: 'Medical Malpractice',
    specialties: [
      'Surgical errors and complications',
      'Misdiagnosis and delayed diagnosis',
      'Medication errors and adverse drug reactions',
      'Anesthesia complications',
      'Emergency medicine standard of care',
      'Obstetric and neonatal injuries',
    ],
  },
  {
    title: 'Orthopedic Surgery',
    specialties: [
      'Joint replacement complications',
      'Spinal surgery outcomes',
      'Sports medicine injuries',
      'Fracture treatment and fixation',
      'Surgical hardware failure',
    ],
  },
  {
    title: 'Neurology & Neurosurgery',
    specialties: [
      'Traumatic brain injury',
      'Spinal cord injuries',
      'Stroke diagnosis and treatment',
      'Seizure disorders',
      'Nerve damage and neuropathy',
    ],
  },
  {
    title: 'Cardiology',
    specialties: [
      'Heart attack diagnosis and treatment',
      'Cardiac surgery complications',
      'Interventional cardiology',
      'Heart failure management',
      'Cardiac device malfunction',
    ],
  },
  {
    title: 'Radiology & Diagnostic Imaging',
    specialties: [
      'Missed or misread imaging findings',
      'CT, MRI, and X-ray interpretation',
      'Interventional radiology complications',
      'Mammography screening failures',
    ],
  },
  {
    title: 'Psychiatry & Psychology',
    specialties: [
      'Competency and capacity evaluations',
      'Post-traumatic stress disorder',
      'Emotional distress and psychological harm',
      'Involuntary commitment disputes',
      'Fitness for duty assessments',
    ],
  },
  {
    title: 'Nursing Standard of Care',
    specialties: [
      'Patient monitoring failures',
      'Medication administration errors',
      'Fall prevention and patient safety',
      'Documentation and charting deficiencies',
      'Staffing adequacy',
    ],
  },
  {
    title: 'Pharmacy & Toxicology',
    specialties: [
      'Drug interactions and contraindications',
      'Compounding errors',
      'Overdose and poisoning analysis',
      'Pharmaceutical product liability',
      'Substance abuse evaluation',
    ],
  },
  {
    title: 'Emergency Medicine',
    specialties: [
      'Triage and prioritization failures',
      'Trauma care standard of care',
      'Discharge decision-making',
      'Emergency department overcrowding',
      'Pediatric emergency care',
    ],
  },
  {
    title: 'Oncology',
    specialties: [
      'Delayed cancer diagnosis',
      'Treatment planning and protocols',
      'Chemotherapy and radiation errors',
      'Surgical oncology complications',
      'Palliative care standards',
    ],
  },
  {
    title: 'Pain Management',
    specialties: [
      'Chronic pain treatment protocols',
      'Opioid prescribing practices',
      'Interventional pain procedures',
      'Disability and impairment ratings',
    ],
  },
  {
    title: 'Life Care Planning & Medical Economics',
    specialties: [
      'Future medical cost projections',
      'Life care plan development',
      'Lost earning capacity',
      'Disability and functional capacity evaluation',
    ],
  },
];

function MedicalHealthcare() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="legal-page">
      <SEO
        title="Medical & Healthcare Expert Witnesses"
        description="Connect with leading medical professionals who provide clear, credible expert witness testimony across every healthcare specialty including malpractice, orthopedics, neurology, and more."
        path="/medical-healthcare"
      />
      <nav className="navbar navbar--scrolled">
        <div className="navbar__container">
          <Link to="/" className="navbar__logo">
            <svg className="navbar__logo-icon" viewBox="0 0 24 24" fill="none" width="28" height="28">
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
          <h1 className="legal-header__title">Medical &amp; Healthcare Expert Witnesses</h1>
          <p className="legal-header__subtitle">
            We connect you with leading medical professionals who provide clear, credible testimony across every healthcare specialty.
          </p>
        </div>
      </header>

      <main className="legal-content specialty-content">
        <p className="specialty-intro">
          Medical and healthcare cases demand expert witnesses with deep clinical knowledge
          and the ability to explain complex medical issues clearly. Our network includes
          board-certified physicians, surgeons, nurses, pharmacists, and allied health
          professionals across the specialties below.
        </p>

        <div className="specialty-grid">
          {expertiseAreas.map((area) => (
            <div key={area.title} className="specialty-card">
              <h2 className="specialty-card__title">{area.title}</h2>
              <ul className="specialty-card__list">
                {area.specialties.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="specialty-cta">
          <h2>Need a Medical Expert Witness?</h2>
          <p>
            Tell us about your case and we'll match you with the right medical expert.
          </p>
          <Link to="/" className="btn btn--primary" onClick={() => {
            setTimeout(() => {
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}>
            Get Started
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </main>

      <footer className="footer">
        <div className="section__container">
          <div className="legal-footer__inner">
            <p>&copy; {currentYear} Veracity Expert Witness. All rights reserved.</p>
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MedicalHealthcare;
