"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import type { Property } from "@/types/property"
import { formatCurrency } from "@/utils/formatCurrency"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const PROPERTY_TAGS = [
  "Free Cancellation",
  "Instant Book",
  "Breakfast Included",
  "Concierge Service",
  "Ocean Front",
  "City Center",
  "Sustainability Award",
  "Last Available",
]

function getCardMeta(property: Property) {
  const seed = Math.floor(property.price_per_night)
  const mod5  = seed % 5

  const badge =
    mod5 === 1
      ? { label: "LIMITED",   cls: "bg-amber-400 text-amber-900"   }
      : mod5 === 4
      ? { label: "BOOKED",    cls: "bg-red-500 text-white"         }
      : { label: "AVAILABLE", cls: "bg-emerald-500 text-white"     }

  const verified = seed % 3 !== 2
  const rating   = (4.7 + (seed % 10) * 0.03).toFixed(1)
  const tag      = PROPERTY_TAGS[seed % PROPERTY_TAGS.length]

  return { badge, verified, rating, tag }
}

interface Props {
  property: Property
  priority?: boolean
}

export default function PropertyCard({ property, priority }: Props) {
  const { badge, verified, rating, tag } = getCardMeta(property)

  return (
    <Link href={ROUTES.PROPERTY_DETAIL(property.id)} className="block group">
      <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

        {/* ── Image ─────────────────────────────────────────────── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={priority}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-5xl text-gray-300">🏡</div>
          )}

          {/* VERIFIED badge — top-left */}
          {verified && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
              <span>✓</span>
              <span>VERIFIED</span>
            </div>
          )}

          {/* Status badge — top-right */}
          <div className={cn(
            "absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm",
            badge.cls
          )}>
            {badge.label}
          </div>

          {/* Heart — bottom-right */}
          <button
            className="absolute bottom-2.5 right-2.5 h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            aria-label="Save property"
            type="button"
          >
            <Heart className="h-3.5 w-3.5 text-gray-600" />
          </button>
        </div>

        {/* ── Content ────────────────────────────────────────────── */}
        <div className="p-3.5">

          {/* Title + rating */}
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 flex-1 font-display">
              {property.title}
            </h3>
            <div className="flex items-center gap-0.5 shrink-0">
              <span className="text-yellow-500 text-sm leading-none">★</span>
              <span className="text-xs font-semibold text-gray-900">{rating}</span>
            </div>
          </div>

          {/* Location + bedrooms */}
          <p className="text-xs text-gray-500 mb-2.5">
            {property.location}&nbsp;·&nbsp;{property.bedrooms}&nbsp;Bedroom{property.bedrooms !== 1 ? "s" : ""}
          </p>

          {/* Price + tag */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold leading-none">
              <span className="text-primary">{formatCurrency(property.price_per_night)}</span>
              <span className="text-gray-400 font-normal text-xs"> /night</span>
            </div>
            <span className="text-[10px] font-medium text-primary">{tag}</span>
          </div>

        </div>
      </article>
    </Link>
  )
}
