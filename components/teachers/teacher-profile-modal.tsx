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
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

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

interface TeacherProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (teacher: Omit<Teacher, "id" | "created_at" | "updated_at" | "user_type">) => void
  teacher: Teacher | null
}

export function TeacherProfileModal({ isOpen, onClose, onSave, teacher }: TeacherProfileModalProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    employee_number: "",
    department: "",
    phone: "",
    office: "",
    specialties: [] as string[],
    available_hours: [] as string[],
  })

  const [newSpecialty, setNewSpecialty] = useState("")
  const [newHour, setNewHour] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (teacher) {
      // Manejar specialties que puede venir como string o array
      const specialtiesArray = Array.isArray(teacher.specialties)
        ? teacher.specialties
        : typeof teacher.specialties === "string"
          ? (() => {
              try {
                return JSON.parse(teacher.specialties)
              } catch {
                return teacher.specialties.split(",").map((s) => s.trim())
              }
            })()
          : []

      // Manejar available_hours que ahora viene como array desde la base de datos
      const availableHoursArray = Array.isArray(teacher.available_hours)
        ? teacher.available_hours
        : teacher.available_hours
          ? [teacher.available_hours]
          : []

      setFormData({
        full_name: teacher.full_name || "",
        email: teacher.email || "",
        employee_number: teacher.employee_number || "",
        department: teacher.department || "",
        phone: teacher.phone || "",
        office: teacher.office || "",
        specialties: specialtiesArray,
        available_hours: availableHoursArray,
      })
    } else {
      setFormData({
        full_name: "",
        email: "",
        employee_number: "",
        department: "",
        phone: "",
        office: "",
        specialties: [],
        available_hours: [],
      })
    }
    setNewSpecialty("")
    setNewHour("")
  }, [teacher])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      const dataToSave = {
        ...formData,
        phone: formData.phone || null,
        office: formData.office || null,
        specialties: formData.specialties,
        available_hours: formData.available_hours.length > 0 ? formData.available_hours : null,
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
      [name]: value,
    }))
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }))
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }))
  }

  const addHour = () => {
    if (newHour.trim()) {
      const trimmedHour = newHour.trim()
      if (!formData.available_hours.includes(trimmedHour)) {
        setFormData((prev) => ({
          ...prev,
          available_hours: [...prev.available_hours, trimmedHour],
        }))
        setNewHour("")
      }
    }
  }

  const removeHour = (hour: string) => {
    setFormData((prev) => ({
      ...prev,
      available_hours: prev.available_hours.filter((h) => h !== hour),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Profesor</DialogTitle>
          <DialogDescription>Modifica la información del profesor</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nombre Completo</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan@universidad.edu"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee_number">Número de Empleado</Label>
            <Input
              id="employee_number"
              name="employee_number"
              value={formData.employee_number}
              onChange={handleChange}
              placeholder="E00123456"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Ingeniería"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+52 555 123 4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="office">Oficina</Label>
              <Input
                id="office"
                name="office"
                value={formData.office}
                onChange={handleChange}
                placeholder="Edificio A, Oficina 201"
              />
            </div>
          </div>

          {/* Especialidades */}
          <div className="space-y-2">
            <Label>Especialidades</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {specialty}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSpecialty(specialty)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Agregar especialidad"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSpecialty()
                  }
                }}
              />
              <Button type="button" onClick={addSpecialty} variant="outline">
                Agregar
              </Button>
            </div>
          </div>

          {/* Horarios disponibles */}
          <div className="space-y-2">
            <Label>Horarios Disponibles</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.available_hours.map((hour, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {hour}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeHour(hour)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newHour}
                onChange={(e) => setNewHour(e.target.value)}
                placeholder="ej: 09:00-11:00"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addHour()
                  }
                }}
              />
              <Button type="button" onClick={addHour} variant="outline">
                Agregar
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

