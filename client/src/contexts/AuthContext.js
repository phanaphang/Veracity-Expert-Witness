import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { supabase } from '../lib/supabase'

export const AuthContext = createContext(null)

const IDLE_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const WARN_BEFORE_MS = 2 * 60 * 1000 // warn 2 minutes before sign-out
const ACTIVITY_EVENTS = [
  'mousemove',
  'keydown',
  'click',
  'touchstart',
  'scroll',
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [idleWarning, setIdleWarning] = useState(false)

  const warnTimer = useRef(null)
  const signOutTimer = useRef(null)

  const clearIdleTimers = useCallback(() => {
    clearTimeout(warnTimer.current)
    clearTimeout(signOutTimer.current)
    setIdleWarning(false)
  }, [])

  const startIdleTimers = useCallback((doSignOut) => {
    clearTimeout(warnTimer.current)
    clearTimeout(signOutTimer.current)
    setIdleWarning(false)

    warnTimer.current = setTimeout(() => {
      setIdleWarning(true)
    }, IDLE_TIMEOUT_MS - WARN_BEFORE_MS)

    signOutTimer.current = setTimeout(() => {
      doSignOut()
    }, IDLE_TIMEOUT_MS)
  }, [])

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
    } catch (e) {
      setProfile(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const handleSession = (s) => {
      setUser(s?.user ?? null)
      setSession(s ?? null)
      if (s?.user) {
        fetchProfile(s.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    }

    // Listen for all auth changes including initial session restoration
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      handleSession(s)
    })

    // Fallback: if onAuthStateChange never fires, stop loading after 3 seconds
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = useCallback(async () => {
    clearIdleTimers()
    setUser(null)
    setSession(null)
    setProfile(null)
    setLoading(false)
    await supabase.auth.signOut()
  }, [clearIdleTimers])

  // Idle session timeout — only active when a user is signed in
  useEffect(() => {
    if (!user) {
      clearIdleTimers()
      return
    }

    const reset = () => startIdleTimers(signOut)

    startIdleTimers(signOut)
    ACTIVITY_EVENTS.forEach((e) =>
      window.addEventListener(e, reset, { passive: true })
    )

    return () => {
      clearIdleTimers()
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, reset))
    }
  }, [user, signOut, startIdleTimers, clearIdleTimers])

  const resetIdleTimer = useCallback(() => {
    if (user) startIdleTimers(signOut)
  }, [user, signOut, startIdleTimers])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        idleWarning,
        signIn,
        signOut,
        fetchProfile,
        resetIdleTimer,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
