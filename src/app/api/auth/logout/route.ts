import { NextResponse } from "next/server"
import { signOutUser } from "@/services/auth.service"

export async function POST() {
  try {
    await signOutUser()
    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Logout failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
