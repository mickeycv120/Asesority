'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSupabase } from './useSupabase'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  role: 'student' | 'advisor' | 'admin'
  phone: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

interface UseProfileReturn {
  profile: Profile | null
  loading: boolean
  error: Error | null
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

export function useProfile(): UseProfileReturn {
  const { user } = useSupabase()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (fetchError) throw fetchError

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar el perfil'))
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('Usuario no autenticado') }
    }

    try {
      setError(null)

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) throw updateError

      setProfile(data)
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al actualizar el perfil')
      setError(error)
      return { error }
    }
  }

  const refreshProfile = async () => {
    await fetchProfile()
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
  }
}

