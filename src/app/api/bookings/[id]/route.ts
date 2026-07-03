import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getBookingById, updateBookingStatus, cancelBooking } from "@/services/booking.service"
import { checkConfirmedBookingOverlap } from "@/services/availability.service"
import { createBookingConfirmedNotification } from "@/services/notification.service"
import { formatDate } from "@/utils/formatDate"
import { logger } from "@/lib/logger"
import type { BookingStatus } from "@/types/booking"

const VALID_STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled", "rejected"]

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const booking = await getBookingById(id)
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin" && booking.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ booking })
  } catch {
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single()

    const { status } = await request.json()
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    if (profile?.role === "admin") {
      // When confirming, ensure no overlap with already-confirmed bookings
      if (status === "confirmed") {
        const existing = await getBookingById(id)
        if (!existing) {
          return NextResponse.json({ error: "Booking not found" }, { status: 404 })
        }

        const hasOverlap = await checkConfirmedBookingOverlap(
          existing.property_id,
          existing.check_in,
          existing.check_out,
          id  // exclude this booking from the overlap scan
        )

        if (hasOverlap) {
          return NextResponse.json(
            {
              error: `Cannot confirm this booking — the dates ${formatDate(existing.check_in)} to ${formatDate(existing.check_out)} are already reserved for "${existing.property?.title ?? "this property"}". Cancel or reject the conflicting confirmed booking first.`,
              code: "DATE_CONFLICT",
            },
            { status: 409 }
          )
        }
      }

      const booking = await updateBookingStatus(id, status)
      if (status === "confirmed") {
        await createBookingConfirmedNotification(booking)
      }
      return NextResponse.json({ booking })
    }

    // Regular users can only cancel their own pending bookings
    if (status !== "cancelled") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    await cancelBooking(id, user.id)
    return NextResponse.json({ success: true })
  } catch (e) {
    logger.error("[PATCH /api/bookings/:id]", { error: String(e) })
    const msg = e instanceof Error ? e.message : "Failed to update booking"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return NextResponse.json({ error: "Use PATCH with status=cancelled instead", id }, { status: 405 })
}
