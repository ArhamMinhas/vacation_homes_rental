"use client"

import { CalendarDays } from "lucide-react"
import { Label } from "@/components/ui/label"
import { toInputDate } from "@/utils/formatDate"
import type { DateRange } from "@/services/availability.service"
import { datesOverlap } from "@/utils/checkOverlap"

interface DateRangePickerProps {
  checkIn: string
  checkOut: string
  onCheckInChange: (v: string) => void
  onCheckOutChange: (v: string) => void
  unavailable?: DateRange[]
  errorCheckIn?: string
  errorCheckOut?: string
}

function isDateUnavailable(date: string, unavailable: DateRange[]): boolean {
  return unavailable.some((r) => datesOverlap(date, date, r.start, r.end))
}

export default function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  unavailable = [],
  errorCheckIn,
  errorCheckOut,
}: DateRangePickerProps) {
  const today = toInputDate(new Date())
  const minCheckOut = checkIn
    ? toInputDate(new Date(new Date(checkIn).getTime() + 86400000))
    : toInputDate(new Date(Date.now() + 86400000))

  const handleCheckIn = (v: string) => {
    if (isDateUnavailable(v, unavailable)) return
    onCheckInChange(v)
    if (checkOut && v >= checkOut) onCheckOutChange("")
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Check-in</Label>
        <div className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border ${
          errorCheckIn ? "border-destructive" : "border-input"
        } bg-background focus-within:ring-1 focus-within:ring-ring`}>
          <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => handleCheckIn(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground outline-none [color-scheme:light] cursor-pointer"
          />
        </div>
        {errorCheckIn && <p className="text-xs text-destructive">{errorCheckIn}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Check-out</Label>
        <div className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border ${
          errorCheckOut ? "border-destructive" : "border-input"
        } bg-background focus-within:ring-1 focus-within:ring-ring`}>
          <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            type="date"
            value={checkOut}
            min={minCheckOut}
            onChange={(e) => onCheckOutChange(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground outline-none [color-scheme:light] cursor-pointer"
          />
        </div>
        {errorCheckOut && <p className="text-xs text-destructive">{errorCheckOut}</p>}
      </div>
    </div>
  )
}
