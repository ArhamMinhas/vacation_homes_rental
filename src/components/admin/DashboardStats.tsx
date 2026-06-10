import { Building2, CalendarCheck, Clock, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getAdminStats } from "@/services/booking.service"
import { formatCurrency } from "@/utils/formatCurrency"

export default async function DashboardStats() {
  const stats = await getAdminStats()

  const cards = [
    {
      label: "Active Properties",
      value: stats.totalProperties,
      icon: Building2,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending Review",
      value: stats.pendingBookings,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Confirmed Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className="border-border shadow-none">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {c.label}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1.5">{c.value}</p>
              </div>
              <div className={`h-9 w-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                <c.icon className={`h-4 w-4 ${c.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
