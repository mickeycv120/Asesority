import { redirect } from "next/navigation"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Obtener datos reales de Supabase
  // Obtener estadísticas
  const { count: totalStudents } = await supabase.from("students").select("*", { count: "exact", head: true })

  const { count: totalTeachers } = await supabase.from("teachers").select("*", { count: "exact", head: true })

  const { count: totalAdvisories } = await supabase.from("advisories").select("*", { count: "exact", head: true })

  const { count: completedAdvisories } = await supabase
    .from("advisories")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")

  const { data: recentAdvisoriesData } = await supabase
    .from("advisories")
    .select(`
      id,
      subject,
      scheduled_date,
      duration,
      status,
      student_id,
      teacher_id
    `)
    .order("scheduled_date", { ascending: false })
    .limit(5)

  // Obtener los nombres de estudiantes y maestros por separado
  const studentIds = recentAdvisoriesData?.map((adv) => adv.student_id).filter(Boolean) || []
  const teacherIds = recentAdvisoriesData?.map((adv) => adv.teacher_id).filter(Boolean) || []

  const { data: studentsData } = await supabase.from("students").select("id, full_name").in("id", studentIds)

  const { data: teachersData } = await supabase.from("teachers").select("id, full_name").in("id", teacherIds)

  // Crear mapas para búsqueda rápida
  const studentsMap = new Map(studentsData?.map((s) => [s.id, s.full_name]) || [])
  const teachersMap = new Map(teachersData?.map((t) => [t.id, t.full_name]) || [])

  // Formatear datos para los componentes
  const stats = {
    totalStudents: totalStudents || 0,
    totalTeachers: totalTeachers || 0,
    totalAdvisories: totalAdvisories || 0,
    completedAdvisories: completedAdvisories || 0,
  }

  const recentAdvisories =
    recentAdvisoriesData?.map((advisory) => ({
      id: advisory.id,
      studentName: studentsMap.get(advisory.student_id) || "N/A",
      teacherName: teachersMap.get(advisory.teacher_id) || "N/A",
      subject: advisory.subject,
      date: advisory.scheduled_date,
      time: new Date(advisory.scheduled_date).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: advisory.status as "scheduled" | "confirmed" | "completed" | "cancelled",
    })) || []

  // Crear feed de actividad con los datos recientes
  const activities = [
    ...(recentAdvisories.slice(0, 2).map((adv, idx) => ({
      id: `adv-${idx}`,
      type: adv.status === "completed" ? ("advisory_completed" as const) : ("advisory_scheduled" as const),
      description: `Asesoría de ${adv.subject}${adv.status === "completed" ? " completada" : " programada"}`,
      timestamp: adv.date,
      user: adv.studentName,
    })) || []),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <DashboardOverview stats={stats} recentAdvisories={recentAdvisories} activities={activities} />
      </main>
    </div>
  )
}
