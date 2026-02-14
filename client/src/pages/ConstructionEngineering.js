import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const expertiseAreas = [
  {
    title: 'Construction Defects',
    specialties: [
      'Structural deficiency analysis',
      'Building envelope and waterproofing failures',
      'Foundation and soil issues',
      'Roofing system failures',
      'Residential and commercial defect assessment',
    ],
  },
  {
    title: 'Structural Engineering',
    specialties: [
      'Structural collapse investigation',
      'Load-bearing capacity analysis',
      'Seismic design and retrofit evaluation',
      'Steel, concrete, and timber design review',
      'Progressive collapse assessment',
    ],
  },
  {
    title: 'Construction Delays & Disputes',
    specialties: [
      'Schedule delay analysis (CPM)',
      'Cost overrun and change order disputes',
      'Acceleration and disruption claims',
      'Contract compliance and interpretation',
      'Productivity loss quantification',
    ],
  },
  {
    title: 'Civil Engineering',
    specialties: [
      'Roadway and highway design',
      'Drainage and stormwater systems',
      'Utility infrastructure failures',
      'Grading and earthwork disputes',
      'Traffic engineering and safety',
    ],
  },
  {
    title: 'Mechanical & Electrical Systems',
    specialties: [
      'HVAC system design and failure',
      'Plumbing and fire protection systems',
      'Electrical system design and safety',
      'Elevator and escalator incidents',
      'Energy efficiency and code compliance',
    ],
  },
  {
    title: 'Geotechnical Engineering',
    specialties: [
      'Soil and foundation analysis',
      'Slope stability and landslide investigation',
      'Subsurface condition assessment',
      'Retaining wall and excavation failures',
      'Ground improvement evaluation',
    ],
  },
  {
    title: 'Building Codes & Standards',
    specialties: [
      'Building code compliance review',
      'Fire and life safety code analysis',
      'ADA accessibility compliance',
      'Zoning and land use disputes',
      'Permit and inspection issues',
    ],
  },
  {
    title: 'Construction Safety',
    specialties: [
      'OSHA compliance and violations',
      'Fall protection and scaffolding safety',
      'Crane and heavy equipment incidents',
      'Trenching and excavation safety',
      'Worksite safety program evaluation',
    ],
  },
  {
    title: 'Project Management',
    specialties: [
      'Construction management standards',
      'Quality control and assurance',
      'Bid and procurement disputes',
      'Owner-contractor relationship issues',
      'Design-build delivery disputes',
    ],
  },
];

function ConstructionEngineering() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="legal-page">
      <SEO
        title="Construction & Engineering Expert Witnesses"
        description="Connect with seasoned construction and engineering professionals for cases involving structural failures, building defects, project delays, and safety compliance."
        path="/construction-engineering"
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
          <h1 className="legal-header__title">Construction &amp; Engineering Expert Witnesses</h1>
          <p className="legal-header__subtitle">
            We connect you with seasoned construction and engineering professionals who bring technical authority to your case.
          </p>
        </div>
      </header>

      <main className="legal-content specialty-content">
        <p className="specialty-intro">
          Construction and engineering disputes require expert witnesses who combine hands-on
          industry experience with the ability to communicate technical findings clearly.
          Our network includes licensed engineers, general contractors, project managers,
          building inspectors, and construction safety specialists.
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
          <h2>Need a Construction or Engineering Expert Witness?</h2>
          <p>
            Tell us about your case and we'll match you with the right expert.
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

export default ConstructionEngineering;
