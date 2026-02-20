import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function ExpertList() {
  const { profile, session } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [experts, setExperts] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*, expert_specialties(specialty_id, specialties(name))').eq('role', 'expert').order('created_at', { ascending: false }),
      supabase.from('specialties').select('*').order('name'),
    ]).then(([expRes, specRes]) => {
      setExperts(expRes.data || []);
      setSpecialties(specRes.data || []);
      setLoading(false);
    });
  }, []);

  const filtered = experts.filter(exp => {
    const name = `${exp.first_name || ''} ${exp.last_name || ''} ${exp.email || ''}`.toLowerCase();
    if (search && !name.includes(search.toLowerCase())) return false;
    if (filterAvailability && exp.availability !== filterAvailability) return false;
    if (filterSpecialty) {
      const hasSpec = exp.expert_specialties?.some(es => es.specialty_id === filterSpecialty);
      if (!hasSpec) return false;
    }
    return true;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/delete-expert', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ expertId: deleteTarget.id }),
      });
      if (res.ok) {
        setExperts(prev => prev.filter(e => e.id !== deleteTarget.id));
      }
    } catch (err) {
      // silent fail
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  if (loading) return <div className="portal-loading"><div className="portal-loading__spinner"></div></div>;

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Experts</h1>
        {profile?.role !== 'staff' && (
          <Link to="/admin/invite" className="btn btn--primary" style={{ padding: '10px 20px', textDecoration: 'none' }}>
            Invite Expert
          </Link>
        )}
      </div>

      <div className="portal-search-bar">
        <input
          className="portal-field__input"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="portal-field__select" value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)}>
          <option value="">All Specialties</option>
          {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className="portal-field__select" value={filterAvailability} onChange={(e) => setFilterAvailability(e.target.value)}>
          <option value="">All Availability</option>
          <option value="available">Available</option>
          <option value="limited">Limited</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="portal-empty">
          <p className="portal-empty__text">No experts found</p>
        </div>
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Specialties</th>
                <th>Availability</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.first_name ? `${exp.first_name} ${exp.last_name || ''}`.trim() : '—'}</td>
                  <td>{exp.email}</td>
                  <td>
                    {exp.expert_specialties?.map(es => (
                      <span key={es.specialty_id} className="portal-badge portal-badge--open" style={{ marginRight: 4, marginBottom: 4 }}>
                        {es.specialties?.name}
                      </span>
                    ))}
                  </td>
                  <td>
                    <span className={`portal-badge portal-badge--${exp.availability || 'pending'}`}>
                      {exp.availability || 'not set'}
                    </span>
                  </td>
                  <td>
                    <span className={`portal-badge portal-badge--${exp.onboarded_at ? 'accepted' : 'pending'}`}>
                      {exp.onboarded_at ? 'onboarded' : 'pending'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/admin/experts/${exp.id}`} className="portal-btn-action">
                      View
                    </Link>
                    {isAdmin && (
                      <button
                        className="portal-btn-action"
                        style={{ color: 'var(--color-error, #e53e3e)', border: '1px solid var(--color-error, #e53e3e)', background: 'none', cursor: 'pointer' }}
                        onClick={() => setDeleteTarget(exp)}
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
            <h3 style={{ margin: '0 0 8px', color: 'var(--color-error, #e53e3e)' }}>Delete Expert</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
              Are you sure you want to permanently delete <strong>{deleteTarget.first_name ? `${deleteTarget.first_name} ${deleteTarget.last_name || ''}`.trim() : deleteTarget.email}</strong>? This will remove their account, profile, documents, and all associated data. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn--secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              <button className="btn" style={{ background: 'var(--color-error, #e53e3e)', color: '#fff', border: 'none' }} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete Expert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
