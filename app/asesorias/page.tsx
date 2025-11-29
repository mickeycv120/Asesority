import { redirect } from "next/navigation"
import { AdvisoryList } from "@/components/advisories/advisory-list"
import { createClient } from "@/lib/supabase/server"

export default async function AdvisoriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <AdvisoryList />
      </main>
    </div>
  )
}