"use client"

import { formatCurrency } from "@/utils/formatCurrency"
import type { Property } from "@/types/property"

interface Props {
  property: Property
}

export default function BookingPanelMobile({ property }: Props) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center justify-between gap-4 shadow-[0_-4px_24px_-4px_rgb(0_0_0_/0.1)]">
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-foreground">
            {formatCurrency(property.price_per_night)}
          </span>
          <span className="text-sm text-muted-foreground">/ night</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          +{formatCurrency(property.cleaning_fee)} cleaning
        </p>
      </div>
      <a
        href="#booking-form"
        className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200"
      >
        Book now
      </a>
    </div>
  )
}
