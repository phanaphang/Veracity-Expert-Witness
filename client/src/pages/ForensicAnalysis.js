import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const expertiseAreas = [
  {
    title: 'DNA & Biological Evidence',
    specialties: [
      'DNA profiling and interpretation',
      'Biological fluid identification',
      'Touch DNA and trace evidence',
      'Forensic genealogy',
      'Lab protocol and contamination review',
    ],
  },
  {
    title: 'Forensic Pathology',
    specialties: [
      'Cause and manner of death determination',
      'Autopsy review and interpretation',
      'Wound pattern analysis',
      'Asphyxiation and drowning cases',
      'Pediatric forensic pathology',
    ],
  },
  {
    title: 'Questioned Documents',
    specialties: [
      'Handwriting identification and comparison',
      'Signature authentication',
      'Document alteration detection',
      'Ink and paper analysis',
      'Printed document examination',
    ],
  },
  {
    title: 'Fire & Explosion Investigation',
    specialties: [
      'Fire origin and cause determination',
      'Arson investigation and analysis',
      'Explosion dynamics and blast analysis',
      'Electrical fire causation',
      'Wildfire behavior and spread',
    ],
  },
  {
    title: 'Firearms & Toolmarks',
    specialties: [
      'Ballistics and trajectory analysis',
      'Firearm identification and function',
      'Gunshot residue analysis',
      'Toolmark comparison',
      'Shooting incident reconstruction',
    ],
  },
  {
    title: 'Trace Evidence',
    specialties: [
      'Fiber and hair analysis',
      'Paint and coating comparison',
      'Glass fracture analysis',
      'Soil and mineral comparison',
      'Footwear and tire impression analysis',
    ],
  },
  {
    title: 'Forensic Chemistry & Toxicology',
    specialties: [
      'Drug identification and analysis',
      'Blood alcohol and DUI toxicology',
      'Poison detection and analysis',
      'Environmental chemical analysis',
      'Lab methodology and quality review',
    ],
  },
  {
    title: 'Crime Scene Analysis',
    specialties: [
      'Crime scene reconstruction',
      'Bloodstain pattern analysis',
      'Evidence collection and preservation',
      'Chain of custody evaluation',
      'Scene documentation and photography',
    ],
  },
  {
    title: 'Forensic Engineering',
    specialties: [
      'Product failure and defect analysis',
      'Materials testing and metallurgy',
      'Electrical and mechanical failure investigation',
      'Consumer product safety evaluation',
      'Industrial accident causation',
    ],
  },
];

function ForensicAnalysis() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="legal-page">
      <SEO
        title="Forensic Analysis Expert Witnesses"
        description="Connect with forensic specialists who apply scientific rigor to uncover facts in criminal and civil cases including DNA, digital forensics, documents, and fire investigation."
        path="/forensic-analysis"
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
          <h1 className="legal-header__title">Forensic Analysis Expert Witnesses</h1>
          <p className="legal-header__subtitle">
            We connect you with forensic specialists who apply scientific rigor to uncover the facts in criminal and civil cases.
          </p>
        </div>
      </header>

      <main className="legal-content specialty-content">
        <p className="specialty-intro">
          Forensic cases require expert witnesses with specialized scientific training and
          courtroom experience. Our network includes forensic scientists, pathologists,
          document examiners, fire investigators, ballistics experts, and crime scene
          analysts with extensive testimony backgrounds.
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
          <h2>Need a Forensic Expert Witness?</h2>
          <p>
            Tell us about your case and we'll match you with the right forensic expert.
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

export default ForensicAnalysis;
