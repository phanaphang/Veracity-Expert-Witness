import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function CaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    supabase
      .from('cases')
      .select('*, specialties(name), case_invitations(count)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setCases(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = filterStatus ? cases.filter(c => c.status === filterStatus) : cases;

  if (loading) return <div className="portal-loading"><div className="portal-loading__spinner"></div></div>;

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Cases</h1>
        <Link to="/admin/cases/new" className="btn btn--primary" style={{ padding: '10px 20px', textDecoration: 'none' }}>
          Create Case
        </Link>
      </div>

      <div className="portal-search-bar">
        <select className="portal-field__select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="portal-empty">
          <p className="portal-empty__text">No cases found</p>
          <Link to="/admin/cases/new" style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>Create your first case</Link>
        </div>
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Specialty</th>
                <th>Status</th>
                <th>Invitations</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.title}</strong></td>
                  <td>{c.specialties?.name || '—'}</td>
                  <td>
                    <span className={`portal-badge portal-badge--${c.status}`}>
                      {c.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{c.case_invitations?.[0]?.count || 0}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/admin/cases/${c.id}`} className="portal-btn-action">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
