"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Loader2 } from "lucide-react"
import { StudentModal } from "./student-modal"
import { TeacherProfileModal } from "@/components/teachers/teacher-profile-modal"
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

interface Teacher {
  id: string
  full_name: string
  email: string
  employee_number: string
  department: string
  specialties: string[] | string
  phone: string | null
  office: string | null
  available_hours: string[] | null
  created_at: string
  updated_at: string
}

type UserProfile = Student | Teacher

export function StudentList() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userType, setUserType] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isStudent = (type: string | null) => type === "estudiante" || type === "student"
  const isTeacher = (type: string | null) => type === "profesor" || type === "teacher"

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

      // Primero obtener el tipo de usuario desde la tabla users
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", user.id)
        .maybeSingle()

      if (userError) throw userError

      if (!userData) {
        console.error("No se encontró información de usuario")
        return
      }

      const type = userData.user_type
      setUserType(type)

      // Cargar datos según el tipo de usuario
      if (isStudent(type)) {
        const { data, error } = await supabase.from("student_profiles").select("*").eq("id", user.id).single()

        if (error) throw error
        setProfile(data as Student)
      } else if (isTeacher(type)) {
        const { data, error } = await supabase.from("teacher_profiles").select("*").eq("id", user.id).single()

        if (error) throw error
        setProfile(data as Teacher)
      } else {
        console.error("Tipo de usuario no reconocido:", type)
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProfile = () => {
    if (isStudent(userType) && profile) {
      setSelectedStudent(profile as Student)
      setIsModalOpen(true)
    } else if (isTeacher(userType) && profile) {
      setSelectedTeacher(profile as Teacher)
      setIsModalOpen(true)
    }
  }

  const handleSaveStudent = async (studentData: Omit<Student, "id" | "created_at" | "updated_at">) => {
    try {
      const supabase = createClient()

      if (profile && isStudent(userType)) {
        const student = profile as Student
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

  const handleSaveTeacher = async (teacherData: Omit<Teacher, "id" | "created_at" | "updated_at" | "user_type">) => {
    try {
      const supabase = createClient()

      if (profile && isTeacher(userType)) {
        const teacher = profile as Teacher
        // Actualizar nombre y email en users
        const { error: usersError } = await supabase
          .from("users")
          .update({
            full_name: teacherData.full_name,
            email: teacherData.email,
          })
          .eq("id", teacher.id)

        if (usersError) throw usersError

        // Actualizar campos específicos en teachers
        const { error: teachersError } = await supabase
          .from("teachers")
          .update({
            employee_number: teacherData.employee_number,
            department: teacherData.department,
            phone: teacherData.phone,
            office: teacherData.office,
            specialties: teacherData.specialties,
            available_hours: teacherData.available_hours,
          })
          .eq("id", teacher.id)

        if (teachersError) throw teachersError
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

  if (!profile) {
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
              <CardDescription className="mt-2">
                {isStudent(userType) ? "Información del Estudiante" : "Información del Profesor"}
              </CardDescription>
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
              <div className="text-base">{profile.full_name}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="text-base">{profile.email}</div>
            </div>

            {isStudent(userType) && (
              <>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Número de Control</div>
                  <div className="text-base">{(profile as Student).enrollment_number}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Carrera</div>
                  <div className="text-base">{(profile as Student).career}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Semestre</div>
                  <div className="text-base">{(profile as Student).semester}°</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Teléfono</div>
                  <div className="text-base">{(profile as Student).phone || "No registrado"}</div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">Dirección</div>
                  <div className="text-base">{(profile as Student).address || "No registrada"}</div>
                </div>
              </>
            )}

            {isTeacher(userType) && (
              <>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Número de Empleado</div>
                  <div className="text-base">{(profile as Teacher).employee_number || "No registrado"}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Departamento</div>
                  <div className="text-base">{(profile as Teacher).department || "No registrado"}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Oficina</div>
                  <div className="text-base">{(profile as Teacher).office || "No registrada"}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Teléfono</div>
                  <div className="text-base">{(profile as Teacher).phone || "No registrado"}</div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">Especialidades</div>
                  <div className="text-base">
                    {(() => {
                      const specialties = (profile as Teacher).specialties
                      if (!specialties) return "No registradas"
                      if (Array.isArray(specialties)) {
                        return specialties.length > 0 ? specialties.join(", ") : "No registradas"
                      }
                      return specialties || "No registradas"
                    })()}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">Horarios Disponibles</div>
                  <div className="text-base">
                    {(() => {
                      const hours = (profile as Teacher).available_hours
                      if (!hours || (Array.isArray(hours) && hours.length === 0)) {
                        return "No registrados"
                      }
                      if (Array.isArray(hours)) {
                        return hours.join(", ")
                      }
                      return hours || "No registrados"
                    })()}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {isStudent(userType) && (
        <StudentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStudent}
          student={selectedStudent}
        />
      )}

      {isTeacher(userType) && (
        <TeacherProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTeacher}
          teacher={selectedTeacher}
        />
      )}
    </div>
  )
}
