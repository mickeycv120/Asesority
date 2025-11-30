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

interface TeacherModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (teacher: Omit<Teacher, "id" | "createdAt">) => void
  teacher: Teacher | null
  mode: "create" | "edit" | "view"
}

export function TeacherModal({ isOpen, onClose, onSave, teacher, mode }: TeacherModalProps) {
  const [formData, setFormData] = useState({
    department: "",
    specialties: [] as string[],
    available_hours: "",
    phone: "",
    office: "",
  })

  const [newSpecialty, setNewSpecialty] = useState("")
  const [newHour, setNewHour] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (teacher && (mode === "edit" || mode === "view")) {
      setFormData({
        department: teacher.department,
        specialties: [...teacher.specialties],
        available_hours: teacher.available_hours || "",
        phone: teacher.phone || "",
        office: teacher.office || "",
      })
    } else {
      setFormData({
        department: "",
        specialties: [],
        available_hours: "",
        phone: "",
        office: "",
      })
    }
    setNewSpecialty("")
    setNewHour("")
  }, [teacher, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "view" || mode === "create") {
      // No permitir crear maestros desde aquí
      return
    }

    setIsLoading(true)
    try {
      const dataToSave = {
        ...formData,
        available_hours: formData.available_hours || null,
        phone: formData.phone || null,
        office: formData.office || null,
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
      const currentHours = formData.available_hours ? formData.available_hours.split(",").map(h => h.trim()) : []
      if (!currentHours.includes(newHour.trim())) {
        const updatedHours = [...currentHours, newHour.trim()].join(", ")
        setFormData((prev) => ({
          ...prev,
          available_hours: updatedHours,
        }))
        setNewHour("")
      }
    }
  }

  const removeHour = (hour: string) => {
    const currentHours = formData.available_hours ? formData.available_hours.split(",").map(h => h.trim()) : []
    const updatedHours = currentHours.filter((h) => h !== hour).join(", ")
    setFormData((prev) => ({
      ...prev,
      available_hours: updatedHours,
    }))
  }

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Crear Nuevo Maestro"
      case "edit":
        return "Editar Maestro"
      case "view":
        return "Detalles del Maestro"
      default:
        return ""
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "create":
        return "Completa la información para registrar un nuevo profesor"
      case "edit":
        return "Modifica la información del profesor"
      case "view":
        return "Información detallada del profesor"
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
          {mode === "create" && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
              ⚠️ No se pueden crear maestros directamente. Los maestros se crean automáticamente cuando un usuario se registra como "Profesor" en el formulario de registro.
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "view" && teacher && (
            <>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={teacher.full_name || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={teacher.email || "N/A"} readOnly />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Ingeniería"
              required
              readOnly={isReadOnly}
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
                readOnly={isReadOnly}
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
                readOnly={isReadOnly}
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
                  {!isReadOnly && <X className="h-3 w-3 cursor-pointer" onClick={() => removeSpecialty(specialty)} />}
                </Badge>
              ))}
            </div>
            {!isReadOnly && (
              <div className="flex gap-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Agregar especialidad"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
                />
                <Button type="button" onClick={addSpecialty} variant="outline">
                  Agregar
                </Button>
              </div>
            )}
          </div>

          {/* Horarios disponibles */}
          <div className="space-y-2">
            <Label>Horarios Disponibles</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.available_hours
                ? formData.available_hours.split(",").map((hour, index) => {
                    const trimmedHour = hour.trim()
                    return trimmedHour ? (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {trimmedHour}
                        {!isReadOnly && <X className="h-3 w-3 cursor-pointer" onClick={() => removeHour(trimmedHour)} />}
                      </Badge>
                    ) : null
                  })
                : null}
            </div>
            {!isReadOnly && (
              <div className="flex gap-2">
                <Input
                  value={newHour}
                  onChange={(e) => setNewHour(e.target.value)}
                  placeholder="ej: 09:00-11:00"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHour())}
                />
                <Button type="button" onClick={addHour} variant="outline">
                  Agregar
                </Button>
              </div>
            )}
          </div>

          {mode !== "view" && (
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : mode === "create" ? "Crear Maestro" : "Guardar Cambios"}
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
