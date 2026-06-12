import { createAdminClient } from "@/lib/supabase/server"
import { formatDate } from "@/utils/formatDate"

export interface DateRange {
  start: string
  end: string
  type?: "booking" | "blocked"
}

export interface AvailabilityResult {
  available: boolean
  reason?: string
  conflictType?: "booking" | "blocked"
}

// ─── Overlap helpers ──────────────────────────────────────────────────────────

/** Add one day to a YYYY-MM-DD string (UTC-safe). */
function addOneDay(dateStr: string): string {
  const d = new Date(dateStr)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().split("T")[0]
}

/**
 * Returns true if two [start, end) half-open ranges overlap.
 * Both checkout and booking.end are exclusive (the day the guest leaves).
 */
function rangesOverlap(
  existingStart: string,
  existingEnd: string,   // exclusive
  requestedStart: string,
  requestedEnd: string   // exclusive
): boolean {
  return existingStart < requestedEnd && existingEnd > requestedStart
}

/**
 * Returns true if a blocked period [blockedStart, blockedEnd] (INCLUSIVE end)
 * overlaps with a booking [checkIn, checkOut) (EXCLUSIVE checkout).
 *
 * We normalise the inclusive end to exclusive by adding one day so we can
 * reuse the same rangesOverlap logic as confirmed bookings.
 */
function blockedOverlaps(
  blockedStart: string,
  blockedEnd: string,  // INCLUSIVE — admin enters last blocked day
  checkIn: string,
  checkOut: string     // exclusive
): boolean {
  return rangesOverlap(blockedStart, addOneDay(blockedEnd), checkIn, checkOut)
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
      conflictType: "blocked",
      reason: "The host has blocked one or more of your selected dates for maintenance or personal use.",
    }
  }

  // 6 — Confirmed booking overlap
  const conflicting = await getConflictingBooking(propertyId, checkIn, checkOut)
  if (conflicting) {
    return {
      available: false,
      conflictType: "booking",
      reason: `These dates overlap with a confirmed guest reservation (${formatDate(conflicting.check_in)} – ${formatDate(conflicting.check_out)}).`,
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

  // end_date is INCLUSIVE (admin's last blocked day) — use blockedOverlaps
  return blocked.some((b) => blockedOverlaps(b.start_date, b.end_date, checkIn, checkOut))
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
    ranges.push({ start: b.check_in, end: b.check_out, type: "booking" })
  for (const bd of blocked ?? [])
    // Normalize inclusive end_date → exclusive so client findConflict works uniformly
    ranges.push({ start: bd.start_date, end: addOneDay(bd.end_date), type: "blocked" })

  return ranges
}
