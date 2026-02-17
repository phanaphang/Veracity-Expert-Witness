import React from 'react';

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Expert Search & Matching',
    description: 'We identify and match the most qualified expert witnesses from our extensive network to your specific case requirements and timeline.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Credential Verification',
    description: 'Every expert undergoes rigorous credential verification including education, certifications, publications, and prior testimony history.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
        <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Report Writing',
    description: 'Our experts produce detailed, court-ready reports that clearly communicate complex technical findings to judges and juries.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Deposition Preparation',
    description: 'We provide comprehensive deposition preparation services to ensure your expert witness delivers clear, compelling testimony.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
        <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Trial Testimony',
    description: 'Experts provide specialized knowledge, opinions, and analysis to help judges or juries understand complex evidence.',
  },
];

function Services() {
  return (
    <section className="services" id="services">
      <div className="section__container">
        <div className="section__header">
          <span className="section__badge">Our Services</span>
          <h2 className="section__title">
            Expert Witness <span className="text--accent">Solutions</span>
          </h2>
          <p className="section__subtitle"></p>
        </div>
        <div className="services__grid">
          {services.map((service) => (
            <div key={service.title} className="services__card">
              <div className="services__icon">{service.icon}</div>
              <h3 className="services__card-title">{service.title}</h3>
              <p className="services__card-desc">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
