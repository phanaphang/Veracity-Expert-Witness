import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../portal.css';

export default function AuthCallback() {
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    // Handle PKCE flow (code in query params)
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).catch(() => {});
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (handled.current) return;
        if (!session) {
          // Only redirect to login if not still processing
          if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
            handled.current = true;
            navigate('/portal/login', { replace: true });
          }
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
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="portal-loading">
      <div className="portal-loading__spinner"></div>
      <p>Verifying your identity...</p>
    </div>
  );
}
