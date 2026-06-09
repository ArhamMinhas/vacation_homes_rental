import { NextResponse } from "next/server"
import { loginSchema } from "@/validations/auth.schema"
import { signInUser, getProfileById } from "@/services/auth.service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input"
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const { email, password } = parsed.data
    const isAdminLogin = body.isAdminLogin === true

    const data = await signInUser(email, password)

    if (!data.user) {
      return NextResponse.json(
        { error: "Login failed. Please try again." },
        { status: 500 }
      )
    }

    const profile = await getProfileById(data.user.id)

    if (isAdminLogin && profile?.role !== "admin") {
      // Sign them back out — wrong role for admin portal
      const { createClient } = await import("@/lib/supabase/server")
      const supabase = await createClient()
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: "Access denied. This portal is for administrators only." },
        { status: 403 }
      )
    }

    return NextResponse.json({
      message: "Login successful",
      role: profile?.role ?? "user",
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed"
    const status =
      message.toLowerCase().includes("invalid") ||
      message.toLowerCase().includes("credentials")
        ? 401
        : 500
    return NextResponse.json({ error: message }, { status })
  }
}
