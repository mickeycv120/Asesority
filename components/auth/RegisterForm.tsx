'use client'

import { useState } from 'react'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '../ui/button'

interface RegisterFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function RegisterForm({ onSuccess, onCancel }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signUp, error } = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      return
    }
    
    setIsLoading(true)
    
    const { error: signUpError } = await signUp(email, password)
    
    setIsLoading(false)
    
    if (!signUpError && onSuccess) {
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
          minLength={6}
          className="w-full px-3 py-2 border rounded-md text-black"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          Confirmar Contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-md text-black"
          placeholder="••••••••"
        />
        {password !== confirmPassword && confirmPassword && (
          <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error.message}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading || password !== confirmPassword} className="flex-1">
          {isLoading ? 'Registrando...' : 'Registrarse'}
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

