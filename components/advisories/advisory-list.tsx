"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Calendar, Clock, User, BookOpen } from "lucide-react"
import { AdvisoryModal } from "./advisory-modal"
import { createBrowserClient } from "@/lib/supabase/clients"

interface Advisory {
  id: string
  student_id: string
  teacher_id: string
  subject: string
  topic: string
  scheduled_date: string
  duration: number
  advisory_type: "individual" | "group"
  status: "scheduled" | "completed" | "cancelled"
  location: string
  notes: string
  created_at: string
  student?: {
    id: string
    student_id: string
    career: string
    users: {
      full_name: string
      email: string
    }
  }
  teacher?: {
    id: string
    employee_id: string
    department: string
    users: {
      full_name: string
      email: string
    }
  }
}

export function AdvisoryList() {
  const [advisories, setAdvisories] = useState<Advisory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create")
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id: string; user_type: string } | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()
        setCurrentUser(userData)
        setUserRole(userData?.user_type)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    const loadAdvisories = async () => {
      if (!currentUser) return

      setIsLoading(true)
      const supabase = createBrowserClient()

      const query = supabase
        .from("advisories")
        .select(
          `
          *,
          student:students!advisories_student_id_fkey (
            id,
            student_id,
            career,
            users!students_user_id_fkey (
              full_name,
              email
            )
          ),
          teacher:teachers!advisories_teacher_id_fkey (
            id,
            employee_id,
            department,
            users!teachers_user_id_fkey (
              full_name,
              email
            )
          )
        `,
        )
        .order("scheduled_date", { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error("[v0] Error cargando asesorías:", error)
      } else {
        setAdvisories(data || [])
      }
      setIsLoading(false)
    }

    loadAdvisories()
  }, [currentUser])

  const filteredAdvisories = advisories.filter((advisory) => {
    const studentName = advisory.student?.users?.full_name || ""
    const teacherName = advisory.teacher?.users?.full_name || ""

    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisory.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisory.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (advisory.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || advisory.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateAdvisory = () => {
    setSelectedAdvisory(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleEditAdvisory = (advisory: Advisory) => {
    setSelectedAdvisory(advisory)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleViewAdvisory = (advisory: Advisory) => {
    setSelectedAdvisory(advisory)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleDeleteAdvisory = async (advisoryId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta asesoría?")) {
      const supabase = createBrowserClient()
      const { error } = await supabase.from("advisories").delete().eq("id", advisoryId)

      if (error) {
        console.error("[v0] Error eliminando asesoría:", error)
        alert("Error al eliminar la asesoría")
      } else {
        setAdvisories(advisories.filter((a) => a.id !== advisoryId))
      }
    }
  }

  const handleSaveAdvisory = async (advisoryData: Omit<Advisory, "id" | "created_at">) => {
    const supabase = createBrowserClient()

    if (modalMode === "create") {
      const { data, error } = await supabase
        .from("advisories")
        .insert(advisoryData)
        .select(
          `
          *,
          student:students!advisories_student_id_fkey (
            id,
            student_id,
            career,
            users!students_user_id_fkey (
              full_name,
              email
            )
          ),
          teacher:teachers!advisories_teacher_id_fkey (
            id,
            employee_id,
            department,
            users!teachers_user_id_fkey (
              full_name,
              email
            )
          )
        `,
        )
        .single()

      if (error) {
        console.error("[v0] Error creando asesoría:", error)
        alert("Error al crear la asesoría")
        return
      }

      setAdvisories([data, ...advisories])
    } else if (modalMode === "edit" && selectedAdvisory) {
      const { data, error } = await supabase
        .from("advisories")
        .update(advisoryData)
        .eq("id", selectedAdvisory.id)
        .select(
          `
          *,
          student:students!advisories_student_id_fkey (
            id,
            student_id,
            career,
            users!students_user_id_fkey (
              full_name,
              email
            )
          ),
          teacher:teachers!advisories_teacher_id_fkey (
            id,
            employee_id,
            department,
            users!teachers_user_id_fkey (
              full_name,
              email
            )
          )
        `,
        )
        .single()

      if (error) {
        console.error("[v0] Error actualizando asesoría:", error)
        alert("Error al actualizar la asesoría")
        return
      }

      setAdvisories(advisories.map((a) => (a.id === selectedAdvisory.id ? data : a)))
    }
    setIsModalOpen(false)
  }

  const getStatusBadge = (status: Advisory["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Programada</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completada</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: Advisory["advisory_type"]) => {
    return type === "individual" ? (
      <Badge variant="outline" className="flex items-center gap-1">
        <User className="h-3 w-3" />
        Individual
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center gap-1">
        <BookOpen className="h-3 w-3" />
        Grupal
      </Badge>
    )
  }

  const canEdit = (advisory: Advisory) => {
    if (userRole === "admin") return true
    if (userRole === "teacher") {
      // Los maestros pueden editar sus propias asesorías
      return advisory.teacher?.id === currentUser?.id
    }
    if (userRole === "student") {
      // Los estudiantes pueden editar sus propias asesorías
      return advisory.student?.id === currentUser?.id
    }
    return false
  }

  const canDelete = (advisory: Advisory) => {
    if (userRole === "admin") return true
    if (userRole === "student") {
      return advisory.student?.id === currentUser?.id
    }
    return false
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Cargando asesorías...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{userRole === "student" ? "Mis Asesorías" : "Gestión de Asesorías"}</CardTitle>
              <CardDescription>
                {userRole === "student"
                  ? "Administra tus sesiones de asesoría académica"
                  : "Administra las sesiones de asesoría académica"}
              </CardDescription>
            </div>
            {(userRole === "student" || userRole === "admin") && (
              <Button onClick={handleCreateAdvisory}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Asesoría
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por estudiante, profesor, materia o tema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Todos los estados</option>
              <option value="scheduled">Programada</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Profesor</TableHead>
                  <TableHead>Materia/Tema</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdvisories.map((advisory) => (
                  <TableRow key={advisory.id}>
                    <TableCell className="font-medium">{advisory.student?.users?.full_name || "N/A"}</TableCell>
                    <TableCell>{advisory.teacher?.users?.full_name || "N/A"}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{advisory.subject}</div>
                        <div className="text-sm text-muted-foreground">{advisory.topic}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{new Date(advisory.scheduled_date).toLocaleDateString("es-ES")}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(advisory.scheduled_date).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            ({advisory.duration}min)
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(advisory.advisory_type)}</TableCell>
                    <TableCell>{getStatusBadge(advisory.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewAdvisory(advisory)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          {canEdit(advisory) && (
                            <DropdownMenuItem onClick={() => handleEditAdvisory(advisory)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          )}
                          {canDelete(advisory) && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteAdvisory(advisory.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAdvisories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {userRole === "student"
                ? "No tienes asesorías registradas."
                : "No se encontraron asesorías que coincidan con los filtros aplicados."}
            </div>
          )}
        </CardContent>
      </Card>

      <AdvisoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAdvisory}
        advisory={selectedAdvisory}
        mode={modalMode}
        userRole={userRole}
        currentUser={currentUser}
      />
    </div>
  )
}
