import { createAdminClient } from "@/lib/supabase/server"
import { ROUTES } from "@/lib/constants"
import { logger } from "@/lib/logger"
import { formatDate } from "@/utils/formatDate"
import type { Booking } from "@/types/booking"
import type { Notification } from "@/types/notification"

function toNotification(row: Record<string, unknown>): Notification {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    booking_id: row.booking_id ? String(row.booking_id) : null,
    type: row.type as Notification["type"],
    title: String(row.title),
    message: String(row.message),
    action_url: row.action_url ? String(row.action_url) : null,
    read_at: row.read_at ? String(row.read_at) : null,
    created_at: String(row.created_at),
  }
}

export async function createBookingConfirmedNotification(
  booking: Booking
): Promise<Notification | null> {
  if (!booking.user_id) return null

  const supabase = createAdminClient()
  const propertyTitle = booking.property?.title ?? "your stay"
  const message = `${propertyTitle} is confirmed for ${formatDate(booking.check_in)} to ${formatDate(booking.check_out)}. Complete payment to secure the reservation.`

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: booking.user_id,
      booking_id: booking.id,
      type: "booking_confirmed",
      title: "Your booking is confirmed",
      message,
      action_url: ROUTES.BOOKING_PAYMENT(booking.id),
    })
    .select("*")
    .single()

  if (error) {
    logger.warn("Booking confirmation notification was not stored", {
      bookingId: booking.id,
      reason: error.message,
    })
    return null
  }

  return toNotification(data)
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    logger.warn("Unable to load notifications", { userId, reason: error.message })
    return []
  }

  return (data ?? []).map(toNotification)
}
