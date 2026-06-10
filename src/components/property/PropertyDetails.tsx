import { BedDouble, Bath, Users, MapPin, Home, Check } from "lucide-react"
import type { Property } from "@/types/property"
import { Badge } from "@/components/ui/badge"

interface PropertyDetailsProps {
  property: Property
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-start gap-3 mb-3">
          <Badge variant="secondary" className="text-xs font-medium">
            <Home className="h-3 w-3 mr-1" />
            {property.property_type}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {property.title}
        </h1>
        <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{property.location}</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
        <div className="text-center">
          <BedDouble className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-semibold text-foreground">{property.bedrooms}</p>
          <p className="text-xs text-muted-foreground">{property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}</p>
        </div>
        <div className="text-center">
          <Bath className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-semibold text-foreground">{property.bathrooms}</p>
          <p className="text-xs text-muted-foreground">{property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}</p>
        </div>
        <div className="text-center">
          <Users className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-semibold text-foreground">{property.max_guests}</p>
          <p className="text-xs text-muted-foreground">Max guests</p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">About this property</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {property.description}
        </p>
      </div>

      {/* Amenities */}
      {property.amenities.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">What this place offers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {property.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2.5 text-sm text-foreground">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                {amenity}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
