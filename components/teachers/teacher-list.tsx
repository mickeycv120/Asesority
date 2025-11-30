"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Loader2 } from "lucide-react"
import { TeacherModal } from "@/components/teachers/teacher-modal"
import { createClient } from "@/lib/supabase/clients"

interface Teacher {
  id: string
  department: string
  specialties: string[]
  available_hours: string | null
  phone: string | null
  office: string | null
  created_at: string
  updated_at: string
  // Datos del usuario (desde JOIN con users)
  full_name?: string
  email?: string
  user_type?: string
}

export function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      
      // Obtener maestros
      const { data: teachersData, error: teachersError } = await supabase
        .from("teachers")
        .select("*")
        .order("created_at", { ascending: false })

      if (teachersError) throw teachersError
      
      if (!teachersData || teachersData.length === 0) {
        setTeachers([])
        return
      }
      
      // Obtener datos de usuarios (teachers.id = users.id)
      const userIds = teachersData.map(t => t.id)
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, full_name, email, user_type")
        .in("id", userIds)

      if (usersError) {
        console.warn("Error al obtener datos de usuarios:", usersError)
        // Continuar sin datos de usuario
        setTeachers(teachersData)
        return
      }
      
      // Combinar datos: crear un mapa de usuarios por ID
      const usersMap = new Map((usersData || []).map(u => [u.id, u]))
      
      // Combinar maestros con datos de usuarios
      const teachersWithUserData = teachersData.map((teacher: any) => ({
        ...teacher,
        full_name: usersMap.get(teacher.id)?.full_name,
        email: usersMap.get(teacher.id)?.email,
        user_type: usersMap.get(teacher.id)?.user_type,
      }))
      
      setTeachers(teachersWithUserData)
    } catch (error) {
      console.error("Error loading teachers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTeachers = teachers.filter(
    (teacher) =>
      (teacher.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleCreateTeacher = () => {
    setSelectedTeacher(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleDeleteTeacher = async (teacherId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este profesor?")) {
      try {
        const supabase = createClient()
        const { error } = await supabase.from("teachers").delete().eq("id", teacherId)

        if (error) throw error
        await loadTeachers()
      } catch (error) {
        console.error("Error deleting teacher:", error)
        alert("Error al eliminar el profesor")
      }
    }
  }

  const handleSaveTeacher = async (teacherData: Omit<Teacher, "id" | "created_at" | "updated_at" | "full_name" | "email" | "user_type">) => {
    try {
      const supabase = createClient()

      if (modalMode === "create") {
        // ⚠️ IMPORTANTE: No se puede crear un maestro sin un usuario existente
        // El maestro debe crearse desde el registro (register-form.tsx)
        alert("Los maestros se crean automáticamente al registrarse. Por favor, usa el formulario de registro.")
        setIsModalOpen(false)
        return
      } else if (modalMode === "edit" && selectedTeacher) {
        // Solo actualizar campos permitidos (no id, que es la referencia a users)
        const { error } = await supabase
          .from("teachers")
          .update({
            department: teacherData.department,
            specialties: teacherData.specialties,
            available_hours: teacherData.available_hours,
            phone: teacherData.phone,
            office: teacherData.office,
          })
          .eq("id", selectedTeacher.id)
        if (error) throw error
      }

      await loadTeachers()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving teacher:", error)
      alert("Error al guardar el profesor")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Maestros</CardTitle>
              <CardDescription>Administra la información de los profesores</CardDescription>
            </div>
            <Button onClick={handleCreateTeacher}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Maestro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, email, departamento o especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Especialidades</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Oficina</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      {teacher.full_name || "N/A"}
                    </TableCell>
                    <TableCell>{teacher.email || "N/A"}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {teacher.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{teacher.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{teacher.phone || "N/A"}</TableCell>
                    <TableCell>{teacher.office || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewTeacher(teacher)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTeacher(teacher)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron profesores que coincidan con la búsqueda.
            </div>
          )}
        </CardContent>
      </Card>

      <TeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTeacher}
        teacher={selectedTeacher}
        mode={modalMode}
      />
    </div>
  )
}
