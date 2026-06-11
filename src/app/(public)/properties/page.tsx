import { Suspense } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { getFilteredProperties, type PropertyFilters } from "@/services/property.service"
import PropertyCard from "@/components/property/PropertyCard"
import PropertyCardSkeleton from "@/components/property/PropertyCardSkeleton"
import EmptyState from "@/components/common/EmptyState"
import { PROPERTY_TYPES } from "@/lib/constants"

interface SearchParams {
  location?: string
  property_type?: string
  min_price?: string
  max_price?: string
  bedrooms?: string
  guests?: string
}

async function PropertiesGrid({ filters }: { filters: PropertyFilters }) {
  const properties = await getFilteredProperties(filters)

  if (properties.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-6 w-6" />}
        title="No properties found"
        description="Try adjusting your filters or searching a different location."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {properties.map((property, i) => (
        <div
          key={property.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${Math.min(i * 60, 360)}ms` }}
        >
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  )
}

function PropertiesSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams

  const filters: PropertyFilters = {
    location: sp.location,
    property_type: sp.property_type,
    min_price: sp.min_price ? Number(sp.min_price) : undefined,
    max_price: sp.max_price ? Number(sp.max_price) : undefined,
    bedrooms: sp.bedrooms ? Number(sp.bedrooms) : undefined,
    max_guests: sp.guests ? Number(sp.guests) : undefined,
  }

  const hasFilters = Object.values(filters).some((v) => v !== undefined)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {sp.location ? `Properties in "${sp.location}"` : "All Properties"}
        </h1>
        {hasFilters && (
          <p className="text-muted-foreground text-sm mt-1">Showing filtered results</p>
        )}
      </div>

      {/* Filter bar */}
      <form method="get" className="mb-10 animate-fade-in-up delay-100">
        <div className="bg-card rounded-2xl border border-border shadow-card p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[160px] space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Location
              </label>
              <input
                name="location"
                defaultValue={sp.location}
                placeholder="City, country…"
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all"
              />
            </div>

            <div className="min-w-[140px] space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Type
              </label>
              <select
                name="property_type"
                defaultValue={sp.property_type ?? ""}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all"
              >
                <option value="">All types</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="min-w-[100px] space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Bedrooms
              </label>
              <select
                name="bedrooms"
                defaultValue={sp.bedrooms ?? ""}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>

            <div className="min-w-[100px] space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Guests
              </label>
              <select
                name="guests"
                defaultValue={sp.guests ?? ""}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all"
              >
                <option value="">Any</option>
                {[1, 2, 4, 6, 8, 10].map((n) => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter
              </button>
              {hasFilters && (
                <a
                  href="/properties"
                  className="h-10 px-4 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </a>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Grid */}
      <Suspense fallback={<PropertiesSkeletonGrid />}>
        <PropertiesGrid filters={filters} />
      </Suspense>
    </div>
  )
}
