import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { formatName } from '../../utils/formatName'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { useToast } from '../../contexts/ToastContext'
import CaseTasksTab from './CaseTasksTab'

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

export default function ProjectDetail() {
  const { id } = useParams()
  const { profile } = useAuth()
  const toast = useToast()
  const isAdmin = profile?.role === 'admin'
  const [project, setProject] = useState(null)
  const [staffMembers, setStaffMembers] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  const [tasks, setTasks] = useState([])
  const [activityLog, setActivityLog] = useState([])
  const [detailsEditing, setDetailsEditing] = useState(false)
  const { UnsavedModal, setSaveHandler } = useUnsavedChanges(detailsEditing)
  const [descValue, setDescValue] = useState('')
  const [titleValue, setTitleValue] = useState('')
  const [ownerValue, setOwnerValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [addMemberTerm, setAddMemberTerm] = useState('')
  const [addMemberResults, setAddMemberResults] = useState([])

  const loadProjectData = useCallback(async () => {
    const [projRes, tasksRes, activityRes, membersRes] = await Promise.all([
      supabase
        .from('projects')
        .select('*, ownerProfile:owner(id, first_name, last_name, email, role)')
        .eq('id', id)
        .single(),
      supabase
        .from('case_tasks')
        .select(
          '*, assigneeProfile:assignee(id, first_name, last_name, email, role), creatorProfile:created_by(id, first_name, last_name, email, role)'
        )
        .eq('project_id', id)
        .order('created_at', { ascending: false }),
      supabase
        .from('project_activity_log')
        .select('*, actorProfile:actor(first_name, last_name, email, role)')
        .eq('project_id', id)
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('project_members')
        .select(
          '*, memberProfile:user_id(id, first_name, last_name, email, role)'
        )
        .eq('project_id', id),
    ])

    if (projRes.data) {
      setProject(projRes.data)
      setTitleValue(projRes.data.title)
      setDescValue(projRes.data.description || '')
      setOwnerValue(projRes.data.owner)
      setStatusValue(projRes.data.status)
    }
    setTasks(tasksRes.data || [])
    setActivityLog(activityRes.data || [])
    setMembers(membersRes.data || [])
    setLoading(false)
  }, [id])

  useEffect(() => {
    loadProjectData()
    supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .in('role', ['admin', 'staff'])
      .order('first_name')
      .then(({ data }) => setStaffMembers(data || []))
  }, [loadProjectData])

  const handleSaveDetails = async () => {
    const { error } = await supabase
      .from('projects')
      .update({
        title: titleValue.trim(),
        description: descValue.trim(),
        owner: ownerValue || project.owner,
        status: statusValue,
      })
      .eq('id', id)
    if (error) {
      toast.error('Failed to save project details.')
      return
    }
    await supabase.from('project_activity_log').insert({
      project_id: id,
      actor: profile.id,
      action: 'project_updated',
      details: { changes: 'details updated' },
    })
    toast.success('Project details saved.')
    setDetailsEditing(false)
    loadProjectData()
  }

  const startEditing = () => {
    setTitleValue(project.title)
    setDescValue(project.description || '')
    setOwnerValue(project.owner)
    setStatusValue(project.status)
    setDetailsEditing(true)
    setSaveHandler(() => handleSaveDetails)
  }

  const cancelEditing = () => {
    setTitleValue(project.title)
    setDescValue(project.description || '')
    setOwnerValue(project.owner)
    setStatusValue(project.status)
    setDetailsEditing(false)
  }

  const sanitize = (term) => term.replace(/[%_(),.\\]/g, '')

  const searchMember = async (term) => {
    setAddMemberTerm(term)
    if (term.length < 2) {
      setAddMemberResults([])
      return
    }
    const safe = sanitize(term)
    if (!safe) {
      setAddMemberResults([])
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .in('role', ['admin', 'staff'])
      .or(
        `first_name.ilike.%${safe}%,last_name.ilike.%${safe}%,email.ilike.%${safe}%`
      )
      .limit(10)
    const memberIds = members.map((m) => m.user_id)
    setAddMemberResults((data || []).filter((u) => !memberIds.includes(u.id)))
  }

  const addMember = async (user) => {
    const { error } = await supabase
      .from('project_members')
      .insert({ project_id: id, user_id: user.id })
    if (error) {
      toast.error('Failed to add member.')
      return
    }
    toast.success(`${formatName(user)} added to project.`)
    setAddMemberTerm('')
    setAddMemberResults([])
    loadProjectData()
  }

  const removeMember = async (userId) => {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', id)
      .eq('user_id', userId)
    if (error) {
      toast.error('Failed to remove member.')
      return
    }
    toast.success('Member removed.')
    loadProjectData()
  }

  if (loading)
    return (
      <div className="portal-loading" role="status" aria-label="Loading">
        <div className="portal-loading__spinner"></div>
      </div>
    )

  if (!project)
    return (
      <div className="portal-empty">
        <p className="portal-empty__text">Project not found.</p>
        <Link to="/admin/projects" style={{ color: 'var(--color-accent)' }}>
          Back to Projects
        </Link>
      </div>
    )

  return (
    <div>
      <div className="portal-page__header">
        <div>
          <Link
            to="/admin/projects"
            style={{
              fontSize: '0.82rem',
              color: 'var(--color-accent)',
              textDecoration: 'none',
            }}
          >
            &larr; Projects
          </Link>
          <h1 className="portal-page__title" style={{ margin: '4px 0 0' }}>
            {project.title}
          </h1>
        </div>
        <span className={`portal-badge portal-badge--${project.status}`}>
          {STATUS_OPTIONS.find((s) => s.value === project.status)?.label}
        </span>
      </div>

      <div className="case-tabs" role="tablist" aria-label="Project sections">
        {['details', 'tasks', 'activity'].map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`tabpanel-${tab}`}
            id={`tab-${tab}`}
            className={`case-tabs__btn${activeTab === tab ? ' case-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'details' && 'Details'}
            {tab === 'tasks' && `Tasks (${tasks.length})`}
            {tab === 'activity' && 'Activity'}
          </button>
        ))}
      </div>

      {activeTab === 'details' && (
        <div
          role="tabpanel"
          id="tabpanel-details"
          aria-labelledby="tab-details"
        >
          <div className="portal-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2 className="portal-card__title" style={{ margin: 0 }}>
                Project Details
              </h2>
              {(isAdmin || profile?.role === 'staff') &&
                (detailsEditing ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn--secondary"
                      onClick={cancelEditing}
                      style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn--primary"
                      onClick={handleSaveDetails}
                      style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    className="portal-btn-action"
                    onClick={startEditing}
                    style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                    aria-label="Edit project details"
                  >
                    Edit
                  </button>
                ))}
            </div>

            {detailsEditing ? (
              <div style={{ marginTop: 16 }}>
                <div className="portal-field">
                  <label className="portal-field__label">Title</label>
                  <input
                    className="portal-field__input"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Description</label>
                  <textarea
                    className="portal-field__textarea"
                    value={descValue}
                    onChange={(e) => setDescValue(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Status</label>
                  <select
                    className="portal-field__select"
                    value={statusValue}
                    onChange={(e) => setStatusValue(e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="portal-field">
                  <label className="portal-field__label">Owner</label>
                  <select
                    className="portal-field__select"
                    value={ownerValue}
                    onChange={(e) => setOwnerValue(e.target.value)}
                  >
                    {staffMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {formatName(m)} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <strong>Title:</strong>
                  <input
                    className="portal-field__input"
                    style={{
                      marginTop: 4,
                      background: 'var(--color-gray-50, #f7fafc)',
                    }}
                    value={project.title}
                    readOnly
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong>Description:</strong>
                  <textarea
                    className="portal-field__input"
                    style={{
                      width: '100%',
                      minHeight: 80,
                      resize: 'vertical',
                      lineHeight: 1.6,
                      marginTop: 4,
                      background: 'var(--color-gray-50, #f7fafc)',
                      color: 'var(--color-gray-600)',
                    }}
                    value={project.description || ''}
                    readOnly
                    placeholder="No description"
                  />
                </div>
                <div
                  className="portal-list-item__row"
                  style={{ marginBottom: 12 }}
                >
                  <div>
                    <strong>Status:</strong>
                    <div style={{ marginTop: 4 }}>
                      <span
                        className={`portal-badge portal-badge--${project.status}`}
                      >
                        {
                          STATUS_OPTIONS.find((s) => s.value === project.status)
                            ?.label
                        }
                      </span>
                    </div>
                  </div>
                  <div>
                    <strong>Owner:</strong>
                    <input
                      className="portal-field__input"
                      style={{
                        marginTop: 4,
                        background: 'var(--color-gray-50, #f7fafc)',
                      }}
                      value={
                        project.ownerProfile
                          ? formatName(project.ownerProfile)
                          : '--'
                      }
                      readOnly
                    />
                  </div>
                  <div>
                    <strong>Created:</strong>
                    <input
                      className="portal-field__input"
                      style={{
                        marginTop: 4,
                        background: 'var(--color-gray-50, #f7fafc)',
                      }}
                      value={new Date(project.created_at).toLocaleDateString()}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Members Section */}
          <div className="portal-card" style={{ marginTop: 16 }}>
            <h2 className="portal-card__title">Members ({members.length})</h2>
            {members.length === 0 && (
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-gray-500)',
                  margin: '8px 0',
                }}
              >
                No members added yet.
              </p>
            )}
            {members.map((m) => (
              <div
                key={m.user_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--color-gray-100)',
                }}
              >
                <div>
                  <span style={{ fontWeight: 500, fontSize: '0.88rem' }}>
                    {m.memberProfile ? formatName(m.memberProfile) : m.user_id}
                  </span>
                  {m.memberProfile && (
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--color-gray-400)',
                        marginLeft: 8,
                      }}
                    >
                      {m.memberProfile.role}
                    </span>
                  )}
                </div>
                {(isAdmin || profile?.role === 'staff') && (
                  <button
                    className="portal-btn-action"
                    style={{
                      color: 'var(--color-error, #e53e3e)',
                      fontSize: '0.78rem',
                      padding: '4px 10px',
                    }}
                    onClick={() => removeMember(m.user_id)}
                    aria-label={`Remove ${m.memberProfile ? formatName(m.memberProfile) : 'member'}`}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {(isAdmin || profile?.role === 'staff') && (
              <div style={{ marginTop: 12, position: 'relative' }}>
                <input
                  className="portal-field__input"
                  placeholder="Search to add a member..."
                  aria-label="Search to add a project member"
                  value={addMemberTerm}
                  onChange={(e) => searchMember(e.target.value)}
                />
                {addMemberResults.length > 0 && (
                  <div
                    role="listbox"
                    aria-label="Member search results"
                    style={{
                      border: '1px solid var(--color-gray-200)',
                      borderRadius: 'var(--radius-md, 6px)',
                      marginTop: 2,
                      position: 'absolute',
                      background: '#fff',
                      zIndex: 10,
                      width: '100%',
                      maxHeight: 200,
                      overflowY: 'auto',
                    }}
                  >
                    {addMemberResults.map((user) => (
                      <div
                        key={user.id}
                        role="option"
                        tabIndex={0}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderBottom: '1px solid var(--color-gray-100)',
                          cursor: 'pointer',
                        }}
                        onClick={() => addMember(user)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addMember(user)
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.85rem' }}>
                            {formatName(user)}
                          </strong>
                          <span
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--color-gray-400)',
                              marginLeft: 6,
                            }}
                          >
                            {user.email}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div role="tabpanel" id="tabpanel-tasks" aria-labelledby="tab-tasks">
          <CaseTasksTab
            projectId={id}
            tasks={tasks}
            onTasksChange={loadProjectData}
            profile={profile}
            managers={staffMembers}
          />
        </div>
      )}

      {activeTab === 'activity' && (
        <div
          role="tabpanel"
          id="tabpanel-activity"
          aria-labelledby="tab-activity"
        >
          <div className="portal-card">
            <h2 className="portal-card__title">Activity</h2>
            {activityLog.length === 0 ? (
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-gray-500)',
                  margin: '8px 0',
                }}
              >
                No activity yet.
              </p>
            ) : (
              <div className="case-activity">
                {activityLog.map((entry) => (
                  <div key={entry.id} className="case-activity__item">
                    <div className="case-activity__dot" />
                    <div className="case-activity__content">
                      <span className="case-activity__actor">
                        {entry.actorProfile
                          ? formatName(entry.actorProfile)
                          : 'System'}
                      </span>
                      <span className="case-activity__action">
                        {' '}
                        {entry.action.replace(/_/g, ' ')}
                      </span>
                      {entry.details?.task_title && (
                        <span className="case-activity__detail">
                          {' '}
                          - {entry.details.task_title}
                        </span>
                      )}
                      {entry.details?.changes && (
                        <span
                          className="case-activity__detail"
                          style={{ color: 'var(--color-gray-400)' }}
                        >
                          {' '}
                          ({entry.details.changes})
                        </span>
                      )}
                      <div
                        className="case-activity__time"
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-gray-400)',
                          marginTop: 2,
                        }}
                      >
                        {new Date(entry.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {UnsavedModal}
    </div>
  )
}
