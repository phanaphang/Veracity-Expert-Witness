import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { formatName } from '../../utils/formatName';

export default function CaseList() {
  const { profile } = useAuth();
  const isStaff = profile?.role === 'staff';
  const isAdmin = profile?.role === 'admin';
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('open');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    supabase
      .from('cases')
      .select('*, specialties(name), case_invitations(count), manager:case_manager(first_name, last_name, email, role)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setCases(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = cases.filter(c => {
    if (filterStatus && c.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!c.title.toLowerCase().includes(term) && !(c.case_number || '').toLowerCase().includes(term)) return false;
    }
    return true;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('cases').delete().eq('id', deleteTarget.id);
    if (!error) {
      setCases(prev => prev.filter(c => c.id !== deleteTarget.id));
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  if (loading) return <div className="portal-loading"><div className="portal-loading__spinner"></div></div>;

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Cases</h1>
        {!isStaff && (
          <Link to="/admin/cases/new" className="btn btn--primary" style={{ padding: '10px 20px', textDecoration: 'none' }}>
            Create Case
          </Link>
        )}
      </div>

      <div className="portal-search-bar" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          className="portal-field__input"
          placeholder="Search by title or case number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <select className="portal-field__select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="portal-empty">
          <p className="portal-empty__text">No cases found</p>
          {!isStaff && <Link to="/admin/cases/new" style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>Create your first case</Link>}
        </div>
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Specialty</th>
                <th>Status</th>
                <th>Case Manager</th>
                <th>Invitations</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><strong>#{c.case_number} — {c.title}</strong></td>
                  <td>{c.specialties?.name || '—'}</td>
                  <td>
                    <span className={`portal-badge portal-badge--${c.status}`}>
                      {c.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{c.manager ? formatName(c.manager) : '—'}</td>
                  <td>{c.case_invitations?.[0]?.count || 0}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/admin/cases/${c.id}`} className="portal-btn-action">
                      View
                    </Link>
                    {isAdmin && (
                      <button
                        className="portal-btn-action"
                        style={{ color: 'var(--color-error, #e53e3e)', border: '1px solid var(--color-error, #e53e3e)', background: 'none', cursor: 'pointer' }}
                        onClick={() => setDeleteTarget(c)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <div className="portal-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="portal-card" style={{ maxWidth: 440, width: '90%', padding: 24 }}>
            <h3 style={{ margin: '0 0 8px', color: 'var(--color-error, #e53e3e)' }}>Delete Case</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
              Are you sure you want to permanently delete <strong>{deleteTarget.title}</strong>? This will remove the case and all associated invitations. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn--secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              <button className="btn" style={{ background: 'var(--color-error, #e53e3e)', color: '#fff', border: 'none' }} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete Case'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
