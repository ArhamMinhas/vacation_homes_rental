"use client"

import { CalendarDays } from "lucide-react"
import { Label } from "@/components/ui/label"
import { toInputDate, formatDate } from "@/utils/formatDate"
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
  onConflict?: (message: string, type: "booking" | "blocked") => void
}

function findConflict(start: string, end: string, ranges: DateRange[]): DateRange | null {
  return ranges.find((r) => r.start < end && r.end > start) ?? null
}

function buildConflictMessage(conflict: DateRange, context: "check-in" | "range"): string {
  if (conflict.type === "blocked") {
    // end is exclusive (normalised) — subtract 1 day to get the inclusive display end
    const d = new Date(conflict.end)
    d.setUTCDate(d.getUTCDate() - 1)
    const inclusiveEnd = d.toISOString().split("T")[0]
    const period =
      conflict.start === inclusiveEnd
        ? formatDate(conflict.start)
        : `${formatDate(conflict.start)} – ${formatDate(inclusiveEnd)}`
    return `The host has blocked ${period} for maintenance or personal use.`
  }
  // Guest booking conflict
  const period = `${formatDate(conflict.start)} – ${formatDate(conflict.end)}`
  return context === "check-in"
    ? `Your check-in falls within an existing reservation (${period}).`
    : `Your selected dates overlap with an existing reservation (${period}).`
}

export default function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  unavailable = [],
  errorCheckIn,
  errorCheckOut,
  onConflict,
}: DateRangePickerProps) {
  const today = toInputDate(new Date())
  const minCheckOut = checkIn
    ? toInputDate(new Date(new Date(checkIn).getTime() + 86_400_000))
    : toInputDate(new Date(Date.now() + 86_400_000))

  const handleCheckIn = (v: string) => {
    onCheckInChange(v)
    if (checkOut && v >= checkOut) onCheckOutChange("")

    if (v && unavailable.length > 0) {
      const rangeEnd =
        checkOut && checkOut > v
          ? checkOut
          : toInputDate(new Date(new Date(v).getTime() + 86_400_000))
      const conflict = findConflict(v, rangeEnd, unavailable)
      if (conflict) onConflict?.(buildConflictMessage(conflict, "check-in"), conflict.type ?? "booking")
    }
  }

  const handleCheckOut = (v: string) => {
    onCheckOutChange(v)

    if (v && checkIn && unavailable.length > 0) {
      const conflict = findConflict(checkIn, v, unavailable)
      if (conflict) onConflict?.(buildConflictMessage(conflict, "range"), conflict.type ?? "booking")
    }
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
            onChange={(e) => handleCheckOut(e.target.value)}
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
