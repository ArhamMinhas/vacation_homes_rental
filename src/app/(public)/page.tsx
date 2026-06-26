import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, MapPin } from "lucide-react"
import { getFilteredProperties } from "@/services/property.service"
import PropertyFilters from "@/components/property/PropertyFilters"
import PropertyCard from "@/components/property/PropertyCard"
import { ROUTES } from "@/lib/constants"
import type { Property } from "@/types/property"

// ── Featured properties loaded server-side ────────────────────────────────────
async function FeaturedSection() {
  let featured: Property[] = []
  try {
    const { properties } = await getFilteredProperties({ pageSize: 3, page: 1 })
    featured = properties
  } catch {
    featured = []
  }

  if (featured.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { name: "The Glass Pavilion", location: "Joshua Tree, California", price: "$850", rating: "4.98" },
          { name: "Nordic Hideaway",    location: "Lofoten, Norway",         price: "$1,200", rating: "4.92" },
          { name: "Azure Vista Villa",  location: "Oia, Santorini",          price: "$2,450", rating: "5.0"  },
        ].map((p) => (
          <div key={p.name} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl">🏡</div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900 text-[15px]">{p.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-[13px] font-semibold text-gray-800">{p.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mb-3">
                <MapPin className="h-3 w-3" />
                <span className="text-xs">{p.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900">{p.price}</span>
                  <span className="text-sm text-gray-500"> / night</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {featured.map((property, i) => (
        <PropertyCard key={property.id} property={property} priority={i < 2} />
      ))}
    </div>
  )
}

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
          <div className="aspect-[4/3] bg-gray-100" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-3/4 bg-gray-100 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
            <div className="h-4 w-1/3 bg-gray-100 rounded mt-3" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Nearby category cards ──────────────────────────────────────────────────────
const NEARBY_CATEGORIES = [
  {
    label: "Secluded Cabins",
    distance: "2.9 hour drive",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=500&fit=crop",
    type: "Cabin",
  },
  {
    label: "Coastal Retreats",
    distance: "1 hour drive",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=500&fit=crop",
    type: "Beach House",
  },
  {
    label: "Urban Lofts",
    distance: "Local discovery",
    image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=500&fit=crop",
    type: "Apartment",
  },
  {
    label: "Country Manors",
    distance: "3 hour drive",
    image: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=400&h=500&fit=crop",
    type: "Villa",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f9f9ff] overflow-x-hidden">

      {/* ══════════════════════════════════════════════════
          1. HERO — full-width photo + pill search
      ══════════════════════════════════════════════════ */}
      <section className="relative h-[520px] sm:h-[600px] lg:h-[680px] overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&h=900&fit=crop&q=80')",
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display tracking-tight leading-tight max-w-3xl">
            Discover Your Private Sanctuary Anywhere
          </h1>
          {/* Pill search bar */}
          <div className="w-full max-w-3xl animate-fade-in-up delay-100">
            <PropertyFilters />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. EXPLORE NEARBY
      ══════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">Explore Nearby</h2>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Unique stays just a short drive away</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {NEARBY_CATEGORIES.map(({ label, distance, image, type }) => (
              <Link
                key={label}
                href={`${ROUTES.PROPERTIES}?property_type=${encodeURIComponent(type)}`}
                className="group block"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={label}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{label}</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{distance}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3. FEATURED VACATION HOMES
      ══════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-16 px-4 bg-[#f9f9ff]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">Featured Vacation Homes</h2>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">Handpicked stays for the ultimate getaway</p>
            </div>
            <Link
              href={ROUTES.PROPERTIES}
              className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all duration-200 shrink-0"
            >
              View all properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Suspense fallback={<FeaturedSkeleton />}>
            <FeaturedSection />
          </Suspense>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. HOST CTA — dark warm card
      ══════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 px-4 bg-[#f9f9ff]">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col sm:flex-row items-stretch min-h-[280px]"
            style={{ background: "linear-gradient(135deg, #3d1500 0%, #5c2000 40%, #7c2d12 100%)" }}
          >
            {/* Left content */}
            <div className="flex-1 p-8 sm:p-12 lg:p-14 flex flex-col justify-center max-w-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-display leading-tight mb-4">
                Your home,<br />
                the next luxury<br />
                destination.
              </h2>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
                Join our exclusive community of hosts and turn your premium property into an extraordinary experience for travellers worldwide.
              </p>
              <div>
                <Link
                  href={ROUTES.REGISTER}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white text-white text-sm font-semibold hover:bg-white hover:text-gray-900 transition-all duration-200"
                >
                  Host Your Home
                </Link>
              </div>
            </div>

            {/* Right decorative image */}
            <div className="hidden sm:block relative flex-1 min-h-[280px]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=600&fit=crop&q=80')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#5c2000]/80" />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
