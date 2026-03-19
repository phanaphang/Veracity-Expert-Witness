import React, { useState, useEffect, useContext, useRef } from 'react';
import PortalSidebar from './PortalSidebar';
import { AuthContext } from '../../contexts/AuthContext';
import '../portal.css';

export default function PortalLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { idleWarning, resetIdleTimer, profile } = useContext(AuthContext);
  const isAdmin = ['admin', 'staff'].includes(profile?.role);
  const menuBtnRef = useRef(null);

  // Close sidebar on Escape key
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sidebarOpen]);

  return (
    <div className="portal">
      <div
        className={`portal-overlay ${sidebarOpen ? 'portal-overlay--visible' : ''}`}
        onClick={() => { setSidebarOpen(false); menuBtnRef.current?.focus(); }}
        aria-hidden="true"
      />
      <div className={`portal-sidebar-wrapper ${sidebarOpen ? 'portal-sidebar-wrapper--open' : ''}`}>
        <PortalSidebar isAdmin={isAdmin} onNavigate={() => setSidebarOpen(false)} />
      </div>
      <main className="portal-main">
        {idleWarning && (
          <div className="portal-idle-warning" role="alert">
            <span>Your session will expire in 2 minutes due to inactivity.</span>
            <button className="portal-idle-warning__btn" onClick={resetIdleTimer}>
              Stay signed in
            </button>
          </div>
        )}
        <header className="portal-topbar">
          <button
            ref={menuBtnRef}
            className="portal-topbar__menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
            aria-expanded={sidebarOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <span className="portal-topbar__title">{isAdmin ? 'Admin Portal' : 'Expert Portal'}</span>
        </header>
        <div className="portal-content" id="main-content">
          {children}
        </div>
      </main>
    </div>
  );
}
