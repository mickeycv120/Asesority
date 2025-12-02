"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, GraduationCap, Calendar, BarChart3 } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>Accesos directos a las funciones principales</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <Button asChild className="justify-start h-auto p-4">
            <Link href="/asesorias">
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Nueva Asesoría</div>
                  <div className="text-sm text-muted-foreground">Programar una nueva sesión</div>
                </div>
              </div>
            </Link>
          </Button>

          <Button variant="outline" asChild className="justify-start h-auto p-4 bg-transparent">
            <Link href="/alumnos">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Mi Perfil</div>
                  <div className="text-sm text-muted-foreground">Ver y editar mi perfil</div>
                </div>
              </div>
            </Link>
          </Button>

          <Button variant="outline" asChild className="justify-start h-auto p-4 bg-transparent">
            <Link href="/maestros">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Gestionar Maestros</div>
                  <div className="text-sm text-muted-foreground">Ver profesores</div>
                </div>
              </div>
            </Link>
          </Button>

          <Button variant="outline" asChild className="justify-start h-auto p-4 bg-transparent">
            <Link href="/asesorias">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Ver Calendario</div>
                  <div className="text-sm text-muted-foreground">Revisar horarios y citas</div>
                </div>
              </div>
            </Link>
          </Button>

          {/* <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Generar Reportes</div>
                <div className="text-sm text-muted-foreground">Estadísticas y análisis</div>
              </div>
            </div>
          </Button> */}
        </div>
      </CardContent>
    </Card>
  )
}
