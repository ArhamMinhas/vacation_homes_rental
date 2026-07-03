import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import {
  BadgeCheck, CalendarDays, ChevronLeft, CreditCard, LockKeyhole,
  MapPin, Moon, ReceiptText, ShieldCheck, Sparkles, Users,
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getBookingById } from "@/services/booking.service"
import { ROUTES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import PaymentCheckoutButton from "@/components/booking/PaymentCheckoutButton"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"

interface PaymentPageProps {
  params: Promise<{ id: string }>
}

export const metadata = { title: "Complete Payment - Coastal Horizon" }

export default async function BookingPaymentPage({ params }: PaymentPageProps) {
  const user = await getCurrentUser()
  if (!user) redirect(`${ROUTES.LOGIN}?redirectTo=${ROUTES.USER_BOOKINGS}`)

  const { id } = await params
  const booking = await getBookingById(id)
  if (!booking) notFound()
  if (booking.user_id !== user.id) redirect(ROUTES.USER_BOOKINGS)

  const isConfirmed = booking.status === "confirmed"
  const stayLabel = `${formatDate(booking.check_in)} - ${formatDate(booking.check_out)}`
  const nightlyEstimate = booking.nights > 0
    ? Math.max(0, booking.total_price / booking.nights)
    : booking.total_price

  return (
    <div className="min-h-screen bg-[#f9f9ff]">
      <section className="relative overflow-hidden bg-[#080d1a]">
        {booking.property?.images?.[0] && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={booking.property.images[0]}
              alt={booking.property.title}
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a] via-[#080d1a]/88 to-[#080d1a]/45" />
          </>
        )}
        <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-primary/15 blur-[100px]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href={ROUTES.USER_BOOKINGS}>
            <Button variant="ghost" size="sm" className="mb-6 gap-1.5 text-white/60 hover:bg-white/10 hover:text-white">
              <ChevronLeft className="h-4 w-4" />
              My bookings
            </Button>
          </Link>
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-200">
              <BadgeCheck className="h-3.5 w-3.5" />
              Host confirmed
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Complete your secure payment
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
              Your reservation is approved. Review the stay details, then continue to Stripe to finish payment.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#f9f9ff] to-transparent" />
      </section>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="h-44 overflow-hidden rounded-2xl bg-gray-100 sm:w-56 sm:flex-shrink-0">
                {booking.property?.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={booking.property.images[0]}
                    alt={booking.property.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <Sparkles className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Reservation</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-gray-900">
                  {booking.property?.title ?? "Vacation home"}
                </h2>
                {booking.property?.location && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{booking.property.location}</span>
                  </div>
                )}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { icon: CalendarDays, label: "Dates", value: stayLabel },
                    { icon: Users, label: "Guests", value: `${booking.guests} guest${booking.guests === 1 ? "" : "s"}` },
                    { icon: Moon, label: "Stay", value: `${booking.nights} night${booking.nights === 1 ? "" : "s"}` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Protected booking", text: "Confirmation stays attached to your account." },
              { icon: LockKeyhole, title: "Encrypted payment", text: "Card details are handled by Stripe." },
              { icon: ReceiptText, title: "Clear receipt", text: "Stripe returns you here after checkout." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-gray-500">{text}</p>
              </div>
            ))}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-900/5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Amount due</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(booking.total_price)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-3 border-y border-gray-100 py-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Nightly average</span>
                <span className="font-semibold text-gray-900">{formatCurrency(nightlyEstimate)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Nights</span>
                <span className="font-semibold text-gray-900">{booking.nights}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Reservation status</span>
                <span className="font-semibold capitalize text-emerald-700">{booking.status}</span>
              </div>
            </div>

            {isConfirmed ? (
              <PaymentCheckoutButton bookingId={booking.id} className="mt-5" />
            ) : (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Payment opens after the admin confirms your booking.
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}
