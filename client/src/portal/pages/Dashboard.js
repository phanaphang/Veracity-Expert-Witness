import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ pendingCases: 0, unreadMessages: 0, documents: 0 });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('case_invitations').select('*', { count: 'exact', head: true }).eq('expert_id', user.id).eq('status', 'pending'),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('recipient_id', user.id).eq('is_read', false),
      supabase.from('documents').select('*', { count: 'exact', head: true }).eq('expert_id', user.id),
    ]).then(([cases, msgs, docs]) => {
      setStats({
        pendingCases: cases.count || 0,
        unreadMessages: msgs.count || 0,
        documents: docs.count || 0,
      });
    });
  }, [user]);

  const profileComplete = profile?.first_name && profile?.last_name && profile?.bio;

  return (
    <div>
      <div className="portal-page__header">
        <div>
          <h1 className="portal-page__title">
            Welcome{profile?.first_name ? `, ${profile.first_name}` : ''}
          </h1>
          <p className="portal-page__subtitle">Here's an overview of your account</p>
        </div>
      </div>

      {!profileComplete && (
        <div className="portal-alert portal-alert--error" style={{ marginBottom: 24 }}>
          Your profile is incomplete. <Link to="/portal/profile" style={{ fontWeight: 600 }}>Complete your profile</Link> to be eligible for case invitations.
        </div>
      )}

      <div className="portal-stats">
        <div className="portal-stat">
          <div className="portal-stat__value">{stats.pendingCases}</div>
          <div className="portal-stat__label">Pending Case Invitations</div>
        </div>
        <div className="portal-stat">
          <div className="portal-stat__value">{stats.unreadMessages}</div>
          <div className="portal-stat__label">Unread Messages</div>
        </div>
        <div className="portal-stat">
          <div className="portal-stat__value">{stats.documents}</div>
          <div className="portal-stat__label">Documents Uploaded</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
        <Link to="/portal/profile" className="portal-card portal-card--clickable" style={{ textDecoration: 'none' }}>
          <h3 className="portal-card__title">Edit Profile</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
            Update your credentials, specialties, and availability
          </p>
        </Link>
        <Link to="/portal/documents" className="portal-card portal-card--clickable" style={{ textDecoration: 'none' }}>
          <h3 className="portal-card__title">Documents</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
            Upload your CV, licenses, and certifications
          </p>
        </Link>
        <Link to="/portal/cases" className="portal-card portal-card--clickable" style={{ textDecoration: 'none' }}>
          <h3 className="portal-card__title">Case Invitations</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
            View and respond to case opportunities
          </p>
        </Link>
      </div>
    </div>
  );
}
