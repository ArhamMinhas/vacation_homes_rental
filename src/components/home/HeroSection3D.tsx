'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring, type Variants } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star, Home, Users, MapPin, Wifi, UtensilsCrossed, Car, Waves, Mountain, Sun, Zap } from 'lucide-react'
import { Spotlight } from '@/components/ui/spotlight'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.13, delayChildren: 0.15 },
  },
}

const item: Variants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const STATS = [
  { icon: Home,  value: '10K+', label: 'Properties'  },
  { icon: Star,  value: '4.9★', label: 'Avg Rating'  },
  { icon: Users, value: '50K+', label: 'Happy Guests' },
]

const PROPERTY_CARDS = [
  {
    CardIcon: Waves,
    title: 'Malibu Beach House',
    location: 'California, USA',
    price: '$480',
    rating: '4.97',
    image: 'from-sky-500/70 via-cyan-400/60 to-blue-600/70',
    amenities: [Wifi, UtensilsCrossed, Car],
    rotate: '-4deg',
    translateY: '-8px',
    zIndex: 30,
    delay: 0.5,
  },
  {
    CardIcon: Mountain,
    title: 'Alpine Chalet',
    location: 'Zermatt, Switzerland',
    price: '$620',
    rating: '4.95',
    image: 'from-emerald-500/70 via-teal-400/60 to-green-600/70',
    amenities: [Wifi, UtensilsCrossed, Car],
    rotate: '2deg',
    translateY: '16px',
    zIndex: 20,
    delay: 0.7,
  },
  {
    CardIcon: Sun,
    title: 'Desert Oasis Villa',
    location: 'Sedona, Arizona',
    price: '$380',
    rating: '4.93',
    image: 'from-amber-500/70 via-orange-400/60 to-red-500/70',
    amenities: [Wifi, UtensilsCrossed, Car],
    rotate: '6deg',
    translateY: '40px',
    zIndex: 10,
    delay: 0.9,
  },
]

function PropertyCardStack() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [8, -8]), { stiffness: 120, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-8, 8]), { stiffness: 120, damping: 20 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: '900px' }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-72 h-[420px]"
      >
        {PROPERTY_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: card.delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0"
            style={{
              zIndex: card.zIndex,
              top: `${i * 28}px`,
              rotate: card.rotate,
            }}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              {/* Property image area */}
              <div className={`h-32 bg-gradient-to-br ${card.image} flex items-end p-3`}>
                <card.CardIcon className="h-9 w-9 text-white/80" />
                <div className="ml-auto flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-white text-xs font-bold">{card.rating}</span>
                </div>
              </div>

              {/* Card content */}
              <div className="p-3.5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-white text-sm font-semibold leading-tight">{card.title}</p>
                  <span className="text-primary font-bold text-sm whitespace-nowrap">{card.price}<span className="text-white/40 text-[10px] font-normal">/night</span></span>
                </div>
                <div className="flex items-center gap-1 text-white/50 text-[11px] mb-2.5">
                  <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                  {card.location}
                </div>
                <div className="flex gap-1.5">
                  {card.amenities.map((Icon, j) => (
                    <div key={j} className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center">
                      <Icon className="h-3 w-3 text-white/60" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating badge — "Live Availability" */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute bottom-8 left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white text-xs font-medium">Live Availability</span>
      </motion.div>

      {/* Floating badge — instant book */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute top-6 right-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-xl px-3 py-2 shadow-xl"
      >
        <p className="text-primary text-[11px] font-bold flex items-center gap-1">
          <Zap className="h-3 w-3 fill-primary" />
          Instant Book
        </p>
      </motion.div>
    </motion.div>
  )
}

export function HeroSection3D() {
  return (
    <section className="relative w-full min-h-[600px] lg:h-[700px] bg-[#080d1a] overflow-hidden">

      {/* Ambient gradient orbs — perpetual motion */}
      <motion.div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none"
        animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-24 right-1/3 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none"
        animate={{ x: [0, -20, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[80px] pointer-events-none"
        animate={{ x: [0, -15, 0], y: [0, 25, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* Interactive mouse spotlight */}
      <Spotlight size={420} />

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* ── LEFT: animated text ─────────────────────────── */}
        <div className="flex-1 py-14 lg:py-0 flex flex-col justify-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="max-w-[540px]"
          >
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/25 text-primary text-[11px] font-bold tracking-widest uppercase mb-7 select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Premium Vacation Rentals
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold font-display leading-[1.1] tracking-tight mb-5"
            >
              <span className="text-white">Discover Your</span>
              <br />
              <span className="hero-shimmer-text">Dream Escape</span>
              <br />
              <span className="text-neutral-400 text-3xl sm:text-4xl lg:text-[2.8rem]">
                Anywhere in the World
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              Luxury villas, coastal retreats, mountain hideaways — curated for travellers who demand the extraordinary.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap items-center gap-3 mb-10">
              <Link href={ROUTES.PROPERTIES}>
                <Button
                  size="lg"
                  className="rounded-full px-7 h-12 bg-primary hover:bg-primary/90 text-white font-semibold gap-2 shadow-xl shadow-primary/30 transition-all duration-200 hover:shadow-primary/50 hover:scale-[1.02]"
                >
                  Browse Properties
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-7 h-12 border-white/15 bg-white/5 text-white hover:bg-white/12 font-semibold gap-2 backdrop-blur-sm transition-all duration-200"
                >
                  <Home className="h-4 w-4" />
                  List Your Home
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={item} className="flex items-center gap-4 sm:gap-6">
              {STATS.map(({ icon: Icon, value, label }, i) => (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-white leading-none">{value}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{label}</p>
                    </div>
                  </div>
                  {i < STATS.length - 1 && (
                    <div className="h-8 w-px bg-white/10 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── RIGHT: 3D property card stack ──────────────── */}
        <div className="flex-1 relative w-full h-[420px] lg:h-full">
          <PropertyCardStack />
          {/* Left edge fade */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#080d1a] to-transparent pointer-events-none" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#080d1a] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Fade into page background — subtle dark fade, transition handled by search section */}
      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#080d1a] to-transparent pointer-events-none" />
    </section>
  )
}
