import { Suspense } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { getFilteredProperties, type PropertyFilters } from "@/services/property.service"
import PropertyCard from "@/components/property/PropertyCard"
import EmptyState from "@/components/common/EmptyState"
import Loader from "@/components/common/Loader"
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, i) => (
        <div key={property.id} className={`animate-fade-in-up delay-${Math.min(i * 100, 400)}`}>
          <PropertyCard property={property} />
        </div>
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
          <p className="text-muted-foreground text-sm mt-1">
            Filtered results
          </p>
        )}
      </div>

      {/* Filter bar */}
      <form method="get" className="mb-8 animate-fade-in-up delay-100">
        <div className="flex flex-wrap gap-3 items-end bg-card rounded-2xl border border-border p-4">
          <div className="flex-1 min-w-[160px] space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Location</label>
            <input
              name="location"
              defaultValue={sp.location}
              placeholder="City, country…"
              className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="min-w-[140px] space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <select
              name="property_type"
              defaultValue={sp.property_type ?? ""}
              className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All types</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="min-w-[100px] space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Bedrooms</label>
            <select
              name="bedrooms"
              defaultValue={sp.bedrooms ?? ""}
              className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}+</option>
              ))}
            </select>
          </div>

          <div className="min-w-[100px] space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Guests</label>
            <select
              name="guests"
              defaultValue={sp.guests ?? ""}
              className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
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
              className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filter
            </button>
            {hasFilters && (
              <a
                href="/properties"
                className="h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center"
              >
                Clear
              </a>
            )}
          </div>
        </div>
      </form>

      {/* Grid */}
      <Suspense fallback={<Loader />}>
        <PropertiesGrid filters={filters} />
      </Suspense>
    </div>
  )
}
