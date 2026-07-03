import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { markBookingPaid } from "@/services/booking.service"
import { logger } from "@/lib/logger"

// Manual HMAC-SHA256 verification — no Stripe SDK needed.
// Stripe signs: HMAC-SHA256(secret, "<timestamp>.<raw_body>")
function verifyStripeSignature(
  rawBody: string,
  sigHeader: string,
  secret: string
): boolean {
  const timestamp = sigHeader.split(",").find((p) => p.startsWith("t="))?.slice(2)
  const v1 = sigHeader.split(",").find((p) => p.startsWith("v1="))?.slice(3)
  if (!timestamp || !v1) return false

  // Reject replays older than 5 minutes
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp, 10)) > 300) return false

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex")

  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(v1, "hex"))
  } catch {
    return false
  }
}

// Next.js must not parse this body — we need the raw bytes for signature verification.
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    logger.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  const rawBody = await request.text()
  const sigHeader = request.headers.get("stripe-signature") ?? ""

  if (!verifyStripeSignature(rawBody, sigHeader, secret)) {
    logger.warn("[stripe-webhook] Signature verification failed")
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  let event: { type: string; data: { object: Record<string, unknown> } }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const bookingId =
      typeof session.client_reference_id === "string" ? session.client_reference_id : null
    const sessionId = typeof session.id === "string" ? session.id : null

    if (!bookingId) {
      logger.warn("[stripe-webhook] checkout.session.completed has no client_reference_id", {
        sessionId,
      })
      return NextResponse.json({ received: true })
    }

    try {
      await markBookingPaid(bookingId, sessionId ?? "")
      logger.info("[stripe-webhook] Booking marked as paid", { bookingId, sessionId })
    } catch (e) {
      logger.error("[stripe-webhook] Failed to mark booking paid", {
        bookingId,
        error: String(e),
      })
      return NextResponse.json({ error: "DB update failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
