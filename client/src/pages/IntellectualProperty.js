import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const expertiseAreas = [
  {
    title: 'Patent Litigation',
    specialties: [
      'Patent infringement analysis',
      'Claim construction and interpretation',
      'Prior art search and invalidity',
      'Patent prosecution history',
      'Standard-essential patents (SEPs)',
    ],
  },
  {
    title: 'Trade Secrets',
    specialties: [
      'Trade secret identification and valuation',
      'Misappropriation investigation',
      'Reasonable measures analysis',
      'Employee departure and non-compete disputes',
      'Reverse engineering evaluation',
    ],
  },
  {
    title: 'Trademark & Brand',
    specialties: [
      'Likelihood of confusion analysis',
      'Trademark dilution and tarnishment',
      'Survey design and consumer perception',
      'Brand valuation and damages',
      'Counterfeiting and gray market goods',
    ],
  },
  {
    title: 'Copyright',
    specialties: [
      'Substantial similarity analysis',
      'Software copyright infringement',
      'Music, film, and media copyright',
      'Fair use evaluation',
      'Digital rights and DMCA issues',
    ],
  },
  {
    title: 'IP Damages & Valuation',
    specialties: [
      'Reasonable royalty calculation',
      'Lost profits analysis',
      'IP portfolio valuation',
      'Licensing and royalty rate benchmarking',
      'Unjust enrichment quantification',
    ],
  },
  {
    title: 'Technology Patents',
    specialties: [
      'Software and algorithm patents',
      'Telecommunications patents',
      'Semiconductor and hardware patents',
      'Internet and e-commerce patents',
      'Medical device patents',
    ],
  },
  {
    title: 'Life Sciences Patents',
    specialties: [
      'Pharmaceutical patent disputes',
      'Biotechnology and gene patents',
      'ANDA/Hatch-Waxman litigation',
      'Chemical compound patents',
      'Biologics and biosimilars',
    ],
  },
  {
    title: 'IP Licensing & Transactions',
    specialties: [
      'License agreement interpretation',
      'Royalty audit and compliance',
      'Technology transfer disputes',
      'Franchise and distribution IP issues',
      'Joint development agreements',
    ],
  },
];

function IntellectualProperty() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="legal-page">
      <SEO
        title="Intellectual Property Expert Witnesses"
        description="Connect with IP professionals for patent, trademark, copyright, and trade secret disputes. Deep technical and industry knowledge for infringement and valuation cases."
        path="/intellectual-property"
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
          <h1 className="legal-header__title">Intellectual Property Expert Witnesses</h1>
          <p className="legal-header__subtitle">
            We connect you with IP professionals who bring deep technical and industry knowledge to patent, trademark, copyright, and trade secret disputes.
          </p>
        </div>
      </header>

      <main className="legal-content specialty-content">
        <p className="specialty-intro">
          Intellectual property cases require expert witnesses who can bridge the gap between
          complex technical concepts and legal standards. Our network includes patent agents,
          engineers, scientists, licensing professionals, economists, and industry specialists
          with extensive testimony experience.
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
          <h2>Need an Intellectual Property Expert Witness?</h2>
          <p>
            Tell us about your case and we'll match you with the right IP expert.
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

export default IntellectualProperty;
