import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock Supabase before importing the service
vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: vi.fn(),
}))

vi.mock("@/utils/formatDate", () => ({
  formatDate: (d: string) => d,
}))

import { createAdminClient } from "@/lib/supabase/server"
import {
  checkConfirmedBookingOverlap,
  getConflictingBooking,
} from "@/services/availability.service"

// ─── Helper ───────────────────────────────────────────────────────────────────
// Creates a Supabase-like query builder that is also a Promise.
// Any chain of .select().eq().eq() or .select().eq().eq().neq() can be awaited.

type BookingRow = { id: string; check_in: string; check_out: string }

function makeClient(rows: BookingRow[]) {
  const thenable = {
    then:   (res: (v: { data: BookingRow[]; error: null }) => unknown) =>
              Promise.resolve({ data: rows, error: null }).then(res),
    catch:  (rej: (e: unknown) => unknown) =>
              Promise.resolve({ data: rows, error: null }).catch(rej),
    finally:(fn: () => unknown) =>
              Promise.resolve({ data: rows, error: null }).finally(fn),
  }

  const chain = {
    select: () => chain,
    eq:     () => chain,
    neq:    () => thenable,
    ...thenable,           // <— awaitable even without .neq()
  }

  return { from: () => chain }
}

// ─── checkConfirmedBookingOverlap ─────────────────────────────────────────────

describe("checkConfirmedBookingOverlap", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns false when there are no confirmed bookings", async () => {
    vi.mocked(createAdminClient).mockReturnValue(makeClient([]) as never)
    const result = await checkConfirmedBookingOverlap("p1", "2026-06-20", "2026-06-25")
    expect(result).toBe(false)
  })

  it("returns true when the requested range overlaps a confirmed booking", async () => {
    vi.mocked(createAdminClient).mockReturnValue(
      makeClient([{ id: "b1", check_in: "2026-06-10", check_out: "2026-06-15" }]) as never
    )
    // Jun 12–18 overlaps Jun 10–15
    const result = await checkConfirmedBookingOverlap("p1", "2026-06-12", "2026-06-18")
    expect(result).toBe(true)
  })

  it("returns false when new check-in equals the checkout day (half-open interval)", async () => {
    vi.mocked(createAdminClient).mockReturnValue(
      makeClient([{ id: "b1", check_in: "2026-06-10", check_out: "2026-06-15" }]) as never
    )
    // Jun 15–20 starts exactly when Jun 10–15 ends — ALLOWED
    const result = await checkConfirmedBookingOverlap("p1", "2026-06-15", "2026-06-20")
    expect(result).toBe(false)
  })

  it("returns false when ranges are completely separate", async () => {
    vi.mocked(createAdminClient).mockReturnValue(
      makeClient([{ id: "b1", check_in: "2026-06-01", check_out: "2026-06-05" }]) as never
    )
    const result = await checkConfirmedBookingOverlap("p1", "2026-06-10", "2026-06-15")
    expect(result).toBe(false)
  })
})

// ─── getConflictingBooking ────────────────────────────────────────────────────

describe("getConflictingBooking", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns null when no confirmed bookings exist", async () => {
    vi.mocked(createAdminClient).mockReturnValue(makeClient([]) as never)
    const result = await getConflictingBooking("p1", "2026-06-20", "2026-06-25")
    expect(result).toBeNull()
  })

  it("returns the conflicting booking when overlap exists", async () => {
    vi.mocked(createAdminClient).mockReturnValue(
      makeClient([{ id: "b1", check_in: "2026-06-10", check_out: "2026-06-15" }]) as never
    )
    const result = await getConflictingBooking("p1", "2026-06-12", "2026-06-18")
    expect(result).not.toBeNull()
    expect(result?.check_in).toBe("2026-06-10")
    expect(result?.check_out).toBe("2026-06-15")
  })

  it("returns null when checkout equals new check-in (half-open)", async () => {
    vi.mocked(createAdminClient).mockReturnValue(
      makeClient([{ id: "b1", check_in: "2026-06-10", check_out: "2026-06-15" }]) as never
    )
    const result = await getConflictingBooking("p1", "2026-06-15", "2026-06-20")
    expect(result).toBeNull()
  })
})
