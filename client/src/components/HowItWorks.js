import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Submit Your Case Details',
    description: 'Tell us about your case, the type of expertise you need, and your timeline. Our platform makes it easy to define your requirements.',
  },
  {
    number: '02',
    title: 'Review Matched Experts',
    description: 'We identify the most qualified experts from our network. Review their credentials, experience, and prior testimony history.',
  },
  {
    number: '03',
    title: 'We Handle the Engagement',
    description: 'Once you select your expert, we handle all the logistics — contracts, scheduling, compliance, and coordination between all parties.',
  },
  {
    number: '04',
    title: 'Expert Delivers Results',
    description: 'Your expert provides reports, depositions, and trial testimony. We support the entire process from preparation through courtroom delivery.',
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="section__container">
        <div className="section__header">
          <span className="section__badge">How It Works</span>
          <h2 className="section__title">
            Simple Process, <span className="text--accent">Exceptional Results</span>
          </h2>
          <p className="section__subtitle">
            Getting the right expert witness has never been easier. Our streamlined
            four-step process gets you from case need to courtroom-ready testimony.
          </p>
        </div>
        <div className="how-it-works__grid">
          {steps.map((step, index) => (
            <div key={step.number} className="how-it-works__step">
              <div className="how-it-works__number">{step.number}</div>
              {index < steps.length - 1 && (
                <div className="how-it-works__connector"></div>
              )}
              <h3 className="how-it-works__step-title">{step.title}</h3>
              <p className="how-it-works__step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
