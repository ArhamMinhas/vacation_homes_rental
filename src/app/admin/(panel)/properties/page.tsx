import { getPaginatedPropertiesAdmin } from "@/services/property.service"
import AdminHeader from "@/components/admin/AdminHeader"
import PropertyTable from "@/components/admin/PropertyTable"
import Pagination from "@/components/common/Pagination"
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

  const buildHref = (p: number) =>
    p > 1 ? `/admin/properties?page=${p}` : "/admin/properties"

  return (
    <div className="max-w-6xl mx-auto">
      <AdminHeader
        title="Properties"
        description={`${total} total properties`}
      />
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
