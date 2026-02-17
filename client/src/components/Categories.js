import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-2.038 0l-2.387.477a2 2 0 00-1.022.547M8 11a4 4 0 118 0 4 4 0 01-8 0zm12.5 1c0 5.523-4.477 10-10 10S.5 17.523.5 12 4.977 2 10.5 2s10 4.477 10 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Medical & Healthcare',
    link: '/medical-healthcare',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M9 7h6m-6 4h6m-6 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Financial & Accounting',
    link: '/financial-accounting',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Technology & Cyber',
    link: '/technology-cyber',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m4-16v4m-4-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Construction & Engineering',
    link: '/construction-engineering',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Environmental Science',
    link: '/environmental-science',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Intellectual Property',
    link: '/intellectual-property',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Accident Reconstruction',
    link: '/accident-reconstruction',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M3 6l3 1m0 0l-3 9a5 5 0 006 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5 5 0 006 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Forensic Analysis',
    link: '/forensic-analysis',
  },
];

function Categories() {
  return (
    <section className="categories" id="categories">
      <div className="section__container">
        <div className="section__header">
          <span className="section__badge">Expert Categories</span>
          <h2 className="section__title">
            Find Experts Across <span className="text--accent">Many Fields</span>
          </h2>
          <p className="section__subtitle">
            Our network spans dozens of industries and specializations. We source,
            engage, and coordinate the right expert for any case.
          </p>
        </div>
        <div className="categories__grid">
          {categories.map((cat) => {
            const content = (
              <>
                <div className="categories__icon">{cat.icon}</div>
                <h3 className="categories__title">{cat.title}</h3>
              </>
            );
            return cat.link ? (
              <Link key={cat.title} to={cat.link} className="categories__card categories__card--link">
                {content}
              </Link>
            ) : (
              <div key={cat.title} className="categories__card">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;
