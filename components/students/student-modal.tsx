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

interface StudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (student: Omit<Student, "id" | "created_at" | "updated_at">) => void
  student: Student | null
  mode: "create" | "edit" | "view"
}

export function StudentModal({ isOpen, onClose, onSave, student, mode }: StudentModalProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    enrollment_number: "",
    career: "",
    semester: 1,
    phone: "",
    address: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (student && (mode === "edit" || mode === "view")) {
      setFormData({
        full_name: student.full_name || "",
        email: student.email || "",
        enrollment_number: student.enrollment_number || "",
        career: student.career,
        semester: student.semester,
        phone: student.phone || "",
        address: student.address || "",
      })
    } else {
      setFormData({
        full_name: "",
        email: "",
        enrollment_number: "",
        career: "",
        semester: 1,
        phone: "",
        address: "",
      })
    }
  }, [student, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "view") return

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
              ? "Completa la información para registrar un nuevo estudiante"
              : mode === "edit"
                ? "Modifica la información del estudiante"
                : "Información detallada del estudiante"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "view" && student && (
            <>
              <div className="space-y-2">
                <Label>ID</Label>
                <Input value={student.id} readOnly />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="full_name">Nombre Completo</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required
              readOnly={isReadOnly}
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
              readOnly={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enrollment_number">Matrícula</Label>
            <Input
              id="enrollment_number"
              name="enrollment_number"
              value={formData.enrollment_number}
              onChange={handleChange}
              placeholder="EST001"
              required
              readOnly={isReadOnly}
            />
          </div>

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
