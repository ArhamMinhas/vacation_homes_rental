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
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import {
  CheckCircle2, Clock, XCircle, ArrowUpRight,
  CalendarOff, Building2, Eye, Plus,
} from "lucide-react"
import type { BookingStatus } from "@/types/booking"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Admin Dashboard — LuxeStay" }

const STATUS_CONFIG: Record<BookingStatus, { label: string; classes: string; dot: string }> = {
  pending:   { label: "Pending",   classes: "bg-amber-50 text-amber-700 border border-amber-200",     dot: "bg-amber-400"   },
  confirmed: { label: "Confirmed", classes: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  cancelled: { label: "Cancelled", classes: "bg-muted text-muted-foreground border border-border",     dot: "bg-gray-400"    },
  rejected:  { label: "Rejected",  classes: "bg-red-50 text-red-700 border border-red-200",           dot: "bg-red-500"     },
}

function MiniCalendar() {
  const now      = new Date()
  const year     = now.getFullYear()
  const month    = now.getMonth()
  const today    = now.getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const total    = new Date(year, month + 1, 0).getDate()
  const cells    = Array.from({ length: firstDay + total }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <div>
      <p className="text-sm font-semibold text-foreground mb-3 text-center">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} className="text-[10px] font-bold text-muted-foreground pb-1">{d}</div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={cn(
              "text-xs h-7 w-7 mx-auto flex items-center justify-center rounded-full transition-colors",
              day === today
                ? "bg-primary text-white font-bold"
                : day
                ? "text-foreground hover:bg-muted/60"
                : ""
            )}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const [bookings, properties] = await Promise.all([
    getAllBookings(),
    getAllPropertiesAdmin(),
  ])

  const recentBookings   = bookings.slice(0, 6)
  const recentProperties = properties.slice(0, 4)

  // Property health: properties with pending bookings = "Needs Attention"
  const propertyHealth = properties.slice(0, 4).map((p) => {
    const propBookings = bookings.filter((b) => b.property_id === p.id)
    const hasPending   = propBookings.some((b) => b.status === "pending")
    const hasAny       = propBookings.length > 0
    return {
      id:     p.id,
      title:  p.title,
      status: !hasAny
        ? { label: "No Bookings",     cls: "text-gray-500",     bg: "bg-gray-100"    }
        : hasPending
        ? { label: "NEEDS ATTENTION", cls: "text-red-600",      bg: "bg-red-50"      }
        : { label: "EXCELLENT",       cls: "text-emerald-600",  bg: "bg-emerald-50"  },
    }
  })

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      <AdminHeader
        title="Dashboard"
        description="Welcome back. Here's an overview of your platform."
        action={<DashboardRealtimeSync />}
      />

      {/* Stats cards */}
      <Suspense fallback={<Loader size="sm" className="py-4" />}>
        <DashboardStats />
      </Suspense>

      {/* Two-column layout: main content + right sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">

        {/* ── LEFT: Recent Bookings + Recent Properties ────────── */}
        <div className="space-y-6">

          {/* Recent Bookings */}
          <div className="bg-card rounded-2xl border border-border/70 shadow-card overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div>
                <h2 className="font-semibold text-foreground text-sm">Recent Booking Requests</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {bookings.filter((b) => b.status === "pending").length} pending action
                </p>
              </div>
              <Link href={ROUTES.ADMIN_BOOKINGS}>
                <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 h-7 hover:bg-primary/8">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-14 text-center px-6">
                <div className="text-3xl mb-3">📋</div>
                <p className="font-medium text-foreground text-sm">No bookings yet</p>
                <p className="text-xs text-muted-foreground mt-1">Bookings will appear here once guests submit requests.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60 flex-1">
                {recentBookings.map((b) => {
                  const s = STATUS_CONFIG[b.status]
                  return (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
                    >
                      {/* Property thumbnail */}
                      {b.property?.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={b.property.images[0]}
                          alt={b.property.title}
                          className="h-10 w-14 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-14 rounded-lg bg-muted flex items-center justify-center text-base flex-shrink-0">🏡</div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{b.guest_name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {b.property?.title ?? "—"} · {formatDate(b.check_in)} · {b.nights} night{b.nights !== 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-semibold text-foreground hidden sm:block">
                          {formatCurrency(b.total_price)}
                        </span>
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap",
                          s.classes
                        )}>
                          <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", s.dot)} />
                          {s.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Property Management cards */}
          <div className="bg-card rounded-2xl border border-border/70 shadow-card overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div>
                <h2 className="font-semibold text-foreground text-sm">Property Management</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {properties.filter((p) => p.is_active).length} of {properties.length} live
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/admin/properties/create">
                  <Button size="sm" className="text-xs gap-1 h-7">
                    <Plus className="h-3 w-3" /> Add New
                  </Button>
                </Link>
                <Link href={ROUTES.ADMIN_PROPERTIES}>
                  <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 h-7 hover:bg-primary/8">
                    View All <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>

            {recentProperties.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-14 text-center px-6">
                <div className="text-3xl mb-3">🏡</div>
                <p className="font-medium text-foreground text-sm">No properties yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add your first property to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                {recentProperties.map((p) => (
                  <div key={p.id} className="group p-4 flex gap-3 hover:bg-muted/20 transition-colors">
                    {/* Image */}
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="h-20 w-28 object-cover rounded-xl flex-shrink-0 shadow-sm"
                      />
                    ) : (
                      <div className="h-20 w-28 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">🏡</div>
                    )}
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.location}</p>
                      <p className="text-sm font-bold text-foreground mt-1">{formatCurrency(p.price_per_night)}<span className="text-xs font-normal text-muted-foreground">/night</span></p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                          p.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-muted text-muted-foreground border-border"
                        )}>
                          {p.is_active ? "Active" : "Inactive"}
                        </span>
                        <Link
                          href={`/admin/properties/${p.id}`}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Calendar + Property Health ───────────────────── */}
        <div className="space-y-4">

          {/* Mini calendar */}
          <div className="bg-card rounded-2xl border border-border/70 shadow-card p-5">
            <MiniCalendar />
            <Link href={ROUTES.ADMIN_BLOCKED_DATES} className="block mt-4">
              <Button variant="outline" size="sm" className="w-full gap-2 text-xs h-9 rounded-xl">
                <CalendarOff className="h-3.5 w-3.5" />
                Manage Blocked Dates
              </Button>
            </Link>
          </div>

          {/* Property Health */}
          <div className="bg-card rounded-2xl border border-border/70 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Property Health</h3>
              </div>
            </div>
            <div className="divide-y divide-border/60">
              {propertyHealth.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No properties yet.</p>
              ) : (
                propertyHealth.map((ph) => (
                  <div key={ph.id} className="flex items-center justify-between px-5 py-2.5">
                    <p className="text-sm font-medium text-foreground truncate flex-1 mr-2">{ph.title}</p>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0",
                      ph.status.cls, ph.status.bg
                    )}>
                      {ph.status.label}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-card rounded-2xl border border-border/70 shadow-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Quick Stats</h3>
            {[
              { label: "Total Bookings",    value: bookings.length,                                   icon: CheckCircle2,  color: "text-blue-600" },
              { label: "Pending Review",    value: bookings.filter((b) => b.status === "pending").length,   icon: Clock,         color: "text-amber-600" },
              { label: "Cancelled/Rejected",value: bookings.filter((b) => b.status === "cancelled" || b.status === "rejected").length, icon: XCircle, color: "text-red-500" },
              { label: "Active Properties", value: properties.filter((p) => p.is_active).length,     icon: Building2,     color: "text-emerald-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", color)} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <span className={cn("text-sm font-bold", color)}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
