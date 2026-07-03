import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Star, MapPin, Home } from "lucide-react"
import { getFilteredProperties } from "@/services/property.service"
import PropertyFilters from "@/components/property/PropertyFilters"
import PropertyCard from "@/components/property/PropertyCard"
import { HeroSection3D } from "@/components/home/HeroSection3D"
import { HomeAnimations } from "@/components/home/HomeAnimations"
import { MarqueeTicker } from "@/components/home/MarqueeTicker"
import { ROUTES } from "@/lib/constants"
import type { Property } from "@/types/property"

// â”€â”€ Featured properties loaded server-side â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
          <div key={p.name} className="bg-white rounded-2xl overflow-hidden shadow-sm group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 via-amber-50 to-rose-50 flex items-center justify-center text-5xl relative overflow-hidden">
              <Home className="h-10 w-10 text-amber-300 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-white text-xs font-bold">{p.rating}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-[15px] mb-1">{p.name}</h3>
              <div className="flex items-center gap-1 text-gray-400 mb-3">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs">{p.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900">{p.price}</span>
                  <span className="text-sm text-gray-400"> / night</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
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

const NEARBY_CATEGORIES = [
  {
    label: "Secluded Cabins",
    distance: "2.9 hour drive",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=500&fit=crop",
    type: "Cabin",
    accent: "from-emerald-600/60 to-emerald-900/80",
  },
  {
    label: "Coastal Retreats",
    distance: "1 hour drive",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=500&fit=crop",
    type: "Beach House",
    accent: "from-blue-600/60 to-blue-900/80",
  },
  {
    label: "Urban Lofts",
    distance: "Local discovery",
    image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=500&fit=crop",
    type: "Apartment",
    accent: "from-violet-600/60 to-violet-900/80",
  },
  {
    label: "Country Manors",
    distance: "3 hour drive",
    image: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=400&h=500&fit=crop",
    type: "Villa",
    accent: "from-amber-600/60 to-amber-900/80",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f9f9ff] overflow-x-hidden">

      {/* ══════════════════════════════════════════════════
          1. HERO â€” 3D card stack + animated copy
      ══════════════════════════════════════════════════ */}
      <HeroSection3D />

      {/* â”€â”€ Search bar below hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="-mt-px px-4 pb-8 pt-0 bg-gradient-to-b from-[#060b18] via-[#0d1428] to-[#f9f9ff]">
        <div className="max-w-4xl mx-auto pt-6">
          <PropertyFilters />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          Trust badges strip
      ══════════════════════════════════════════════════ */}
      <MarqueeTicker />
      <HomeAnimations
        nearbyCats={NEARBY_CATEGORIES}
        featuredFallback={
          <Suspense fallback={<FeaturedSkeleton />}>
            <FeaturedSection />
          </Suspense>
        }
      />
    </div>
  )
}

