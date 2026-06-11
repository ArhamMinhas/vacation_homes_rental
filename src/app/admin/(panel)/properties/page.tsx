import { getAllPropertiesAdmin } from "@/services/property.service"
import AdminHeader from "@/components/admin/AdminHeader"
import PropertyTable from "@/components/admin/PropertyTable"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Properties — Admin" }

export default async function AdminPropertiesPage() {
  const properties = await getAllPropertiesAdmin()

  return (
    <div className="max-w-6xl mx-auto">
      <AdminHeader
        title="Properties"
        description={`${properties.length} total properties`}
      />
      <PropertyTable properties={properties} />
    </div>
  )
}
