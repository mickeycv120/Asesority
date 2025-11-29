"use client"

import { StatsCards } from "./stats-cards"
import { RecentAdvisories } from "./recent-advisories"
import { QuickActions } from "./quick-actions"
import { ActivityFeed } from "./activity-feed"

// Mock data
const mockStats = {
  totalStudents: 4,
  totalTeachers: 4,
  totalAdvisories: 4,
  completedAdvisories: 1,
}

const mockRecentAdvisories = [
  {
    id: "1",
    studentName: "Ana García",
    teacherName: "Dr. Elena García",
    subject: "Matemáticas - Cálculo Diferencial",
    date: "2024-12-15",
    time: "14:00",
    status: "confirmed" as const,
  },
  {
    id: "2",
    studentName: "Carlos Rodríguez",
    teacherName: "Dr. Carlos Rodríguez",
    subject: "Anatomía - Sistema Cardiovascular",
    date: "2024-12-16",
    time: "10:00",
    status: "scheduled" as const,
  },
  {
    id: "3",
    studentName: "María López",
    teacherName: "Dra. María López",
    subject: "Derecho Civil - Contratos",
    date: "2024-12-14",
    time: "16:00",
    status: "completed" as const,
  },
]

const mockActivities = [
  {
    id: "1",
    type: "advisory_scheduled" as const,
    description: "Nueva asesoría programada para Matemáticas",
    timestamp: "2024-12-10T14:30:00Z",
    user: "Ana García",
  },
  {
    id: "2",
    type: "student_registered" as const,
    description: "Nuevo estudiante registrado en el sistema",
    timestamp: "2024-12-10T10:15:00Z",
    user: "Carlos Rodríguez",
  },
  {
    id: "3",
    type: "advisory_completed" as const,
    description: "Asesoría de Derecho Civil completada exitosamente",
    timestamp: "2024-12-09T16:45:00Z",
    user: "María López",
  },
  {
    id: "4",
    type: "teacher_added" as const,
    description: "Nuevo profesor agregado al departamento de Finanzas",
    timestamp: "2024-12-09T09:20:00Z",
    user: "Dr. José Martínez",
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del sistema de asesorías</p>
      </div>

      <StatsCards stats={mockStats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentAdvisories advisories={mockRecentAdvisories} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ActivityFeed activities={mockActivities} />
        <div className="space-y-6">
          {/* Espacio para futuros componentes como gráficos */}
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
            Espacio reservado para gráficos y estadísticas adicionales
          </div>
        </div>
      </div>
    </div>
  )
}
