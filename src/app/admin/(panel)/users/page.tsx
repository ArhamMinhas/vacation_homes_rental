import { createAdminClient } from "@/lib/supabase/server"
import AdminHeader from "@/components/admin/AdminHeader"
import UsersTable from "@/components/admin/UsersTable"
import { AnimatedStatCard } from "@/components/ui/animations"
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
    { label: "Total Users", value: users.length, iconName: "Users",       color: "text-blue-600",    bg: "bg-blue-50 border-blue-200"       },
    { label: "Admins",      value: admins,        iconName: "ShieldCheck", color: "text-amber-600",   bg: "bg-amber-50 border-amber-200"     },
    { label: "Regular",     value: regular,       iconName: "User",        color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
    { label: "Joined (7d)", value: recent,        iconName: "Clock",       color: "text-primary",     bg: "bg-orange-50 border-orange-200"   },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminHeader
        title="Users"
        description="Manage user roles. Promoting a user to admin grants full dashboard access."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, iconName, color, bg }, i) => (
          <AnimatedStatCard
            key={label}
            label={label}
            value={value}
            iconName={iconName}
            color={color}
            bg={bg}
            index={i}
            isNumber
          />
        ))}
      </div>

      <UsersTable users={users} />
    </div>
  )
}
