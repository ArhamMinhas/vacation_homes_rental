export function calculatePrice(
  pricePerNight: number,
  nights: number,
  cleaningFee: number
) {
  const subtotal = pricePerNight * nights
  const total = subtotal + cleaningFee
  return { subtotal, cleaningFee, total, nights }
}
