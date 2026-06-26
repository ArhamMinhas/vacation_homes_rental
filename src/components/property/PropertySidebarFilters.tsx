"use client"

import { useRouter, usePathname } from "next/navigation"
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react"
import { PROPERTY_TYPES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const PRICE_RANGES = [
  { label: "$100 – $300",   min: "100",  max: "300"  },
  { label: "$300 – $600",   min: "300",  max: "600"  },
  { label: "$600 – $1,000", min: "600",  max: "1000" },
  { label: "$1,000+",       min: "1000", max: ""     },
]

interface Props {
  location?:      string
  property_type?: string
  min_price?:     string
  max_price?:     string
  bedrooms?:      string
  guests?:        string
  hasFilters:     boolean
}

export default function PropertySidebarFilters({
  location, property_type, min_price, max_price, bedrooms, guests, hasFilters,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const values = {
      location, property_type, min_price, max_price, bedrooms, guests,
      ...overrides,
    }
    for (const [k, v] of Object.entries(values)) {
      if (v) params.set(k, v)
    }
    const qs = params.toString()
    return `${pathname}${qs ? `?${qs}` : ""}`
  }

  const activePriceLabel = PRICE_RANGES.find(
    (r) => r.min === min_price && r.max === (max_price ?? "")
  )?.label

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filters
        </div>
        {hasFilters && (
          <a href="/properties" className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
            <X className="h-3 w-3" /> Reset
          </a>
        )}
      </div>

      <form
        method="get"
        action="/properties"
        className="p-5 space-y-7"
      >
        {/* Location */}
        <div>
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider block mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              name="location"
              defaultValue={location}
              placeholder="City, country…"
              className="w-full h-9 rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Price range — link-based for instant navigation */}
        <div>
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider block mb-2">Price Range</label>
          <div className="space-y-1.5">
            {[{ label: "Any price", min: "", max: "" }, ...PRICE_RANGES].map((range) => {
              const isActive = range.label === "Any price"
                ? !min_price
                : activePriceLabel === range.label
              return (
                <a
                  key={range.label}
                  href={buildUrl({ min_price: range.min || undefined, max_price: range.max || undefined, page: undefined })}
                  className={cn(
                    "flex items-center gap-2.5 text-sm rounded-lg px-2 py-1 transition-colors",
                    isActive
                      ? "text-primary font-medium bg-primary/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <span className={cn(
                    "h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    isActive ? "border-primary" : "border-gray-300"
                  )}>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary block" />}
                  </span>
                  {range.label}
                </a>
              )
            })}
          </div>
        </div>

        {/* Property type */}
        <div>
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider block mb-2">Property Type</label>
          <div className="space-y-1.5">
            {PROPERTY_TYPES.map((type) => {
              const isSelected = property_type === type
              return (
                <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="radio"
                    name="property_type"
                    value={type}
                    defaultChecked={isSelected}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  <span className={cn("text-sm transition-colors", isSelected ? "text-primary font-medium" : "text-gray-600 group-hover:text-gray-900")}>
                    {type}
                  </span>
                </label>
              )
            })}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="radio" name="property_type" value="" defaultChecked={!property_type} className="h-3.5 w-3.5 accent-primary" />
              <span className="text-sm text-gray-500">Any type</span>
            </label>
          </div>
          {/* Preserve price range in form submission */}
          {min_price && <input type="hidden" name="min_price" value={min_price} />}
          {max_price && <input type="hidden" name="max_price" value={max_price} />}
        </div>

        {/* Bedrooms */}
        <div>
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider block mb-2">Bedrooms</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Any", value: "" },
              { label: "1+",  value: "1" },
              { label: "2+",  value: "2" },
              { label: "3+",  value: "3" },
              { label: "5+",  value: "5" },
            ].map(({ label, value }) => (
              <label key={label} className="cursor-pointer">
                <input type="radio" name="bedrooms" value={value} defaultChecked={(bedrooms ?? "") === value} className="sr-only" />
                <span className={cn(
                  "inline-flex h-8 px-3 items-center rounded-full text-xs font-medium border transition-all",
                  (bedrooms ?? "") === value
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                )}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider block mb-2">Guests</label>
          <select
            name="guests"
            defaultValue={guests ?? ""}
            className="w-full h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">Any</option>
            {[1, 2, 4, 6, 8, 10].map((n) => (
              <option key={n} value={n}>{n}+ guests</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-10 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm"
        >
          <Search className="h-3.5 w-3.5" />
          Update Search
        </button>
      </form>
    </div>
  )
}
