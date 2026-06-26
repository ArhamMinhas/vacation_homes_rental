import { getPaginatedPropertiesAdmin } from "@/services/property.service"
import AdminHeader from "@/components/admin/AdminHeader"
import PropertyTable from "@/components/admin/PropertyTable"
import Pagination from "@/components/common/Pagination"
import { Building2, CheckCircle2, XCircle, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Properties — Admin" }

const PAGE_SIZE = 15

interface SearchParams {
  page?: string
}

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const page = sp.page ? Math.max(1, parseInt(sp.page, 10)) : 1

  const { properties, total, totalPages } = await getPaginatedPropertiesAdmin(page, PAGE_SIZE)

  const active   = properties.filter((p) => p.is_active).length
  const inactive = properties.filter((p) => !p.is_active).length

  const stats = [
    { label: "Total",    value: total,    icon: Building2,    color: "text-blue-600",    bg: "bg-blue-50 border-blue-200"       },
    { label: "Active",   value: active,   icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
    { label: "Inactive", value: inactive, icon: XCircle,      color: "text-gray-500",    bg: "bg-muted border-border"           },
    { label: "On page",  value: properties.length, icon: Home, color: "text-primary",  bg: "bg-orange-50 border-orange-200"   },
  ]

  const buildHref = (p: number) =>
    p > 1 ? `/admin/properties?page=${p}` : "/admin/properties"

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AdminHeader
        title="Properties"
        description={`${total} total propert${total !== 1 ? "ies" : "y"}`}
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

      <PropertyTable properties={properties} />
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        buildHref={buildHref}
        className="pb-4"
      />
    </div>
  )
}
