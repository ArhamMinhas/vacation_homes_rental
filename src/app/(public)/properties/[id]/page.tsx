import { notFound } from "next/navigation"
import { Suspense, cache } from "react"
import { getPropertyById as _getPropertyById } from "@/services/property.service"

// Per-request memoization — generateMetadata, BookingPanel, and the page
// all call this; cache() deduplicates them into one DB query per request.
const getPropertyById = cache(_getPropertyById)
import { getUnavailableDates } from "@/services/availability.service"
import { getCurrentUser } from "@/lib/auth"
import PropertyGallery from "@/components/property/PropertyGallery"
import PropertyDetails from "@/components/property/PropertyDetails"
import BookingForm from "@/components/booking/BookingForm"
import BookingPanelMobile from "@/components/booking/BookingPanelMobile"
import Loader from "@/components/common/Loader"
import { formatCurrency } from "@/utils/formatCurrency"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = await getPropertyById(id)
  if (!property) return { title: "Property not found" }
  return {
    title: `${property.title} — StayFinder`,
    description: property.description.slice(0, 160),
  }
}

async function BookingPanel({ propertyId }: { propertyId: string }) {
  const [property, unavailable, user] = await Promise.all([
    getPropertyById(propertyId),
    getUnavailableDates(propertyId),
    getCurrentUser(),
  ])

  if (!property) return null

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-bold text-foreground">
            {formatCurrency(property.price_per_night)}
          </span>
          <span className="text-muted-foreground text-sm">/ night</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Sign in to book this property.
        </p>
        <Link href={`${ROUTES.LOGIN}?redirectTo=/properties/${propertyId}`}>
          <Button className="w-full">Sign in to book</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <BookingForm property={property} unavailable={unavailable} />
    </div>
  )
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const property = await getPropertyById(id)

  if (!property) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      {/* Back */}
      <div className="mb-6">
        <Link href={ROUTES.PROPERTIES}>
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2">
            <ChevronLeft className="h-4 w-4" />
            All properties
          </Button>
        </Link>
      </div>

      {/* Mobile: price bar + "Book" CTA at bottom of screen */}
      <BookingPanelMobile property={property} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 pb-28 lg:pb-0">
        {/* Left: gallery + details */}
        <div className="space-y-8">
          <PropertyGallery images={property.images} title={property.title} />
          <PropertyDetails property={property} />
        </div>

        {/* Right: booking — desktop sticky panel */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <Suspense fallback={<Loader className="py-6" />}>
              <BookingPanel propertyId={id} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Mobile: full booking form below property details */}
      <div className="lg:hidden mt-8 mb-4" id="booking-form">
        <Suspense fallback={<Loader className="py-6" />}>
          <BookingPanel propertyId={id} />
        </Suspense>
      </div>
    </div>
  )
}
