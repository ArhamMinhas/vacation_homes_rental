"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, BedDouble, Bath, Users, Heart } from "lucide-react"
import type { Property } from "@/types/property"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface PropertyCardProps {
  property: Property
  className?: string
  /** Set true for above-the-fold cards to preload as LCP candidate */
  priority?: boolean
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)
}

const TYPE_BADGE: Record<string, string> = {
  Villa: "bg-violet-600/90",
  Apartment: "bg-blue-600/90",
  Cabin: "bg-amber-700/90",
  "Beach House": "bg-cyan-600/90",
  Cottage: "bg-emerald-700/90",
  Penthouse: "bg-slate-700/90",
  Farmhouse: "bg-lime-700/90",
  Studio: "bg-indigo-600/90",
}

export default function PropertyCard({ property, className, priority = false }: PropertyCardProps) {
  const primaryImage = property.images?.[0]
  const typeBadge = TYPE_BADGE[property.property_type] ?? "bg-gray-700/90"

  return (
    <Link
      href={ROUTES.PROPERTY_DETAIL(property.id)}
      className={cn(
        "group block bg-card rounded-2xl overflow-hidden border border-border/70",
        "shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <span className="text-5xl">🏡</span>
          </div>
        )}

        {/* Gradient vignette for overlay text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Property type badge — top left */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "inline-block text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm",
              typeBadge
            )}
          >
            {property.property_type}
          </span>
        </div>

        {/* Wishlist button — appears on hover */}
        <button
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 transition-all duration-200"
          onClick={(e) => e.preventDefault()}
          aria-label="Save to wishlist"
        >
          <Heart className="h-3.5 w-3.5 text-foreground/70" />
        </button>

        {/* Price pill — bottom right of image */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-sm font-bold text-foreground leading-none">
              {formatPrice(property.price_per_night)}
            </span>
            <span className="text-[11px] text-muted-foreground"> /night</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-foreground text-[15px] leading-snug line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="text-xs truncate">{property.location}</span>
          </div>
        </div>

        <div className="h-px bg-border/60 mb-3" />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5 text-primary/70" />
              {property.bedrooms} {property.bedrooms === 1 ? "bed" : "beds"}
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="h-3.5 w-3.5 text-primary/70" />
              {property.bathrooms} {property.bathrooms === 1 ? "bath" : "baths"}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary/70" />
              {property.max_guests}
            </span>
          </div>
          {property.cleaning_fee > 0 && (
            <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
              +{formatPrice(property.cleaning_fee)} cleaning
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
