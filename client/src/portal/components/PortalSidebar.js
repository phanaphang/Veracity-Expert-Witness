import React, { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useUnreadCount } from '../../hooks/useUnreadCount'

export default function PortalSidebar({ isAdmin, onNavigate }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const unreadCount = useUnreadCount()
  const isTrainingActive =
    location.pathname.startsWith('/training') ||
    location.pathname === '/admin/training' ||
    location.pathname === '/sop-training'
  const [trainingOpen, setTrainingOpen] = useState(isTrainingActive)

  const expertLinks = [
    {
      to: '/portal/dashboard',
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
    },
    {
      to: '/portal/profile',
      label: 'Profile',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
    {
      to: '/portal/documents',
      label: 'Documents',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
    {
      to: '/portal/cases',
      label: 'Cases',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h2',
    },
    {
      to: '/portal/messages',
      label: 'Messages',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    },
    {
      to: '/portal/calendar',
      label: 'Calendar',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      to: '/training',
      label: 'Training',
      icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
      end: true,
    },
    {
      to: '/portal/resources',
      label: 'Resources',
      icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
    {
      to: '/portal/change-password',
      label: 'Change Password',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    },
  ]

  const adminLinks = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
    },
    {
      to: '/admin/profile',
      label: 'Profile',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
    {
      to: '/admin/experts',
      label: 'Experts',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
      to: '/admin/invite',
      label: 'Invite Expert',
      icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    },
    {
      to: '/admin/cases',
      label: 'Cases',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h2',
    },
    {
      to: '/admin/team-tasks',
      label: 'Team Tasks',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    },
    {
      to: '/admin/messages',
      label: 'Messages',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    },
    {
      label: 'Training',
      icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
      group: true,
      children: [
        {
          to: '/admin/training',
          label: 'Progress Report',
          icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        },
        {
          to: '/training/foundations',
          label: 'EW Foundations',
          icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
        },
        {
          to: '/training/admissibility',
          label: 'Admissibility',
          icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
        },
        {
          to: '/training/report-writing',
          label: 'Report Writing',
          icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        },
        {
          to: '/training/deposition',
          label: 'Deposition',
          icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
        },
        {
          to: '/training/trial-testimony',
          label: 'Trial Testimony',
          icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0l-3-3m-9 3l3-3m0 0h6',
        },
        {
          to: '/portal/resources',
          label: 'Resources',
          icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        },
        {
          to: '/sop-training',
          label: 'SOP Training',
          icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
        },
      ],
    },
    {
      to: '/admin/change-password',
      label: 'Change Password',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    },
  ]

  const filteredAdminLinks =
    profile?.role === 'staff'
      ? adminLinks.filter((link) => link.to !== '/admin/invite')
      : adminLinks

  const links = isAdmin ? filteredAdminLinks : expertLinks

  return (
    <nav className="portal-sidebar" aria-label="Main navigation">
      <div className="portal-sidebar__header">
        <NavLink
          to="/"
          className="portal-sidebar__logo"
          aria-label="Veracity home"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            width="24"
            height="24"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--color-accent)" />
            <path
              d="M2 17l10 5 10-5"
              stroke="var(--color-accent)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M2 12l10 5 10-5"
              stroke="var(--color-accent)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <span>Veracity</span>
        </NavLink>
        <span className="portal-sidebar__role">
          {isAdmin
            ? profile?.role === 'staff'
              ? 'Staff'
              : 'Admin'
            : 'Expert Portal'}
        </span>
      </div>

      <nav className="portal-sidebar__nav">
        {links.map((link) =>
          link.group ? (
            <div key={link.label} className="portal-sidebar__group">
              <button
                className={`portal-sidebar__link portal-sidebar__group-toggle ${isTrainingActive ? 'portal-sidebar__link--active' : ''}`}
                onClick={() => setTrainingOpen(!trainingOpen)}
                aria-expanded={trainingOpen}
                aria-controls="training-group-children"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="20"
                  height="20"
                  aria-hidden="true"
                >
                  <path
                    d={link.icon}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{link.label}</span>
                <svg
                  className={`portal-sidebar__chevron ${trainingOpen ? 'portal-sidebar__chevron--open' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {trainingOpen && (
                <div
                  className="portal-sidebar__group-children"
                  id="training-group-children"
                >
                  {link.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      end
                      className={({ isActive }) =>
                        `portal-sidebar__link portal-sidebar__link--child ${isActive ? 'portal-sidebar__link--active' : ''}`
                      }
                      onClick={onNavigate}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        width="16"
                        height="16"
                        aria-hidden="true"
                      >
                        <path
                          d={child.icon}
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `portal-sidebar__link ${isActive ? 'portal-sidebar__link--active' : ''}`
              }
              onClick={onNavigate}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path
                  d={link.icon}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{link.label}</span>
              {link.label === 'Messages' && unreadCount > 0 && (
                <span className="portal-sidebar__badge">{unreadCount}</span>
              )}
            </NavLink>
          )
        )}
      </nav>

      <div className="portal-sidebar__footer">
        <div className="portal-sidebar__user">
          <span className="portal-sidebar__user-name">
            {profile?.first_name || profile?.email || 'User'}
          </span>
        </div>
        <button
          className="portal-sidebar__signout"
          style={{ marginBottom: 24 }}
          onClick={() => navigate('/')}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <path
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Home
        </button>
        <button
          className="portal-sidebar__signout"
          onClick={async () => {
            await signOut()
            navigate('/portal/login')
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <path
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </nav>
  )
}
