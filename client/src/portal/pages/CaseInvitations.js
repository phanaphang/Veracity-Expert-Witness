import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function CaseInvitations() {
  const { user, profile } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadInvitations = async () => {
    const { data } = await supabase
      .from('case_invitations')
      .select('*, cases(case_number, title, description, status, specialties(name))')
      .eq('expert_id', user.id)
      .order('invited_at', { ascending: false });
    setInvitations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadInvitations();
  }, [user]); // eslint-disable-line

  const respond = async (invitationId, status, notes) => {
    const inv = invitations.find(i => i.id === invitationId);
    await supabase
      .from('case_invitations')
      .update({ status, expert_notes: notes || null, responded_at: new Date().toISOString() })
      .eq('id', invitationId);

    // Send notification email (fire-and-forget)
    const expertName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : user.email;
    fetch('/api/case-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expertName: expertName || user.email,
        expertEmail: user.email,
        caseTitle: inv?.cases?.title || 'Untitled Case',
        action: status,
      }),
    }).catch(() => {});

    await loadInvitations();
  };

  if (loading) return <div className="portal-loading"><div className="portal-loading__spinner"></div></div>;

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Case Invitations</h1>
      </div>

      {invitations.length > 0 && (
        <div className="portal-search-bar" style={{ marginBottom: 16 }}>
          <input
            className="portal-field__input"
            placeholder="Search by case title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 300 }}
          />
        </div>
      )}

      {invitations.length === 0 ? (
        <div className="portal-empty">
          <p className="portal-empty__text">No case invitations yet</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-400)' }}>When you're invited to a case, it will appear here.</p>
        </div>
      ) : (
        invitations.filter(inv => !searchTerm || (inv.cases?.title || '').toLowerCase().includes(searchTerm.toLowerCase())).map(inv => (
          <div key={inv.id} className="portal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 className="portal-card__title" style={{ marginBottom: 4 }}>{inv.cases?.case_number ? `#${inv.cases.case_number} — ` : ''}{inv.cases?.title || 'Untitled Case'}</h3>
                {inv.cases?.specialties?.name && (
                  <span className="portal-badge portal-badge--open">{inv.cases.specialties.name}</span>
                )}
              </div>
              <span className={`portal-badge portal-badge--${inv.status}`}>{inv.status === 'accepted' ? 'interested' : inv.status.replace('_', ' ')}</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', marginBottom: 16, lineHeight: 1.6 }}>
              {inv.cases?.description || 'No description provided.'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', marginBottom: 12 }}>
              Invited: {new Date(inv.invited_at).toLocaleDateString()}
            </p>

            {inv.status === 'pending' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn--primary" onClick={() => respond(inv.id, 'accepted')} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                  Interested
                </button>
                <button className="portal-btn-action" onClick={() => respond(inv.id, 'declined')}>
                  Decline
                </button>
                <button className="portal-btn-action" onClick={() => respond(inv.id, 'info_requested')}>
                  Request More Info
                </button>
              </div>
            )}

            {(inv.status === 'info_requested' || inv.status === 'declined' || inv.status === 'accepted') && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn--primary" onClick={() => respond(inv.id, 'accepted')} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                  Interested
                </button>
                <button className="portal-btn-action" onClick={() => respond(inv.id, 'declined')}>
                  Decline
                </button>
              </div>
            )}

            {inv.expert_notes && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', marginTop: 12, fontStyle: 'italic' }}>
                Your note: {inv.expert_notes}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
