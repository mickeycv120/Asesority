"use client"

import { StatsCards } from "./stats-cards"
import { RecentAdvisories } from "./recent-advisories"
import { QuickActions } from "./quick-actions"
import { ActivityFeed } from "./activity-feed"

interface DashboardOverviewProps {
  stats: {
    totalStudents: number
    totalTeachers: number
    totalAdvisories: number
    completedAdvisories: number
  }
  recentAdvisories: Array<{
    id: string
    studentName: string
    teacherName: string
    subject: string
    date: string
    time: string
    status: "scheduled" | "confirmed" | "completed" | "cancelled"
  }>
  activities: Array<{
    id: string
    type: "student_registered" | "advisory_scheduled" | "advisory_completed" | "teacher_added"
    description: string
    timestamp: string
    user: string
  }>
}

export function DashboardOverview({ stats, recentAdvisories, activities }: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del sistema de asesorías</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentAdvisories advisories={recentAdvisories} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ActivityFeed activities={activities} />
        {/* <div className="space-y-6">
          Espacio para futuros componentes como gráficos 
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
            Espacio reservado para gráficos y estadísticas adicionales
          </div>
        </div> */}
      </div>
    </div>
  )
}
