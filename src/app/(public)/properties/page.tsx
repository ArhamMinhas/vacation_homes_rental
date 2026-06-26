import { Suspense } from "react"
import { Search } from "lucide-react"
import { getFilteredProperties, type PropertyFilters } from "@/services/property.service"
import PropertyCard from "@/components/property/PropertyCard"
import PropertyCardSkeleton from "@/components/property/PropertyCardSkeleton"
import PropertyTopFilters from "@/components/property/PropertyTopFilters"
import EmptyState from "@/components/common/EmptyState"
import Pagination from "@/components/common/Pagination"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Properties — LuxeStay" }

const PAGE_SIZE = 12

interface SearchParams {
  location?:      string
  property_type?: string
  min_price?:     string
  max_price?:     string
  bedrooms?:      string
  guests?:        string
  page?:          string
}

async function PropertiesSection({
  filters,
  page,
  searchParams,
}: {
  filters: PropertyFilters
  page: number
  searchParams: SearchParams
}) {
  const { properties, total, totalPages } = await getFilteredProperties({
    ...filters,
    page,
    pageSize: PAGE_SIZE,
  })

  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    if (searchParams.location)      params.set("location",      searchParams.location)
    if (searchParams.property_type) params.set("property_type", searchParams.property_type)
    if (searchParams.min_price)     params.set("min_price",     searchParams.min_price)
    if (searchParams.max_price)     params.set("max_price",     searchParams.max_price)
    if (searchParams.bedrooms)      params.set("bedrooms",      searchParams.bedrooms)
    if (searchParams.guests)        params.set("guests",        searchParams.guests)
    if (p > 1)                      params.set("page",          String(p))
    const qs = params.toString()
    return `/properties${qs ? `?${qs}` : ""}`
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-6 w-6" />}
        title="No properties found"
        description="Try adjusting your filters or searching a different location."
      />
    )
  }

  const from = (page - 1) * PAGE_SIZE + 1
  const to   = Math.min(page * PAGE_SIZE, total)

  return (
    <>
      {/* Result count row */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">{from}–{to}</span>
          {" "}of{" "}
          <span className="font-semibold text-gray-900">{total}</span>
          {" "}properties
          {searchParams.location && (
            <span> in <span className="font-semibold text-gray-900">{searchParams.location}</span></span>
          )}
        </p>
      </div>

      {/* 4-column responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {properties.map((property, i) => (
          <div
            key={property.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
          >
            <PropertyCard property={property} priority={i < 4} />
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} buildHref={buildHref} />
    </>
  )
}

function PropertiesSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
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
  const sp   = await searchParams
  const page = sp.page ? Math.max(1, parseInt(sp.page, 10)) : 1

  const filters: PropertyFilters = {
    location:      sp.location,
    property_type: sp.property_type,
    min_price:     sp.min_price ? Number(sp.min_price) : undefined,
    max_price:     sp.max_price ? Number(sp.max_price) : undefined,
    bedrooms:      sp.bedrooms  ? Number(sp.bedrooms)  : undefined,
    max_guests:    sp.guests    ? Number(sp.guests)    : undefined,
  }

  const hasFilters = Object.values(filters).some((v) => v !== undefined)

  return (
    <div className="min-h-screen bg-[#f9f9ff]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Horizontal filter bar */}
        <div className="mb-6 animate-fade-in-up">
          <PropertyTopFilters
            location={sp.location}
            property_type={sp.property_type}
            min_price={sp.min_price}
            max_price={sp.max_price}
            bedrooms={sp.bedrooms}
            guests={sp.guests}
          />
        </div>

        {/* Page heading */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "60ms" }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display tracking-tight">
            {sp.location ? `Stays in ${sp.location}` : "Vacation Homes"}
          </h1>
          {hasFilters && (
            <p className="text-sm text-gray-500 mt-1">
              Filters applied —{" "}
              <a href="/properties" className="text-primary hover:underline font-medium">
                clear all
              </a>
            </p>
          )}
        </div>

        {/* Property grid with suspense */}
        <Suspense
          key={`${JSON.stringify(filters)}-${page}`}
          fallback={<PropertiesSkeletonGrid />}
        >
          <PropertiesSection filters={filters} page={page} searchParams={sp} />
        </Suspense>
      </div>
    </div>
  )
}
