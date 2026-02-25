import React, { useState, useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';

export function useUnsavedChanges(isDirty) {
  const onSaveRef = useRef(null);
  const bypassRef = useRef(false);
  const [modalSaving, setModalSaving] = useState(false);

  // Reset bypass when form is no longer dirty (e.g., after save resets editing state)
  useEffect(() => {
    if (!isDirty) bypassRef.current = false;
  }, [isDirty]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !bypassRef.current && currentLocation.pathname !== nextLocation.pathname
  );

  // Warn on browser refresh / tab close
  useEffect(() => {
    const handler = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Call before programmatic navigate() on successful save to skip the modal
  const allowNavigation = () => { bypassRef.current = true; };

  // Call this in your component body (after defining your save function) to enable the Save button
  const setSaveHandler = (fn) => { onSaveRef.current = fn; };

  const handleSave = async () => {
    if (!onSaveRef.current) return;
    setModalSaving(true);
    try {
      const ok = await onSaveRef.current();
      if (ok) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    } catch {
      blocker.reset();
    }
    setModalSaving(false);
  };

  const UnsavedModal = blocker.state === 'blocked' ? (
    <div className="portal-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="portal-card" style={{ maxWidth: 440, width: '90%', padding: 24 }}>
        <h3 style={{ margin: '0 0 8px', color: 'var(--color-gray-800)' }}>Unsaved Changes</h3>
        <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
          You have unsaved changes. If you leave now, your changes will be lost.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn--secondary" onClick={() => blocker.reset()} disabled={modalSaving}>Stay on Page</button>
          {onSaveRef.current && (
            <button className="btn btn--primary" onClick={handleSave} disabled={modalSaving}>
              {modalSaving ? 'Saving...' : 'Save'}
            </button>
          )}
          <button
            className="btn"
            style={{ background: 'var(--color-error, #e53e3e)', color: '#fff', border: 'none' }}
            onClick={() => blocker.proceed()}
            disabled={modalSaving}
          >
            Leave Without Saving
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { UnsavedModal, allowNavigation, setSaveHandler };
}
