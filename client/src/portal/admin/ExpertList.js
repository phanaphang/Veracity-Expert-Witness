import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');

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

  if (loading) return <div className="portal-loading"><div className="portal-loading__spinner"></div></div>;

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Experts</h1>
        <Link to="/admin/invite" className="btn btn--primary" style={{ padding: '10px 20px', textDecoration: 'none' }}>
          Invite Expert
        </Link>
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
                  <td>
                    <Link to={`/admin/experts/${exp.id}`} className="portal-btn-action">
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
