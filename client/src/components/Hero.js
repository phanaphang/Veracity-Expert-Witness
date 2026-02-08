import React from 'react';

function Hero() {
  const stats = [
    { value: '500+', label: 'Expert Witnesses' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '24h', label: 'Average Response' },
    { value: '1,000+', label: 'Cases Supported' },
  ];

  return (
    <section className="hero" id="hero">
      <div className="hero__bg">
        <div className="hero__gradient-orb hero__gradient-orb--1"></div>
        <div className="hero__gradient-orb hero__gradient-orb--2"></div>
      </div>
      <div className="hero__container">
        <div className="hero__content">
          <div className="hero__badge">Trusted by Leading Law Firms</div>
          <h1 className="hero__title">
            Expert Witnesses{' '}
            <span className="hero__title--accent">When You Need Them</span>
          </h1>
          <p className="hero__subtitle">
            Connect with highly qualified expert witnesses across every industry and
            specialization. Veracity streamlines the process of finding, vetting, and
            retaining the right expert for your case.
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
        <div className="hero__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="hero__stat-card">
              <div className="hero__stat-value">{stat.value}</div>
              <div className="hero__stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
