import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, CalendarDays, Download, Home, MapPin } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getBookingById } from "@/services/booking.service"
import { ROUTES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"

interface SuccessPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ session_id?: string }>
}

export const metadata = { title: "Payment Complete - Coastal Horizon" }

export default async function PaymentSuccessPage({ params, searchParams }: SuccessPageProps) {
  const user = await getCurrentUser()
  if (!user) redirect(`${ROUTES.LOGIN}?redirectTo=${ROUTES.USER_BOOKINGS}`)

  const { id } = await params
  const { session_id } = await searchParams
  const booking = await getBookingById(id)
  if (!booking) notFound()
  if (booking.user_id !== user.id) redirect(ROUTES.USER_BOOKINGS)

  return (
    <div className="min-h-screen bg-[#f9f9ff] px-4 py-12 sm:px-6">
      <main className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-900/5">
        <div className="relative bg-[#080d1a] px-6 py-10 text-center text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(40,190,120,0.25),_transparent_35%)]" />
          <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/30">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="relative font-display text-3xl font-bold">Payment complete</h1>
          <p className="relative mx-auto mt-2 max-w-xl text-sm leading-6 text-white/55">
            Your confirmed stay is ready. We have attached the Stripe session to this checkout return.
          </p>
        </div>

        <section className="p-6 sm:p-8">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Home className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-xl font-bold text-gray-900">
                  {booking.property?.title ?? "Vacation home"}
                </h2>
                {booking.property?.location && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {booking.property.location}
                  </p>
                )}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Dates</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(booking.total_price)}</p>
                  </div>
                  <div className="rounded-xl bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Status</p>
                    <p className="mt-1 text-sm font-semibold capitalize text-emerald-700">{booking.status}</p>
                  </div>
                </div>
                {session_id && (
                  <p className="mt-4 break-all rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-gray-400">
                    Stripe session: {session_id}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={ROUTES.USER_BOOKINGS} className="flex-1">
              <Button className="h-11 w-full rounded-full">View my bookings</Button>
            </Link>
            <Link href={ROUTES.USER_DASHBOARD} className="flex-1">
              <Button variant="outline" className="h-11 w-full rounded-full gap-2">
                <CalendarDays className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" className="h-11 rounded-full gap-2 text-gray-500" disabled>
              <Download className="h-4 w-4" />
              Receipt soon
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
