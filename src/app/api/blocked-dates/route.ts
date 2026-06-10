import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  getAllBlockedDatesForAdmin,
  getBlockedDatesByProperty,
  createBlockedDate,
} from "@/services/blocked-date.service"
import { blockedDateSchema } from "@/validations/blocked-date.schema"

export async function GET(request: NextRequest) {
  try {
    const propertyId = request.nextUrl.searchParams.get("property_id")
    const dates = propertyId
      ? await getBlockedDatesByProperty(propertyId)
      : await getAllBlockedDatesForAdmin()
    return NextResponse.json({ blocked_dates: dates })
  } catch {
    return NextResponse.json({ error: "Failed to fetch blocked dates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single()
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = blockedDateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const date = await createBlockedDate(parsed.data, user.id)
    return NextResponse.json({ blocked_date: date }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create blocked date"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
