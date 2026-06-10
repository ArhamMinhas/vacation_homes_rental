"use client"

import Link from "next/link"
import { formatCurrency } from "@/utils/formatCurrency"
import type { Property } from "@/types/property"

interface Props {
  property: Property
}

export default function BookingPanelMobile({ property }: Props) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border px-4 py-3 flex items-center justify-between gap-4 shadow-lg">
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-foreground">
          {formatCurrency(property.price_per_night)}
        </span>
        <span className="text-sm text-muted-foreground">/ night</span>
      </div>
      <a
        href="#booking-form"
        className="flex-1 max-w-[160px] inline-flex items-center justify-center h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors"
      >
        Book now
      </a>
    </div>
  )
}
