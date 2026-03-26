import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { formatName } from '../../utils/formatName'
import { useToast } from '../../contexts/ToastContext'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function TaskComments({ taskId, profile, onRead }) {
  const toast = useToast()
  const [comments, setComments] = useState([])
  const [body, setBody] = useState('')
  const [posting, setPosting] = useState(false)

  const markRead = useCallback(
    async (loaded) => {
      // Use the latest comment's server-generated created_at to avoid clock skew
      const latest = loaded?.length
        ? loaded[loaded.length - 1].created_at
        : new Date().toISOString()
      await supabase.from('task_comment_reads').upsert(
        {
          user_id: profile.id,
          task_id: taskId,
          last_read_at: latest,
        },
        { onConflict: 'user_id,task_id' }
      )
      if (onRead) onRead(taskId)
    },
    [taskId, profile.id, onRead]
  )

  const loadComments = useCallback(async () => {
    const { data } = await supabase
      .from('task_comments')
      .select('*, authorProfile:author(id, first_name, last_name, email, role)')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })
    if (data) setComments(data)
    return data || []
  }, [taskId])

  useEffect(() => {
    loadComments().then((data) => markRead(data))
  }, [loadComments, markRead])

  const handlePost = async () => {
    if (!body.trim()) return
    setPosting(true)
    const { error } = await supabase.from('task_comments').insert({
      task_id: taskId,
      author: profile.id,
      body: body.trim(),
    })
    if (error) {
      toast.error('Failed to post comment.')
    } else {
      setBody('')
      loadComments().then((data) => markRead(data))
    }
    setPosting(false)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('task_comments').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete comment.')
    } else {
      loadComments()
    }
  }

  return (
    <div className="task-comments">
      <div className="task-comments__label">Comments ({comments.length})</div>
      {comments.length === 0 && (
        <p className="task-comments__empty">No comments yet.</p>
      )}
      {comments.map((c) => (
        <div key={c.id} className="task-comments__item">
          <div className="task-comments__header">
            <span className="task-comments__author">
              {formatName(c.authorProfile)}
            </span>
            <span className="task-comments__time">{timeAgo(c.created_at)}</span>
            {c.author === profile.id && (
              <button
                className="task-comments__delete"
                onClick={() => handleDelete(c.id)}
                title="Delete comment"
              >
                Delete
              </button>
            )}
          </div>
          <div className="task-comments__body">{c.body}</div>
        </div>
      ))}
      <div className="task-comments__form">
        <textarea
          className="portal-field__textarea"
          placeholder="Add a comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          maxLength={2000}
        />
        <button
          className="btn btn--primary"
          style={{
            alignSelf: 'flex-end',
            fontSize: '0.82rem',
            padding: '6px 16px',
          }}
          onClick={handlePost}
          disabled={posting || !body.trim()}
        >
          {posting ? 'Posting...' : 'Comment'}
        </button>
      </div>
    </div>
  )
}
