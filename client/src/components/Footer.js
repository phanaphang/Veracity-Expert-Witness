import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="section__container">
        <div className="footer__grid">
          <div className="footer__brand">
            <a href="#hero" className="navbar__logo" onClick={(e) => {
              e.preventDefault();
              document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <svg className="navbar__logo-icon" viewBox="0 0 24 24" fill="none" width="28" height="28">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--color-accent)" />
                <path d="M2 17l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
                <path d="M2 12l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
              </svg>
              <span>Veracity</span>
            </a>
            <p className="footer__brand-text">
              Expert witness solutions for legal professionals &mdash; from sourcing and engagement to scheduling, logistics, and compliance.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Legal</h4>
            <ul className="footer__links">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/cookie-policy">Cookie Policy</Link></li>
              <li><Link to="/compliance">Compliance</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Resources</h4>
            <ul className="footer__links">
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/join-our-panel">Join Our Panel</Link></li>
            </ul>
          </div>
        </div>

        <button
          className="footer__back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top
        </button>

        <div className="footer__bottom">
          <p>&copy; {currentYear} Veracity Expert Witness. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
