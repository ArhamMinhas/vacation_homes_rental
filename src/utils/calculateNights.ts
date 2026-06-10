export function calculateNights(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn).getTime()
  const b = new Date(checkOut).getTime()
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}
