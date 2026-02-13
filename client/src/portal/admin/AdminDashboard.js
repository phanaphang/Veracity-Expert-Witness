import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalExperts: 0, pendingProfiles: 0, openCases: 0, unreadMessages: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'expert'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'expert').is('onboarded_at', null),
      supabase.from('cases').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    ]).then(([experts, pending, cases, msgs]) => {
      setStats({
        totalExperts: experts.count || 0,
        pendingProfiles: pending.count || 0,
        openCases: cases.count || 0,
        unreadMessages: msgs.count || 0,
      });
    });
  }, []);

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Admin Dashboard</h1>
      </div>

      <div className="portal-stats">
        <div className="portal-stat">
          <div className="portal-stat__value">{stats.totalExperts}</div>
          <div className="portal-stat__label">Total Experts</div>
        </div>
        <div className="portal-stat">
          <div className="portal-stat__value">{stats.pendingProfiles}</div>
          <div className="portal-stat__label">Pending Profiles</div>
        </div>
        <div className="portal-stat">
          <div className="portal-stat__value">{stats.openCases}</div>
          <div className="portal-stat__label">Open Cases</div>
        </div>
        <div className="portal-stat">
          <div className="portal-stat__value">{stats.unreadMessages}</div>
          <div className="portal-stat__label">Unread Messages</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
        <Link to="/admin/experts" className="portal-card portal-card--clickable" style={{ textDecoration: 'none' }}>
          <h3 className="portal-card__title">Manage Experts</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
            Browse, review, and manage expert profiles
          </p>
        </Link>
        <Link to="/admin/invite" className="portal-card portal-card--clickable" style={{ textDecoration: 'none' }}>
          <h3 className="portal-card__title">Invite Expert</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
            Send an invitation to a new expert
          </p>
        </Link>
        <Link to="/admin/cases" className="portal-card portal-card--clickable" style={{ textDecoration: 'none' }}>
          <h3 className="portal-card__title">Cases</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
            Create and manage case opportunities
          </p>
        </Link>
        <Link to="/admin/messages" className="portal-card portal-card--clickable" style={{ textDecoration: 'none' }}>
          <h3 className="portal-card__title">Messages</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
            Communicate with experts
          </p>
        </Link>
      </div>
    </div>
  );
}
