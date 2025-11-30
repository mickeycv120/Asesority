"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/clients"

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student",
    studentId: "",
    career: "",
    semester: "1",
    employeeId: "",
    department: "",
    specialties: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    console.log("[v0] Iniciando proceso de registro")
    console.log("[v0] Tipo de usuario:", formData.userType)

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (formData.userType === "student") {
      if (!formData.studentId || !formData.career || !formData.semester) {
        setError("Por favor completa todos los campos de estudiante")
        setIsLoading(false)
        return
      }
    } else if (formData.userType === "teacher") {
      if (!formData.employeeId || !formData.department || !formData.specialties) {
        setError("Por favor completa todos los campos de profesor")
        setIsLoading(false)
        return
      }
    }

    try {
      console.log("[v0] Creando cliente Supabase")
      const supabase = createClient()

      console.log("[v0] Llamando a signUp con metadata completo")
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.fullName,
            user_type: formData.userType,
          },
        },
      })

      console.log("[v0] Respuesta de signUp:", { authData, signUpError })

      if (signUpError) throw signUpError
      if (!authData.user) throw new Error("No se pudo crear el usuario")

      console.log("[v0] Usuario creado exitosamente con ID:", authData.user.id)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (formData.userType === "student") {
        console.log("[v0] Insertando datos de estudiante")
        const { error: studentError } = await supabase.from("students").insert({
          id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          enrollment_number: formData.studentId,
          career: formData.career,
          semester: Number.parseInt(formData.semester),
        })
        console.log("[v0] Resultado de inserción students:", studentError)
        if (studentError) {
          console.error("[v0] Error detallado de students:", studentError)
          throw new Error(`Error al guardar datos de estudiante: ${studentError.message}`)
        }
      } else if (formData.userType === "teacher") {
        console.log("[v0] Insertando datos de profesor")
        const { error: teacherError } = await supabase.from("teachers").insert({
          id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          employee_number: formData.employeeId,
          department: formData.department,
          specialties: formData.specialties.split(",").map((s) => s.trim()),
        })
        console.log("[v0] Resultado de inserción teachers:", teacherError)
        if (teacherError) {
          console.error("[v0] Error detallado de teachers:", teacherError)
          throw new Error(`Error al guardar datos de profesor: ${teacherError.message}`)
        }
      }

      console.log("[v0] Registro completado exitosamente")
      setSuccess("Cuenta creada exitosamente. Redirigiendo al login...")
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
    } catch (err) {
      console.error("[v0] Error durante el registro:", err)
      setError(err instanceof Error ? err.message : "Error al crear la cuenta")
    } finally {
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
          <CardDescription>Únete a la comunidad de UniAsesorías</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="userType">Tipo de Usuario</Label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="student">Estudiante</option>
                <option value="teacher">Profesor</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Juan Pérez"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@universidad.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {formData.userType === "student" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Matrícula</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    type="text"
                    placeholder="A00123456"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="career">Carrera</Label>
                  <Input
                    id="career"
                    name="career"
                    type="text"
                    placeholder="Ingeniería en Sistemas"
                    value={formData.career}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semestre</Label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}° Semestre
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {formData.userType === "teacher" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Número de Empleado</Label>
                  <Input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    placeholder="EMP001"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    name="department"
                    type="text"
                    placeholder="Ciencias de la Computación"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialties">Especialidades (separadas por comas)</Label>
                  <Input
                    id="specialties"
                    name="specialties"
                    type="text"
                    placeholder="Algoritmos, Estructuras de datos, Programación"
                    value={formData.specialties}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>

            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Inicia sesión aquí
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
