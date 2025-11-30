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

interface StudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (student: Omit<Student, "id" | "created_at" | "updated_at">) => void
  student: Student | null
  mode: "create" | "edit" | "view"
}

export function StudentModal({ isOpen, onClose, onSave, student, mode }: StudentModalProps) {
  const [formData, setFormData] = useState({
    career: "",
    semester: 1,
    phone: "",
    address: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (student && (mode === "edit" || mode === "view")) {
      setFormData({
        career: student.career,
        semester: student.semester,
        phone: student.phone || "",
        address: student.address || "",
      })
    } else {
      setFormData({
        career: "",
        semester: 1,
        phone: "",
        address: "",
      })
    }
  }, [student, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "view" || mode === "create") {
      // No permitir crear estudiantes desde aquí
      return
    }

    setIsLoading(true)
    try {
      const dataToSave = {
        ...formData,
        phone: formData.phone || null,
        address: formData.address || null,
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
      [name]: name === "semester" ? Number.parseInt(value) || 1 : value,
    }))
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Crear Nuevo Alumno" : mode === "edit" ? "Editar Alumno" : "Detalles del Alumno"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Los estudiantes se crean automáticamente al registrarse. Usa el formulario de registro para crear nuevos estudiantes."
              : mode === "edit"
                ? "Modifica la información del estudiante"
                : "Información detallada del estudiante"}
          </DialogDescription>
          {mode === "create" && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
              ⚠️ No se pueden crear estudiantes directamente. Los estudiantes se crean automáticamente cuando un usuario se registra como "Estudiante" en el formulario de registro.
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "view" && student && (
            <>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={student.full_name || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={student.email || "N/A"} readOnly />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="career">Carrera</Label>
            <Input
              id="career"
              name="career"
              value={formData.career}
              onChange={handleChange}
              placeholder="Ingeniería en Sistemas"
              required
              readOnly={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Semestre</Label>
            <Input
              id="semester"
              name="semester"
              type="number"
              min="1"
              max="12"
              value={formData.semester}
              onChange={handleChange}
              required
              readOnly={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="555-0101"
              readOnly={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Calle Principal 123"
              readOnly={isReadOnly}
            />
          </div>

          {mode !== "view" && (
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : mode === "create" ? "Crear Alumno" : "Guardar Cambios"}
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
