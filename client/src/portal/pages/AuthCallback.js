import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../portal.css';

export default function AuthCallback() {
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    const handleAuth = async () => {
      if (handled.current) return;

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      // Exchange PKCE code for session (must await before checking session)
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          handled.current = true;
          navigate('/portal/login', { replace: true });
          return;
        }
      }

      // Get the current session (either from code exchange or existing)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        handled.current = true;
        navigate('/portal/login', { replace: true });
        return;
      }

      handled.current = true;
      const { data } = await supabase.from('profiles')
        .select('onboarded_at, role')
        .eq('id', session.user.id)
        .single();

      if (data?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (!data?.onboarded_at) {
        navigate('/portal/accept-invite', { replace: true });
      } else {
        navigate('/portal/dashboard', { replace: true });
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="portal-loading">
      <div className="portal-loading__spinner"></div>
      <p>Verifying your identity...</p>
    </div>
  );
}
