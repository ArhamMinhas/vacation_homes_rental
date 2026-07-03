import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, RotateCcw, ShieldCheck } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getBookingById } from "@/services/booking.service"
import { ROUTES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import PaymentCheckoutButton from "@/components/booking/PaymentCheckoutButton"
import { formatCurrency } from "@/utils/formatCurrency"

interface CancelPageProps {
  params: Promise<{ id: string }>
}

export const metadata = { title: "Payment Canceled - Coastal Horizon" }

export default async function PaymentCancelPage({ params }: CancelPageProps) {
  const user = await getCurrentUser()
  if (!user) redirect(`${ROUTES.LOGIN}?redirectTo=${ROUTES.USER_BOOKINGS}`)

  const { id } = await params
  const booking = await getBookingById(id)
  if (!booking) notFound()
  if (booking.user_id !== user.id) redirect(ROUTES.USER_BOOKINGS)

  return (
    <div className="min-h-screen bg-[#f9f9ff] px-4 py-12 sm:px-6">
      <main className="mx-auto max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-xl shadow-gray-900/5 sm:p-8">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200">
          <RotateCcw className="h-8 w-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Checkout paused</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-gray-900">Payment was not completed</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
          No charge was made. Your booking is still confirmed, so you can safely return to Stripe whenever you are ready.
        </p>

        <div className="my-7 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900">{booking.property?.title ?? "Vacation home"}</h2>
              <p className="mt-1 text-sm text-gray-500">{booking.nights} night stay</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Due</p>
              <p className="font-bold text-gray-900">{formatCurrency(booking.total_price)}</p>
            </div>
          </div>
        </div>

        <PaymentCheckoutButton bookingId={booking.id} label="Try payment again" />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href={ROUTES.USER_BOOKINGS} className="flex-1">
            <Button variant="outline" className="h-11 w-full rounded-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to bookings
            </Button>
          </Link>
          <div className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 text-xs font-medium text-gray-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <CreditCard className="h-4 w-4 text-primary" />
            Stripe protected
          </div>
        </div>
      </main>
    </div>
  )
}
