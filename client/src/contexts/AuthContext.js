import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const handleSession = (s) => {
      setUser(s?.user ?? null);
      setSession(s ?? null);
      if (s?.user) {
        setLoading(true);
        fetchProfile(s.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    };

    // Listen for all auth changes including initial session restoration
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, s) => {
        handleSession(s);
      }
    );

    // Fallback: if onAuthStateChange never fires, stop loading after 3 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoading(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signOut, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
