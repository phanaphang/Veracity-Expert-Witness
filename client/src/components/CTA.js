import React from 'react';

function CTA() {
  return (
    <section className="cta">
      <div className="cta__bg">
        <div className="cta__gradient-orb cta__gradient-orb--1"></div>
        <div className="cta__gradient-orb cta__gradient-orb--2"></div>
      </div>
      <div className="section__container">
        <div className="cta__content">
          <h2 className="cta__title">Ready to Find Your Expert Witness?</h2>
          <p className="cta__subtitle">
            Tell us about your case and we'll match you with the right expert witness.
          </p>
          <div className="cta__actions">
            <a href="#contact" className="btn btn--white" onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Get Started Now
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
