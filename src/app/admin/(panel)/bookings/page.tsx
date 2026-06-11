import { getAllBookings } from "@/services/booking.service"
import AdminHeader from "@/components/admin/AdminHeader"
import BookingTable from "@/components/admin/BookingTable"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Bookings — Admin" }

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings()

  const pending = bookings.filter((b) => b.status === "pending").length
  const confirmed = bookings.filter((b) => b.status === "confirmed").length

  return (
    <div className="max-w-6xl mx-auto">
      <AdminHeader
        title="Bookings"
        description={`${bookings.length} total · ${pending} pending · ${confirmed} confirmed`}
      />
      <BookingTable bookings={bookings} />
    </div>
  )
}
