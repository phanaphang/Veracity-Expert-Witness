import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../portal.css';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Detect invite or recovery links — prompt user to set a password
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', ''));
    const type = params.get('type');

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (type === 'invite' || type === 'magiclink') {
          navigate('/portal/accept-invite', { replace: true });
          return;
        }
        supabase.from('profiles')
          .select('onboarded_at, role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.role === 'admin') {
              navigate('/admin/dashboard', { replace: true });
            } else if (!data?.onboarded_at) {
              navigate('/portal/profile', { replace: true });
            } else {
              navigate('/portal/dashboard', { replace: true });
            }
          });
      } else {
        navigate('/portal/login', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="portal-loading">
      <div className="portal-loading__spinner"></div>
      <p>Verifying your identity...</p>
    </div>
  );
}
