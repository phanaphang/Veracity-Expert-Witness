import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Submit Your Case Details',
    description: "Tell us about your case, the expertise you need, and your timeline. We'll take it from there.",
  },
  {
    number: '02',
    title: 'Review Matched Experts',
    description: 'We identify the most qualified experts from our network. Review their credentials, experience, and prior testimony history.',
  },
  {
    number: '03',
    title: 'We Handle the Engagement',
    description: 'Contracts, scheduling, fee agreements, compliance, coordination: we take care of it all.',
  },
  {
    number: '04',
    title: 'Expert Delivers Results',
    description: 'Your expert delivers reports, depositions, and courtroom testimony.',
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
            Finding the right expert should be the least of your worries.
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
