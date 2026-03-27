import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatName } from '../../utils/formatName'
import { useToast } from '../../contexts/ToastContext'

const sanitize = (term) => term.replace(/[%_(),.\\]/g, '')

export default function TaskCollaborators({
  taskId,
  collaborators = [],
  onUpdate,
  profile,
  task,
}) {
  const toast = useToast()
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const canManage =
    profile?.id === task?.assignee || profile?.id === task?.created_by

  const searchUser = async (term) => {
    setSearchTerm(term)
    if (term.length < 2) {
      setSearchResults([])
      return
    }
    const safe = sanitize(term)
    if (!safe) {
      setSearchResults([])
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

    const excludeIds = new Set([
      ...(collaborators || []).map((c) => c.user_id),
      task?.assignee,
      task?.created_by,
    ])
    setSearchResults((data || []).filter((u) => !excludeIds.has(u.id)))
  }

  const addCollaborator = async (user) => {
    const { error } = await supabase
      .from('task_collaborators')
      .insert({ task_id: taskId, user_id: user.id })
    if (error) {
      toast.error('Failed to add collaborator.')
      return
    }
    toast.success(`${formatName(user)} added as collaborator.`)
    setSearchTerm('')
    setSearchResults([])
    setShowSearch(false)
    onUpdate()
  }

  const removeCollaborator = async (userId) => {
    const { error } = await supabase
      .from('task_collaborators')
      .delete()
      .eq('task_id', taskId)
      .eq('user_id', userId)
    if (error) {
      toast.error('Failed to remove collaborator.')
      return
    }
    onUpdate()
  }

  if (!collaborators.length && !canManage) return null

  return (
    <div className="task-collaborators">
      <span className="task-collaborators__label">Collaborators:</span>
      {collaborators.map((c) => (
        <span key={c.user_id} className="task-collaborators__chip">
          {c.profile ? formatName(c.profile) : c.user_id}
          {canManage && (
            <button
              type="button"
              className="task-collaborators__chip-remove"
              onClick={() => removeCollaborator(c.user_id)}
              title="Remove collaborator"
            >
              x
            </button>
          )}
        </span>
      ))}
      {!collaborators.length && (
        <span
          style={{ fontSize: '0.76rem', color: 'var(--color-gray-400)' }}
        >
          None
        </span>
      )}
      {canManage && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            className="task-collaborators__add-btn"
            onClick={() => {
              setShowSearch(!showSearch)
              setSearchTerm('')
              setSearchResults([])
            }}
          >
            {showSearch ? 'Cancel' : '+ Add'}
          </button>
          {showSearch && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 20,
                marginTop: 4,
                width: 260,
              }}
            >
              <input
                className="portal-field__input"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => searchUser(e.target.value)}
                autoFocus
                style={{ fontSize: '0.82rem' }}
              />
              {searchResults.length > 0 && (
                <div
                  style={{
                    border: '1px solid var(--color-gray-200)',
                    borderRadius: 'var(--radius-md, 6px)',
                    marginTop: 2,
                    background: '#fff',
                    maxHeight: 180,
                    overflowY: 'auto',
                  }}
                >
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 10px',
                        borderBottom: '1px solid var(--color-gray-100)',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                      }}
                      onClick={() => addCollaborator(user)}
                    >
                      <div>
                        <strong>{formatName(user)}</strong>
                        <span
                          style={{
                            fontSize: '0.76rem',
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
      )}
    </div>
  )
}
