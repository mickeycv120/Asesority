"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye } from "lucide-react"
import { TeacherModal } from "./teacher-modal"
import { createClient } from "@/lib/supabase/clients"

interface Teacher {
  id: string
  full_name: string
  email: string
  employee_number: string
  department: string
  specialties: string[] | string // Puede venir como array o string desde la vista
  phone: string | null
  office: string | null
  available_hours: string | null
  created_at: string
  updated_at: string
  user_type?: string
}

export function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeachers()
  }, [])

  const parseSpecialties = (specialties: string[] | string | null): string[] => {
    if (!specialties) return []
    if (Array.isArray(specialties)) return specialties
    try {
      return JSON.parse(specialties)
    } catch {
      return typeof specialties === "string" ? specialties.split(",").map((s) => s.trim()) : []
    }
  }

  const loadTeachers = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("teacher_profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setTeachers(data || [])
    } catch (error) {
      console.error("Error cargando maestros:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const searchLower = searchTerm.toLowerCase()
    const specialtiesArray = parseSpecialties(teacher.specialties)
    const specialtiesStr = specialtiesArray.join(" ").toLowerCase()

    return (
      (teacher.full_name?.toLowerCase() || "").includes(searchLower) ||
      (teacher.email?.toLowerCase() || "").includes(searchLower) ||
      (teacher.employee_number?.toLowerCase() || "").includes(searchLower) ||
      (teacher.department?.toLowerCase() || "").includes(searchLower) ||
      specialtiesStr.includes(searchLower)
    )
  })

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Directorio de Maestros</CardTitle>
              <CardDescription>Consulta la información de los profesores disponibles</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, email, departamento o especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando maestros...</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>ID Empleado</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Especialidades</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.full_name || "N/A"}</TableCell>
                        <TableCell>{teacher.email || "N/A"}</TableCell>
                        <TableCell>{teacher.employee_number || "N/A"}</TableCell>
                        <TableCell>{teacher.department || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(() => {
                              const specialties = parseSpecialties(teacher.specialties)
                              return (
                                <>
                                  {specialties.slice(0, 2).map((specialty, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {specialty}
                                    </Badge>
                                  ))}
                                  {specialties.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{specialties.length - 2}
                                    </Badge>
                                  )}
                                </>
                              )
                            })()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewTeacher(teacher)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredTeachers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron profesores que coincidan con la búsqueda.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <TeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {}}
        teacher={selectedTeacher}
        mode="view"
      />
    </div>
  )
}