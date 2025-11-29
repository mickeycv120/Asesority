"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Users, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/clients"

export function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setIsAuthenticated(true)
      }
    }

    checkAuth()
  }, [])

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Hero Content */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                Conecta con tus <span className="text-primary">profesores</span> de manera eficiente
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Programa y gestiona asesorías académicas con facilidad. Una plataforma diseñada para estudiantes y
                profesores universitarios.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <>
                  <Button size="lg" asChild className="text-lg px-8">
                    <Link href="/dashboard">Ir al Dashboard</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="text-lg px-8 bg-transparent">
                    <Link href="/asesorias">Gestionar asesorías</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" asChild className="text-lg px-8">
                    <Link href="/register">Comenzar ahora</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="text-lg px-8 bg-transparent">
                    <Link href="/asesorias">Ver asesorías</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Estudiantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Profesores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Asesorías</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Panel de Asesorías</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">En línea</span>
                  </div>
                </div>

                {/* Mock Dashboard Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Matemáticas Avanzadas</div>
                        <div className="text-sm text-muted-foreground">Prof. García - 14:00</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-600">Confirmada</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-secondary" />
                      <div>
                        <div className="font-medium">Física Cuántica</div>
                        <div className="text-sm text-muted-foreground">Prof. Rodríguez - 16:00</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-yellow-600">Pendiente</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-accent" />
                      <div>
                        <div className="font-medium">Química Orgánica</div>
                        <div className="text-sm text-muted-foreground">Prof. López - 10:00</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-blue-600">Grupal</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progreso del semestre</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Por qué elegir UniAsesorías?</h2>
          <p className="text-xl text-muted-foreground">
            Simplificamos la gestión académica para toda la comunidad universitaria
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Programación Fácil</h3>
            <p className="text-sm text-muted-foreground">
              Agenda asesorías en segundos con nuestro calendario intuitivo
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Gestión Completa</h3>
            <p className="text-sm text-muted-foreground">
              Administra estudiantes, profesores y asesorías desde un solo lugar
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <BookOpen className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Seguimiento Académico</h3>
            <p className="text-sm text-muted-foreground">Rastrea el progreso y rendimiento de cada estudiante</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Reportes Detallados</h3>
            <p className="text-sm text-muted-foreground">
              Genera informes y estadísticas para mejorar el proceso educativo
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
