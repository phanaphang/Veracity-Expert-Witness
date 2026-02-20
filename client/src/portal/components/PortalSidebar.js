import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUnreadCount } from '../../hooks/useUnreadCount';

export default function PortalSidebar({ isAdmin, onNavigate }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const unreadCount = useUnreadCount();

  const expertLinks = [
    { to: '/portal/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
    { to: '/portal/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { to: '/portal/documents', label: 'Documents', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { to: '/portal/cases', label: 'Cases', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h2' },
    { to: '/portal/messages', label: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { to: '/portal/change-password', label: 'Change Password', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
    { to: '/admin/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { to: '/admin/experts', label: 'Experts', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { to: '/admin/invite', label: 'Invite Expert', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
    { to: '/admin/cases', label: 'Cases', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h2' },
    { to: '/admin/messages', label: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { to: '/admin/change-password', label: 'Change Password', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];

  const links = isAdmin ? adminLinks : expertLinks;

  return (
    <aside className="portal-sidebar">
      <div className="portal-sidebar__header">
        <NavLink to="/" className="portal-sidebar__logo">
          <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--color-accent)" />
            <path d="M2 17l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
            <path d="M2 12l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
          </svg>
          <span>Veracity</span>
        </NavLink>
        <span className="portal-sidebar__role">{isAdmin ? 'Admin' : 'Expert Portal'}</span>
      </div>

      <nav className="portal-sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `portal-sidebar__link ${isActive ? 'portal-sidebar__link--active' : ''}`
            }
            onClick={onNavigate}
          >
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d={link.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{link.label}</span>
            {link.label === 'Messages' && unreadCount > 0 && (
              <span className="portal-sidebar__badge">{unreadCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="portal-sidebar__footer">
        <div className="portal-sidebar__user">
          <span className="portal-sidebar__user-name">
            {profile?.first_name || profile?.email || 'User'}
          </span>
        </div>
        <button className="portal-sidebar__signout" onClick={async () => { await signOut(); navigate('/portal/login'); }}>
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
