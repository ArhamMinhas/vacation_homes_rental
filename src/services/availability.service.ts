import { createAdminClient } from "@/lib/supabase/server"
import { formatDate } from "@/utils/formatDate"

export interface DateRange {
  start: string
  end: string
}

export interface AvailabilityResult {
  available: boolean
  reason?: string
}

// ─── Overlap helper ───────────────────────────────────────────────────────────

/**
 * Returns true if two [start, end) date ranges overlap.
 * Checkout date is NOT occupied — [check_in, check_out) logic.
 *
 * Overlap condition: existing_start < requested_end AND existing_end > requested_start
 */
function rangesOverlap(
  existingStart: string,
  existingEnd: string,
  requestedStart: string,
  requestedEnd: string
): boolean {
  return existingStart < requestedEnd && existingEnd > requestedStart
}

// ─── Availability check ───────────────────────────────────────────────────────

/**
 * Comprehensive availability check for a property + date range.
 * Returns { available: true } or { available: false, reason: "..." }.
 */
export async function checkPropertyAvailability(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  guests: number
): Promise<AvailabilityResult> {
  const supabase = createAdminClient()
  const today = new Date().toISOString().split("T")[0]

  // 1 — Past dates
  if (checkIn < today) {
    return { available: false, reason: "Check-in date cannot be in the past" }
  }

  // 2 — Date order
  if (checkOut <= checkIn) {
    return { available: false, reason: "Check-out must be after check-in" }
  }

  // 3 — Property exists and is active
  const { data: property, error: propError } = await supabase
    .from("properties")
    .select("id, is_active, max_guests")
    .eq("id", propertyId)
    .single()

  if (propError || !property) {
    return { available: false, reason: "Property not found" }
  }

  if (!property.is_active) {
    return { available: false, reason: "Property is not available for booking" }
  }

  // 4 — Guest count
  if (guests > property.max_guests) {
    return {
      available: false,
      reason: `Maximum ${property.max_guests} guests allowed`,
    }
  }

  // 5 — Blocked date overlap
  const hasBlockedOverlap = await checkBlockedDateOverlap(
    propertyId,
    checkIn,
    checkOut
  )
  if (hasBlockedOverlap) {
    return {
      available: false,
      reason: "The host has blocked one or more of your selected dates. Please choose different dates.",
    }
  }

  // 6 — Confirmed booking overlap
  const conflicting = await getConflictingBooking(propertyId, checkIn, checkOut)
  if (conflicting) {
    return {
      available: false,
      reason: `These dates overlap with a confirmed reservation (${formatDate(conflicting.check_in)} – ${formatDate(conflicting.check_out)}). Please select dates that don't overlap with that period.`,
    }
  }

  return { available: true }
}

// ─── Overlap sub-checks ───────────────────────────────────────────────────────

export async function getConflictingBooking(
  propertyId: string,
  checkIn: string,
  checkOut: string
): Promise<{ check_in: string; check_out: string } | null> {
  const supabase = createAdminClient()
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, check_in, check_out")
    .eq("property_id", propertyId)
    .eq("status", "confirmed")

  if (!bookings) return null
  return bookings.find((b) => rangesOverlap(b.check_in, b.check_out, checkIn, checkOut)) ?? null
}

export async function checkConfirmedBookingOverlap(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  excludeBookingId?: string
): Promise<boolean> {
  const supabase = createAdminClient()
  let query = supabase
    .from("bookings")
    .select("id, check_in, check_out")
    .eq("property_id", propertyId)
    .eq("status", "confirmed")

  if (excludeBookingId) {
    query = query.neq("id", excludeBookingId)
  }

  const { data: bookings } = await query
  if (!bookings) return false

  return bookings.some((b) =>
    rangesOverlap(b.check_in, b.check_out, checkIn, checkOut)
  )
}

export async function checkBlockedDateOverlap(
  propertyId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  const supabase = createAdminClient()
  const { data: blocked } = await supabase
    .from("blocked_dates")
    .select("start_date, end_date")
    .eq("property_id", propertyId)

  if (!blocked) return false

  return blocked.some((b) =>
    rangesOverlap(b.start_date, b.end_date, checkIn, checkOut)
  )
}

// ─── Unavailable date ranges for date picker ──────────────────────────────────

export async function getUnavailableDates(
  propertyId: string
): Promise<DateRange[]> {
  const supabase = createAdminClient()

  const [{ data: bookings }, { data: blocked }] = await Promise.all([
    supabase
      .from("bookings")
      .select("check_in, check_out")
      .eq("property_id", propertyId)
      .eq("status", "confirmed"),
    supabase
      .from("blocked_dates")
      .select("start_date, end_date")
      .eq("property_id", propertyId),
  ])

  const ranges: DateRange[] = []
  for (const b of bookings ?? [])
    ranges.push({ start: b.check_in, end: b.check_out })
  for (const bd of blocked ?? [])
    ranges.push({ start: bd.start_date, end: bd.end_date })

  return ranges
}
