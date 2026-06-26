import { getAllBookings } from "@/services/booking.service"
import AdminHeader from "@/components/admin/AdminHeader"
import BookingTable from "@/components/admin/BookingTable"
import { formatCurrency } from "@/utils/formatCurrency"
import { CheckCircle2, Clock, DollarSign, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
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
    { label: "Pending",   value: pending,            icon: Clock,        color: "text-amber-600",   bg: "bg-amber-50 border-amber-200"   },
    { label: "Confirmed", value: confirmed,           icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200"},
    { label: "Cancelled", value: cancelled,           icon: XCircle,      color: "text-red-500",     bg: "bg-red-50 border-red-200"        },
    { label: "Revenue",   value: formatCurrency(revenue), icon: DollarSign, color: "text-primary", bg: "bg-orange-50 border-orange-200"  },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AdminHeader
        title="Bookings"
        description={`${bookings.length} total reservation${bookings.length !== 1 ? "s" : ""}`}
      />

      {/* Quick stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={cn("rounded-xl border px-4 py-3 flex items-center gap-3", bg)}>
            <Icon className={cn("h-4 w-4 flex-shrink-0", color)} />
            <div>
              <p className={cn("text-base font-bold leading-none", color)}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <BookingTable bookings={bookings} />
    </div>
  )
}
