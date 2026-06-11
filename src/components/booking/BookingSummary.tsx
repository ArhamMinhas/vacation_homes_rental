import { CalendarDays } from "lucide-react"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDateShort } from "@/utils/formatDate"

interface BookingSummaryProps {
  pricePerNight: number
  cleaningFee: number
  nights: number
  checkIn: string
  checkOut: string
}

export default function BookingSummary({
  pricePerNight,
  cleaningFee,
  nights,
  checkIn,
  checkOut,
}: BookingSummaryProps) {
  const subtotal = pricePerNight * nights
  const total = subtotal + cleaningFee

  return (
    <div className="rounded-xl bg-muted/40 border border-border/80 overflow-hidden animate-slide-up">
      {/* Date range header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-primary/5">
        <CalendarDays className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="text-sm font-medium text-foreground">
          {formatDateShort(checkIn)} → {formatDateShort(checkOut)}
        </span>
        <span className="ml-auto text-xs text-muted-foreground font-medium bg-primary/10 px-2 py-0.5 rounded-full">
          {nights} {nights === 1 ? "night" : "nights"}
        </span>
      </div>

      {/* Line items */}
      <div className="px-4 py-3 space-y-2.5 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            {formatCurrency(pricePerNight)} × {nights} {nights === 1 ? "night" : "nights"}
          </span>
          <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Cleaning fee</span>
          <span className="font-medium text-foreground">{formatCurrency(cleaningFee)}</span>
        </div>
      </div>

      {/* Total row */}
      <div className="flex justify-between items-center px-4 py-3 bg-primary/8 border-t border-border/60">
        <span className="font-semibold text-foreground">Total</span>
        <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
