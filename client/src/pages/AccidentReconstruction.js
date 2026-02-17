import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const expertiseAreas = [
  {
    title: 'Vehicle Accident Reconstruction',
    specialties: [
      'Passenger vehicle collisions',
      'Commercial truck and fleet accidents',
      'Motorcycle and bicycle crashes',
      'Multi-vehicle pile-up analysis',
      'Hit-and-run investigation',
    ],
  },
  {
    title: 'Pedestrian & Bicycle Accidents',
    specialties: [
      'Pedestrian visibility and detection',
      'Crosswalk and intersection analysis',
      'Bicycle-vehicle interaction',
      'Speed and braking distance calculations',
      'Driver reaction time assessment',
    ],
  },
  {
    title: 'Commercial & Industrial Accidents',
    specialties: [
      'Workplace injury reconstruction',
      'Industrial equipment failures',
      'Forklift and heavy machinery incidents',
      'Warehouse and manufacturing accidents',
      'Construction site incidents',
    ],
  },
  {
    title: 'Biomechanics & Injury Causation',
    specialties: [
      'Injury mechanism analysis',
      'Occupant kinematics',
      'Low-speed impact injury assessment',
      'Seat belt and airbag performance',
      'Helmet and protective equipment evaluation',
    ],
  },
  {
    title: 'Vehicle Systems & Defects',
    specialties: [
      'Brake and steering system failure',
      'Tire blowout and tread separation',
      'Vehicle electronics and software defects',
      'Crashworthiness and occupant protection',
      'Recalls and safety compliance',
    ],
  },
  {
    title: 'Highway & Road Design',
    specialties: [
      'Road geometry and design defects',
      'Guardrail and barrier performance',
      'Signage and signal adequacy',
      'Work zone safety analysis',
      'Sight distance and visibility studies',
    ],
  },
  {
    title: 'Event Data & Digital Evidence',
    specialties: [
      'Event Data Recorder (EDR/black box) analysis',
      'Dashcam and surveillance video analysis',
      'GPS and telematics data interpretation',
      'Cell phone usage and distraction analysis',
      'Photogrammetry and 3D scene mapping',
    ],
  },
  {
    title: 'Aviation & Marine Accidents',
    specialties: [
      'Aircraft incident investigation',
      'Helicopter accident analysis',
      'Boating and watercraft collisions',
      'Drone incident investigation',
      'Transportation safety regulations',
    ],
  },
];

function AccidentReconstruction() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="legal-page">
      <SEO
        title="Accident Reconstruction Expert Witnesses"
        description="Connect with accident reconstruction specialists who use science and engineering to determine how and why vehicle, workplace, and industrial incidents occurred."
        path="/accident-reconstruction"
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
          <h1 className="legal-header__title">Accident Reconstruction Expert Witnesses</h1>
          <p className="legal-header__subtitle">
            We connect you with accident reconstruction specialists who use science and engineering to determine how and why incidents occurred.
          </p>
        </div>
      </header>

      <main className="legal-content specialty-content">
        <p className="specialty-intro">
          Accident reconstruction cases require expert witnesses who combine engineering
          principles, physics, and investigative techniques to establish the facts of an
          incident. Our network includes certified accident reconstructionists, biomechanical
          engineers, vehicle systems experts, and highway safety specialists.
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
          <h2>Need an Accident Reconstruction Expert Witness?</h2>
          <p>
            Tell us about your case and we'll match you with the right reconstruction expert.
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

export default AccidentReconstruction;
