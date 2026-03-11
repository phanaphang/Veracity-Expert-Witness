import React, { useState, useContext } from 'react';
import PortalSidebar from './PortalSidebar';
import { AuthContext } from '../../contexts/AuthContext';
import '../portal.css';

export default function PortalLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { idleWarning, resetIdleTimer, profile } = useContext(AuthContext);
  const isAdmin = ['admin', 'staff'].includes(profile?.role);

  return (
    <div className="portal">
      <div className={`portal-overlay ${sidebarOpen ? 'portal-overlay--visible' : ''}`} onClick={() => setSidebarOpen(false)} />
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
          <button className="portal-topbar__menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <span className="portal-topbar__title">{isAdmin ? 'Admin Portal' : 'Expert Portal'}</span>
        </header>
        <div className="portal-content">
          {children}
        </div>
      </main>
    </div>
  );
}
