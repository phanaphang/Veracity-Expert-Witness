import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const faqData = [
  {
    category: 'General',
    items: [
      {
        question: 'What is Veracity Expert Witness?',
        answer: 'Veracity Expert Witness is an expert witness agency based in Los Angeles, California. We handle the sourcing, engagement, scheduling, logistics, and compliance needs for expert witness testimony, connecting attorneys and legal professionals with qualified experts across a wide range of specialties.',
      },
      {
        question: 'Who does Veracity serve?',
        answer: 'We primarily serve attorneys, law firms, insurance companies, and corporate legal departments throughout California and nationwide. Whether you are handling plaintiff or defense matters, we can help you find the right expert for your case.',
      },
      {
        question: 'Is Veracity a law firm or lawyer referral service?',
        answer: 'No. Veracity Expert Witness is not a law firm, does not provide legal advice, and is not a lawyer referral service. We are not certified by the State Bar of California. We are an expert witness agency that connects legal professionals with qualified expert witnesses.',
      },
      {
        question: 'What geographic areas do you cover?',
        answer: 'While we are headquartered in Los Angeles, we work with experts and attorneys throughout California and across the United States. Many of our experts are available for remote testimony, depositions, and consultations as well.',
      },
    ],
  },
  {
    category: 'Expert Witness Services',
    items: [
      {
        question: 'How does expert matching work?',
        answer: 'When you submit a case inquiry, our team reviews your requirements including the specialty area, case type, timeline, and jurisdiction. We then identify experts from our vetted network who are the best fit, screen for conflicts of interest, and present you with qualified candidates.',
      },
      {
        question: 'What specialties do your experts cover?',
        answer: 'Our network spans a broad range of disciplines including medical and healthcare, financial and accounting, technology and cybersecurity, construction and engineering, environmental science, intellectual property, accident reconstruction, and forensic analysis. Within each discipline we have experts in dozens of sub-specialties.',
      },
      {
        question: 'How quickly can you find an expert for my case?',
        answer: 'Timelines vary depending on the specialty and complexity, but in most cases we can present qualified expert candidates within a few business days. If you have an urgent deadline, let us know and we will prioritize your request.',
      },
      {
        question: 'Do you screen experts for conflicts of interest?',
        answer: 'Yes. Conflict screening is a standard part of our process. Before making any introduction, we work with the expert to confirm there are no conflicts of interest with the parties involved in your case.',
      },
    ],
  },
  {
    category: 'Working With Us',
    items: [
      {
        question: 'How do I get started?',
        answer: 'Simply reach out through our contact form on the homepage or email us at info@veracityexpertwitness.com. Provide a brief description of your case and the type of expert you need, and our team will follow up to discuss your requirements in detail.',
      },
      {
        question: 'How does pricing work?',
        answer: 'Expert witness fees vary based on the specialty, scope of work, and the individual expert. We are transparent about costs from the beginning and will provide fee information before any engagement begins so there are no surprises.',
      },
      {
        question: 'Is my case information kept confidential?',
        answer: 'Absolutely. We take confidentiality very seriously. All case information you share with us is treated as strictly confidential. We only share details with potential experts as needed to assess fit and screen for conflicts, and we comply with all applicable privacy laws including HIPAA when medical information is involved.',
      },
      {
        question: 'What happens after I am matched with an expert?',
        answer: 'Once you select an expert, we handle the logistics of the engagement including scheduling, document coordination, and compliance. We remain involved throughout the process to ensure everything runs smoothly and to address any issues that arise.',
      },
    ],
  },
  {
    category: 'Join Our Panel',
    items: [
      {
        question: 'How can I join the Veracity expert witness network?',
        answer: <>We are always looking for qualified professionals to join our panel. Visit our <Link to="/join-our-panel">Join Our Panel</Link> page to learn about the benefits and submit your application. Our team will review your credentials and be in touch within a few business days.</>,
      },
      {
        question: 'What are the benefits of joining the panel?',
        answer: <>Panel members receive steady case referrals, full administrative and logistics support, scheduling and compliance coordination, access to our secure Expert Portal, and the flexibility to choose cases that match their expertise. Learn more and apply on our <Link to="/join-our-panel">Join Our Panel</Link> page.</>,
      },
      {
        question: 'What qualifications do I need to apply?',
        answer: <>We work with professionals across a wide range of specialties who have strong credentials and relevant experience. Prior expert witness experience is helpful but not required. Visit our <Link to="/join-our-panel">Join Our Panel</Link> page to submit your application and our team will evaluate your background.</>,
      },
    ],
  },
  {
    category: 'Expert Portal',
    items: [
      {
        question: 'What is the Expert Portal?',
        answer: 'The Expert Portal is a secure online platform where our expert witnesses can manage their profiles, review case invitations, upload documents, and communicate with the Veracity team. It streamlines the engagement process for everyone involved.',
      },
      {
        question: 'How do I access the Expert Portal?',
        answer: 'Expert witnesses receive an invitation to join the portal when they are onboarded to our network. If you are an expert and have not received an invitation, please contact us at info@veracityexpertwitness.com.',
      },
      {
        question: 'Is the Expert Portal secure?',
        answer: 'Yes. The portal uses industry-standard security measures including encrypted connections, secure authentication, and role-based access controls. Your data and documents are protected at every step.',
      },
      {
        question: 'Can attorneys access the Expert Portal?',
        answer: 'The Expert Portal is currently designed for expert witnesses. Attorneys and legal professionals work with our team directly for case coordination. If you have questions about your engagement, please contact us and we will be happy to assist.',
      },
    ],
  },
];

function FAQ() {
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="legal-page">
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about Veracity Expert Witness services, how expert matching works, pricing, confidentiality, and our Expert Portal."
        path="/faq"
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
          <h1 className="legal-header__title">Frequently Asked Questions</h1>
          <p className="legal-header__subtitle">
            Find answers to common questions about our expert witness services and how we work with legal professionals.
          </p>
        </div>
      </header>

      <main className="faq-content">
        {faqData.map((category) => (
          <section key={category.category} className="faq-category">
            <h2 className="faq-category__title">{category.category}</h2>
            <div className="faq-category__items">
              {category.items.map((item) => {
                const key = `${category.category}-${item.question}`;
                const isOpen = openItems[key];
                return (
                  <div key={key} className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
                    <button
                      className="faq-item__question"
                      onClick={() => toggleItem(key)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.question}</span>
                      <svg
                        className="faq-item__icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M5 8l5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div className="faq-item__answer">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <div className="faq-contact">
          <h2>Still have questions?</h2>
          <p>We are here to help. Reach out and our team will get back to you promptly.</p>
          <Link to="/" className="btn btn--primary" onClick={() => {
            setTimeout(() => {
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}>
            Contact Us
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

export default FAQ;
