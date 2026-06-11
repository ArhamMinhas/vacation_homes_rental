"use client"

import { CalendarDays } from "lucide-react"
import { Label } from "@/components/ui/label"
import { toInputDate } from "@/utils/formatDate"
import { cn } from "@/lib/utils"
import type { DateRange } from "@/services/availability.service"

interface DateRangePickerProps {
  checkIn: string
  checkOut: string
  onCheckInChange: (v: string) => void
  onCheckOutChange: (v: string) => void
  unavailable?: DateRange[]
  errorCheckIn?: string
  errorCheckOut?: string
}

export default function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  errorCheckIn,
  errorCheckOut,
}: DateRangePickerProps) {
  const today = toInputDate(new Date())
  const minCheckOut = checkIn
    ? toInputDate(new Date(new Date(checkIn).getTime() + 86_400_000))
    : toInputDate(new Date(Date.now() + 86_400_000))

  const handleCheckIn = (v: string) => {
    onCheckInChange(v)
    if (checkOut && v >= checkOut) onCheckOutChange("")
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Check-in */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Check-in
        </Label>
        <div
          className={cn(
            "relative flex items-center gap-2.5 h-11 px-3 rounded-xl border bg-background transition-all duration-150",
            "focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-ring",
            errorCheckIn ? "border-destructive" : "border-input hover:border-ring/40"
          )}
        >
          <CalendarDays className="h-4 w-4 text-primary/60 flex-shrink-0" />
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => handleCheckIn(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none [color-scheme:light] cursor-pointer min-w-0"
          />
        </div>
        {errorCheckIn && (
          <p className="text-xs text-destructive">{errorCheckIn}</p>
        )}
      </div>

      {/* Check-out */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Check-out
        </Label>
        <div
          className={cn(
            "relative flex items-center gap-2.5 h-11 px-3 rounded-xl border bg-background transition-all duration-150",
            "focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-ring",
            errorCheckOut ? "border-destructive" : "border-input hover:border-ring/40"
          )}
        >
          <CalendarDays className="h-4 w-4 text-primary/60 flex-shrink-0" />
          <input
            type="date"
            value={checkOut}
            min={minCheckOut}
            onChange={(e) => onCheckOutChange(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none [color-scheme:light] cursor-pointer min-w-0"
          />
        </div>
        {errorCheckOut && (
          <p className="text-xs text-destructive">{errorCheckOut}</p>
        )}
      </div>
    </div>
  )
}
