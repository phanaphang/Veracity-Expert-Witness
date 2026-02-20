import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { formatName } from '../../utils/formatName';

export default function CaseDetail() {
  const { id } = useParams();
  const { profile, session } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [caseData, setCaseData] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [experts, setExperts] = useState([]);
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignExpertTerm, setAssignExpertTerm] = useState('');
  const [assignExpertResults, setAssignExpertResults] = useState([]);
  const [assignConfirmTarget, setAssignConfirmTarget] = useState(null);
  const [managerConfirmTarget, setManagerConfirmTarget] = useState(null);
  const [removeExpertConfirm, setRemoveExpertConfirm] = useState(false);
  const [notesEditing, setNotesEditing] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [clientEditing, setClientEditing] = useState(false);
  const [clientValue, setClientValue] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCase = async () => {
    const [caseRes, invRes, mgrRes] = await Promise.all([
      supabase.from('cases').select('*, specialties(name), manager:case_manager(id, first_name, last_name, email, role), assignedExpert:assigned_expert(id, first_name, last_name, email, role)').eq('id', id).single(),
      supabase.from('case_invitations').select('*, profiles:expert_id(id, first_name, last_name, email)').eq('case_id', id).order('invited_at', { ascending: false }),
      supabase.from('profiles').select('id, first_name, last_name, email, role').in('role', ['admin', 'staff']).order('first_name'),
    ]);
    setCaseData(caseRes.data);
    setClientValue(caseRes.data?.client || '');
    setNotesValue(caseRes.data?.additional_notes || '');
    setInvitations(invRes.data || []);
    setManagers(mgrRes.data || []);
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

  const searchAssignExpert = async (term) => {
    setAssignExpertTerm(term);
    if (term.length < 2) { setAssignExpertResults([]); return; }
    const safe = sanitizeSearch(term);
    if (!safe) { setAssignExpertResults([]); return; }
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .eq('role', 'expert')
      .or(`first_name.ilike.%${safe}%,last_name.ilike.%${safe}%,email.ilike.%${safe}%`)
      .limit(10);
    setAssignExpertResults(data || []);
  };

  const assignExpert = async (expertId) => {
    await supabase.from('cases').update({ assigned_expert: expertId }).eq('id', id);
    setAssignExpertTerm('');
    setAssignExpertResults([]);
    fetch('/api/notify-assigned-expert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        expertId,
        caseTitle: caseData.title,
        caseId: id,
        caseNumber: caseData.case_number,
      }),
    }).catch(() => {});
    await loadCase();
  };

  const removeAssignedExpert = async () => {
    await supabase.from('cases').update({ assigned_expert: null }).eq('id', id);
    await loadCase();
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
          <h1 className="portal-page__title">#{caseData.case_number} — {caseData.title}</h1>
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
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong>Client:</strong>
            {(isAdmin || profile?.role === 'staff') && (
              clientEditing ? (
                <button
                  className="btn btn--primary"
                  style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                  onClick={async () => {
                    await supabase.from('cases').update({ client: clientValue }).eq('id', id);
                    setCaseData(prev => ({ ...prev, client: clientValue }));
                    setClientEditing(false);
                  }}
                >
                  Save
                </button>
              ) : (
                <button
                  className="portal-btn-action"
                  style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                  onClick={() => setClientEditing(true)}
                >
                  Edit
                </button>
              )
            )}
          </div>
          <input
            className="portal-field__input"
            style={{ marginTop: 4, background: clientEditing ? '#fff' : 'var(--color-gray-50, #f7fafc)' }}
            value={clientValue}
            onChange={(e) => setClientValue(e.target.value)}
            readOnly={!clientEditing}
            placeholder={clientEditing ? 'Enter client name...' : 'No client specified'}
          />
        </div>
        <div className="portal-list-item__row">
          {caseData.case_type && <div><strong>Type:</strong> {caseData.case_type}</div>}
          {caseData.jurisdiction && <div><strong>Jurisdiction:</strong> {caseData.jurisdiction}</div>}
        </div>
        <div style={{ marginTop: 12 }}>
          <strong>Case Manager:</strong>{' '}
          {isAdmin ? (
            <select
              className="portal-field__select"
              style={{ display: 'inline-block', width: 'auto', marginLeft: 8 }}
              value={caseData.case_manager || ''}
              onChange={(e) => {
                const value = e.target.value || null;
                const selected = managers.find(m => m.id === value);
                setManagerConfirmTarget({ id: value, profile: selected });
              }}
            >
              <option value="">Unassigned</option>
              {managers.map(m => (
                <option key={m.id} value={m.id}>
                  {formatName(m)} ({m.role})
                </option>
              ))}
            </select>
          ) : (
            <span>
              {caseData.manager
                ? `${formatName(caseData.manager)} (${caseData.manager.role})`
                : 'Unassigned'}
            </span>
          )}
        </div>
        <div style={{ marginTop: 12 }}>
          <strong>Assigned Expert:</strong>{' '}
          {caseData.assignedExpert ? (
            <span>
              {formatName(caseData.assignedExpert)}
              <Link to={`/admin/experts/${caseData.assignedExpert.id}?from=case&caseId=${id}`} style={{ color: 'var(--color-accent)', fontSize: '0.8rem', marginLeft: 8 }}>
                View Profile
              </Link>
              {(isAdmin || profile?.role === 'staff') && (
                <button
                  className="portal-btn-action"
                  style={{ marginLeft: 8, padding: '4px 10px', fontSize: '0.8rem' }}
                  onClick={() => setRemoveExpertConfirm(true)}
                >
                  Remove
                </button>
              )}
            </span>
          ) : (isAdmin || profile?.role === 'staff') ? (
            <div style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 8 }}>
              <input
                className="portal-field__input"
                style={{ width: 260, display: 'inline-block' }}
                placeholder="Search experts by name or email..."
                value={assignExpertTerm}
                onChange={(e) => searchAssignExpert(e.target.value)}
              />
              {assignExpertResults.length > 0 && (
                <div style={{ border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', marginTop: 4, position: 'absolute', background: '#fff', zIndex: 10, width: 360 }}>
                  {assignExpertResults.map(exp => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--color-gray-100)' }}>
                      <div>
                        <strong>{formatName(exp)}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', marginLeft: 8 }}>{exp.email}</span>
                      </div>
                      <button className="btn btn--primary" onClick={() => setAssignConfirmTarget({ type: 'search', expertId: exp.id, name: formatName(exp) })} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <span>Unassigned</span>
          )}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', marginTop: 8 }}>
          Created: {new Date(caseData.created_at).toLocaleDateString()}
        </p>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <strong>Additional Notes:</strong>
            {(isAdmin || profile?.role === 'staff') && (
              notesEditing ? (
                <button
                  className="btn btn--primary"
                  style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                  onClick={async () => {
                    await supabase.from('cases').update({ additional_notes: notesValue }).eq('id', id);
                    setCaseData(prev => ({ ...prev, additional_notes: notesValue }));
                    setNotesEditing(false);
                  }}
                >
                  Save
                </button>
              ) : (
                <button
                  className="portal-btn-action"
                  style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                  onClick={() => setNotesEditing(true)}
                >
                  Edit
                </button>
              )
            )}
          </div>
          <textarea
            className="portal-field__input"
            style={{ width: '100%', minHeight: 100, resize: 'vertical', background: notesEditing ? '#fff' : 'var(--color-gray-50, #f7fafc)', color: 'var(--color-gray-600)' }}
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            readOnly={!notesEditing}
            placeholder={notesEditing ? 'Enter additional notes...' : 'No additional notes'}
          />
        </div>
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
        {(() => {
          const filteredInvitations = invitations.filter(inv => inv.profiles?.id !== caseData.assignedExpert?.id);
          return (
            <>
        <h2 className="portal-card__title">Invited Experts ({filteredInvitations.length})</h2>
        {filteredInvitations.length === 0 ? (
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
                {filteredInvitations.map(inv => (
                  <tr key={inv.id}>
                    <td>
                      {inv.profiles?.first_name
                        ? `${inv.profiles.first_name} ${inv.profiles.last_name || ''}`.trim()
                        : inv.profiles?.email || '—'}
                    </td>
                    <td>
                      <span className={`portal-badge portal-badge--${inv.status}`}>
                        {inv.status === 'accepted' ? 'interested' : inv.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(inv.invited_at).toLocaleDateString()}</td>
                    <td>{inv.responded_at ? new Date(inv.responded_at).toLocaleDateString() : '—'}</td>
                    <td style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <Link to={`/admin/experts/${inv.expert_id}?from=case&caseId=${id}`} style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }}>
                        View Profile
                      </Link>
                      {(isAdmin || profile?.role === 'staff') && (
                        <button
                          className="btn btn--primary"
                          style={{ padding: '4px 12px', fontSize: '0.8rem', marginLeft: 'auto' }}
                          onClick={() => setAssignConfirmTarget({ type: 'invited', expertId: inv.expert_id, name: inv.profiles?.first_name ? `${inv.profiles.first_name} ${inv.profiles.last_name || ''}`.trim() : inv.profiles?.email || 'this expert' })}
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
            </>
          );
        })()}
      </div>

      {assignConfirmTarget && (
        <div className="portal-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="portal-card" style={{ maxWidth: 440, width: '90%', padding: 24 }}>
            <h3 style={{ margin: '0 0 8px', color: 'var(--color-gray-800)' }}>Assign Expert</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
              Are you sure you want to assign{' '}
              <strong>{assignConfirmTarget.name}</strong>{' '}
              as the assigned expert for this case?
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn--secondary" onClick={() => setAssignConfirmTarget(null)}>Cancel</button>
              <button
                className="btn btn--primary"
                onClick={async () => {
                  await assignExpert(assignConfirmTarget.expertId);
                  setAssignConfirmTarget(null);
                }}
              >
                Assign Expert
              </button>
            </div>
          </div>
        </div>
      )}

      {removeExpertConfirm && caseData.assignedExpert && (
        <div className="portal-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="portal-card" style={{ maxWidth: 440, width: '90%', padding: 24 }}>
            <h3 style={{ margin: '0 0 8px', color: 'var(--color-error, #e53e3e)' }}>Remove Assigned Expert</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
              Are you sure you want to remove <strong>{formatName(caseData.assignedExpert)}</strong> as the assigned expert? They will be returned to the Invited Experts list.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn--secondary" onClick={() => setRemoveExpertConfirm(false)}>Cancel</button>
              <button
                className="btn"
                style={{ background: 'var(--color-error, #e53e3e)', color: '#fff', border: 'none' }}
                onClick={async () => {
                  setRemoveExpertConfirm(false);
                  await removeAssignedExpert();
                }}
              >
                Remove Expert
              </button>
            </div>
          </div>
        </div>
      )}

      {managerConfirmTarget && (
        <div className="portal-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="portal-card" style={{ maxWidth: 440, width: '90%', padding: 24 }}>
            <h3 style={{ margin: '0 0 8px', color: 'var(--color-gray-800)' }}>
              {managerConfirmTarget.id ? 'Assign Case Manager' : 'Remove Case Manager'}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
              {managerConfirmTarget.id ? (
                <>Are you sure you want to assign <strong>{formatName(managerConfirmTarget.profile)}</strong> as the case manager?</>
              ) : (
                <>Are you sure you want to remove the current case manager?</>
              )}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn--secondary" onClick={() => setManagerConfirmTarget(null)}>Cancel</button>
              <button
                className="btn btn--primary"
                onClick={async () => {
                  const value = managerConfirmTarget.id;
                  await supabase.from('cases').update({ case_manager: value }).eq('id', id);
                  setCaseData(prev => ({ ...prev, case_manager: value }));
                  if (value) {
                    fetch('/api/notify-case-manager', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.access_token}`,
                      },
                      body: JSON.stringify({
                        caseManagerId: value,
                        caseTitle: caseData.title,
                        caseId: id,
                      }),
                    }).catch(() => {});
                  }
                  setManagerConfirmTarget(null);
                  await loadCase();
                }}
              >
                {managerConfirmTarget.id ? 'Assign Manager' : 'Remove Manager'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
