import React, { useState, useEffect } from 'react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Expert Categories', href: '#categories' },
    { label: 'How It Works', href: '#how-it-works' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <a href="#hero" className="navbar__logo" onClick={(e) => handleNavClick(e, '#hero')}>
          <svg className="navbar__logo-icon" viewBox="0 0 24 24" fill="none" width="28" height="28">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--color-accent)" />
            <path d="M2 17l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
            <path d="M2 12l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
          </svg>
          <span>Veracity</span>
        </a>

        <div className="navbar__links">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__link"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="navbar__actions">
          <a
            href="#contact"
            className="navbar__btn navbar__btn--cta"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            Get Started
          </a>
        </div>

        <button
          className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {mobileOpen && (
        <div className="navbar__mobile">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__mobile-link"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <div className="navbar__mobile-actions">
            <a
              href="#contact"
              className="navbar__btn navbar__btn--cta"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
