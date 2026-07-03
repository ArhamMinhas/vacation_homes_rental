import { getAdminStats } from "@/services/booking.service"
import { formatCurrency } from "@/utils/formatCurrency"
import { DashboardStatsCards } from "./DashboardStatsCards"

export default async function DashboardStats() {
  const stats = await getAdminStats()

  const cards = [
    {
      label: "Pending Requests",
      numericValue: stats.pendingBookings,
      displayValue: String(stats.pendingBookings),
      iconName: "Clock" as const,
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
      numericValue: stats.totalBookings,
      displayValue: String(stats.totalBookings),
      iconName: "CalendarCheck" as const,
      gradient: "from-blue-500 to-indigo-600",
      ring: "ring-blue-100",
      badge: "This month",
      badgeColor: "bg-blue-50 text-blue-700 border border-blue-200",
      valueColor: "text-foreground",
      trend: "+12%",
    },
    {
      label: "Monthly Revenue",
      numericValue: null,
      displayValue: formatCurrency(stats.totalRevenue),
      iconName: "TrendingUp" as const,
      gradient: "from-orange-500 to-red-600",
      ring: "ring-orange-100",
      badge: "Confirmed",
      badgeColor: "bg-orange-50 text-orange-700 border border-orange-200",
      valueColor: "text-foreground",
      trend: "+8%",
    },
    {
      label: "Active Properties",
      numericValue: stats.totalProperties,
      displayValue: String(stats.totalProperties),
      iconName: "Building2" as const,
      gradient: "from-emerald-500 to-teal-600",
      ring: "ring-emerald-100",
      badge: "Live",
      badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      valueColor: "text-foreground",
      trend: null,
    },
  ]

  return <DashboardStatsCards cards={cards} />
}
