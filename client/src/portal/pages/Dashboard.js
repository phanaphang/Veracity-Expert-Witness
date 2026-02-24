import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ pendingCases: 0, unreadMessages: 0, documents: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [hasCv, setHasCv] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const now = new Date().toISOString();
        const weekOut = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const [cases, msgs, docs, events] = await Promise.all([
          supabase.from('case_invitations').select('*', { count: 'exact', head: true }).eq('expert_id', user.id).eq('status', 'pending'),
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('recipient_id', user.id).eq('is_read', false),
          supabase.from('documents').select('document_type').eq('expert_id', user.id),
          supabase.from('calendar_events').select('id, title, start_time').eq('expert_id', user.id).gte('start_time', now).lte('start_time', weekOut).order('start_time', { ascending: true }).limit(5),
        ]);
        setStats({
          pendingCases: cases.count || 0,
          unreadMessages: msgs.count || 0,
          documents: docs.data?.length || 0,
        });
        setUpcomingEvents(events.data || []);
        if (docs.data?.some(d => d.document_type === 'cv')) setHasCv(true);
      } catch (e) {
        console.error('Dashboard load error', e);
      }
    };
    load();
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>Edit Profile</h3>
            {!hasCv && (
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap', marginLeft: 8 }}>
                CV missing
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', marginTop: 8 }}>
            Update your credentials, specialties, and availability
          </p>
          {!hasCv && (
            <p style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: 6, fontWeight: 600 }}>
              Upload your CV / Resume →
            </p>
          )}
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

      <div className="portal-card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 className="portal-card__title" style={{ marginBottom: 0 }}>My 30-Day Horizon</h3>
          <Link to="/portal/calendar" style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}>
            View Calendar →
          </Link>
        </div>
        {upcomingEvents.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-400)' }}>
            No events in the next 30 days. <Link to="/portal/calendar" style={{ color: 'var(--color-accent)' }}>Add one →</Link>
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {upcomingEvents.map(ev => (
              <div key={ev.id} className="cal-upcoming-event">
                <div className="cal-upcoming-event__dot" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-navy)' }}>{ev.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-gray-500)' }}>
                    {new Date(ev.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {' · '}
                    {new Date(ev.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
