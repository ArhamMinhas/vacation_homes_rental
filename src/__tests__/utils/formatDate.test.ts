import { describe, it, expect } from "vitest"
import { formatDate, formatDateShort, formatDateRange, toInputDate } from "@/utils/formatDate"

describe("formatDate", () => {
  it("formats a date string to readable format", () => {
    // We check the structure rather than the exact string because locale can vary by runtime
    const result = formatDate("2026-06-15")
    expect(result).toContain("2026")
    expect(result).toMatch(/Jun/)
    expect(result).toContain("15")
  })

  it("includes the year", () => {
    expect(formatDate("2026-01-01")).toContain("2026")
  })
})

describe("formatDateShort", () => {
  it("omits the year", () => {
    const result = formatDateShort("2026-06-15")
    expect(result).not.toContain("2026")
    expect(result).toMatch(/Jun/)
    expect(result).toContain("15")
  })
})

describe("formatDateRange", () => {
  it("formats a date range with a dash", () => {
    const result = formatDateRange("2026-06-10", "2026-06-15")
    expect(result).toContain("–")
    expect(result).toMatch(/Jun/)
  })
})

describe("toInputDate", () => {
  it("returns ISO date string YYYY-MM-DD", () => {
    const date = new Date("2026-06-15T12:00:00.000Z")
    const result = toInputDate(date)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it("returns correct date string", () => {
    // Use a UTC midnight date to avoid timezone issues
    const date = new Date("2026-06-15T00:00:00.000Z")
    const result = toInputDate(date)
    expect(result.startsWith("2026-06-")).toBe(true)
  })
})
