'use client'

import { useState } from 'react'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '../ui/button'

interface LoginFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function LoginForm({ onSuccess, onCancel }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, error } = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const { error: signInError } = await signIn(email, password)
    
    setIsLoading(false)
    
    if (!signInError && onSuccess) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md text-black"
          placeholder="tu@email.com"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md text-black"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error.message}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}

