import { describe, it, expect } from "vitest"
import { calculatePrice } from "@/utils/calculatePrice"

describe("calculatePrice", () => {
  it("returns correct subtotal, total, and nights", () => {
    const result = calculatePrice(100, 5, 50)
    expect(result).toEqual({ subtotal: 500, cleaningFee: 50, total: 550, nights: 5 })
  })

  it("handles zero cleaning fee", () => {
    const result = calculatePrice(200, 3, 0)
    expect(result.total).toBe(600)
    expect(result.subtotal).toBe(600)
  })

  it("handles fractional price per night", () => {
    const result = calculatePrice(99.99, 2, 30)
    expect(result.subtotal).toBeCloseTo(199.98)
    expect(result.total).toBeCloseTo(229.98)
  })

  it("passes nights through unchanged", () => {
    const result = calculatePrice(100, 10, 50)
    expect(result.nights).toBe(10)
  })
})
