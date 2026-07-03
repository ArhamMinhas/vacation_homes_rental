import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getUserBookings } from "@/services/booking.service"
import { ROUTES } from "@/lib/constants"
import BackButton from "@/components/common/BackButton"
import type { Metadata } from "next"
import { BookingsListClient } from "@/components/bookings/BookingsListClient"

export const metadata: Metadata = { title: "My Bookings — Coastal Horizon" }

export default async function UserBookingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect(`${ROUTES.LOGIN}?redirectTo=${ROUTES.USER_BOOKINGS}`)

  const bookings = await getUserBookings(user.id)

  const confirmed = bookings.filter((b) => b.status === "confirmed").length
  const pending   = bookings.filter((b) => b.status === "pending").length

  return (
    <div className="min-h-screen bg-[#f9f9ff]">

      {/* Cinematic header strip */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #080d1a 0%, #0f1a2e 50%, #0a1020 100%)",
        }}
      >
        {/* Ambient orbs */}
        <div className="absolute -top-20 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-blue-600/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <BackButton className="text-white/60 hover:text-white mb-5" />
          <div>
            <p className="text-[11px] font-bold text-primary tracking-widest uppercase mb-1.5">My Account</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">My Travel Bookings</h1>
            <p className="text-sm text-white/40 mt-1">
              {bookings.length === 0
                ? "No bookings yet — start exploring"
                : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} · ${confirmed} confirmed`}
            </p>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#f9f9ff] to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <BookingsListClient
          bookings={bookings}
          confirmedCount={confirmed}
          pendingCount={pending}
        />
      </div>
    </div>
  )
}
