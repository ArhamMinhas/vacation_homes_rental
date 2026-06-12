import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createBooking, getUserBookings, getAllBookings } from "@/services/booking.service"
import { checkPropertyAvailability } from "@/services/availability.service"
import { bookingSchema } from "@/validations/booking.schema"
import { logger } from "@/lib/logger"

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single()

    const bookings =
      profile?.role === "admin"
        ? await getAllBookings()
        : await getUserBookings(user.id)

    return NextResponse.json({ bookings })
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    // Server-side availability check — defence in depth, catches races the
    // client-side pre-check cannot prevent.
    const avail = await checkPropertyAvailability(
      parsed.data.property_id,
      parsed.data.check_in,
      parsed.data.check_out,
      parsed.data.guests
    )
    if (!avail.available) {
      return NextResponse.json(
        { error: avail.reason ?? "Dates not available", conflictType: avail.conflictType ?? "booking" },
        { status: 409 }
      )
    }

    const booking = await createBooking(parsed.data, user.id)
    return NextResponse.json({ booking }, { status: 201 })
  } catch (e) {
    logger.error("[POST /api/bookings]", { error: String(e) })
    const msg = e instanceof Error ? e.message : "Failed to create booking"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
