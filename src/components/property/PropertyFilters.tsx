"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, CalendarDays, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/lib/constants"

interface HomeSearchProps {
  variant?: "hero" | "inline"
}

export default function PropertyFilters({ variant = "hero" }: HomeSearchProps) {
  const router = useRouter()
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]

  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (location.trim()) params.set("location", location.trim())
    if (checkIn) params.set("checkin", checkIn)
    if (checkOut) params.set("checkout", checkOut)
    if (guests > 1) params.set("guests", String(guests))
    router.push(`${ROUTES.PROPERTIES}?${params.toString()}`)
  }, [location, checkIn, checkOut, guests, router])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  if (variant === "inline") {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} className="gap-2 shrink-0">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    )
  }

  // ── Hero variant ───────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden">

      {/* Fields row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/30">

        {/* Location */}
        <div className="col-span-2 sm:col-span-2 lg:col-span-1 flex flex-col px-4 py-3.5 hover:bg-gray-50/80 transition-colors group lg:border-r border-border/30">
          <label className="text-[11px] font-bold text-foreground mb-1 uppercase tracking-wide">Location</label>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 outline-none"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="flex flex-col px-4 py-3.5 hover:bg-gray-50/80 transition-colors">
          <label className="text-[11px] font-bold text-foreground mb-1 uppercase tracking-wide">Check-in</label>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => {
                setCheckIn(e.target.value)
                if (checkOut && e.target.value >= checkOut) setCheckOut("")
              }}
              className="w-full bg-transparent text-sm text-foreground outline-none [color-scheme:light] cursor-pointer"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="flex flex-col px-4 py-3.5 hover:bg-gray-50/80 transition-colors">
          <label className="text-[11px] font-bold text-foreground mb-1 uppercase tracking-wide">Check-out</label>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="date"
              value={checkOut}
              min={checkIn || tomorrow}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none [color-scheme:light] cursor-pointer"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="flex flex-col px-4 py-3.5 hover:bg-gray-50/80 transition-colors">
          <label className="text-[11px] font-bold text-foreground mb-1 uppercase tracking-wide">Guests</label>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
              className="w-full bg-transparent text-sm text-foreground outline-none"
            />
          </div>
        </div>
      </div>

      {/* Search button — full width on mobile, hidden per-cell */}
      <div className="px-3 pb-3 pt-0 sm:hidden">
        <Button onClick={handleSearch} className="w-full h-11 rounded-xl gap-2 font-semibold">
          <Search className="h-4 w-4" />
          Search properties
        </Button>
      </div>

      {/* Search button — desktop: floating inside last cell handled by lg grid */}
      <div className="hidden sm:flex px-3 pb-3 pt-0 lg:hidden justify-end">
        <Button onClick={handleSearch} className="h-10 px-6 rounded-xl gap-2 font-semibold">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Desktop search icon row button — lives outside grid when lg */}
      <div className="hidden lg:flex justify-end px-3 pb-3 -mt-1">
        <Button onClick={handleSearch} size="lg" className="h-11 px-7 rounded-xl gap-2 font-semibold">
          <Search className="h-5 w-5" />
          Search
        </Button>
      </div>
    </div>
  )
}
