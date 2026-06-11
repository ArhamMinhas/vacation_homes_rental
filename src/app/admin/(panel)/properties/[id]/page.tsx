import { notFound } from "next/navigation"
import { getPropertyById } from "@/services/property.service"
import AdminHeader from "@/components/admin/AdminHeader"
import PropertyForm from "@/components/property/PropertyForm"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = await getPropertyById(id)
  return { title: property ? `Edit: ${property.title} — Admin` : "Edit Property" }
}

export default async function AdminEditPropertyPage({ params }: Props) {
  const { id } = await params
  const property = await getPropertyById(id)
  if (!property) notFound()

  return (
    <div className="max-w-3xl mx-auto">
      <AdminHeader
        title="Edit Property"
        description={property.title}
      />
      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
        <PropertyForm property={property} />
      </div>
    </div>
  )
}
