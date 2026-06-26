import { redirect } from "next/navigation"
import { CalendarX, MapPin, Users, Clock, CheckCircle2, XCircle, MinusCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { getUserBookings } from "@/services/booking.service"
import { ROUTES } from "@/lib/constants"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { Button } from "@/components/ui/button"
import EmptyState from "@/components/common/EmptyState"
import BackButton from "@/components/common/BackButton"
import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/types/booking"
import type { Metadata } from "next"
import CancelBookingButton from "./CancelBookingButton"

export const metadata: Metadata = { title: "My Bookings — LuxeStay" }

const STATUS_CONFIG: Record<BookingStatus, { label: string; classes: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",   classes: "bg-amber-50 text-amber-700 border border-amber-200",       icon: Clock        },
  confirmed: { label: "Confirmed", classes: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", classes: "bg-muted text-muted-foreground border border-border",       icon: MinusCircle  },
  rejected:  { label: "Rejected",  classes: "bg-red-50 text-red-700 border border-red-200",             icon: XCircle      },
}

export default async function UserBookingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect(`${ROUTES.LOGIN}?redirectTo=${ROUTES.USER_BOOKINGS}`)

  const bookings = await getUserBookings(user.id)

  const confirmed = bookings.filter((b) => b.status === "confirmed").length
  const pending   = bookings.filter((b) => b.status === "pending").length
  const totalSpend = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.total_price, 0)

  return (
    <div className="min-h-screen bg-[#f9f9ff]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in-up">

      {/* Header */}
      <div className="mb-7 flex items-center gap-3">
        <BackButton />
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Stats strip */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-7">
          {[
            { label: "Total",     value: bookings.length,       color: "text-gray-900",    bg: "bg-white border-gray-100 shadow-sm"  },
            { label: "Confirmed", value: confirmed,             color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200"    },
            { label: "Pending",   value: pending,               color: "text-amber-700",   bg: "bg-amber-50 border-amber-200"        },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={cn("rounded-xl border px-4 py-3 text-center", bg)}>
              <p className={cn("text-xl font-bold leading-none", color)}>{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarX className="h-6 w-6" />}
          title="No bookings yet"
          description="Find a property and book your next coastal escape."
          action={
            <Link href={ROUTES.PROPERTIES}>
              <Button>Browse properties</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const s = STATUS_CONFIG[booking.status]
            const StatusIcon = s.icon
            return (
              <div
                key={booking.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-lg transition-all duration-200 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row gap-0">
                  {/* Property image */}
                  <div className="sm:w-40 h-40 sm:h-auto flex-shrink-0 overflow-hidden sm:rounded-none rounded-t-2xl">
                    {booking.property?.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={booking.property.images[0]}
                        alt={booking.property.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center text-4xl">🏡</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-1 text-base">
                          {booking.property?.title ?? "Property"}
                        </h3>
                        {booking.property?.location && (
                          <div className="flex items-center gap-1 mt-0.5 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{booking.property.location}</span>
                          </div>
                        )}
                      </div>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0",
                        s.classes
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {s.label}
                      </span>
                    </div>

                    {/* Dates row */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
                      <div className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-3 py-1.5">
                        <span className="text-muted-foreground text-xs">In:</span>
                        <span className="font-medium text-foreground text-xs">{formatDate(booking.check_in)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-3 py-1.5">
                        <span className="text-muted-foreground text-xs">Out:</span>
                        <span className="font-medium text-foreground text-xs">{formatDate(booking.check_out)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-3 py-1.5">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium text-foreground text-xs">{booking.guests} guest{booking.guests > 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    {/* Footer row */}
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 pt-1 border-t border-border/60">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-foreground">{formatCurrency(booking.total_price)}</span>
                        <span className="text-xs text-muted-foreground">· {booking.nights} night{booking.nights !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {booking.property && (
                          <Link href={ROUTES.PROPERTY_DETAIL(booking.property_id)}>
                            <Button variant="outline" size="sm" className="text-xs h-8 gap-1 rounded-xl">
                              View property
                              <ArrowRight className="h-3 w-3" />
                            </Button>
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
            )
          })}
        </div>
      )}
    </div>
    </div>
  )
}
