import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const expertiseAreas = [
  {
    title: 'Environmental Contamination',
    specialties: [
      'Soil and groundwater contamination',
      'Hazardous waste site assessment',
      'Chemical release investigation',
      'Contamination source identification',
      'Remediation cost estimation',
    ],
  },
  {
    title: 'Toxic Exposure & Health',
    specialties: [
      'Toxic tort causation analysis',
      'Indoor air quality and mold',
      'Asbestos and lead exposure',
      'Pesticide and chemical exposure',
      'Occupational health hazards',
    ],
  },
  {
    title: 'Water Resources',
    specialties: [
      'Water quality and pollution analysis',
      'Groundwater hydrology',
      'Stormwater management disputes',
      'Water rights and allocation',
      'Wastewater treatment compliance',
    ],
  },
  {
    title: 'Air Quality',
    specialties: [
      'Air emissions and permitting',
      'Odor and nuisance complaints',
      'Particulate matter and dust analysis',
      'Industrial air pollution',
      'Clean Air Act compliance',
    ],
  },
  {
    title: 'Environmental Compliance',
    specialties: [
      'CERCLA and Superfund liability',
      'RCRA hazardous waste regulations',
      'Clean Water Act compliance',
      'NEPA environmental review',
      'State environmental law (CEQA)',
    ],
  },
  {
    title: 'Ecological Assessment',
    specialties: [
      'Wetlands delineation and impact',
      'Endangered species issues',
      'Natural resource damage assessment',
      'Habitat restoration evaluation',
      'Biological impact studies',
    ],
  },
  {
    title: 'Environmental Site Assessment',
    specialties: [
      'Phase I and Phase II assessments',
      'Brownfield redevelopment',
      'Property transfer due diligence',
      'Underground storage tank issues',
      'Environmental lien and liability analysis',
    ],
  },
  {
    title: 'Geology & Earth Science',
    specialties: [
      'Landslide and subsidence analysis',
      'Earthquake and seismic assessment',
      'Mining and extraction disputes',
      'Coastal erosion and flooding',
      'Geological hazard evaluation',
    ],
  },
];

function EnvironmentalScience() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="legal-page">
      <SEO
        title="Environmental Science Expert Witnesses"
        description="Connect with environmental scientists and engineers for cases involving contamination, regulatory compliance, toxic exposure, water quality, and environmental impact."
        path="/environmental-science"
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
          <h1 className="legal-header__title">Environmental Science Expert Witnesses</h1>
          <p className="legal-header__subtitle">
            We connect you with environmental scientists and engineers who bring rigorous analysis to complex environmental disputes.
          </p>
        </div>
      </header>

      <main className="legal-content specialty-content">
        <p className="specialty-intro">
          Environmental cases demand expert witnesses with deep scientific knowledge and
          regulatory expertise. Our network includes environmental engineers, toxicologists,
          hydrogeologists, ecologists, and environmental compliance specialists.
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
          <h2>Need an Environmental Expert Witness?</h2>
          <p>
            Tell us about your case and we'll match you with the right environmental expert.
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

export default EnvironmentalScience;
