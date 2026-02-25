import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import * as XLSX from 'xlsx';

export default function ExpertList() {
  const { profile, session } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [experts, setExperts] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSpecialties, setFilterSpecialties] = useState(new Set());
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [expandedInFilter, setExpandedInFilter] = useState(new Set());
  const [filterAvailability, setFilterAvailability] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const filterPanelRef = useRef(null);
  const [deleting, setDeleting] = useState(false);
  const [exportConfirm, setExportConfirm] = useState(false);

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

  useEffect(() => {
    const handler = (e) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target)) {
        setFilterPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const parents = specialties.filter(s => !s.parent_id);
  const subsOf = (parentId) => specialties.filter(s => s.parent_id === parentId).map(s => s.id);

  const toggleFilterSpecialty = (id) => {
    setFilterSpecialties(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleExpandInFilter = (parentId) => {
    setExpandedInFilter(prev => {
      const next = new Set(prev);
      next.has(parentId) ? next.delete(parentId) : next.add(parentId);
      return next;
    });
  };

  const filtered = experts.filter(exp => {
    const name = `${exp.first_name || ''} ${exp.last_name || ''} ${exp.email || ''}`.toLowerCase();
    if (search && !name.includes(search.toLowerCase())) return false;
    if (filterAvailability && exp.availability !== filterAvailability) return false;
    if (filterSpecialties.size > 0) {
      const matchesAny = [...filterSpecialties].some(filterId => {
        const spec = specialties.find(s => s.id === filterId);
        if (spec && !spec.parent_id) {
          // Parent: match experts with the parent itself OR any of its subspecialties
          const ids = [filterId, ...subsOf(filterId)];
          return exp.expert_specialties?.some(es => ids.includes(es.specialty_id));
        }
        return exp.expert_specialties?.some(es => es.specialty_id === filterId);
      });
      if (!matchesAny) return false;
    }
    if (filterTag) {
      const words = filterTag.toLowerCase().split(/\s+/).filter(Boolean);
      const tagText = (exp.tags || []).join(' ').toLowerCase();
      if (!words.every(word => tagText.includes(word))) return false;
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

  const [exporting, setExporting] = useState(false);

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const exportExperts = [...filtered].sort((a, b) => (a.last_name || '').localeCompare(b.last_name || ''));
      const expertIds = exportExperts.map(e => e.id);

      const [docsRes, eduRes, expRes, credRes, testRes] = await Promise.all([
        supabase.from('documents').select('*').in('expert_id', expertIds).order('uploaded_at', { ascending: false }),
        supabase.from('education').select('*').in('expert_id', expertIds).order('end_year', { ascending: false }),
        supabase.from('work_experience').select('*').in('expert_id', expertIds).order('start_date', { ascending: false }),
        supabase.from('credentials').select('*').in('expert_id', expertIds),
        supabase.from('prior_testimony').select('*').in('expert_id', expertIds).order('date_of_testimony', { ascending: false }),
      ]);

      const allDocs = docsRes.data || [];
      const docsByExpert = {};
      for (const doc of allDocs) {
        if (!docsByExpert[doc.expert_id]) docsByExpert[doc.expert_id] = [];
        docsByExpert[doc.expert_id].push(doc);
      }

      const groupBy = (arr, key) => {
        const map = {};
        for (const item of (arr || [])) {
          if (!map[item[key]]) map[item[key]] = [];
          map[item[key]].push(item);
        }
        return map;
      };
      const eduByExpert = groupBy(eduRes.data, 'expert_id');
      const expByExpert = groupBy(expRes.data, 'expert_id');
      const credByExpert = groupBy(credRes.data, 'expert_id');
      const testByExpert = groupBy(testRes.data, 'expert_id');

      // Generate signed URLs for all documents (1 hour expiry)
      const signedUrlMap = {};
      for (const doc of allDocs) {
        const { data } = await supabase.storage.from('expert-documents').createSignedUrl(doc.file_path, 3600);
        if (data?.signedUrl) signedUrlMap[doc.id] = data.signedUrl;
      }

      const rows = exportExperts.map(exp => {
        const expertDocs = docsByExpert[exp.id] || [];
        const expertEdu = eduByExpert[exp.id] || [];
        const expertExp = expByExpert[exp.id] || [];
        const expertCred = credByExpert[exp.id] || [];
        const expertTest = testByExpert[exp.id] || [];
        return {
          'First Name': exp.first_name || '',
          'Last Name': exp.last_name || '',
          'Email': exp.email || '',
          'Phone': exp.phone || '',
          'Specialties': (exp.expert_specialties || []).map(es => es.specialties?.name).filter(Boolean).join(', '),
          'Tags': (exp.tags || []).join(', '),
          'Availability': exp.availability || '',
          'Bio': exp.bio || '',
          'Review & Report Rate': exp.rate_review_report || '',
          'Deposition Rate': exp.rate_deposition || '',
          'Trial Testimony Rate': exp.rate_trial_testimony || '',
          'Education': expertEdu.map(e => `${e.degree || ''} ${e.field_of_study ? 'in ' + e.field_of_study : ''} — ${e.institution || ''}${e.end_year ? ' (' + e.end_year + ')' : ''}`.trim()).join('; '),
          'Work Experience': expertExp.map(e => `${e.title || ''} at ${e.organization || ''}${e.is_current ? ' (Current)' : ''}`.trim()).join('; '),
          'Credentials': expertCred.map(c => `${c.name || ''}${c.issuing_body ? ' — ' + c.issuing_body : ''} (${c.credential_type || ''})`.trim()).join('; '),
          'Prior Testimony': expertTest.map(t => `${t.case_name || ''}${t.court ? ' — ' + t.court : ''}${t.retained_by ? ' [' + t.retained_by + ']' : ''}`.trim()).join('; '),
          'Status': exp.onboarded_at ? 'Onboarded' : 'Pending',
          'Created': exp.created_at ? new Date(exp.created_at).toLocaleDateString() : '',
          'Documents': expertDocs.map(d => d.file_name).join(', '),
        };
      });

      const ws = XLSX.utils.json_to_sheet(rows);

      // Add hyperlinks to the Documents column (index 16)
      const docColIndex = 16;
      let rowIndex = 1;
      for (const exp of exportExperts) {
        const expertDocs = docsByExpert[exp.id] || [];
        if (expertDocs.length > 0) {
          const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: docColIndex });
          if (expertDocs.length === 1 && signedUrlMap[expertDocs[0].id]) {
            ws[cellRef].l = { Target: signedUrlMap[expertDocs[0].id], Tooltip: expertDocs[0].file_name };
          }
        }
        rowIndex++;
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Experts');

      // Create a separate Documents sheet with all files hyperlinked
      const docRows = allDocs.map(doc => {
        const expert = exportExperts.find(e => e.id === doc.expert_id);
        return {
          'Expert': expert ? `${expert.first_name || ''} ${expert.last_name || ''}`.trim() || expert.email : '',
          'File Name': doc.file_name,
          'Type': doc.document_type,
          'Uploaded': doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : '',
          'Link': signedUrlMap[doc.id] || '',
        };
      });
      const ws2 = XLSX.utils.json_to_sheet(docRows);
      // Add hyperlinks to Link column (column E, index 4)
      docRows.forEach((row, i) => {
        if (row.Link) {
          const cellRef = XLSX.utils.encode_cell({ r: i + 1, c: 4 });
          if (ws2[cellRef]) {
            ws2[cellRef].l = { Target: row.Link, Tooltip: docRows[i]['File Name'] };
          }
        }
      });
      XLSX.utils.book_append_sheet(wb, ws2, 'Documents');

      XLSX.writeFile(wb, `Experts_${new Date().toISOString().split('T')[0]}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="portal-loading"><div className="portal-loading__spinner"></div></div>;

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Experts</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {isAdmin && (
            <button className="portal-btn-action" style={{ padding: '10px 20px' }} onClick={() => setExportConfirm(true)} disabled={exporting}>
              {exporting ? 'Exporting...' : 'Export'}
            </button>
          )}
          {profile?.role !== 'staff' && (
            <Link to="/admin/invite" className="btn btn--primary" style={{ padding: '10px 20px', textDecoration: 'none' }}>
              Invite Expert
            </Link>
          )}
        </div>
      </div>

      <div className="portal-stats" style={{ marginBottom: 24 }}>
        <div
          className="portal-stat"
          style={{ cursor: 'pointer', transition: 'border-color 0.15s', borderColor: filterSpecialties.size === 0 ? 'var(--color-accent)' : undefined }}
          onClick={() => setFilterSpecialties(new Set())}
        >
          <div className="portal-stat__value">{experts.length}</div>
          <div className="portal-stat__label">All Experts</div>
        </div>
        {parents.map(parent => {
          const childIds = subsOf(parent.id);
          const ids = [parent.id, ...childIds];
          const count = experts.filter(exp =>
            exp.expert_specialties?.some(es => ids.includes(es.specialty_id))
          ).length;
          return (
            <div
              key={parent.id}
              className="portal-stat"
              style={{ cursor: 'pointer', transition: 'border-color 0.15s', borderColor: filterSpecialties.has(parent.id) ? 'var(--color-accent)' : undefined }}
              onClick={() => toggleFilterSpecialty(parent.id)}
            >
              <div className="portal-stat__value">{count}</div>
              <div className="portal-stat__label">{parent.name}</div>
            </div>
          );
        })}
      </div>

      <div className="portal-search-bar">
        <input
          className="portal-field__input"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Multi-select specialty/subspecialty dropdown */}
        <div style={{ position: 'relative' }} ref={filterPanelRef}>
          <button
            type="button"
            className="portal-field__select"
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', width: '100%', textAlign: 'left', background: '#fff' }}
            onClick={() => setFilterPanelOpen(p => !p)}
          >
            <span style={{ flex: 1 }}>
              {filterSpecialties.size === 0 ? 'All Specialties' : `Specialties (${filterSpecialties.size})`}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-400)' }}>{filterPanelOpen ? '▲' : '▼'}</span>
          </button>

          {filterPanelOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 200, background: '#fff', border: '1px solid var(--color-gray-200)', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 300, maxHeight: 400, overflowY: 'auto' }}>
              {filterSpecialties.size > 0 && (
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-gray-200)' }}>
                  <button type="button" onClick={() => setFilterSpecialties(new Set())} style={{ fontSize: '0.78rem', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    Clear all ({filterSpecialties.size} selected)
                  </button>
                </div>
              )}
              {parents.map(parent => {
                const subs = specialties.filter(s => s.parent_id === parent.id);
                const isExpanded = expandedInFilter.has(parent.id);
                return (
                  <div key={parent.id}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '7px 12px', gap: 6, borderBottom: '1px solid var(--color-gray-100)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-navy)' }}>
                        <input
                          type="checkbox"
                          checked={filterSpecialties.has(parent.id)}
                          onChange={() => toggleFilterSpecialty(parent.id)}
                        />
                        {parent.name}
                      </label>
                      {subs.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleExpandInFilter(parent.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', fontSize: '0.7rem', padding: '2px 4px', lineHeight: 1 }}
                          title={isExpanded ? 'Collapse subspecialties' : 'Expand subspecialties'}
                        >
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      )}
                    </div>
                    {isExpanded && subs.map(sub => (
                      <label
                        key={sub.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px 6px 32px', cursor: 'pointer', fontSize: '0.83rem', color: 'var(--color-gray-600)', borderBottom: '1px solid var(--color-gray-100)' }}
                      >
                        <input
                          type="checkbox"
                          checked={filterSpecialties.has(sub.id)}
                          onChange={() => toggleFilterSpecialty(sub.id)}
                        />
                        {sub.name}
                      </label>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <select className="portal-field__select" value={filterAvailability} onChange={(e) => setFilterAvailability(e.target.value)}>
          <option value="">All Availability</option>
          <option value="available">Available</option>
          <option value="limited">Limited</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <input
          className="portal-field__input"
          placeholder="Search for additional subspecialties..."
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        />
      </div>

      {/* Active filter chips */}
      {filterSpecialties.size > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {[...filterSpecialties].map(id => {
            const spec = specialties.find(s => s.id === id);
            if (!spec) return null;
            return (
              <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#e0e7ff', color: '#3730a3', borderRadius: 999, padding: '3px 10px', fontSize: '0.8rem', fontWeight: 500 }}>
                {spec.name}
                <button type="button" onClick={() => toggleFilterSpecialty(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3730a3', fontSize: '1rem', lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button>
              </span>
            );
          })}
          <button type="button" onClick={() => setFilterSpecialties(new Set())} style={{ fontSize: '0.78rem', color: 'var(--color-gray-400)', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 4px' }}>
            Clear all
          </button>
        </div>
      )}

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
                <th>Subspecialties</th>
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
                    {exp.tags?.length > 0
                      ? exp.tags.map((tag, i) => (
                          <span key={i} className="portal-badge portal-badge--open" style={{ marginRight: 4, marginBottom: 4 }}>
                            {tag}
                          </span>
                        ))
                      : '—'}
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

      {exportConfirm && (
        <div className="portal-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="portal-card" style={{ maxWidth: 440, width: '90%', padding: 24 }}>
            <h3 style={{ margin: '0 0 8px', color: 'var(--color-gray-800)' }}>Export Experts</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
              Are you sure you want to export the Experts database to an Excel file?
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn--secondary" onClick={() => setExportConfirm(false)}>Cancel</button>
              <button
                className="btn btn--primary"
                onClick={() => {
                  setExportConfirm(false);
                  exportToExcel();
                }}
              >
                Export
              </button>
            </div>
          </div>
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
