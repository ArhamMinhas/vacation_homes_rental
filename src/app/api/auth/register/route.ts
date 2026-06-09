import { NextResponse } from "next/server"
import { registerSchema } from "@/validations/auth.schema"
import { signUpUser } from "@/services/auth.service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input"
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const { email, password, fullName } = parsed.data
    const data = await signUpUser({ email, password, fullName })

    if (!data.user) {
      return NextResponse.json(
        { error: "Registration failed. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: data.session
          ? "Account created successfully."
          : "Account created. Please check your email to confirm your account.",
        hasSession: !!data.session,
      },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed"
    const status = message.toLowerCase().includes("already registered")
      ? 409
      : 500
    return NextResponse.json({ error: message }, { status })
  }
}
