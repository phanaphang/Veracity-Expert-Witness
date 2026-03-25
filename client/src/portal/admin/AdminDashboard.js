import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export default function AdminDashboard() {
  const { profile } = useAuth()
  const isStaff = profile?.role === 'staff'
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalExperts: 0,
    pendingProfiles: 0,
    openCases: 0,
    unreadMessages: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      const queries = [
        supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('is_read', false),
      ]
      if (!isStaff) {
        queries.unshift(
          supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'expert'),
          supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'expert')
            .is('onboarded_at', null),
          supabase
            .from('cases')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'open')
        )
      }
      Promise.all(queries)
        .then((results) => {
          if (isStaff) {
            setStats({
              totalExperts: 0,
              pendingProfiles: 0,
              openCases: 0,
              unreadMessages: results[0].count || 0,
            })
          } else {
            const [experts, pending, cases, msgs] = results
            setStats({
              totalExperts: experts.count || 0,
              pendingProfiles: pending.count || 0,
              openCases: cases.count || 0,
              unreadMessages: msgs.count || 0,
            })
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
    loadStats()
  }, [isStaff])

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">
          {isStaff ? 'Staff Dashboard' : 'Admin Dashboard'}
        </h1>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 16,
        }}
      >
        <Link
          to="/admin/experts"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
              Manage Experts
            </h3>
            {!isStaff && !loading && stats.totalExperts > 0 && (
              <span
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  marginLeft: 8,
                }}
              >
                {stats.totalExperts} expert{stats.totalExperts !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gray-500)',
              marginTop: 8,
            }}
          >
            Browse, review, and manage expert profiles
          </p>
        </Link>
        {!isStaff && (
          <Link
            to="/admin/invite"
            className="portal-card portal-card--clickable"
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
                Invite Expert
              </h3>
              {!loading && stats.pendingProfiles > 0 && (
                <span
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 999,
                    whiteSpace: 'nowrap',
                    marginLeft: 8,
                  }}
                >
                  {stats.pendingProfiles} pending
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-gray-500)',
                marginTop: 8,
              }}
            >
              Send an invitation to a new expert
            </p>
          </Link>
        )}
        <Link
          to="/admin/cases"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
              Cases
            </h3>
            {!isStaff && !loading && stats.openCases > 0 && (
              <span
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  marginLeft: 8,
                }}
              >
                {stats.openCases} open
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gray-500)',
              marginTop: 8,
            }}
          >
            {isStaff ? 'Manage cases' : 'Create and manage case opportunities'}
          </p>
        </Link>
        <Link
          to="/admin/messages"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
              Messages
            </h3>
            {!loading && stats.unreadMessages > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  marginLeft: 8,
                }}
              >
                {stats.unreadMessages} unread
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gray-500)',
              marginTop: 8,
            }}
          >
            Communicate with experts
          </p>
        </Link>
        <Link
          to="/admin/training"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <h3 className="portal-card__title">Training Report</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
            Panel progress on Expert Witness Foundations
          </p>
        </Link>
      </div>
    </div>
  )
}
