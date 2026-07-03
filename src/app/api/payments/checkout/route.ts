import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getBookingById, recordPaymentCheckoutAttempt } from "@/services/booking.service"
import { createBookingCheckoutSession } from "@/services/stripe.service"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()
    if (typeof bookingId !== "string" || bookingId.length === 0) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const booking = await getBookingById(bookingId)
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    if (booking.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (booking.status !== "confirmed") {
      return NextResponse.json(
        { error: "Payment is available after the admin confirms your booking." },
        { status: 409 }
      )
    }

    const session = await createBookingCheckoutSession(booking)
    await recordPaymentCheckoutAttempt(booking.id, session.id)

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (e) {
    logger.error("[POST /api/payments/checkout]", { error: String(e) })
    const msg = e instanceof Error ? e.message : "Unable to start payment"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
