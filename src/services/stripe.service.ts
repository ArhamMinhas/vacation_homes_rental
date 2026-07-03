import { APP_NAME } from "@/lib/constants"
import type { Booking } from "@/types/booking"

export interface StripeCheckoutSession {
  id: string
  url: string
}

export async function createBookingCheckoutSession(
  booking: Booking
): Promise<StripeCheckoutSession> {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.")
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const propertyTitle = booking.property?.title ?? "Vacation home reservation"
  const amount = Math.max(50, Math.round(booking.total_price * 100))

  const body = new URLSearchParams()
  body.set("mode", "payment")
  body.set("success_url", `${appUrl}/bookings/${booking.id}/payment/success?session_id={CHECKOUT_SESSION_ID}`)
  body.set("cancel_url", `${appUrl}/bookings/${booking.id}/payment/cancel`)
  body.set("customer_email", booking.guest_email)
  body.set("client_reference_id", booking.id)
  body.set("metadata[booking_id]", booking.id)
  body.set("metadata[property_id]", booking.property_id)
  body.set("metadata[user_id]", booking.user_id ?? "")
  body.set("line_items[0][quantity]", "1")
  body.set("line_items[0][price_data][currency]", "usd")
  body.set("line_items[0][price_data][unit_amount]", String(amount))
  body.set("line_items[0][price_data][product_data][name]", `${APP_NAME}: ${propertyTitle}`)
  body.set(
    "line_items[0][price_data][product_data][description]",
    `${booking.nights} night${booking.nights === 1 ? "" : "s"} for ${booking.guests} guest${booking.guests === 1 ? "" : "s"}`
  )
  body.set(
    "custom_text[submit][message]",
    "Your card will be charged by Stripe. Your reservation is already confirmed by the host."
  )

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  const data = await response.json()
  if (!response.ok) {
    const message =
      typeof data?.error?.message === "string"
        ? data.error.message
        : "Stripe could not create a Checkout Session."
    throw new Error(message)
  }

  if (typeof data?.id !== "string" || typeof data?.url !== "string") {
    throw new Error("Stripe returned an invalid Checkout Session response.")
  }

  return { id: data.id, url: data.url }
}
