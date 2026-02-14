import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const expertiseAreas = [
  {
    title: 'Cybersecurity',
    specialties: [
      'Data breach investigation and response',
      'Network security standards and failures',
      'Vulnerability assessment and penetration testing',
      'Ransomware and malware analysis',
      'Security compliance and best practices',
    ],
  },
  {
    title: 'Digital Forensics',
    specialties: [
      'Computer and mobile device forensics',
      'Email and communications analysis',
      'Data recovery and preservation',
      'Metadata and timestamp analysis',
      'Social media evidence collection',
    ],
  },
  {
    title: 'Software & Technology',
    specialties: [
      'Software defect and failure analysis',
      'Source code review and comparison',
      'Software development standards',
      'System architecture evaluation',
      'Technology product liability',
    ],
  },
  {
    title: 'Intellectual Property & Trade Secrets',
    specialties: [
      'Software patent infringement',
      'Trade secret misappropriation',
      'Source code theft analysis',
      'Technology licensing disputes',
      'Open source compliance',
    ],
  },
  {
    title: 'Data Privacy & Compliance',
    specialties: [
      'CCPA/CPRA compliance',
      'HIPAA data security standards',
      'Privacy impact assessments',
      'Data governance practices',
      'Cross-border data transfer issues',
    ],
  },
  {
    title: 'Electronic Discovery',
    specialties: [
      'ESI preservation and collection',
      'Spoliation of digital evidence',
      'Search methodology and protocols',
      'Technology-assisted review',
      'eDiscovery process standards',
    ],
  },
  {
    title: 'Internet & E-Commerce',
    specialties: [
      'Website and platform disputes',
      'Domain name and trademark issues',
      'Online advertising fraud',
      'Click fraud and bot detection',
      'Terms of service enforcement',
    ],
  },
  {
    title: 'Artificial Intelligence & Emerging Tech',
    specialties: [
      'AI and machine learning systems',
      'Algorithm bias and fairness',
      'Autonomous systems liability',
      'Blockchain and cryptocurrency',
      'IoT device security and failure',
    ],
  },
  {
    title: 'Telecommunications',
    specialties: [
      'Network infrastructure disputes',
      'Wireless and spectrum issues',
      'VoIP and communications systems',
      'Telecom billing and fraud',
      'Regulatory compliance',
    ],
  },
];

function TechnologyCyber() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="legal-page">
      <SEO
        title="Technology & Cyber Expert Witnesses"
        description="Connect with leading technology professionals who explain complex digital issues including cybersecurity breaches, software disputes, data privacy, and IT standards of care."
        path="/technology-cyber"
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
          <h1 className="legal-header__title">Technology &amp; Cyber Expert Witnesses</h1>
          <p className="legal-header__subtitle">
            We connect you with leading technology professionals who can explain complex digital issues with clarity and authority.
          </p>
        </div>
      </header>

      <main className="legal-content specialty-content">
        <p className="specialty-intro">
          Technology disputes require expert witnesses who understand both the technical
          details and how to communicate them effectively. Our network includes cybersecurity
          specialists, software engineers, digital forensics examiners, data scientists,
          and IT industry veterans.
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
          <h2>Need a Technology Expert Witness?</h2>
          <p>
            Tell us about your case and we'll match you with the right technology expert.
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

export default TechnologyCyber;
