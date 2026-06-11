import { describe, it, expect } from "vitest"
import { bookingSchema } from "@/validations/booking.schema"

// Use dates far in the future so the "past date" refine never triggers
// regardless of when the tests are run.
const FUTURE_IN  = "2030-07-01"
const FUTURE_OUT = "2030-07-08"
// A well-formed UUID v4 (version=4, variant=a)
const UUID = "550e8400-e29b-41d4-a716-446655440000"

const valid = {
  property_id:  UUID,
  guest_name:   "Alice Smith",
  guest_email:  "alice@example.com",
  check_in:     FUTURE_IN,
  check_out:    FUTURE_OUT,
  guests:       2,
}

describe("bookingSchema — valid input", () => {
  it("accepts a complete valid booking", () => {
    const result = bookingSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it("accepts optional fields missing (phone, message)", () => {
    const result = bookingSchema.safeParse({ ...valid, guest_phone: undefined, message: undefined })
    expect(result.success).toBe(true)
  })

  it("coerces guests from string to number", () => {
    const result = bookingSchema.safeParse({ ...valid, guests: "3" })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.guests).toBe(3)
  })

  it("accepts a message within 500 characters", () => {
    const result = bookingSchema.safeParse({ ...valid, message: "Short note" })
    expect(result.success).toBe(true)
  })
})

describe("bookingSchema — invalid input", () => {
  it("rejects an invalid UUID for property_id", () => {
    const result = bookingSchema.safeParse({ ...valid, property_id: "not-a-uuid" })
    expect(result.success).toBe(false)
  })

  it("rejects a guest_name shorter than 2 characters", () => {
    const result = bookingSchema.safeParse({ ...valid, guest_name: "A" })
    expect(result.success).toBe(false)
  })

  it("rejects a malformed email", () => {
    const result = bookingSchema.safeParse({ ...valid, guest_email: "not-an-email" })
    expect(result.success).toBe(false)
  })

  it("rejects zero guests", () => {
    const result = bookingSchema.safeParse({ ...valid, guests: 0 })
    expect(result.success).toBe(false)
  })

  it("rejects checkout before check-in", () => {
    const result = bookingSchema.safeParse({ ...valid, check_in: FUTURE_OUT, check_out: FUTURE_IN })
    expect(result.success).toBe(false)
  })

  it("rejects checkout equal to check-in", () => {
    const result = bookingSchema.safeParse({ ...valid, check_in: FUTURE_IN, check_out: FUTURE_IN })
    expect(result.success).toBe(false)
  })

  it("rejects check-in in the past", () => {
    const result = bookingSchema.safeParse({ ...valid, check_in: "2020-01-01", check_out: "2020-01-07" })
    expect(result.success).toBe(false)
  })

  it("rejects a message longer than 500 characters", () => {
    const result = bookingSchema.safeParse({ ...valid, message: "x".repeat(501) })
    expect(result.success).toBe(false)
  })
})
