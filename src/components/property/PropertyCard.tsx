"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate } from "framer-motion"
import { Heart, Star, MapPin, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react"
import type { Property } from "@/types/property"
import { formatCurrency } from "@/utils/formatCurrency"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

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
  const seed  = Math.floor(property.price_per_night)
  const mod5  = seed % 5
  const badge =
    mod5 === 1 ? { label: "LIMITED",   cls: "bg-amber-500/90 text-white"   } :
    mod5 === 4 ? { label: "BOOKED",    cls: "bg-red-500/90 text-white"     } :
                 { label: "AVAILABLE", cls: "bg-emerald-500/90 text-white" }
  const verified = seed % 3 !== 2
  const rating   = (4.7 + (seed % 10) * 0.03).toFixed(2)
  const reviews  = 18 + (seed % 80)
  const tag      = PROPERTY_TAGS[seed % PROPERTY_TAGS.length]
  return { badge, verified, rating, reviews, tag }
}

interface Props {
  property: Property
  priority?: boolean
}

export default function PropertyCard({ property, priority }: Props) {
  const [liked, setLiked]       = useState(false)
  const [hovered, setHovered]   = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const { badge, verified, rating, reviews, tag } = getCardMeta(property)

  const cardRef = useRef<HTMLElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })
  const shineX = useTransform(mouseX, [-0.5, 0.5], ['20%', '80%'])
  const shineY = useTransform(mouseY, [-0.5, 0.5], ['20%', '80%'])
  const shineBg = useMotionTemplate`radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.12) 0%, transparent 55%)`

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function onMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  const imgs = property.images.length > 0 ? property.images : []
  const hasMultiple = imgs.length > 1

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIndex(i => (i - 1 + imgs.length) % imgs.length)
  }
  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIndex(i => (i + 1) % imgs.length)
  }

  return (
    <Link href={ROUTES.PROPERTY_DETAIL(property.id)} className="block group" style={{ perspective: '900px' }}>
      <motion.article
        ref={cardRef}
        className="relative bg-white rounded-2xl overflow-hidden border border-gray-100/80 shadow-sm"
        style={{ rotateX, rotateY }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{
          y: -6,
          boxShadow: "0 24px 64px rgba(0,0,0,0.14)",
          transition: { duration: 0.3, ease: EASE },
        }}
      >
        {/* Glass shimmer following cursor */}
        <motion.div className="absolute inset-0 pointer-events-none z-20 rounded-2xl" style={{ background: shineBg }} />
        {/* ── Image area ─────────────────────────────── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {imgs.length > 0 ? (
            <motion.div
              className="absolute inset-0"
              animate={{ scale: hovered ? 1.07 : 1 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={imgIndex}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={imgs[imgIndex]}
                    alt={property.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover"
                    priority={priority && imgIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
              <MapPin className="h-10 w-10 text-gray-300" />
            </div>
          )}

          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          />

          {/* Mini carousel controls */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={prevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-6 w-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-3.5 w-3.5 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={nextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-6 w-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight className="h-3.5 w-3.5 text-gray-700" />
              </button>

              {/* Dot row */}
              <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {imgs.slice(0, 5).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 rounded-full bg-white transition-all duration-200",
                      i === imgIndex ? "w-3 opacity-100" : "w-1 opacity-50"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Top badges and heart overlay */}
          <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {verified && (
                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                  <ShieldCheck className="h-3 w-3" />
                  VERIFIED
                </div>
              )}
              <div className={cn(
                "text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm",
                badge.cls
              )}>
                {badge.label}
              </div>
            </div>

            <motion.button
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center shadow-sm transition-colors pointer-events-auto",
                liked ? "bg-primary text-white" : "bg-white/90 backdrop-blur-sm text-gray-400 hover:text-primary"
              )}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(p => !p) }}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
              type="button"
            >
              <motion.div
                animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart className={cn("h-3.5 w-3.5 transition-all", liked && "fill-white")} />
              </motion.div>
            </motion.button>
          </div>

          {/* Price chip — slides up on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute bottom-3 left-3 z-10 flex items-baseline gap-1 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <span className="font-bold text-gray-900 text-sm">{formatCurrency(property.price_per_night)}</span>
                <span className="text-gray-400 text-xs font-normal">/night</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Content ────────────────────────────────── */}
        <div className="p-3.5 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 text-[13px] leading-snug line-clamp-1 flex-1 font-display group-hover:text-primary transition-colors duration-200">
              {property.title}
            </h3>
            <div className="flex items-center gap-0.5 shrink-0 mt-px">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[12px] font-semibold text-gray-900">{rating}</span>
              <span className="text-[11px] text-gray-400 ml-0.5">({reviews})</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="text-xs truncate">{property.location}</span>
            <span className="text-gray-300 mx-0.5">·</span>
            <span className="text-xs text-gray-400 shrink-0">{property.bedrooms} bd</span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <div className="text-sm font-bold leading-none">
              <span className="text-primary">{formatCurrency(property.price_per_night)}</span>
              <span className="text-gray-400 font-normal text-xs"> /night</span>
            </div>
            <span className="text-[10px] font-medium text-primary/80 bg-primary/6 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
