'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'

interface UseSupabaseReturn {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  signInWithOAuth: (provider: 'google' | 'github' | 'discord') => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

export function useSupabase(): UseSupabaseReturn {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setError(error)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    })

    // Suscribirse a cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setError(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, unknown>
  ) => {
    setError(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    if (error) setError(error)
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) setError(error)
    return { error }
  }

  const signOut = async () => {
    setError(null)
    const { error } = await supabase.auth.signOut()
    if (error) setError(error)
    return { error }
  }

  const signInWithOAuth = async (provider: 'google' | 'github' | 'discord') => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error)
    return { error }
  }

  const resetPassword = async (email: string) => {
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) setError(error)
    return { error }
  }

  return {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
    resetPassword,
  }
}
