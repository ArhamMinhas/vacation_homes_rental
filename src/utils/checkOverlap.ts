// [checkIn, checkOut) — checkout is allowed as another booking's check-in
export function datesOverlap(
  aIn: string,
  aOut: string,
  bIn: string,
  bOut: string
): boolean {
  return aIn < bOut && aOut > bIn
}
