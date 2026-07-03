import { Suspense } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { getFilteredProperties, type PropertyFilters } from "@/services/property.service"
import PropertyCard from "@/components/property/PropertyCard"
import PropertyCardSkeleton from "@/components/property/PropertyCardSkeleton"
import PropertyTopFilters from "@/components/property/PropertyTopFilters"
import EmptyState from "@/components/common/EmptyState"
import Pagination from "@/components/common/Pagination"
import { PropertiesGrid } from "@/components/property/PropertiesGrid"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Properties — Coastal Horizon" }

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
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">{from}–{to}</span>
          {" "}of{" "}
          <span className="font-semibold text-gray-900">{total}</span>
          {" "}properties
          {searchParams.location && (
            <span> in <span className="font-semibold text-primary">{searchParams.location}</span></span>
          )}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{total} total</span>
        </div>
      </div>

      <PropertiesGrid properties={properties} />

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
      {/* Page header — cinematic treatment */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #080d1a 0%, #0f1826 60%, #0a1020 100%)" }}>
        {/* Ambient orbs */}
        <div className="absolute -top-16 left-1/4 w-80 h-80 rounded-full bg-primary/12 blur-[90px] pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full bg-blue-600/8 blur-[70px] pointer-events-none" />
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
              {sp.location ? `Stays in ${sp.location}` : "All Vacation Homes"}
            </h1>
            {hasFilters ? (
              <p className="text-sm text-white/40 mt-0.5">
                Filters applied —{" "}
                <a href="/properties" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  clear all
                </a>
              </p>
            ) : (
              <p className="text-sm text-white/40 mt-0.5">Handpicked coastal retreats and luxury villas</p>
            )}
          </div>

          {/* Filter bar */}
          <PropertyTopFilters
            location={sp.location}
            property_type={sp.property_type}
            min_price={sp.min_price}
            max_price={sp.max_price}
            bedrooms={sp.bedrooms}
            guests={sp.guests}
          />
        </div>

        {/* Fade into page bg */}
        <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-[#f9f9ff] to-transparent pointer-events-none" />
      </div>

      {/* Property grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
