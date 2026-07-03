"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, BedDouble, Users, DollarSign, SlidersHorizontal, X } from "lucide-react"
import { PROPERTY_TYPES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const PRICE_RANGES = [
  { label: "Any Price",            min: "",     max: ""    },
  { label: "$100 – $300/night",   min: "100",  max: "300" },
  { label: "$300 – $600/night",   min: "300",  max: "600" },
  { label: "$600 – $1,000/night", min: "600",  max: "1000"},
  { label: "$1,000+/night",       min: "1000", max: ""    },
]

const BEDROOM_OPTIONS = [
  { label: "Any",    value: "" },
  { label: "1",      value: "1" },
  { label: "2+",     value: "2" },
  { label: "3+",     value: "3" },
  { label: "5+",     value: "5" },
]

const GUEST_OPTIONS = [
  { label: "Any",  value: "" },
  { label: "1+",   value: "1" },
  { label: "2+",   value: "2" },
  { label: "4+",   value: "4" },
  { label: "6+",   value: "6" },
  { label: "8+",   value: "8" },
  { label: "10+",  value: "10"},
]

const SELECT_CLS =
  "w-full h-9 rounded-xl border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-800 appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer hover:border-gray-300"

interface Props {
  location?:      string
  property_type?: string
  min_price?:     string
  max_price?:     string
  bedrooms?:      string
  guests?:        string
}

export default function PropertyTopFilters({
  location, property_type, min_price, max_price, bedrooms, guests,
}: Props) {
  const activePriceIdx = PRICE_RANGES.findIndex(
    (r) => r.min === (min_price || "") && r.max === (max_price || "")
  )
  const [priceIdx, setPriceIdx]   = useState(activePriceIdx < 0 ? 0 : activePriceIdx)
  const [propType, setPropType]   = useState(property_type || "")

  const selectedRange = PRICE_RANGES[priceIdx]
  const activeCount   = [propType, priceIdx > 0 ? "1" : "", bedrooms || "", guests || ""].filter(Boolean).length

  const clearAll = () => {
    setPriceIdx(0)
    setPropType("")
  }

  return (
    <form method="get" action="/properties">
      {/* Hidden inputs for controlled state */}
      {selectedRange.min && <input type="hidden" name="min_price" value={selectedRange.min} />}
      {selectedRange.max && <input type="hidden" name="max_price" value={selectedRange.max} />}
      {propType         && <input type="hidden" name="property_type" value={propType} />}
      {location         && <input type="hidden" name="location" value={location} />}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Property type pill row */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">Type</span>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-1">
              {["", ...PROPERTY_TYPES].map((type) => (
                <motion.button
                  key={type || "__all__"}
                  type="button"
                  onClick={() => setPropType(type)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors shrink-0",
                    propType === type
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:text-primary"
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  {type || "All Types"}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter row */}
        <div className="px-5 py-3.5">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">

            {/* Price Range */}
            <FilterSelect label="Price" icon={<DollarSign className="h-3 w-3" />}>
              <select
                value={String(priceIdx)}
                onChange={(e) => setPriceIdx(Number(e.target.value))}
                className={SELECT_CLS}
              >
                {PRICE_RANGES.map((r, i) => (
                  <option key={r.label} value={String(i)}>{r.label}</option>
                ))}
              </select>
            </FilterSelect>

            {/* Bedrooms */}
            <FilterSelect label="Bedrooms" icon={<BedDouble className="h-3 w-3" />}>
              <select name="bedrooms" defaultValue={bedrooms || ""} className={SELECT_CLS}>
                {BEDROOM_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.value ? `${o.label} bed${o.value === "1" ? "" : "s"}` : "Any bedrooms"}
                  </option>
                ))}
              </select>
            </FilterSelect>

            {/* Guests */}
            <FilterSelect label="Guests" icon={<Users className="h-3 w-3" />}>
              <select name="guests" defaultValue={guests || ""} className={SELECT_CLS}>
                {GUEST_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.value ? `${o.label} guests` : "Any guests"}
                  </option>
                ))}
              </select>
            </FilterSelect>

            {/* Actions */}
            <div className="flex gap-2 shrink-0 sm:pb-0">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="h-9 px-3 rounded-xl border border-gray-200 text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700 flex items-center gap-1.5 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
              <motion.button
                type="submit"
                className="h-9 px-5 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap relative"
                whileTap={{ scale: 0.97 }}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Apply Filters
                {activeCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {activeCount}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

function FilterSelect({
  label, icon, children,
}: {
  label:    string
  icon:     React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 min-w-0 space-y-1">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
        {icon}
        {label}
      </label>
      <div className="relative">
        {children}
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}
