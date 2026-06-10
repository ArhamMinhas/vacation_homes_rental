import { formatCurrency } from "@/utils/formatCurrency"
import { formatDateRange } from "@/utils/formatDate"

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
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between text-muted-foreground">
        <span>{formatDateRange(checkIn, checkOut)}</span>
        <span>{nights} {nights === 1 ? "night" : "nights"}</span>
      </div>
      <div className="space-y-2 pt-1 border-t border-border">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {formatCurrency(pricePerNight)} × {nights} nights
          </span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cleaning fee</span>
          <span className="font-medium">{formatCurrency(cleaningFee)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border font-semibold text-base">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
