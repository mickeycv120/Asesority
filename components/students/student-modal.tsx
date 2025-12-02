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
}

export function StudentModal({ isOpen, onClose, onSave, student }: StudentModalProps) {
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
    if (student) {
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
  }, [student])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Alumno</DialogTitle>
          <DialogDescription>Modifica la información del estudiante</DialogDescription>
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
            <Label htmlFor="enrollment_number">Número de Control</Label>
            <Input
              id="enrollment_number"
              name="enrollment_number"
              value={formData.enrollment_number}
              onChange={handleChange}
              placeholder="A00123456"
              required
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
            />
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
