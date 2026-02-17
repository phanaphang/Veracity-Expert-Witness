import React from 'react';

const testimonials = [
  {
    quote: 'Veracity connected us with a cybersecurity expert who was instrumental in winning our data breach case. The process was seamless and the expert\'s testimony was compelling.',
    name: 'Sarah Mitchell',
    title: 'Partner, Mitchell & Associates',
    initials: 'SM',
  },
  {
    quote: 'The quality of expert witnesses we\'ve found through Veracity is consistently outstanding. Their vetting process ensures we get credible, well-prepared experts every time.',
    name: 'David Chen',
    title: 'Senior Litigator, Chen Law Group',
    initials: 'DC',
  },
  {
    quote: 'In a complex medical malpractice case, Veracity provided us with three qualified candidates within 24 hours. Their speed and accuracy saved our case preparation timeline.',
    name: 'Jennifer Adams',
    title: 'Managing Partner, Adams Legal',
    initials: 'JA',
  },
];

function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="section__container">
        <div className="section__header">
          <span className="section__badge">Testimonials</span>
          <h2 className="section__title">
            Trusted by <span className="text--accent">Legal Professionals</span>
          </h2>
          <p className="section__subtitle">
            See what attorneys and law firms have to say about working with Veracity.
          </p>
        </div>
        <div className="testimonials__grid">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonials__card">
              <div className="testimonials__quote-mark">"</div>
              <p className="testimonials__text">{t.quote}</p>
              <div className="testimonials__author">
                <div className="testimonials__avatar">{t.initials}</div>
                <div>
                  <div className="testimonials__name">{t.name}</div>
                  <div className="testimonials__title">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
