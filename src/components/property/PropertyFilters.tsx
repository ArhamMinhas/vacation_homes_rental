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

  return (
    <div className="bg-background rounded-2xl shadow-2xl p-2 w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
        {/* Location */}
        <div className="flex flex-col px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors cursor-text group">
          <label className="text-xs font-semibold text-foreground mb-1">Location</label>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="flex flex-col px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
          <label className="text-xs font-semibold text-foreground mb-1">Check-in</label>
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
        <div className="flex flex-col px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
          <label className="text-xs font-semibold text-foreground mb-1">Check-out</label>
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

        {/* Guests + Search */}
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex flex-col flex-1 px-2 py-1 rounded-xl hover:bg-muted/50 transition-colors">
            <label className="text-xs font-semibold text-foreground mb-1">Guests</label>
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
          <Button
            onClick={handleSearch}
            size="lg"
            className="h-12 w-12 rounded-xl p-0 flex-shrink-0"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
