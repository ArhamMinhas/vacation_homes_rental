import { Building2, CalendarCheck, Clock, TrendingUp, ArrowUpRight } from "lucide-react"
import { getAdminStats } from "@/services/booking.service"
import { formatCurrency } from "@/utils/formatCurrency"
import { cn } from "@/lib/utils"

export default async function DashboardStats() {
  const stats = await getAdminStats()

  const cards = [
    {
      label: "Pending Requests",
      value: stats.pendingBookings,
      icon: Clock,
      gradient: stats.pendingBookings > 0 ? "from-amber-500 to-orange-500" : "from-gray-400 to-gray-500",
      ring: stats.pendingBookings > 0 ? "ring-amber-100" : "ring-gray-100",
      badge: stats.pendingBookings > 0 ? "Needs action" : "All clear",
      badgeColor: stats.pendingBookings > 0
        ? "bg-amber-50 text-amber-700 border border-amber-200"
        : "bg-gray-50 text-gray-600 border border-gray-200",
      valueColor: stats.pendingBookings > 0 ? "text-amber-600" : "text-foreground",
      trend: null,
    },
    {
      label: "Confirmed Bookings",
      value: stats.totalBookings,
      icon: CalendarCheck,
      gradient: "from-blue-500 to-indigo-600",
      ring: "ring-blue-100",
      badge: "This month",
      badgeColor: "bg-blue-50 text-blue-700 border border-blue-200",
      valueColor: "text-foreground",
      trend: "+12%",
    },
    {
      label: "Monthly Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-600",
      ring: "ring-orange-100",
      badge: "Confirmed",
      badgeColor: "bg-orange-50 text-orange-700 border border-orange-200",
      valueColor: "text-foreground",
      trend: "+8%",
    },
    {
      label: "Active Properties",
      value: stats.totalProperties,
      icon: Building2,
      gradient: "from-emerald-500 to-teal-600",
      ring: "ring-emerald-100",
      badge: "Live",
      badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      valueColor: "text-foreground",
      trend: null,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className={cn(
            "bg-card rounded-2xl border border-border/60 p-5 shadow-card",
            "hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300",
            "animate-fade-in-up"
          )}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={cn(
                "h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0",
                "bg-gradient-to-br ring-4 shadow-sm",
                c.gradient, c.ring
              )}
            >
              <c.icon className="h-5 w-5 text-white" />
            </div>
            <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", c.badgeColor)}>
              {c.badge}
            </span>
          </div>
          <p className={cn("text-2xl font-bold tracking-tight", c.valueColor)}>{c.value}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
            {c.trend && (
              <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                <ArrowUpRight className="h-3 w-3" />
                {c.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
