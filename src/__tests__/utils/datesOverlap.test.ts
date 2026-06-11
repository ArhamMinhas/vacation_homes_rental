import { describe, it, expect } from "vitest"
import { datesOverlap } from "@/utils/checkOverlap"

// The core booking logic: [checkIn, checkOut) — checkout day is free for new check-in.
// Overlap condition: aIn < bOut AND aOut > bIn

describe("datesOverlap", () => {
  // ── Non-overlapping ────────────────────────────────────────────────────────

  it("returns false when range A ends before range B starts", () => {
    expect(datesOverlap("2026-06-01", "2026-06-05", "2026-06-05", "2026-06-10")).toBe(false)
  })

  it("returns false when range B ends before range A starts", () => {
    expect(datesOverlap("2026-06-10", "2026-06-15", "2026-06-01", "2026-06-10")).toBe(false)
  })

  it("returns false when ranges are completely separate", () => {
    expect(datesOverlap("2026-06-01", "2026-06-05", "2026-06-08", "2026-06-12")).toBe(false)
  })

  // ── Overlapping ────────────────────────────────────────────────────────────

  it("returns true when ranges overlap in the middle", () => {
    // Jun 10–15 booked; user requests Jun 12–18 — overlap Jun 12–15
    expect(datesOverlap("2026-06-12", "2026-06-18", "2026-06-10", "2026-06-15")).toBe(true)
  })

  it("returns true when requested range is fully inside existing booking", () => {
    // Existing Jun 10–20; request Jun 12–14 — fully inside
    expect(datesOverlap("2026-06-12", "2026-06-14", "2026-06-10", "2026-06-20")).toBe(true)
  })

  it("returns true when requested range fully contains existing booking", () => {
    expect(datesOverlap("2026-06-08", "2026-06-22", "2026-06-10", "2026-06-20")).toBe(true)
  })

  it("returns true when ranges share only start/end overlap", () => {
    // Existing Jun 10–15; request Jun 14–18 — one-night overlap on Jun 14
    expect(datesOverlap("2026-06-14", "2026-06-18", "2026-06-10", "2026-06-15")).toBe(true)
  })

  // ── Checkout/check-in boundary (half-open interval) ────────────────────────

  it("allows check-in on the exact checkout day of another booking", () => {
    // Existing Jun 10–15; new booking starts Jun 15 — should be ALLOWED
    expect(datesOverlap("2026-06-15", "2026-06-20", "2026-06-10", "2026-06-15")).toBe(false)
  })

  it("allows booking that ends exactly when another begins", () => {
    // New booking Jun 5–10; existing Jun 10–15 — should be ALLOWED
    expect(datesOverlap("2026-06-05", "2026-06-10", "2026-06-10", "2026-06-15")).toBe(false)
  })

  // ── Requirement from spec ──────────────────────────────────────────────────

  it("spec example: Jun 10–15 booked, Jun 12–14 requested — BLOCKED", () => {
    expect(datesOverlap("2026-06-12", "2026-06-14", "2026-06-10", "2026-06-15")).toBe(true)
  })

  it("spec example: Jun 10–15 booked, Jun 14–18 requested — BLOCKED", () => {
    expect(datesOverlap("2026-06-14", "2026-06-18", "2026-06-10", "2026-06-15")).toBe(true)
  })

  it("spec example: Jun 10–15 booked, Jun 15–18 requested — ALLOWED (checkout day free)", () => {
    expect(datesOverlap("2026-06-15", "2026-06-18", "2026-06-10", "2026-06-15")).toBe(false)
  })
})
