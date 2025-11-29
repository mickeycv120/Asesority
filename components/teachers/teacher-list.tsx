"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Calendar } from "lucide-react"
import { TeacherModal } from "@/components/teachers/teacher-modal"

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

const mockTeachers: Teacher[] = [
  {
    id: "1",
    firstName: "Dr. Elena",
    lastName: "García",
    email: "elena.garcia@universidad.edu",
    employeeId: "PROF001",
    department: "Ingeniería",
    specialties: ["Matemáticas", "Cálculo", "Álgebra"],
    phone: "+52 555 123 4567",
    office: "Edificio A, Oficina 201",
    status: "active",
    availableHours: ["09:00-11:00", "14:00-16:00"],
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    firstName: "Dr. Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@universidad.edu",
    employeeId: "PROF002",
    department: "Medicina",
    specialties: ["Anatomía", "Fisiología", "Patología"],
    phone: "+52 555 234 5678",
    office: "Edificio B, Oficina 305",
    status: "active",
    availableHours: ["10:00-12:00", "15:00-17:00"],
    createdAt: "2023-02-20",
  },
  {
    id: "3",
    firstName: "Dra. María",
    lastName: "López",
    email: "maria.lopez@universidad.edu",
    employeeId: "PROF003",
    department: "Derecho",
    specialties: ["Derecho Civil", "Derecho Penal", "Derecho Constitucional"],
    phone: "+52 555 345 6789",
    office: "Edificio C, Oficina 102",
    status: "sabbatical",
    availableHours: [],
    createdAt: "2022-08-10",
  },
  {
    id: "4",
    firstName: "Dr. José",
    lastName: "Martínez",
    email: "jose.martinez@universidad.edu",
    employeeId: "PROF004",
    department: "Administración",
    specialties: ["Finanzas", "Marketing", "Recursos Humanos"],
    phone: "+52 555 456 7890",
    office: "Edificio D, Oficina 401",
    status: "active",
    availableHours: ["08:00-10:00", "13:00-15:00"],
    createdAt: "2023-03-05",
  },
]

export function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create")

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleCreateTeacher = () => {
    setSelectedTeacher(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleDeleteTeacher = (teacherId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este profesor?")) {
      setTeachers(teachers.filter((t) => t.id !== teacherId))
    }
  }

  const handleSaveTeacher = (teacherData: Omit<Teacher, "id" | "createdAt">) => {
    if (modalMode === "create") {
      const newTeacher: Teacher = {
        ...teacherData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      }
      setTeachers([...teachers, newTeacher])
    } else if (modalMode === "edit" && selectedTeacher) {
      setTeachers(teachers.map((t) => (t.id === selectedTeacher.id ? { ...selectedTeacher, ...teacherData } : t)))
    }
    setIsModalOpen(false)
  }

  const getStatusBadge = (status: Teacher["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactivo</Badge>
      case "sabbatical":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sabático</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Maestros</CardTitle>
              <CardDescription>Administra la información de los profesores</CardDescription>
            </div>
            <Button onClick={handleCreateTeacher}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Maestro
            </Button>
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>ID Empleado</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Especialidades</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      {teacher.firstName} {teacher.lastName}
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.employeeId}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {teacher.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{teacher.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(teacher.status)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditTeacher(teacher)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Ver horarios
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
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
        </CardContent>
      </Card>

      <TeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTeacher}
        teacher={selectedTeacher}
        mode={modalMode}
      />
    </div>
  )
}
