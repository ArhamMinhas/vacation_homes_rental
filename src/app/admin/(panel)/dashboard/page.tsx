import { Suspense } from "react"
import Link from "next/link"
import { getAllBookings } from "@/services/booking.service"
import { getAllPropertiesAdmin } from "@/services/property.service"
import AdminHeader from "@/components/admin/AdminHeader"
import DashboardStats from "@/components/admin/DashboardStats"
import DashboardRealtimeSync from "@/components/admin/DashboardRealtimeSync"
import Loader from "@/components/common/Loader"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/types/booking"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Admin Dashboard — StayFinder" }

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending:   "bg-amber-100 text-amber-700 border border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  cancelled: "bg-muted text-muted-foreground border border-border",
  rejected:  "bg-red-100 text-red-700 border border-red-200",
}

export default async function AdminDashboardPage() {
  const [bookings, properties] = await Promise.all([
    getAllBookings(),
    getAllPropertiesAdmin(),
  ])

  const recentBookings   = bookings.slice(0, 5)
  const recentProperties = properties.slice(0, 4)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <AdminHeader
        title="Dashboard"
        description="Welcome back. Here's an overview of your platform."
        action={<DashboardRealtimeSync />}
      />

      <Suspense fallback={<Loader size="sm" className="py-4" />}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-card rounded-2xl border border-border/70 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-muted/30">
            <h2 className="font-semibold text-foreground">Recent Bookings</h2>
            <Link href={ROUTES.ADMIN_BOOKINGS}>
              <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 h-7">
                View all →
              </Button>
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No bookings yet.</p>
          ) : (
            <div className="divide-y divide-border/60">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{b.guest_name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {b.property?.title} · {formatDate(b.check_in)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-semibold text-foreground">{formatCurrency(b.total_price)}</span>
                    <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-medium", STATUS_STYLES[b.status])}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Properties */}
        <div className="bg-card rounded-2xl border border-border/70 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-muted/30">
            <h2 className="font-semibold text-foreground">Properties</h2>
            <Link href={ROUTES.ADMIN_PROPERTIES}>
              <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 h-7">
                Manage all →
              </Button>
            </Link>
          </div>
          {recentProperties.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No properties yet.</p>
          ) : (
            <div className="divide-y divide-border/60">
              {recentProperties.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-muted/30 transition-colors"
                >
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="h-11 w-16 object-cover rounded-lg flex-shrink-0 shadow-sm"
                    />
                  ) : (
                    <div className="h-11 w-16 rounded-lg bg-muted flex items-center justify-center text-lg flex-shrink-0">🏡</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.location} · {formatCurrency(p.price_per_night)}/night</p>
                  </div>
                  <Badge
                    variant={p.is_active ? "default" : "secondary"}
                    className={cn("text-[11px] flex-shrink-0 px-2 py-0.5", p.is_active && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200")}
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
