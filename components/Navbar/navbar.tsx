'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { useSupabase } from '@/hooks/useSupabase'
import { LoginForm } from '../auth/LoginForm'
import { RegisterForm } from '../auth/RegisterForm'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const Navbar = () => {
  const { user, loading, signOut } = useSupabase()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const handleLoginSuccess = () => {
    setShowLogin(false)
  }

  const handleRegisterSuccess = () => {
    setShowRegister(false)
  }

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <>
      <nav className='p-3 bg-[#02669C] text-white'>
        <div className='flex justify-between items-center'>
          <span className='text-xl font-bold'>LOGO</span>
          <div className='flex gap-6'>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>      
          </div>
      
          <div className='flex gap-2 items-center'>
            {loading ? (
              <span>Cargando...</span>
            ) : user ? (
              <>
                <span className='text-sm'>{user.email}</span>
                <Button onClick={handleLogout} variant="outline">Cerrar sesión</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setShowLogin(true)}>Login</Button>
                <Button onClick={() => setShowRegister(true)}>Register</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Modal de Login */}
      {showLogin && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <Card className='w-full max-w-md bg-white text-black'>
            <CardHeader>
              <CardTitle>Iniciar Sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm 
                onSuccess={handleLoginSuccess}
                onCancel={() => setShowLogin(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Register */}
      {showRegister && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <Card className='w-full max-w-md bg-white text-black'>
            <CardHeader>
              <CardTitle>Registrarse</CardTitle>
            </CardHeader>
            <CardContent>
              <RegisterForm 
                onSuccess={handleRegisterSuccess}
                onCancel={() => setShowRegister(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default Navbar
