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

interface Advisory {
  id: string
  studentId: string
  studentName: string
  teacherId: string
  teacherName: string
  subject: string
  topic: string
  date: string
  time: string
  duration: number
  type: "individual" | "group"
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  location: string
  notes: string
  createdAt: string
}

interface AdvisoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (advisory: Omit<Advisory, "id" | "createdAt">) => void
  advisory: Advisory | null
  mode: "create" | "edit" | "view"
}

// Mock data para los selects
const mockStudents = [
  { id: "1", name: "Ana García" },
  { id: "2", name: "Carlos Rodríguez" },
  { id: "3", name: "María López" },
]

const mockTeachers = [
  { id: "1", name: "Dr. Elena García" },
  { id: "2", name: "Dr. Carlos Rodríguez" },
  { id: "3", name: "Dra. María López" },
  { id: "4", name: "Dr. José Martínez" },
]

export function AdvisoryModal({ isOpen, onClose, onSave, advisory, mode }: AdvisoryModalProps) {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    teacherId: "",
    teacherName: "",
    subject: "",
    topic: "",
    date: "",
    time: "",
    duration: 60,
    type: "individual" as "individual" | "group",
    status: "scheduled" as "scheduled" | "confirmed" | "completed" | "cancelled",
    location: "",
    notes: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (advisory && (mode === "edit" || mode === "view")) {
      setFormData({
        studentId: advisory.studentId,
        studentName: advisory.studentName,
        teacherId: advisory.teacherId,
        teacherName: advisory.teacherName,
        subject: advisory.subject,
        topic: advisory.topic,
        date: advisory.date,
        time: advisory.time,
        duration: advisory.duration,
        type: advisory.type,
        status: advisory.status,
        location: advisory.location,
        notes: advisory.notes,
      })
    } else {
      setFormData({
        studentId: "",
        studentName: "",
        teacherId: "",
        teacherName: "",
        subject: "",
        topic: "",
        date: "",
        time: "",
        duration: 60,
        type: "individual",
        status: "scheduled",
        location: "",
        notes: "",
      })
    }
  }, [advisory, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "view") return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simular API call
      onSave(formData)
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

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value
    const student = mockStudents.find((s) => s.id === studentId)
    setFormData((prev) => ({
      ...prev,
      studentId,
      studentName: student?.name || "",
    }))
  }

  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teacherId = e.target.value
    const teacher = mockTeachers.find((t) => t.id === teacherId)
    setFormData((prev) => ({
      ...prev,
      teacherId,
      teacherName: teacher?.name || "",
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
              <Label htmlFor="studentId">Estudiante</Label>
              <select
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleStudentChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
                disabled={isReadOnly}
              >
                <option value="">Seleccionar estudiante</option>
                {mockStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacherId">Profesor</Label>
              <select
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleTeacherChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
                disabled={isReadOnly}
              >
                <option value="">Seleccionar profesor</option>
                {mockTeachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                readOnly={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
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
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
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
                <option value="confirmed">Confirmada</option>
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
              <Button type="submit" disabled={isLoading}>
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
