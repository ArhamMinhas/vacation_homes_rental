import { createAdminClient } from "@/lib/supabase/server"
import UsersTable from "@/components/admin/UsersTable"
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage user roles. Promoting a user to admin grants full dashboard access.
        </p>
      </div>
      <UsersTable users={users} />
    </div>
  )
}
