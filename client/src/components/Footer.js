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
        </div>
      </div>
    </footer>
  );
}

export default Footer;
