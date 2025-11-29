"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Calendar, Clock, User, BookOpen } from "lucide-react"
import { AdvisoryModal } from "@/components/advisories/advisory-modal"

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

const mockAdvisories: Advisory[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "Ana García",
    teacherId: "1",
    teacherName: "Dr. Elena García",
    subject: "Matemáticas",
    topic: "Cálculo Diferencial",
    date: "2024-12-15",
    time: "14:00",
    duration: 60,
    type: "individual",
    status: "confirmed",
    location: "Edificio A, Oficina 201",
    notes: "Revisar ejercicios de derivadas",
    createdAt: "2024-12-01",
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Carlos Rodríguez",
    teacherId: "2",
    teacherName: "Dr. Carlos Rodríguez",
    subject: "Anatomía",
    topic: "Sistema Cardiovascular",
    date: "2024-12-16",
    time: "10:00",
    duration: 90,
    type: "individual",
    status: "scheduled",
    location: "Edificio B, Oficina 305",
    notes: "Preparar para examen parcial",
    createdAt: "2024-12-02",
  },
  {
    id: "3",
    studentId: "3",
    studentName: "María López",
    teacherId: "3",
    teacherName: "Dra. María López",
    subject: "Derecho Civil",
    topic: "Contratos",
    date: "2024-12-14",
    time: "16:00",
    duration: 45,
    type: "group",
    status: "completed",
    location: "Aula 302",
    notes: "Sesión grupal sobre tipos de contratos",
    createdAt: "2024-11-28",
  },
  {
    id: "4",
    studentId: "1",
    studentName: "Ana García",
    teacherId: "4",
    teacherName: "Dr. José Martínez",
    subject: "Finanzas",
    topic: "Análisis Financiero",
    date: "2024-12-18",
    time: "09:00",
    duration: 60,
    type: "individual",
    status: "cancelled",
    location: "Edificio D, Oficina 401",
    notes: "Cancelada por enfermedad del estudiante",
    createdAt: "2024-12-03",
  },
]

export function AdvisoryList() {
  const [advisories, setAdvisories] = useState<Advisory[]>(mockAdvisories)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create")

  const filteredAdvisories = advisories.filter((advisory) => {
    const matchesSearch =
      advisory.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisory.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisory.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisory.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisory.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || advisory.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateAdvisory = () => {
    setSelectedAdvisory(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleEditAdvisory = (advisory: Advisory) => {
    setSelectedAdvisory(advisory)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleViewAdvisory = (advisory: Advisory) => {
    setSelectedAdvisory(advisory)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleDeleteAdvisory = (advisoryId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta asesoría?")) {
      setAdvisories(advisories.filter((a) => a.id !== advisoryId))
    }
  }

  const handleSaveAdvisory = (advisoryData: Omit<Advisory, "id" | "createdAt">) => {
    if (modalMode === "create") {
      const newAdvisory: Advisory = {
        ...advisoryData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      }
      setAdvisories([...advisories, newAdvisory])
    } else if (modalMode === "edit" && selectedAdvisory) {
      setAdvisories(
        advisories.map((a) => (a.id === selectedAdvisory.id ? { ...selectedAdvisory, ...advisoryData } : a)),
      )
    }
    setIsModalOpen(false)
  }

  const getStatusBadge = (status: Advisory["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Programada</Badge>
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmada</Badge>
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Completada</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: Advisory["type"]) => {
    return type === "individual" ? (
      <Badge variant="outline" className="flex items-center gap-1">
        <User className="h-3 w-3" />
        Individual
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center gap-1">
        <BookOpen className="h-3 w-3" />
        Grupal
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Asesorías</CardTitle>
              <CardDescription>Administra las sesiones de asesoría académica</CardDescription>
            </div>
            <Button onClick={handleCreateAdvisory}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Asesoría
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por estudiante, profesor, materia o tema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Todos los estados</option>
              <option value="scheduled">Programada</option>
              <option value="confirmed">Confirmada</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Profesor</TableHead>
                  <TableHead>Materia/Tema</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdvisories.map((advisory) => (
                  <TableRow key={advisory.id}>
                    <TableCell className="font-medium">{advisory.studentName}</TableCell>
                    <TableCell>{advisory.teacherName}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{advisory.subject}</div>
                        <div className="text-sm text-muted-foreground">{advisory.topic}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{new Date(advisory.date).toLocaleDateString("es-ES")}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {advisory.time} ({advisory.duration}min)
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(advisory.type)}</TableCell>
                    <TableCell>{getStatusBadge(advisory.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewAdvisory(advisory)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditAdvisory(advisory)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteAdvisory(advisory.id)}
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

          {filteredAdvisories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron asesorías que coincidan con los filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      <AdvisoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAdvisory}
        advisory={selectedAdvisory}
        mode={modalMode}
      />
    </div>
  )
}
