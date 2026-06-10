import Link from "next/link"
import { MapPin, BedDouble, Bath, Users, Star } from "lucide-react"
import type { Property } from "@/types/property"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface PropertyCardProps {
  property: Property
  className?: string
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  const primaryImage = property.images?.[0]

  return (
    <Link
      href={ROUTES.PROPERTY_DETAIL(property.id)}
      className={cn(
        "group block bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryImage}
            alt={property.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="text-4xl">🏡</span>
          </div>
        )}

        {/* Property type badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-2.5 py-1 rounded-full border border-border/50">
            {property.property_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & location */}
        <div>
          <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" />
            {property.bedrooms} {property.bedrooms === 1 ? "bed" : "beds"}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            {property.bathrooms} {property.bathrooms === 1 ? "bath" : "baths"}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {property.max_guests} guests
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <div>
            <span className="text-base font-bold text-foreground">
              {formatPrice(property.price_per_night)}
            </span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          <span className="text-xs text-muted-foreground">
            +{formatPrice(property.cleaning_fee)} cleaning
          </span>
        </div>
      </div>
    </Link>
  )
}
