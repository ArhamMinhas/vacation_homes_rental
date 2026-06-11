"use client"

import { Minus, Plus, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface GuestSelectorProps {
  value: number
  max: number
  onChange: (v: number) => void
  error?: string
}

export default function GuestSelector({ value, max, onChange, error }: GuestSelectorProps) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Guests</div>
      <div
        className={cn(
          "flex items-center justify-between gap-3 h-11 px-3 rounded-xl border bg-background",
          error ? "border-destructive" : "border-input"
        )}
      >
        <div className="flex items-center gap-2.5 text-sm text-foreground">
          <Users className="h-4 w-4 text-primary/60" />
          <span className="font-medium">{value} {value === 1 ? "guest" : "guests"}</span>
          <span className="text-muted-foreground text-xs">· max {max}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChange(Math.max(1, value - 1))}
            disabled={value <= 1}
            className="h-7 w-7 rounded-lg border border-input flex items-center justify-center hover:bg-muted hover:border-ring/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-6 text-center text-sm font-semibold">{value}</span>
          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            className="h-7 w-7 rounded-lg border border-input flex items-center justify-center hover:bg-muted hover:border-ring/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
