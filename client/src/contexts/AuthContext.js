import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(data);
    } catch (e) {
      setProfile(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Primary: get session on mount
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (initialized.current) return;
      initialized.current = true;
      setUser(s?.user ?? null);
      setSession(s ?? null);
      if (s?.user) {
        fetchProfile(s.user.id);
      } else {
        setLoading(false);
      }
    }).catch(() => {
      if (!initialized.current) {
        initialized.current = true;
        setLoading(false);
      }
    });

    // Fallback: if getSession hangs, stop loading after 3 seconds
    const timeout = setTimeout(() => {
      if (!initialized.current) {
        initialized.current = true;
        setLoading(false);
      }
    }, 3000);

    // Listen for future auth changes (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (event === 'INITIAL_SESSION') {
          if (!initialized.current) {
            initialized.current = true;
            setUser(s?.user ?? null);
            setSession(s ?? null);
            if (s?.user) {
              await fetchProfile(s.user.id);
            } else {
              setLoading(false);
            }
          }
          return;
        }
        setUser(s?.user ?? null);
        setSession(s ?? null);
        if (s?.user) {
          await fetchProfile(s.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signOut, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
