import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const expertiseAreas = [
  {
    title: 'Forensic Accounting',
    specialties: [
      'Fraud detection and investigation',
      'Embezzlement and misappropriation',
      'Financial statement manipulation',
      'Asset tracing and recovery',
      'Ponzi scheme analysis',
    ],
  },
  {
    title: 'Business Valuation',
    specialties: [
      'Company and enterprise valuation',
      'Shareholder disputes and buyouts',
      'Marital dissolution valuations',
      'Goodwill and intangible asset valuation',
      'Fair market value determinations',
    ],
  },
  {
    title: 'Economic Damages',
    specialties: [
      'Lost profits and revenue analysis',
      'Lost earning capacity',
      'Business interruption losses',
      'Intellectual property damages',
      'Wrongful termination damages',
    ],
  },
  {
    title: 'Securities & Investments',
    specialties: [
      'Securities fraud and misrepresentation',
      'Broker-dealer misconduct',
      'Suitability and fiduciary duty',
      'Insider trading analysis',
      'Portfolio management standards',
    ],
  },
  {
    title: 'Banking & Lending',
    specialties: [
      'Lending practice standards',
      'Predatory lending analysis',
      'Mortgage fraud investigation',
      'Loan underwriting review',
      'Banking regulation compliance',
    ],
  },
  {
    title: 'Tax',
    specialties: [
      'Tax fraud and evasion',
      'Transfer pricing disputes',
      'Estate and gift tax issues',
      'Tax shelter analysis',
      'State and federal tax controversies',
    ],
  },
  {
    title: 'Insurance',
    specialties: [
      'Bad faith claims analysis',
      'Coverage dispute evaluation',
      'Actuarial analysis',
      'Claims handling practices',
      'Policy interpretation',
    ],
  },
  {
    title: 'Real Estate Finance',
    specialties: [
      'Property valuation disputes',
      'Real estate investment analysis',
      'Construction lending practices',
      'Eminent domain compensation',
      'Lease and rental value analysis',
    ],
  },
  {
    title: 'Bankruptcy & Restructuring',
    specialties: [
      'Solvency and insolvency analysis',
      'Fraudulent transfer investigation',
      'Preference payment analysis',
      'Plan feasibility assessment',
      'Creditor recovery projections',
    ],
  },
];

function FinancialAccounting() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="legal-page">
      <SEO
        title="Financial & Accounting Expert Witnesses"
        description="Connect with experienced financial professionals who bring clarity to complex financial disputes including fraud, valuation, tax, banking, and insurance matters."
        path="/financial-accounting"
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
          <h1 className="legal-header__title">Financial &amp; Accounting Expert Witnesses</h1>
          <p className="legal-header__subtitle">
            We connect you with experienced financial professionals who bring clarity to complex financial disputes.
          </p>
        </div>
      </header>

      <main className="legal-content specialty-content">
        <p className="specialty-intro">
          Financial litigation requires expert witnesses who can analyze complex transactions,
          quantify damages, and present findings in a way judges and juries can understand.
          Our network includes CPAs, CFAs, certified fraud examiners, economists, and
          valuation specialists.
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
          <h2>Need a Financial Expert Witness?</h2>
          <p>
            Tell us about your case and we'll match you with the right financial expert.
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

export default FinancialAccounting;
