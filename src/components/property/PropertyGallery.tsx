"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence, type Variants, type PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Maximize2, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const slideVariants: Variants = {
  enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit:  (d: number) => ({ x: d < 0 ? "100%" : "-100%", opacity: 0 }),
}

interface PropertyGalleryProps {
  images: string[]
  title:  string
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [active, setActive]     = useState(0)
  const [direction, setDir]     = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const go = useCallback((newIndex: number) => {
    setDir(newIndex > active ? 1 : -1)
    setActive(newIndex)
  }, [active])

  const prev = useCallback(() => go((active - 1 + images.length) % images.length), [active, images.length, go])
  const next = useCallback(() => go((active + 1) % images.length), [active, images.length, go])

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    if (info.offset.x < -50)      next()
    else if (info.offset.x > 50)  prev()
  }, [next, prev])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev()
      if (e.key === "ArrowRight") next()
      if (e.key === "Escape")     setLightbox(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox, prev, next])

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <Home className="h-16 w-16 text-primary/30" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {/* ── Main Carousel ─────────────────────────────── */}
        <div
          className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 cursor-pointer group"
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={active}
              className="absolute inset-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: EASE }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[active]}
                alt={`${title} — photo ${active + 1}`}
                fill
                priority={active === 0}
                sizes="(max-width: 1024px) 100vw, 75vw"
                className="object-cover pointer-events-none select-none"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />

          {/* Gallery hint */}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5 text-white" />
              <span className="text-white text-xs font-semibold tracking-wide">View gallery</span>
            </div>
          </div>

          {/* Counter */}
          <div className="absolute bottom-3 right-3 z-20 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none">
            <span className="text-white text-xs font-bold tabular-nums">{active + 1} / {images.length}</span>
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-gray-800" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-gray-800" />
              </button>

              {/* Animated dot indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 pointer-events-none">
                {images.map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 rounded-full bg-white"
                    animate={{ width: i === active ? 20 : 6, opacity: i === active ? 1 : 0.5 }}
                    transition={{ duration: 0.25 }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Thumbnails ─────────────────────────────────── */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <motion.button
                key={i}
                onClick={() => go(i)}
                className={cn(
                  "relative flex-shrink-0 h-16 w-24 rounded-xl overflow-hidden border-2 transition-colors",
                  i === active
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent opacity-55 hover:opacity-90 hover:border-gray-300"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(4,6,14,0.97)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(false)}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 z-30 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              onClick={() => setLightbox(false)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              aria-label="Close gallery"
            >
              <X className="h-5 w-5 text-white" />
            </motion.button>

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 text-white/60 text-sm font-semibold tabular-nums pointer-events-none">
              {active + 1} / {images.length}
            </div>

            {/* Directional image slide */}
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={`lb-${active}`}
                className="absolute inset-10 flex items-center justify-center"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE }}
                onClick={(e) => e.stopPropagation()}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[active]}
                  alt={`${title} — photo ${active + 1}`}
                  className="max-h-full max-w-full object-contain rounded-xl select-none"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  onClick={(e) => { e.stopPropagation(); prev() }}
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-7 w-7 text-white" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  onClick={(e) => { e.stopPropagation(); next() }}
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-7 w-7 text-white" />
                </button>
              </>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    className={cn(
                      "relative h-12 w-16 rounded-lg overflow-hidden border-2 transition-all",
                      i === active ? "border-white opacity-100" : "border-transparent opacity-35 hover:opacity-70"
                    )}
                    aria-label={`Go to photo ${i + 1}`}
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
