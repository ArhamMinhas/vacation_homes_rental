import { Building2, CalendarCheck, Clock, DollarSign } from "lucide-react"
import { getAdminStats } from "@/services/booking.service"
import { formatCurrency } from "@/utils/formatCurrency"
import { cn } from "@/lib/utils"

export default async function DashboardStats() {
  const stats = await getAdminStats()

  const cards = [
    {
      label: "Active Properties",
      value: stats.totalProperties,
      icon: Building2,
      gradient: "from-teal-500 to-emerald-600",
      ring: "ring-teal-100",
      badge: "Live",
      badgeColor: "bg-teal-50 text-teal-700",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarCheck,
      gradient: "from-blue-500 to-cyan-600",
      ring: "ring-blue-100",
      badge: "All time",
      badgeColor: "bg-blue-50 text-blue-700",
    },
    {
      label: "Pending Review",
      value: stats.pendingBookings,
      icon: Clock,
      gradient: stats.pendingBookings > 0 ? "from-amber-500 to-orange-500" : "from-gray-400 to-gray-500",
      ring: stats.pendingBookings > 0 ? "ring-amber-100" : "ring-gray-100",
      badge: stats.pendingBookings > 0 ? "Needs action" : "All clear",
      badgeColor: stats.pendingBookings > 0
        ? "bg-amber-50 text-amber-700"
        : "bg-gray-50 text-gray-600",
    },
    {
      label: "Confirmed Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      gradient: "from-purple-500 to-violet-600",
      ring: "ring-purple-100",
      badge: "Confirmed",
      badgeColor: "bg-purple-50 text-purple-700",
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
          <p className="text-2xl font-bold text-foreground tracking-tight">{c.value}</p>
          <p className="text-xs font-medium text-muted-foreground mt-1">{c.label}</p>
        </div>
      ))}
    </div>
  )
}
