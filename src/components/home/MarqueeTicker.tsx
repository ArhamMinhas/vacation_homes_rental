'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MapPin } from 'lucide-react'

const ITEMS = [
  { label: 'Malibu, California'     },
  { label: 'Zermatt, Switzerland'   },
  { label: 'Bali, Indonesia'        },
  { label: 'Santorini, Greece'      },
  { label: 'Sedona, Arizona'        },
  { label: 'Tulum, Mexico'          },
  { label: 'Hakuba, Japan'          },
  { label: 'Amalfi Coast, Italy'    },
  { label: 'Provence, France'       },
  { label: 'Maui, Hawaii'           },
]

/* Duplicate 3× so the seamless CSS loop never shows a gap */
const TRIPLED = [...ITEMS, ...ITEMS, ...ITEMS]

const ITEM_WIDTH = 200 // px — approximate width of each item including padding

export function MarqueeTicker() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })
  /* Subtle parallax tint on the left fade as user scrolls past */
  const leftOpacity = useTransform(scrollYProgress, [0, 0.5], [0.7, 1])

  const totalWidth = ITEM_WIDTH * ITEMS.length

  return (
    <div ref={containerRef} className="relative py-4 bg-white border-y border-gray-100 overflow-hidden">
      {/* Left fade */}
      <motion.div
        className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"
        style={{ opacity: leftOpacity }}
      />
      {/* Right fade */}
      <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex items-center w-max"
        animate={{ x: [0, -totalWidth] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
      >
        {TRIPLED.map(({ label }, i) => (
          <div key={i} className="flex items-center gap-6 px-6 shrink-0">
            <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
              <MapPin className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
              <span className="font-medium">{label}</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-primary/40 flex-shrink-0" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
