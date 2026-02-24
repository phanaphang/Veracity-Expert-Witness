import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const DOC_TYPES = [
  { value: 'cv', label: 'CV / Resume' },
  { value: 'license', label: 'License' },
  { value: 'certification', label: 'Certification' },
  { value: 'sample_report', label: 'Sample Report' },
  { value: 'other', label: 'Other' },
];

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function Documents() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('cv');
  const [error, setError] = useState('');
  const fileRef = useRef();

  const loadDocuments = async () => {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('expert_id', user.id)
      .order('uploaded_at', { ascending: false });
    setDocuments(data || []);
  };

  useEffect(() => {
    if (user) loadDocuments();
  }, [user]); // eslint-disable-line

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('File type not allowed. Please upload PDF, JPG, or PNG files.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
    const filePath = `${user.id}/${selectedType}/${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('expert-documents')
      .upload(filePath, file);

    if (uploadError) {
      setError('Failed to upload file. Please try again.');
      setUploading(false);
      return;
    }

    await supabase.from('documents').insert({
      expert_id: user.id,
      document_type: selectedType,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
    });

    await loadDocuments();
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDownload = async (doc) => {
    const { data } = await supabase.storage
      .from('expert-documents')
      .createSignedUrl(doc.file_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const handleDelete = async (doc) => {
    await supabase.storage.from('expert-documents').remove([doc.file_path]);
    await supabase.from('documents').delete().eq('id', doc.id);
    await loadDocuments();
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Documents</h1>
      </div>

      {error && <div className="portal-alert portal-alert--error">{error}</div>}

      {/* Upload */}
      <div className="portal-card">
        <h2 className="portal-card__title">Upload Document</h2>
        <div className="portal-list-item__row" style={{ marginBottom: 16 }}>
          <div className="portal-field">
            <label className="portal-field__label">Document Type</label>
            <select className="portal-field__select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="portal-field">
            <label className="portal-field__label">File</label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleUpload}
              disabled={uploading}
              className="portal-field__input"
            />
          </div>
        </div>
        {uploading && <p style={{ fontSize: '0.85rem', color: 'var(--color-accent)' }}>Uploading...</p>}
        <p className="portal-upload__hint">PDF, JPG, or PNG. Max 10MB.</p>
      </div>

      {/* Document List */}
      {DOC_TYPES.map(type => {
        const typeDocs = documents.filter(d => d.document_type === type.value);
        if (typeDocs.length === 0) return null;
        return (
          <div key={type.value} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: 12 }}>{type.label}</h3>
            <div className="portal-doc-grid">
              {typeDocs.map(doc => (
                <div key={doc.id} className="portal-doc-card">
                  <div className="portal-doc-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="portal-doc-card__info">
                    <div className="portal-doc-card__name">{doc.file_name}</div>
                    <div className="portal-doc-card__meta">{formatSize(doc.file_size)} &middot; {new Date(doc.uploaded_at).toLocaleDateString()}</div>
                  </div>
                  <div className="portal-doc-card__actions">
                    <button className="portal-doc-card__btn" onClick={() => handleDownload(doc)} title="Download">
                      <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button className="portal-doc-card__btn" onClick={() => handleDelete(doc)} title="Delete">
                      <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {documents.length === 0 && (
        <div className="portal-empty">
          <p className="portal-empty__text">No documents uploaded yet</p>
        </div>
      )}
    </div>
  );
}
