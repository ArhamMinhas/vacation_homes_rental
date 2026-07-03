import { notFound } from "next/navigation"
import { Suspense, cache } from "react"
import { getPropertyById as _getPropertyById } from "@/services/property.service"

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
import { ChevronLeft, Star, Shield, Trophy, BadgeCheck, Lock } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = await getPropertyById(id)
  if (!property) return { title: "Property not found" }
  return {
    title: `${property.title} — Coastal Horizon`,
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
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-lg">
        {/* Price header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(property.price_per_night)}
            </span>
            <span className="text-gray-400 text-sm">/ night</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-900">4.89</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500 underline cursor-default">28 reviews</span>
          </div>
        </div>
        {/* CTA */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-sm text-gray-500">
            Sign in to check availability and book this property instantly.
          </p>
          <Link href={`${ROUTES.LOGIN}?redirectTo=/properties/${propertyId}`} className="block">
            <Button className="w-full rounded-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-primary/30 hover:scale-[1.01]">
              Sign in to book
            </Button>
          </Link>
          <Link href={`${ROUTES.REGISTER}`} className="block">
            <Button variant="outline" className="w-full rounded-full h-10 text-sm border-gray-200 hover:border-primary/30">
              Create account
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-1">
            <Shield className="h-3 w-3" />
            <span>You won&apos;t be charged until confirmed</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
      <BookingForm property={property} unavailable={unavailable} />
    </div>
  )
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const property = await getPropertyById(id)

  if (!property) notFound()

  return (
    <div className="min-h-screen bg-[#f9f9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back */}
        <div className="mb-5">
          <Link href={ROUTES.PROPERTIES}>
            <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-gray-500 hover:text-gray-900 rounded-full">
              <ChevronLeft className="h-4 w-4" />
              All properties
            </Button>
          </Link>
        </div>

        {/* Title above gallery on mobile */}
        <div className="mb-4 lg:hidden">
          <h1 className="text-2xl font-bold text-gray-900 font-display">{property.title}</h1>
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
            <div className="sticky top-24 space-y-4">
              <Suspense fallback={<Loader className="py-6" />}>
                <BookingPanel propertyId={id} />
              </Suspense>

              {/* Trust signals */}
              <div className="rounded-2xl bg-white border border-gray-100 p-4 divide-y divide-gray-50">
                {[
                  { Icon: Trophy,     text: "Top-rated property",          sub: "Consistently 4.8+ stars" },
                  { Icon: BadgeCheck, text: "Identity verified host",       sub: "Background check passed" },
                  { Icon: Lock,       text: "Secure & protected booking",   sub: "No charge until confirmed" },
                ].map(({ Icon, text, sub }) => (
                  <div key={text} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{text}</p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
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
    </div>
  )
}
