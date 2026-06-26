import { createAdminClient } from "@/lib/supabase/server"
import AdminHeader from "@/components/admin/AdminHeader"
import UsersTable from "@/components/admin/UsersTable"
import { Users, ShieldCheck, User, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Users — Admin" }

async function getUsers() {
  const admin = createAdminClient()
  const [{ data: authData }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin.from("profiles").select("id, role"),
  ])

  const roleMap = new Map((profiles ?? []).map((p) => [p.id, p.role as string]))

  return (authData?.users ?? []).map((u) => ({
    id:           u.id,
    email:        u.email ?? "",
    role:         roleMap.get(u.id) ?? "user",
    created_at:   u.created_at,
    last_sign_in: u.last_sign_in_at ?? null,
  }))
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  const admins  = users.filter((u) => u.role === "admin").length
  const regular = users.filter((u) => u.role !== "admin").length
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recent  = users.filter((u) => new Date(u.created_at).getTime() > sevenDaysAgo).length

  const stats = [
    { label: "Total Users",  value: users.length, icon: Users,       color: "text-blue-600",    bg: "bg-blue-50 border-blue-200"       },
    { label: "Admins",       value: admins,        icon: ShieldCheck, color: "text-amber-600",   bg: "bg-amber-50 border-amber-200"     },
    { label: "Regular",      value: regular,       icon: User,        color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
    { label: "Joined (7d)",  value: recent,        icon: Clock,       color: "text-primary",     bg: "bg-orange-50 border-orange-200"   },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminHeader
        title="Users"
        description="Manage user roles. Promoting a user to admin grants full dashboard access."
      />

      {/* Quick stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={cn("rounded-xl border px-4 py-3 flex items-center gap-3", bg)}>
            <Icon className={cn("h-4 w-4 flex-shrink-0", color)} />
            <div>
              <p className={cn("text-base font-bold leading-none", color)}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <UsersTable users={users} />
    </div>
  )
}
