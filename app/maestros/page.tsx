import { redirect } from "next/navigation"
import { Navigation } from "@/components/Navbar/navigation"
import { TeacherList } from "@/components/teachers/teacher-list"
import { createClient } from "@/lib/supabase/server"

export default async function TeachersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <TeacherList />
      </main>
    </div>
  )
}
