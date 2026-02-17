import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCase = async () => {
    const [caseRes, invRes] = await Promise.all([
      supabase.from('cases').select('*, specialties(name)').eq('id', id).single(),
      supabase.from('case_invitations').select('*, profiles:expert_id(id, first_name, last_name, email)').eq('case_id', id).order('invited_at', { ascending: false }),
    ]);
    setCaseData(caseRes.data);
    setInvitations(invRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCase();
  }, [id]); // eslint-disable-line

  const sanitizeSearch = (term) => term.replace(/[%_(),.\\]/g, '');

  const searchExperts = async (term) => {
    setSearchTerm(term);
    if (term.length < 2) { setExperts([]); return; }
    const safe = sanitizeSearch(term);
    if (!safe) { setExperts([]); return; }
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .eq('role', 'expert')
      .or(`first_name.ilike.%${safe}%,last_name.ilike.%${safe}%,email.ilike.%${safe}%`)
      .limit(10);
    const invitedIds = invitations.map(inv => inv.profiles?.id);
    setExperts((data || []).filter(e => !invitedIds.includes(e.id)));
  };

  const inviteExpert = async (expertId) => {
    await supabase.from('case_invitations').insert({
      case_id: id,
      expert_id: expertId,
      status: 'pending',
    });
    setSearchTerm('');
    setExperts([]);
    await loadCase();
  };

  const updateStatus = async (status) => {
    await supabase.from('cases').update({ status }).eq('id', id);
    setCaseData(prev => ({ ...prev, status }));
  };

  if (loading) return <div className="portal-loading"><div className="portal-loading__spinner"></div></div>;
  if (!caseData) return <div className="portal-empty"><p className="portal-empty__text">Case not found</p></div>;

  return (
    <div>
      <div className="portal-page__header">
        <div>
          <Link to="/admin/cases" style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textDecoration: 'none', marginBottom: 8, display: 'inline-block' }}>
            &larr; Back to Cases
          </Link>
          <h1 className="portal-page__title">{caseData.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {caseData.status !== 'closed' && (
            <button className="portal-btn-action" onClick={() => updateStatus('closed')}>
              Close Case
            </button>
          )}
          {caseData.status === 'closed' && (
            <button className="btn btn--primary" onClick={() => updateStatus('open')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Reopen Case
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <span className={`portal-badge portal-badge--${caseData.status}`}>{caseData.status?.replace('_', ' ')}</span>
        {caseData.specialties?.name && <span className="portal-badge portal-badge--open">{caseData.specialties.name}</span>}
      </div>

      <div className="portal-card">
        <h2 className="portal-card__title">Case Details</h2>
        <p style={{ lineHeight: 1.6, color: 'var(--color-gray-600)', marginBottom: 12 }}>{caseData.description}</p>
        <div className="portal-list-item__row">
          {caseData.case_type && <div><strong>Type:</strong> {caseData.case_type}</div>}
          {caseData.jurisdiction && <div><strong>Jurisdiction:</strong> {caseData.jurisdiction}</div>}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', marginTop: 8 }}>
          Created: {new Date(caseData.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Invite Experts */}
      <div className="portal-card">
        <h2 className="portal-card__title">Invite Experts</h2>
        <div className="portal-field">
          <input
            className="portal-field__input"
            placeholder="Search experts by name or email..."
            value={searchTerm}
            onChange={(e) => searchExperts(e.target.value)}
          />
        </div>
        {experts.length > 0 && (
          <div style={{ border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', marginTop: 8 }}>
            {experts.map(exp => (
              <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid var(--color-gray-100)' }}>
                <div>
                  <strong>{exp.first_name ? `${exp.first_name} ${exp.last_name || ''}`.trim() : exp.email}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', marginLeft: 8 }}>{exp.email}</span>
                </div>
                <button className="btn btn--primary" onClick={() => inviteExpert(exp.id)} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                  Invite
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invited Experts */}
      <div className="portal-card">
        <h2 className="portal-card__title">Invited Experts ({invitations.length})</h2>
        {invitations.length === 0 ? (
          <p style={{ color: 'var(--color-gray-400)', fontSize: '0.85rem' }}>No experts invited yet</p>
        ) : (
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Expert</th>
                  <th>Status</th>
                  <th>Invited</th>
                  <th>Responded</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invitations.map(inv => (
                  <tr key={inv.id}>
                    <td>
                      {inv.profiles?.first_name
                        ? `${inv.profiles.first_name} ${inv.profiles.last_name || ''}`.trim()
                        : inv.profiles?.email || '—'}
                    </td>
                    <td>
                      <span className={`portal-badge portal-badge--${inv.status}`}>
                        {inv.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(inv.invited_at).toLocaleDateString()}</td>
                    <td>{inv.responded_at ? new Date(inv.responded_at).toLocaleDateString() : '—'}</td>
                    <td>
                      <Link to={`/admin/experts/${inv.expert_id}`} style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }}>
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
