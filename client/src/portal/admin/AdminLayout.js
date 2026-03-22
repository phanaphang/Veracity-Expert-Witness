import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PortalSidebar from '../components/PortalSidebar';
import '../portal.css';

function getPageTitle(pathname) {
  if (pathname === '/admin/dashboard') return 'Admin Dashboard';
  if (pathname === '/admin/experts') return 'Expert Management';
  if (pathname === '/admin/invite') return 'Invite Expert';
  if (pathname === '/admin/cases/new') return 'Create Case';
  if (pathname === '/admin/cases') return 'Case Management';
  if (pathname === '/admin/messages') return 'Messages';
  if (pathname === '/admin/profile') return 'Profile';
  if (pathname === '/admin/training') return 'Training Report';
  if (pathname === '/admin/change-password') return 'Change Password';
  if (/^\/admin\/experts\/[^/]+$/.test(pathname)) return 'Expert Details';
  if (/^\/admin\/cases\/[^/]+$/.test(pathname)) return 'Case Details';
  return 'Admin Portal';
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="portal">
      <div className={`portal-overlay ${sidebarOpen ? 'portal-overlay--visible' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={`portal-sidebar-wrapper ${sidebarOpen ? 'portal-sidebar-wrapper--open' : ''}`}>
        <PortalSidebar isAdmin onNavigate={() => setSidebarOpen(false)} />
      </div>
      <main className="portal-main">
        <header className="portal-topbar">
          <button className="portal-topbar__menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <span className="portal-topbar__title">{pageTitle}</span>
        </header>
        <div className="portal-content">
          {children}
        </div>
      </main>
    </div>
  );
}
