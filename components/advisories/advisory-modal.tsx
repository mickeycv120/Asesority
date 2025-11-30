"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
}

type AdvisoryFormData = Omit<Advisory, "id" | "created_at">

interface AdvisoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (advisory: AdvisoryFormData) => void
  advisory: Advisory | null
  mode: "create" | "edit" | "view"
  userRole?: string | null
  currentUser?: { id: string; user_type?: string } | null
}

interface Student {
  id: string
  full_name: string
  email: string
  enrollment_number: string
}

interface Teacher {
  id: string
  full_name: string
  email: string
  department: string
}

export function AdvisoryModal({ isOpen, onClose, onSave, advisory, mode, userRole, currentUser }: AdvisoryModalProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [formData, setFormData] = useState<AdvisoryFormData>({
    student_id: "",
    teacher_id: "",
    subject: "",
    topic: "",
    scheduled_date: "",
    duration: 60,
    advisory_type: "individual",
    status: "scheduled",
    location: "",
    notes: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true)
      const supabase = createBrowserClient()

      // Cargar estudiantes desde la vista student_profiles
      const { data: studentsData, error: studentsError } = await supabase
        .from("student_profiles")
        .select("id, full_name, email, enrollment_number")
        .order("full_name")

      if (studentsError) {
        console.error("[v0] Error cargando estudiantes:", studentsError)
      } else {
        setStudents(studentsData || [])
      }

      // Cargar maestros desde la vista teacher_profiles
      const { data: teachersData, error: teachersError } = await supabase
        .from("teacher_profiles")
        .select("id, full_name, email, department")
        .order("full_name")

      if (teachersError) {
        console.error("[v0] Error cargando maestros:", teachersError)
      } else {
        setTeachers(teachersData || [])
      }

      setLoadingData(false)
    }

    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  useEffect(() => {
    if (advisory && (mode === "edit" || mode === "view")) {
      setFormData({
        student_id: advisory.student_id,
        teacher_id: advisory.teacher_id,
        subject: advisory.subject,
        topic: advisory.topic,
        scheduled_date: advisory.scheduled_date ? new Date(advisory.scheduled_date).toISOString().slice(0, 16) : "",
        duration: advisory.duration,
        advisory_type: advisory.advisory_type,
        status: advisory.status,
        location: advisory.location,
        notes: advisory.notes || "",
      })
    } else {
      const defaultStudentId = userRole === "student" ? currentUser?.id || "" : ""

      setFormData({
        student_id: defaultStudentId,
        teacher_id: "",
        subject: "",
        topic: "",
        scheduled_date: "",
        duration: 60,
        advisory_type: "individual",
        status: "scheduled",
        location: "",
        notes: "",
      })
    }
  }, [advisory, mode, userRole, currentUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "view") return

    setIsLoading(true)
    try {
      const dataToSave = {
        ...formData,
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
      }

      await onSave(dataToSave)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number.parseInt(value) || 60 : value,
    }))
  }

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Crear Nueva Asesoría"
      case "edit":
        return "Editar Asesoría"
      case "view":
        return "Detalles de la Asesoría"
      default:
        return ""
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "create":
        return "Programa una nueva sesión de asesoría académica"
      case "edit":
        return "Modifica la información de la asesoría"
      case "view":
        return "Información detallada de la asesoría"
      default:
        return ""
    }
  }

  const isReadOnly = mode === "view"
  const canChangeStudent = userRole !== "student"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student_id">Estudiante</Label>
              <select
                id="student_id"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
                disabled={isReadOnly || !canChangeStudent || loadingData}
              >
                <option value="">{loadingData ? "Cargando..." : "Seleccionar estudiante"}</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} ({student.enrollment_number})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher_id">Profesor</Label>
              <select
                id="teacher_id"
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
                disabled={isReadOnly || loadingData}
              >
                <option value="">{loadingData ? "Cargando..." : "Seleccionar profesor"}</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.full_name} - {teacher.department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Materia</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Matemáticas"
                required
                readOnly={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Tema</Label>
              <Input
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Cálculo Diferencial"
                required
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled_date">Fecha y Hora</Label>
              <Input
                id="scheduled_date"
                name="scheduled_date"
                type="datetime-local"
                value={formData.scheduled_date}
                onChange={handleChange}
                required
                readOnly={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duración (min)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="15"
                max="180"
                step="15"
                value={formData.duration}
                onChange={handleChange}
                required
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="advisory_type">Tipo</Label>
              <select
                id="advisory_type"
                name="advisory_type"
                value={formData.advisory_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isReadOnly}
              >
                <option value="individual">Individual</option>
                <option value="group">Grupal</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isReadOnly}
              >
                <option value="scheduled">Programada</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Edificio A, Oficina 201"
              required
              readOnly={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Información adicional sobre la asesoría..."
              rows={3}
              readOnly={isReadOnly}
            />
          </div>

          {mode !== "view" && (
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || loadingData}>
                {isLoading ? "Guardando..." : mode === "create" ? "Crear Asesoría" : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          )}

          {mode === "view" && (
            <DialogFooter>
              <Button type="button" onClick={onClose}>
                Cerrar
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
