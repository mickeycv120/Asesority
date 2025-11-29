import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface Activity {
  id: string
  type: "student_registered" | "advisory_scheduled" | "advisory_completed" | "teacher_added"
  description: string
  timestamp: string
  user: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "student_registered":
        return "👨‍🎓"
      case "advisory_scheduled":
        return "📅"
      case "advisory_completed":
        return "✅"
      case "teacher_added":
        return "👨‍🏫"
      default:
        return "📝"
    }
  }

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "student_registered":
        return "bg-blue-100 text-blue-800"
      case "advisory_scheduled":
        return "bg-green-100 text-green-800"
      case "advisory_completed":
        return "bg-purple-100 text-purple-800"
      case "teacher_added":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas acciones en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getActivityColor(activity.type)}>
                    {activity.user}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(activity.timestamp).toLocaleString("es-ES")}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No hay actividad reciente</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
