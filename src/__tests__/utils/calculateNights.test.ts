import { describe, it, expect } from "vitest"
import { calculateNights } from "@/utils/calculateNights"

describe("calculateNights", () => {
  it("returns 1 for consecutive days", () => {
    expect(calculateNights("2026-06-10", "2026-06-11")).toBe(1)
  })

  it("returns correct count for a week-long stay", () => {
    expect(calculateNights("2026-06-10", "2026-06-17")).toBe(7)
  })

  it("returns correct count for a month-long stay", () => {
    expect(calculateNights("2026-06-01", "2026-07-01")).toBe(30)
  })

  it("returns 5 for Jun 10–15", () => {
    expect(calculateNights("2026-06-10", "2026-06-15")).toBe(5)
  })

  it("handles cross-month dates", () => {
    expect(calculateNights("2026-01-28", "2026-02-04")).toBe(7)
  })

  it("handles cross-year dates", () => {
    expect(calculateNights("2026-12-28", "2027-01-04")).toBe(7)
  })
})
