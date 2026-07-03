import {
  BedDouble, Bath, Users, MapPin, Home,
  Wifi, Wind, Car, Waves, Tv, Flame, Sun, Leaf, Mountain,
  Coffee, Dumbbell, Anchor, Sparkles, Eye, UtensilsCrossed,
  ShowerHead, RotateCcw, Thermometer, Check, Shield, Star, HeartHandshake,
  type LucideIcon,
} from "lucide-react"
import type { Property } from "@/types/property"
import { Badge } from "@/components/ui/badge"

interface PropertyDetailsProps {
  property: Property
}

const AMENITY_ICONS: Record<string, LucideIcon> = {
  WiFi: Wifi,
  "Wi-Fi": Wifi,
  "Free WiFi": Wifi,
  Kitchen: UtensilsCrossed,
  "Full kitchen": UtensilsCrossed,
  "Air conditioning": Wind,
  "Air Conditioning": Wind,
  AC: Wind,
  Parking: Car,
  "Free parking": Car,
  "On-site parking": Car,
  Pool: Waves,
  "Swimming pool": Waves,
  "Outdoor pool": Waves,
  "Ocean view": Eye,
  "Sea view": Eye,
  "Mountain view": Mountain,
  Beachfront: Anchor,
  Fireplace: Flame,
  "BBQ grill": Flame,
  Balcony: Sun,
  Terrace: Sun,
  Garden: Leaf,
  "Hot tub": Thermometer,
  Sauna: Thermometer,
  TV: Tv,
  "Smart TV": Tv,
  Gym: Dumbbell,
  "Fitness center": Dumbbell,
  Washer: RotateCcw,
  Dryer: RotateCcw,
  "Coffee maker": Coffee,
  Dishwasher: ShowerHead,
  Spa: Sparkles,
}

function AmenityIcon({ amenity }: { amenity: string }) {
  const Icon = AMENITY_ICONS[amenity] ?? Check
  return <Icon className="h-4 w-4 text-primary" />
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-start gap-3 mb-3">
          <Badge variant="secondary" className="text-xs font-medium px-2.5 py-1">
            <Home className="h-3 w-3 mr-1.5" />
            {property.property_type}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {property.title}
        </h1>
        <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0 text-primary/60" />
          <span className="text-sm">{property.location}</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 py-5 sm:py-6 border-y border-border">
        {[
          { icon: BedDouble, value: property.bedrooms, label: property.bedrooms === 1 ? "Bedroom" : "Bedrooms" },
          { icon: Bath, value: property.bathrooms, label: property.bathrooms === 1 ? "Bathroom" : "Bathrooms" },
          { icon: Users, value: property.max_guests, label: "Max guests" },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="text-center group">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/15 transition-colors">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <p className="text-base sm:text-lg font-bold text-foreground">{value}</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">About this space</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
          {property.description}
        </p>
      </div>

      {/* Amenities */}
      {property.amenities.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">What this place offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {property.amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/20 hover:bg-primary/5 transition-all group"
              >
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  <AmenityIcon amenity={amenity} />
                </div>
                <span className="text-sm text-foreground font-medium">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coastal Horizon Guarantee */}
      <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-orange-50/80 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Coastal Horizon Guarantee</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Shield,        title: "Secure booking",   desc: "256-bit encrypted payments and secure guest verification" },
            { icon: Star,          title: "Quality assured",  desc: "Every property is reviewed and meets our quality standards" },
            { icon: HeartHandshake, title: "24/7 support",    desc: "Our team is available around the clock for any assistance" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
