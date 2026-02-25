import { useEffect } from 'react';

export function useUnsavedChanges(isDirty) {
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

  const allowNavigation = () => {};
  const UnsavedModal = null;

  return { UnsavedModal, allowNavigation };
}
