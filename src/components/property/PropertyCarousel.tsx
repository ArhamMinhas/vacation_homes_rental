"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PropertyCard from "./PropertyCard"
import type { Property } from "@/types/property"
import { cn } from "@/lib/utils"

const GAP = 24

function useCarouselLayout(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [layout, setLayout] = useState({ ipv: 3, cardWidth: 0 })
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const update = useCallback(() => {
    const w = window.innerWidth
    const ipv = w < 640 ? 1 : w < 1024 ? 2 : 3
    const cw = containerRef.current
      ? (containerRef.current.clientWidth - GAP * (ipv - 1)) / ipv
      : 0
    setLayout({ ipv, cardWidth: Math.max(0, cw) })
  }, [containerRef])

  const debouncedUpdate = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(update, 100)
  }, [update])

  useEffect(() => {
    update()
    const ro = new ResizeObserver(debouncedUpdate)
    const el = containerRef.current
    if (el) ro.observe(el)
    return () => {
      ro.disconnect()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [update, debouncedUpdate, containerRef])

  return layout
}

export default function PropertyCarousel({ properties }: { properties: Property[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { ipv: itemsPerView, cardWidth } = useCarouselLayout(containerRef)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const maxIndex = Math.max(0, properties.length - itemsPerView)

  const goTo = useCallback((i: number) => setIndex(Math.max(0, Math.min(i, maxIndex))), [maxIndex])
  const next = useCallback(() => setIndex(i => (i >= maxIndex ? 0 : i + 1)), [maxIndex])
  const prev = useCallback(() => setIndex(i => (i <= 0 ? maxIndex : i - 1)), [maxIndex])

  useEffect(() => { setIndex(i => Math.min(i, maxIndex)) }, [maxIndex])

  useEffect(() => {
    if (paused || maxIndex === 0) return
    const t = setInterval(next, 4500)
    return () => clearInterval(t)
  }, [paused, next, maxIndex])

  const translateX = cardWidth > 0 ? index * (cardWidth + GAP) : 0

  if (properties.length === 0) return null

  return (
    <div
      className="relative group/carousel select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Overflow track */}
      <div ref={containerRef} className="overflow-hidden py-2">
        <div
          className="flex"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(-${translateX}px)`,
            transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
          }}
        >
          {properties.map((property, i) => (
            <div
              key={property.id}
              style={{
                flexShrink: 0,
                width:
                  cardWidth > 0
                    ? `${cardWidth}px`
                    : `calc(${100 / itemsPerView}% - ${(GAP * (itemsPerView - 1)) / itemsPerView}px)`,
              }}
            >
              {/* Preload only the first viewport-worth of cards as LCP candidates */}
              <PropertyCard property={property} priority={i < itemsPerView} />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next arrows — visible on hover */}
      {maxIndex > 0 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className={cn(
              "absolute -left-4 sm:-left-6 top-[38%] -translate-y-1/2 z-10",
              "h-12 w-12 rounded-full bg-white shadow-xl border border-border/50",
              "flex items-center justify-center",
              "opacity-0 group-hover/carousel:opacity-100",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110",
              "transition-all duration-200"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className={cn(
              "absolute -right-4 sm:-right-6 top-[38%] -translate-y-1/2 z-10",
              "h-12 w-12 rounded-full bg-white shadow-xl border border-border/50",
              "flex items-center justify-center",
              "opacity-0 group-hover/carousel:opacity-100",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110",
              "transition-all duration-200"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "rounded-full transition-all duration-300 hover:opacity-80",
                i === index ? "w-8 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-border hover:bg-primary/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
