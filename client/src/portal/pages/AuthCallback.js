import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../portal.css';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
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
