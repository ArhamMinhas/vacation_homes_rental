import { redirect } from "next/navigation"
import { CalendarX } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { getUserBookings } from "@/services/booking.service"
import { ROUTES } from "@/lib/constants"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import EmptyState from "@/components/common/EmptyState"
import BackButton from "@/components/common/BackButton"
import type { BookingStatus } from "@/types/booking"
import type { Metadata } from "next"
import CancelBookingButton from "./CancelBookingButton"

export const metadata: Metadata = { title: "My Bookings — StayFinder" }

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700 border border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  cancelled: "bg-muted text-muted-foreground border border-border",
  rejected: "bg-red-100 text-red-700 border border-red-200",
}

export default async function UserBookingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect(`${ROUTES.LOGIN}?redirectTo=${ROUTES.USER_BOOKINGS}`)

  const bookings = await getUserBookings(user.id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in-up">
      <div className="mb-6 flex items-center gap-3">
        <BackButton />
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
          <p className="text-sm text-muted-foreground">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarX className="h-6 w-6" />}
          title="No bookings yet"
          description="Find a property and book your next stay."
          action={
            <Link href={ROUTES.PROPERTIES}>
              <Button>Browse properties</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/20 transition-colors"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-5">
                {/* Property image */}
                {booking.property?.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={booking.property.images[0]}
                    alt={booking.property.title}
                    className="h-24 w-full sm:w-32 object-cover rounded-xl flex-shrink-0"
                  />
                ) : (
                  <div className="h-24 w-full sm:w-32 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                    🏡
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {booking.property?.title ?? "Property"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.property?.location}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[booking.status]}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Check-in: </span>
                      <span className="font-medium text-foreground">{formatDate(booking.check_in)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Check-out: </span>
                      <span className="font-medium text-foreground">{formatDate(booking.check_out)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Guests: </span>
                      <span className="font-medium text-foreground">{booking.guests}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-sm text-muted-foreground">{booking.nights} nights · </span>
                      <span className="font-semibold text-foreground">{formatCurrency(booking.total_price)}</span>
                    </div>
                    <div className="flex gap-2">
                      {booking.property && (
                        <Link href={ROUTES.PROPERTY_DETAIL(booking.property_id)}>
                          <Button variant="outline" size="sm">View property</Button>
                        </Link>
                      )}
                      {booking.status === "pending" && (
                        <CancelBookingButton bookingId={booking.id} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
