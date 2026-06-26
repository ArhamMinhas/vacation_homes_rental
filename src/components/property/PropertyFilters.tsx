"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, CalendarDays, Users } from "lucide-react"
import { ROUTES } from "@/lib/constants"

interface HomeSearchProps {
  variant?: "hero" | "inline"
}

export default function PropertyFilters({ variant = "hero" }: HomeSearchProps) {
  const router = useRouter()
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]

  const [location, setLocation]   = useState("")
  const [checkIn, setCheckIn]     = useState("")
  const [guests, setGuests]       = useState("")

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (location.trim()) params.set("location", location.trim())
    if (checkIn) params.set("checkin", checkIn)
    if (guests) params.set("guests", guests)
    router.push(`${ROUTES.PROPERTIES}?${params.toString()}`)
  }, [location, checkIn, guests, router])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  if (variant === "inline") {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-3 h-10 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <button
          onClick={handleSearch}
          className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shrink-0"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    )
  }

  // ── Hero variant — Stitch pill search bar ─────────────────────────────────
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-full shadow-2xl flex items-stretch overflow-hidden border border-white/20">

        {/* Location */}
        <div className="flex-1 flex flex-col px-6 py-3 hover:bg-gray-50/60 transition-colors cursor-text border-r border-gray-100 min-w-0">
          <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-0.5">Location</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none truncate"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="flex-1 hidden sm:flex flex-col px-6 py-3 hover:bg-gray-50/60 transition-colors border-r border-gray-100 min-w-0">
          <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-0.5">Check In</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={checkIn}
              min={today}
              placeholder="Add dates"
              onChange={(e) => setCheckIn(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-gray-700 outline-none [color-scheme:light] cursor-pointer"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="flex-1 hidden sm:flex flex-col px-6 py-3 hover:bg-gray-50/60 transition-colors min-w-0">
          <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-0.5">Guests</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={20}
              value={guests}
              placeholder="Add guests"
              onChange={(e) => setGuests(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Search button — orange circle */}
        <div className="flex items-center justify-center px-3 py-2 flex-shrink-0">
          <button
            onClick={handleSearch}
            className="h-11 w-11 rounded-full bg-primary flex items-center justify-center shadow-md hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile check-in/guests below */}
      <div className="flex sm:hidden gap-2 mt-2">
        <div className="flex-1 bg-white/90 rounded-2xl px-4 py-2.5 shadow-lg">
          <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest block mb-0.5">Check In</span>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 outline-none [color-scheme:light]"
          />
        </div>
        <div className="flex-1 bg-white/90 rounded-2xl px-4 py-2.5 shadow-lg">
          <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest block mb-0.5">Guests</span>
          <input
            type="number"
            min={1}
            max={20}
            value={guests}
            placeholder="1"
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 outline-none"
          />
        </div>
      </div>
    </div>
  )
}
