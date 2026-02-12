import React from 'react';

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
              Connecting legal professionals with qualified expert witnesses across every industry and specialization.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Services</h4>
            <ul className="footer__links">
              <li><a href="#services">Expert Search</a></li>
              <li><a href="#services">Credential Verification</a></li>
              <li><a href="#services">Deposition Prep</a></li>
              <li><a href="#services">Report Writing</a></li>
              <li><a href="#services">Trial Support</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Company</h4>
            <ul className="footer__links">
              <li><a href="#hero">About Us</a></li>
              <li><a href="#categories">Expert Network</a></li>
              <li><a href="#contact">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Legal</h4>
            <ul className="footer__links">
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="#hero">Terms of Service</a></li>
              <li><a href="#hero">Cookie Policy</a></li>
              <li><a href="#hero">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {currentYear} Veracity Expert Witness. All rights reserved.</p>
          <div className="footer__social">
            <a href="#hero" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
