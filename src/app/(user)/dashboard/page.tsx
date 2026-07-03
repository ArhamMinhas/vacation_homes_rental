import { redirect } from "next/navigation"
import { getCurrentProfile, getCurrentUser } from "@/lib/auth"
import { getUserBookings } from "@/services/booking.service"
import { ROUTES } from "@/lib/constants"
import BackButton from "@/components/common/BackButton"
import { DashboardClient } from "@/components/dashboard/DashboardClient"
import type { Booking } from "@/types/booking"

export const metadata = { title: "Dashboard — Coastal Horizon" }

export default async function UserDashboardPage() {
  const [profile, user] = await Promise.all([getCurrentProfile(), getCurrentUser()])
  if (!profile || !user) redirect(ROUTES.LOGIN)

  let bookings: Booking[] = []
  try {
    bookings = await getUserBookings(user.id)
  } catch {
    bookings = []
  }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : profile.email[0].toUpperCase()

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed")
  const pendingBookings   = bookings.filter((b) => b.status === "pending")
  const totalSpend        = confirmedBookings.reduce((sum, b) => sum + b.total_price, 0)

  return (
    <div className="min-h-screen bg-[#f9f9ff]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <BackButton />
        <DashboardClient
          profile={profile}
          initials={initials}
          totalBookings={bookings.length}
          confirmedCount={confirmedBookings.length}
          totalSpend={totalSpend}
          pendingCount={pendingBookings.length}
        />
      </div>
    </div>
  )
}

