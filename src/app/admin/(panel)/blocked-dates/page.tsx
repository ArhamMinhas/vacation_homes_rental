import { getAllPropertiesAdmin } from "@/services/property.service"
import { getBlockedDates } from "@/services/blocked-date.service"
import AdminHeader from "@/components/admin/AdminHeader"
import BlockDateForm from "@/components/admin/BlockDateForm"
import { CalendarOff, Building2, CalendarX, CalendarCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Blocked Dates — Admin" }

export default async function AdminBlockedDatesPage() {
  const [properties, blockedDates] = await Promise.all([
    getAllPropertiesAdmin(),
    getBlockedDates(),
  ])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = blockedDates.filter((d) => new Date(d.end_date) >= today)
  const past     = blockedDates.filter((d) => new Date(d.end_date) < today)
  const affectedProps = new Set(blockedDates.map((d) => d.property_id)).size

  const stats = [
    {
      label: "Total Periods",
      value: blockedDates.length,
      icon: CalendarOff,
      color: "text-primary",
      bg: "bg-orange-50 border-orange-200",
    },
    {
      label: "Upcoming",
      value: upcoming.length,
      icon: CalendarX,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
    },
    {
      label: "Past / Expired",
      value: past.length,
      icon: CalendarCheck,
      color: "text-gray-500",
      bg: "bg-muted border-border",
    },
    {
      label: "Properties Affected",
      value: affectedProps,
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
    },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <AdminHeader
        title="Blocked Dates"
        description="Block specific date ranges per property to prevent new bookings"
      />

      {/* Quick stats */}
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

      {/* Info banner */}
      <div className="rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 flex items-start gap-3">
        <CalendarOff className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-orange-800 leading-relaxed">
          Blocked dates prevent guests from booking the property during that period. Existing confirmed bookings are not affected.
        </p>
      </div>

      <BlockDateForm
        properties={properties}
        initialBlockedDates={blockedDates}
      />
    </div>
  )
}
