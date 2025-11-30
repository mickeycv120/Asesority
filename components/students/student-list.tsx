"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Loader2 } from "lucide-react"
import { StudentModal } from "./student-modal"
import { createClient } from "@/lib/supabase/clients"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  full_name: string
  email: string
  enrollment_number: string
  career: string
  semester: number
  phone: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export function StudentList() {
  const [student, setStudent] = useState<Student | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadMyProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMyProfile = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase.from("student_profiles").select("*").eq("id", user.id).single()

      if (error) throw error
      setStudent(data)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProfile = () => {
    setSelectedStudent(student)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleSaveStudent = async (studentData: Omit<Student, "id" | "created_at" | "updated_at">) => {
    try {
      const supabase = createClient()

      if (student) {
        // Actualizar nombre y email en users
        const { error: usersError } = await supabase
          .from("users")
          .update({
            full_name: studentData.full_name,
            email: studentData.email,
          })
          .eq("id", student.id)

        if (usersError) throw usersError

        // Actualizar campos específicos en students
        const { error: studentsError } = await supabase
          .from("students")
          .update({
            enrollment_number: studentData.enrollment_number,
            career: studentData.career,
            semester: studentData.semester,
            phone: studentData.phone,
            address: studentData.address,
          })
          .eq("id", student.id)

        if (studentsError) throw studentsError
      }

      await loadMyProfile()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Error al guardar el perfil")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!student) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            No se encontró información de perfil. Por favor contacta al administrador.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mi Perfil</CardTitle>
              <CardDescription>Visualiza y edita tu información personal</CardDescription>
            </div>
            <Button onClick={handleEditProfile}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Nombre Completo</div>
              <div className="text-base">{student.full_name}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Matrícula</div>
              <div className="text-base">{student.enrollment_number}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="text-base">{student.email}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Carrera</div>
              <div className="text-base">{student.career}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Semestre</div>
              <div className="text-base">{student.semester}°</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Teléfono</div>
              <div className="text-base">{student.phone || "No registrado"}</div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="text-sm font-medium text-muted-foreground">Dirección</div>
              <div className="text-base">{student.address || "No registrada"}</div>
            </div>
          </div>
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
