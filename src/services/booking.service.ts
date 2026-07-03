import { createClient, createAdminClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import type { Booking, BookingStatus } from "@/types/booking"
import type { BookingInput } from "@/validations/booking.schema"

// ─── Mapper ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBooking(row: any): Booking {
  const imgs: { image_url: string; is_primary: boolean }[] =
    row.property?.property_images ?? []
  const images = imgs
    .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
    .map((i) => i.image_url)

  return {
    id: row.id,
    property_id: row.property_id,
    user_id: row.user_id,
    guest_name: row.guest_name,
    guest_email: row.guest_email,
    guest_phone: row.guest_phone ?? null,
    message: row.message ?? null,
    check_in: row.check_in,
    check_out: row.check_out,
    guests: row.guests,
    nights: row.nights,
    total_price: Number(row.total_price),
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    property: row.property
      ? {
          id: row.property.id,
          title: row.property.title,
          location: row.property.location ?? "",
          property_type: row.property.property_type,
          images,
        }
      : undefined,
  }
}

const WITH_PROPERTY = `
  *,
  property:properties (*, property_images (image_url, is_primary))
` as const

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createBooking(
  input: BookingInput,
  userId: string
): Promise<Booking> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      property_id: input.property_id,
      user_id: userId,
      guest_name: input.guest_name,
      guest_email: input.guest_email,
      guest_phone: input.guest_phone ?? null,
      message: input.message ?? null,
      check_in: input.check_in,
      check_out: input.check_out,
      guests: input.guests,
      nights: 0,       // DB trigger recalculates
      total_price: 0,  // DB trigger recalculates
      status: "pending",
    })
    .select(WITH_PROPERTY)
    .single()

  if (error) throw new Error(error.message)
  return toBooking(data)
}

// ─── User queries ─────────────────────────────────────────────────────────────

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("bookings")
    .select(WITH_PROPERTY)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(toBooking)
}

// ─── Admin queries ────────────────────────────────────────────────────────────

export async function getAllBookingsForAdmin(): Promise<Booking[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("bookings")
    .select(WITH_PROPERTY)
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(toBooking)
}

// Alias for backwards compat
export const getAllBookings = getAllBookingsForAdmin

export async function getBookingById(id: string): Promise<Booking | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("bookings")
    .select(WITH_PROPERTY)
    .eq("id", id)
    .single()
  if (error) return null
  return toBooking(data)
}

// ─── Status updates ───────────────────────────────────────────────────────────

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  const supabase = createAdminClient()
  // Update only — don't chain .select() with joins after .update() as
  // PostgREST can fail to resolve nested relations in that context.
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
  if (error) throw new Error(error.message)

  // Re-fetch separately so relations (property, property_images) are included
  const booking = await getBookingById(id)
  if (!booking) throw new Error("Booking not found after update")
  return booking
}

export async function confirmBooking(id: string): Promise<Booking> {
  return updateBookingStatus(id, "confirmed")
}

export async function rejectBooking(id: string): Promise<Booking> {
  return updateBookingStatus(id, "rejected")
}

export async function cancelBooking(
  id: string,
  userId: string
): Promise<void> {
  // Users may only cancel their own pending bookings
  const supabase = await createClient()
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", id)
    .eq("user_id", userId)
    .eq("status", "pending")
  if (error) throw new Error(error.message)
}

export async function recordPaymentCheckoutAttempt(
  bookingId: string,
  sessionId: string
): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from("bookings")
    .update({
      stripe_checkout_session_id: sessionId,
      payment_status: "checkout_started",
    })
    .eq("id", bookingId)

  if (error) {
    logger.warn("Payment checkout metadata was not stored", {
      bookingId,
      reason: error.message,
    })
  }
}

export async function markBookingPaid(
  bookingId: string,
  sessionId: string
): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from("bookings")
    .update({
      payment_status: "paid",
      stripe_checkout_session_id: sessionId,
    })
    .eq("id", bookingId)

  if (error) throw new Error(error.message)
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export async function getAdminStats() {
  const supabase = createAdminClient()
  const [
    { count: totalProperties },
    { count: totalBookings },
    { count: pendingBookings },
    { data: revenueRows },
  ] = await Promise.all([
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("bookings").select("total_price").eq("status", "confirmed"),
  ])

  const totalRevenue = (revenueRows ?? []).reduce(
    (sum, b) => sum + Number(b.total_price),
    0
  )

  return {
    totalProperties: totalProperties ?? 0,
    totalBookings: totalBookings ?? 0,
    pendingBookings: pendingBookings ?? 0,
    totalRevenue,
  }
}
