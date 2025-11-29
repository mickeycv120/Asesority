import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"

interface Advisory {
  id: string
  studentName: string
  teacherName: string
  subject: string
  date: string
  time: string
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
}

interface RecentAdvisoriesProps {
  advisories: Advisory[]
}

export function RecentAdvisories({ advisories }: RecentAdvisoriesProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asesorías Recientes</CardTitle>
        <CardDescription>Últimas sesiones programadas y completadas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {advisories.map((advisory) => (
            <div key={advisory.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 text-muted-foreground bg-muted rounded-full p-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{advisory.studentName}</p>
                    <span className="text-muted-foreground">→</span>
                    <p className="text-sm text-muted-foreground truncate">{advisory.teacherName}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{advisory.subject}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(advisory.date).toLocaleDateString("es-ES")}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {advisory.time}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">{getStatusBadge(advisory.status)}</div>
            </div>
          ))}
          {advisories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No hay asesorías recientes</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
