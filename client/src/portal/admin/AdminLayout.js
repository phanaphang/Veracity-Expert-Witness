import React, { useState } from 'react';
import PortalSidebar from '../components/PortalSidebar';
import '../portal.css';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="portal">
      <div className={`portal-overlay ${sidebarOpen ? 'portal-overlay--visible' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={`portal-sidebar-wrapper ${sidebarOpen ? 'portal-sidebar-wrapper--open' : ''}`}>
        <PortalSidebar isAdmin onNavigate={() => setSidebarOpen(false)} />
      </div>
      <main className="portal-main">
        <header className="portal-topbar">
          <button className="portal-topbar__menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <span className="portal-topbar__title">Admin Dashboard</span>
        </header>
        <div className="portal-content">
          {children}
        </div>
      </main>
    </div>
  );
}
