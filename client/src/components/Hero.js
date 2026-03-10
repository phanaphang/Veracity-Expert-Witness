import React from 'react';

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__bg">
        <div className="hero__gradient-orb hero__gradient-orb--1"></div>
        <div className="hero__gradient-orb hero__gradient-orb--2"></div>
      </div>
      <div className="hero__container">
        <div className="hero__content">
          <div className="hero__badge">Your Expert Witness Partner</div>
          <h1 className="hero__title">
            Expert Witnesses{' '}
            <span className="hero__title--accent">When You Need Them</span>
          </h1>
          <p className="hero__subtitle">
            Veracity is your dedicated expert witness team &mdash; handling sourcing,
            vetting, scheduling, logistics, and compliance so you can focus on your case.
          </p>
          <div className="hero__actions">
            <a href="#contact" className="btn btn--primary" onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Find an Expert
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#how-it-works" className="btn btn--outline" onClick={(e) => {
              e.preventDefault();
              document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              How It Works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
