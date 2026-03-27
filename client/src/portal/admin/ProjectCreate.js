import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { formatName } from '../../utils/formatName'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { useToast } from '../../contexts/ToastContext'

export default function ProjectCreate() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const toast = useToast()
  const [staffMembers, setStaffMembers] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    owner: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isDirty = form.title !== '' || form.description !== ''
  const { UnsavedModal, allowNavigation } = useUnsavedChanges(isDirty)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .in('role', ['admin', 'staff'])
      .order('first_name')
      .then(({ data }) => {
        setStaffMembers(data || [])
        if (profile?.id && !form.owner) {
          setForm((f) => ({ ...f, owner: profile.id }))
        }
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { data, error: insertError } = await supabase
      .from('projects')
      .insert({
        title: form.title.trim(),
        description: form.description.trim(),
        owner: form.owner || profile.id,
        created_by: profile.id,
      })
      .select()
      .single()

    if (insertError) {
      setError(
        'Failed to create project. Please check your input and try again.'
      )
      setSaving(false)
      return
    }

    toast.success('Project created')
    allowNavigation()
    navigate(`/admin/projects/${data.id}`)
  }

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">New Project</h1>
      </div>

      {error && <div className="portal-alert portal-alert--error">{error}</div>}

      <div className="portal-card" style={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit}>
          <div className="portal-field">
            <label className="portal-field__label">Project Title *</label>
            <input
              className="portal-field__input"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Office Relocation, Q2 Marketing Plan"
            />
          </div>
          <div className="portal-field">
            <label className="portal-field__label">Description</label>
            <textarea
              className="portal-field__textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the project goals and scope..."
            />
          </div>
          <div className="portal-field">
            <label className="portal-field__label">Owner</label>
            <select
              className="portal-field__select"
              name="owner"
              value={form.owner}
              onChange={handleChange}
            >
              <option value="">Select owner</option>
              {staffMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {formatName(m)} ({m.role})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={saving}
            style={{ marginTop: 8, padding: '10px 24px' }}
          >
            {saving ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
      {UnsavedModal}
    </div>
  )
}
