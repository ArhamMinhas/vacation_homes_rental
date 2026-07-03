import { getAllBookings } from "@/services/booking.service"
import AdminHeader from "@/components/admin/AdminHeader"
import BookingTable from "@/components/admin/BookingTable"
import { AnimatedStatCard } from "@/components/ui/animations"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Bookings — Admin" }

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings()

  const pending   = bookings.filter((b) => b.status === "pending").length
  const confirmed = bookings.filter((b) => b.status === "confirmed").length
  const cancelled = bookings.filter((b) => b.status === "cancelled" || b.status === "rejected").length
  const revenue   = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.total_price, 0)

  const stats = [
    { label: "Pending",   value: pending,   iconName: "Clock",        color: "text-amber-600",   bg: "bg-amber-50 border-amber-200"    },
    { label: "Confirmed", value: confirmed, iconName: "CheckCircle2", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
    { label: "Cancelled", value: cancelled, iconName: "XCircle",      color: "text-red-500",     bg: "bg-red-50 border-red-200"         },
    { label: "Revenue",   value: revenue,   iconName: "DollarSign",   color: "text-primary",     bg: "bg-orange-50 border-orange-200",  prefix: "$" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AdminHeader
        title="Bookings"
        description={`${bookings.length} total reservation${bookings.length !== 1 ? "s" : ""}`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, iconName, color, bg, prefix }, i) => (
          <AnimatedStatCard
            key={label}
            label={label}
            value={value}
            iconName={iconName}
            color={color}
            bg={bg}
            index={i}
            isNumber
            prefix={prefix}
          />
        ))}
      </div>

      <BookingTable bookings={bookings} />
    </div>
  )
}
