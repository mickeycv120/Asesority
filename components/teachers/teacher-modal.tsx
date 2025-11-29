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
  firstName: string
  lastName: string
  email: string
  employeeId: string
  department: string
  specialties: string[]
  phone: string
  office: string
  status: "active" | "inactive" | "sabbatical"
  availableHours: string[]
  createdAt: string
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
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    department: "",
    specialties: [] as string[],
    phone: "",
    office: "",
    status: "active" as "active" | "inactive" | "sabbatical",
    availableHours: [] as string[],
  })

  const [newSpecialty, setNewSpecialty] = useState("")
  const [newHour, setNewHour] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (teacher && (mode === "edit" || mode === "view")) {
      setFormData({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        employeeId: teacher.employeeId,
        department: teacher.department,
        specialties: [...teacher.specialties],
        phone: teacher.phone,
        office: teacher.office,
        status: teacher.status,
        availableHours: [...teacher.availableHours],
      })
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        employeeId: "",
        department: "",
        specialties: [],
        phone: "",
        office: "",
        status: "active",
        availableHours: [],
      })
    }
    setNewSpecialty("")
    setNewHour("")
  }, [teacher, mode])

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
    if (newHour.trim() && !formData.availableHours.includes(newHour.trim())) {
      setFormData((prev) => ({
        ...prev,
        availableHours: [...prev.availableHours, newHour.trim()],
      }))
      setNewHour("")
    }
  }

  const removeHour = (hour: string) => {
    setFormData((prev) => ({
      ...prev,
      availableHours: prev.availableHours.filter((h) => h !== hour),
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
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Dr. Juan"
                required
                readOnly={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Pérez"
                required
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan.perez@universidad.edu"
              required
              readOnly={isReadOnly}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">ID Empleado</Label>
              <Input
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="PROF001"
                required
                readOnly={isReadOnly}
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
                readOnly={isReadOnly}
              />
            </div>
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
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="sabbatical">Sabático</option>
            </select>
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
              {formData.availableHours.map((hour, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {hour}
                  {!isReadOnly && <X className="h-3 w-3 cursor-pointer" onClick={() => removeHour(hour)} />}
                </Badge>
              ))}
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
