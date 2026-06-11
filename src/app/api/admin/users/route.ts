import { NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import { z } from "zod"

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single()
  return profile?.role === "admin" ? user : null
}

// GET /api/admin/users — list all users with their roles
export async function GET() {
  try {
    const caller = await requireAdmin()
    if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const admin = createAdminClient()

    const [{ data: authData, error: authError }, { data: profiles }] = await Promise.all([
      admin.auth.admin.listUsers({ perPage: 1000 }),
      admin.from("profiles").select("id, role"),
    ])

    if (authError) throw authError

    const roleMap = new Map((profiles ?? []).map((p) => [p.id, p.role as string]))

    const users = (authData?.users ?? []).map((u) => ({
      id:         u.id,
      email:      u.email ?? "",
      role:       roleMap.get(u.id) ?? "user",
      created_at: u.created_at,
      last_sign_in: u.last_sign_in_at ?? null,
    }))

    return NextResponse.json({ users })
  } catch (e) {
    logger.error("[GET /api/admin/users]", { error: String(e) })
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

const patchSchema = z.object({
  userId: z.string().uuid(),
  role:   z.enum(["admin", "user"]),
})

// PATCH /api/admin/users — update a user's role
export async function PATCH(request: NextRequest) {
  try {
    const caller = await requireAdmin()
    if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { userId, role } = parsed.data

    // Prevent admin from removing their own admin role
    if (userId === caller.id && role !== "admin") {
      return NextResponse.json(
        { error: "You cannot remove your own admin role." },
        { status: 400 }
      )
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from("profiles")
      .update({ role })
      .eq("id", userId)

    if (error) throw error

    logger.info("User role updated", { updatedBy: caller.id, targetUser: userId, newRole: role })
    return NextResponse.json({ success: true })
  } catch (e) {
    logger.error("[PATCH /api/admin/users]", { error: String(e) })
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}
