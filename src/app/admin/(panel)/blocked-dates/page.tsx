import { getAllPropertiesAdmin } from "@/services/property.service"
import { getBlockedDates } from "@/services/blocked-date.service"
import AdminHeader from "@/components/admin/AdminHeader"
import BlockDateForm from "@/components/admin/BlockDateForm"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Blocked Dates — Admin" }

export default async function AdminBlockedDatesPage() {
  const [properties, blockedDates] = await Promise.all([
    getAllPropertiesAdmin(),
    getBlockedDates(),
  ])

  return (
    <div className="max-w-3xl mx-auto">
      <AdminHeader
        title="Blocked Dates"
        description="Block specific date ranges per property"
      />
      <BlockDateForm
        properties={properties}
        initialBlockedDates={blockedDates}
      />
    </div>
  )
}
