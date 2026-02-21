import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
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
    { label: 'Join Our Panel', href: '/join-our-panel', isRoute: true },
    { label: 'FAQ', href: '/faq', isRoute: true },
    { label: 'Expert Portal', href: '/portal/login', isRoute: true },
  ];

  const scrollToElement = (hash) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const wasMobileOpen = mobileOpen;
    setMobileOpen(false);

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: href } });
    } else if (wasMobileOpen) {
      // Delay scroll until after mobile menu closes and overflow is restored
      setTimeout(() => scrollToElement(href), 50);
    } else {
      scrollToElement(href);
    }
  };

  // Handle scroll-to after navigating back to homepage
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      // Small delay to let the homepage render
      setTimeout(() => {
        scrollToElement(location.state.scrollTo);
      }, 100);
    }
  }, [location]);

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
              onClick={(e) => {
                if (link.isRoute) {
                  e.preventDefault();
                  navigate(link.href);
                } else {
                  handleNavClick(e, link.href);
                }
              }}
            >
              {link.label}
            </a>
          ))}
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
              onClick={(e) => {
                if (link.isRoute) {
                  e.preventDefault();
                  setMobileOpen(false);
                  navigate(link.href);
                } else {
                  handleNavClick(e, link.href);
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
