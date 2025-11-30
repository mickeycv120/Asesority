"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Loader2 } from "lucide-react"
import { StudentModal } from "./student-modal"
import { createClient } from "@/lib/supabase/clients"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  career: string
  semester: number
  phone: string | null
  address: string | null
  created_at: string
  updated_at: string
  // Datos del usuario (desde JOIN con users)
  full_name?: string
  email?: string
  user_type?: string
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      
      // Obtener estudiantes
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false })

      if (studentsError) throw studentsError
      
      if (!studentsData || studentsData.length === 0) {
        setStudents([])
        return
      }
      
      // Obtener datos de usuarios (students.id = users.id)
      const userIds = studentsData.map(s => s.id)
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, full_name, email, user_type")
        .in("id", userIds)

      if (usersError) {
        console.warn("Error al obtener datos de usuarios:", usersError)
        // Continuar sin datos de usuario
        setStudents(studentsData)
        return
      }
      
      // Combinar datos: crear un mapa de usuarios por ID
      const usersMap = new Map((usersData || []).map(u => [u.id, u]))
      
      // Combinar estudiantes con datos de usuarios
      const studentsWithUserData = studentsData.map((student: any) => ({
        ...student,
        full_name: usersMap.get(student.id)?.full_name,
        email: usersMap.get(student.id)?.email,
        user_type: usersMap.get(student.id)?.user_type,
      }))
      
      setStudents(studentsWithUserData)
    } catch (error) {
      console.error("Error loading students:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      (student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      student.career.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateStudent = () => {
    setSelectedStudent(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
      try {
        const supabase = createClient()
        const { error } = await supabase.from("students").delete().eq("id", studentId)

        if (error) throw error
        await loadStudents()
      } catch (error) {
        console.error("Error deleting student:", error)
        alert("Error al eliminar el estudiante")
      }
    }
  }

  const handleSaveStudent = async (studentData: Omit<Student, "id" | "created_at" | "updated_at" | "full_name" | "email" | "user_type">) => {
    try {
      const supabase = createClient()

      if (modalMode === "create") {
        // ⚠️ IMPORTANTE: No se puede crear un estudiante sin un usuario existente
        // El estudiante debe crearse desde el registro (register-form.tsx)
        alert("Los estudiantes se crean automáticamente al registrarse. Por favor, usa el formulario de registro.")
        setIsModalOpen(false)
        return
      } else if (modalMode === "edit" && selectedStudent) {
        // Solo actualizar campos permitidos (no id, que es la referencia a users)
        const { error } = await supabase
          .from("students")
          .update({
            career: studentData.career,
            semester: studentData.semester,
            phone: studentData.phone,
            address: studentData.address,
          })
          .eq("id", selectedStudent.id)
        if (error) throw error
      }

      await loadStudents()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving student:", error)
      alert("Error al guardar el estudiante")
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
              <CardTitle>Gestión de Alumnos</CardTitle>
              <CardDescription>Administra la información de los estudiantes</CardDescription>
            </div>
            <Button onClick={handleCreateStudent}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Alumno
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, email o carrera..."
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
                  <TableHead>Carrera</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.full_name || "N/A"}</TableCell>
                    <TableCell>{student.email || "N/A"}</TableCell>
                    <TableCell>{student.career}</TableCell>
                    <TableCell>{student.semester}°</TableCell>
                    <TableCell>{student.phone || "N/A"}</TableCell>
                    <TableCell>{student.address || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewStudent(student)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditStudent(student)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteStudent(student.id)}
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

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron estudiantes que coincidan con la búsqueda.
            </div>
          )}
        </CardContent>
      </Card>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        student={selectedStudent}
        mode={modalMode}
      />
    </div>
  )
}
