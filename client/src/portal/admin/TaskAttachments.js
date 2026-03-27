import React, { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { formatName } from '../../utils/formatName'
import { useToast } from '../../contexts/ToastContext'

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]
const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 10

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

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(mimeType) {
  if (mimeType === 'image/jpeg' || mimeType === 'image/png') {
    return (
      <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
        <path
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return (
      <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
        <path
          d="M3 10h18M3 14h18M9 4v16m6-16v16M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <path
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function TaskAttachments({ taskId, caseId, projectId, profile }) {
  const toast = useToast()
  const [attachments, setAttachments] = useState([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const isAdmin = profile?.role === 'admin' || profile?.role === 'staff'

  const loadAttachments = useCallback(async () => {
    const { data } = await supabase
      .from('task_attachments')
      .select(
        '*, uploaderProfile:uploaded_by(id, first_name, last_name, email, role)'
      )
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })
    if (data) setAttachments(data)
  }, [taskId])

  useEffect(() => {
    loadAttachments()
  }, [loadAttachments])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('File type not allowed. Use PDF, JPG, PNG, DOCX, or XLSX.')
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    if (file.size > MAX_SIZE) {
      toast.error('File too large. Maximum size is 10MB.')
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    if (attachments.length >= MAX_FILES) {
      toast.error('Maximum 10 files per task.')
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    setUploading(true)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100)
    const parentId = caseId || projectId
    const filePath = `${parentId}/${taskId}/${Date.now()}_${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('task-attachments')
      .upload(filePath, file, { contentType: file.type })

    if (uploadError) {
      toast.error('Failed to upload file. Please try again.')
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    const { error: insertError } = await supabase
      .from('task_attachments')
      .insert({
        task_id: taskId,
        uploaded_by: profile.id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
      })

    if (insertError) {
      // Clean up orphaned file
      await supabase.storage.from('task-attachments').remove([filePath])
      toast.error('Failed to save file record. Please try again.')
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    await loadAttachments()
    setUploading(false)
    toast.success('File uploaded')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDownload = async (att) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      toast.error('Session expired. Please log in again.')
      return
    }

    const win = window.open('', '_blank')
    try {
      const res = await fetch(
        `/api/task-attachments/download?path=${encodeURIComponent(att.file_path)}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      )
      const json = await res.json()
      if (json.signedUrl) {
        win.location.href = json.signedUrl
      } else {
        win.close()
        toast.error('Failed to download file.')
      }
    } catch {
      win.close()
      toast.error('Failed to download file.')
    }
  }

  const handleDelete = async (att) => {
    if (!window.confirm(`Delete "${att.file_name}"?`)) return

    await supabase.storage.from('task-attachments').remove([att.file_path])
    const { error } = await supabase
      .from('task_attachments')
      .delete()
      .eq('id', att.id)
    if (error) {
      toast.error('Failed to delete file.')
    } else {
      loadAttachments()
    }
  }

  const canDelete = (att) => att.uploaded_by === profile.id || isAdmin

  return (
    <div className="task-attachments">
      <div className="task-attachments__label">
        Files ({attachments.length})
      </div>

      {isAdmin && attachments.length < MAX_FILES && (
        <div className="task-attachments__upload">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
            onChange={handleUpload}
            disabled={uploading}
            className="portal-field__input"
            style={{ fontSize: '0.82rem' }}
          />
          {uploading && (
            <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}>
              Uploading...
            </span>
          )}
          <span className="task-attachments__hint">
            PDF, JPG, PNG, DOCX, XLSX. Max 10MB.
          </span>
        </div>
      )}

      {attachments.length === 0 && (
        <p className="task-attachments__empty">No files attached.</p>
      )}

      {attachments.map((att) => (
        <div key={att.id} className="task-attachments__item">
          <div className="task-attachments__icon">
            {getFileIcon(att.mime_type)}
          </div>
          <div className="task-attachments__info">
            <div className="task-attachments__name">{att.file_name}</div>
            <div className="task-attachments__meta">
              {formatSize(att.file_size)} &middot;{' '}
              {formatName(att.uploaderProfile)} &middot;{' '}
              {timeAgo(att.created_at)}
            </div>
          </div>
          <div className="task-attachments__actions">
            <button
              className="task-attachments__btn"
              onClick={() => handleDownload(att)}
              title="Download"
            >
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {canDelete(att) && (
              <button
                className="task-attachments__btn task-attachments__btn--delete"
                onClick={() => handleDelete(att)}
                title="Delete"
              >
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
