import AdminHeader from "@/components/admin/AdminHeader"
import PropertyForm from "@/components/property/PropertyForm"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Create Property — Admin" }

export default function AdminCreatePropertyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <AdminHeader
        title="Create Property"
        description="Add a new property to the platform"
      />
      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
        <PropertyForm />
      </div>
    </div>
  )
}
