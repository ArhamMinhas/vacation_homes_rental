import { redirect } from "next/navigation"
import Link from "next/link"
import { Bell, CheckCircle2, CreditCard, Sparkles } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getUserBookings } from "@/services/booking.service"
import { getUserNotifications } from "@/services/notification.service"
import { ROUTES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/formatDate"
import type { Notification } from "@/types/notification"

export const metadata = { title: "Notifications - Coastal Horizon" }

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect(`${ROUTES.LOGIN}?redirectTo=${ROUTES.USER_NOTIFICATIONS}`)

  const [stored, bookings] = await Promise.all([
    getUserNotifications(user.id),
    getUserBookings(user.id),
  ])

  const storedBookingIds = new Set(stored.map((n) => n.booking_id).filter(Boolean))
  const inferred: Notification[] = bookings
    .filter((booking) => booking.status === "confirmed" && !storedBookingIds.has(booking.id))
    .map((booking) => ({
      id: `booking-${booking.id}`,
      user_id: user.id,
      booking_id: booking.id,
      type: "booking_confirmed",
      title: "Your booking is confirmed",
      message: `${booking.property?.title ?? "Your stay"} is confirmed for ${formatDate(booking.check_in)} to ${formatDate(booking.check_out)}. Complete payment to secure the reservation.`,
      action_url: ROUTES.BOOKING_PAYMENT(booking.id),
      read_at: null,
      created_at: booking.updated_at ?? booking.created_at,
    }))

  const notifications = [...stored, ...inferred].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="min-h-screen bg-[#f9f9ff]">
      <section className="relative overflow-hidden bg-[#080d1a]">
        <div className="absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-primary/15 blur-[100px]" />
        <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
            <Bell className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Guest updates</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">Notifications</h1>
          <p className="mt-2 text-sm text-white/45">
            Booking confirmations and payment reminders from Coastal Horizon.
          </p>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#f9f9ff] to-transparent" />
      </section>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-gray-300" />
            <h2 className="font-display text-xl font-bold text-gray-900">No notifications yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              When an admin confirms one of your bookings, the update will appear here.
            </p>
            <Link href={ROUTES.PROPERTIES} className="mt-5 inline-flex">
              <Button>Explore homes</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const isConfirmation = notification.type === "booking_confirmed"
              return (
                <article
                  key={notification.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        {isConfirmation ? <CheckCircle2 className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{notification.title}</p>
                        <p className="mt-1 text-sm leading-6 text-gray-500">{notification.message}</p>
                        <p className="mt-2 text-xs text-gray-400">{formatDate(notification.created_at)}</p>
                      </div>
                    </div>
                    {notification.action_url && (
                      <Link href={notification.action_url} className="sm:flex-shrink-0">
                        <Button size="sm" className="w-full rounded-full gap-2 sm:w-auto">
                          <CreditCard className="h-4 w-4" />
                          Pay now
                        </Button>
                      </Link>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
