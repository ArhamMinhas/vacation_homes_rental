"use client"

import { useState } from "react"
import { ChevronDown, Building2, BedDouble, Users, DollarSign, SlidersHorizontal } from "lucide-react"
import { PROPERTY_TYPES } from "@/lib/constants"

const PRICE_RANGES = [
  { label: "Any Price",            min: "",     max: ""    },
  { label: "$100 – $300/night",    min: "100",  max: "300" },
  { label: "$300 – $600/night",    min: "300",  max: "600" },
  { label: "$600 – $1,000/night",  min: "600",  max: "1000"},
  { label: "$1,000+/night",        min: "1000", max: ""    },
]

const BEDROOM_OPTIONS = [
  { label: "Any Bedrooms", value: "" },
  { label: "1 Bedroom",    value: "1" },
  { label: "2+ Bedrooms",  value: "2" },
  { label: "3+ Bedrooms",  value: "3" },
  { label: "5+ Bedrooms",  value: "5" },
]

const GUEST_OPTIONS = [
  { label: "Any Guests",  value: "" },
  { label: "1+ Guests",   value: "1" },
  { label: "2+ Guests",   value: "2" },
  { label: "4+ Guests",   value: "4" },
  { label: "6+ Guests",   value: "6" },
  { label: "8+ Guests",   value: "8" },
  { label: "10+ Guests",  value: "10"},
]

interface Props {
  location?:      string
  property_type?: string
  min_price?:     string
  max_price?:     string
  bedrooms?:      string
  guests?:        string
}

const SELECT_CLS =
  "w-full h-10 rounded-xl border border-gray-200 bg-white pl-3 pr-9 text-sm text-gray-800 appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"

export default function PropertyTopFilters({
  location, property_type, min_price, max_price, bedrooms, guests,
}: Props) {
  const activePriceIndex = PRICE_RANGES.findIndex(
    (r) => r.min === (min_price || "") && r.max === (max_price || "")
  )
  const [priceIdx, setPriceIdx] = useState(activePriceIndex < 0 ? 0 : activePriceIndex)

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriceIdx(Number(e.target.value))
  }

  const selectedRange = PRICE_RANGES[priceIdx]

  return (
    <form method="get" action="/properties">
      {/* Hidden price inputs from controlled state */}
      {selectedRange.min && <input type="hidden" name="min_price" value={selectedRange.min} />}
      {selectedRange.max && <input type="hidden" name="max_price" value={selectedRange.max} />}
      {/* Preserve location if present */}
      {location && <input type="hidden" name="location" value={location} />}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">

          {/* Price Range */}
          <FilterField label="Price Range" icon={<DollarSign className="h-3 w-3" />}>
            <select
              value={String(priceIdx)}
              onChange={handlePriceChange}
              className={SELECT_CLS}
            >
              {PRICE_RANGES.map((r, i) => (
                <option key={r.label} value={String(i)}>{r.label}</option>
              ))}
            </select>
          </FilterField>

          {/* Property Type */}
          <FilterField label="Property Type" icon={<Building2 className="h-3 w-3" />}>
            <select name="property_type" defaultValue={property_type || ""} className={SELECT_CLS}>
              <option value="">Any Type</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FilterField>

          {/* Bedrooms */}
          <FilterField label="Bedrooms" icon={<BedDouble className="h-3 w-3" />}>
            <select name="bedrooms" defaultValue={bedrooms || ""} className={SELECT_CLS}>
              {BEDROOM_OPTIONS.map((o) => (
                <option key={o.label} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FilterField>

          {/* Guests */}
          <FilterField label="Guests" icon={<Users className="h-3 w-3" />}>
            <select name="guests" defaultValue={guests || ""} className={SELECT_CLS}>
              {GUEST_OPTIONS.map((o) => (
                <option key={o.label} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FilterField>

          {/* Submit */}
          <div className="shrink-0 sm:pb-0">
            <button
              type="submit"
              className="h-10 w-full sm:w-auto px-6 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm whitespace-nowrap"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Update Search
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

function FilterField({
  label,
  icon,
  children,
}: {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 min-w-0 space-y-1.5">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
        {icon}
        {label}
      </label>
      <div className="relative">
        {children}
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}
