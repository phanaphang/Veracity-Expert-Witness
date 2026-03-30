import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { formatName } from '../../utils/formatName'
import { useToast } from '../../contexts/ToastContext'

const STATUS_LABELS = {
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
}

function highlight(text, term) {
  if (!text || !term) return text
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark
        key={i}
        style={{ background: '#fef08a', borderRadius: 2, padding: '0 1px' }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export default function ProjectList() {
  const { profile } = useAuth()
  const toast = useToast()
  const isAdmin = profile?.role === 'admin'
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('active')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 25

  useEffect(() => {
    supabase
      .from('projects')
      .select(
        '*, ownerProfile:owner(first_name, last_name, email, role), case_tasks(count)'
      )
      .order('created_at', { ascending: false })
      .limit(500)
      .then(({ data }) => {
        setProjects(data || [])
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load projects')
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (filterStatus && p.status !== filterStatus) return false
        if (searchTerm) {
          const term = searchTerm.toLowerCase()
          if (!p.title.toLowerCase().includes(term)) return false
        }
        return true
      }),
    [projects, filterStatus, searchTerm]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [filterStatus, searchTerm])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', deleteTarget.id)
    if (!error) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast.success('Project deleted')
    } else {
      toast.error('Failed to delete project')
    }
    setDeleting(false)
    setDeleteTarget(null)
  }

  if (loading)
    return (
      <div className="portal-loading" role="status" aria-label="Loading">
        <div className="portal-loading__spinner"></div>
      </div>
    )

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Projects</h1>
        {isAdmin && (
          <Link
            to="/admin/projects/new"
            className="btn btn--primary"
            style={{ padding: '10px 20px', textDecoration: 'none' }}
          >
            New Project
          </Link>
        )}
      </div>

      <div className="portal-search-bar project-filters">
        <input
          className="portal-field__input"
          placeholder="Search by title..."
          aria-label="Search projects by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="portal-field__select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter projects by status"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="portal-empty">
          <p className="portal-empty__text">No projects found</p>
          {isAdmin && (
            <Link
              to="/admin/projects/new"
              style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}
            >
              Create your first project
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="portal-table-wrap project-table-desktop">
            <table className="portal-table" aria-label="Projects list">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Status</th>
                  <th scope="col">Tasks</th>
                  <th scope="col">Owner</th>
                  <th scope="col">Created</th>
                  <th scope="col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{highlight(p.title, searchTerm)}</strong>
                    </td>
                    <td>
                      <span
                        className={`portal-badge portal-badge--${p.status}`}
                      >
                        {STATUS_LABELS[p.status] || p.status}
                      </span>
                    </td>
                    <td>{p.case_tasks?.[0]?.count || 0}</td>
                    <td>
                      {p.ownerProfile ? formatName(p.ownerProfile) : '--'}
                    </td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <Link
                        to={`/admin/projects/${p.id}`}
                        className="portal-btn-action"
                        aria-label={`View ${p.title}`}
                      >
                        View
                      </Link>
                      {isAdmin && (
                        <button
                          className="portal-btn-action"
                          style={{
                            color: 'var(--color-error, #e53e3e)',
                            border: '1px solid var(--color-error, #e53e3e)',
                            background: 'none',
                            cursor: 'pointer',
                          }}
                          onClick={() => setDeleteTarget(p)}
                          aria-label={`Delete ${p.title}`}
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

          {/* Mobile cards */}
          <div className="project-cards-mobile">
            {paginated.map((p) => (
              <div key={p.id} className="project-mobile-card">
                <div className="project-mobile-card__header">
                  <strong className="project-mobile-card__title">
                    {highlight(p.title, searchTerm)}
                  </strong>
                  <span className={`portal-badge portal-badge--${p.status}`}>
                    {STATUS_LABELS[p.status] || p.status}
                  </span>
                </div>
                <div className="project-mobile-card__meta">
                  <span>
                    Owner: {p.ownerProfile ? formatName(p.ownerProfile) : '--'}
                  </span>
                  <span>Tasks: {p.case_tasks?.[0]?.count || 0}</span>
                  <span>{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
                <div className="project-mobile-card__actions">
                  <Link
                    to={`/admin/projects/${p.id}`}
                    className="portal-btn-action"
                    aria-label={`View ${p.title}`}
                  >
                    View
                  </Link>
                  {isAdmin && (
                    <button
                      className="portal-btn-action"
                      style={{
                        color: 'var(--color-error, #e53e3e)',
                        border: '1px solid var(--color-error, #e53e3e)',
                        background: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => setDeleteTarget(p)}
                      aria-label={`Delete ${p.title}`}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="portal-pagination">
          <button
            className="portal-pagination__btn"
            disabled={page === 1}
            onClick={() => setPage((pg) => pg - 1)}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              className={`portal-pagination__btn ${pg === page ? 'portal-pagination__btn--active' : ''}`}
              onClick={() => setPage(pg)}
            >
              {pg}
            </button>
          ))}
          <button
            className="portal-pagination__btn"
            disabled={page === totalPages}
            onClick={() => setPage((pg) => pg + 1)}
          >
            Next
          </button>
          <span className="portal-pagination__info">
            Page {page} of {totalPages}
          </span>
        </div>
      )}

      {deleteTarget && (
        <div
          className="portal-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-project-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="portal-card"
            style={{ maxWidth: 440, width: '90%', padding: 24 }}
          >
            <h3
              id="delete-project-title"
              style={{
                margin: '0 0 8px',
                color: 'var(--color-error, #e53e3e)',
              }}
            >
              Delete Project
            </h3>
            <p
              style={{
                margin: '0 0 16px',
                fontSize: '0.9rem',
                color: 'var(--color-gray-500)',
              }}
            >
              Are you sure you want to permanently delete{' '}
              <strong>{deleteTarget.title}</strong>? This will remove the
              project and all associated tasks. This action cannot be undone.
            </p>
            <div
              style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}
            >
              <button
                className="btn btn--secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{
                  background: 'var(--color-error, #e53e3e)',
                  color: '#fff',
                  border: 'none',
                }}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
