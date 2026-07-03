'use client'

import React, { useRef, useEffect, useState } from 'react'
import {
  motion, AnimatePresence,
  useMotionValue, useTransform, useSpring, animate,
  type Variants,
} from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Home, MapPin, Wifi, UtensilsCrossed, Car,
  Waves, Mountain, Sun, Zap, Star, ShieldCheck,
} from 'lucide-react'
import { Spotlight } from '@/components/ui/spotlight'
import { ROUTES } from '@/lib/constants'

// ── Constants ─────────────────────────────────────────────
const EASE_OUT  = [0.22, 1, 0.36, 1] as const

const WORDS = [
  { text: 'Dream Escape',  from: '#FF5A1F', via: '#f59e0b', to: '#FF5A1F' },
  { text: 'Beach Retreat', from: '#38bdf8', via: '#67e8f9', to: '#3b82f6' },
  { text: 'Alpine Haven',  from: '#34d399', via: '#6ee7b7', to: '#10b981' },
  { text: 'Desert Oasis',  from: '#fbbf24', via: '#fb923c', to: '#ef4444' },
]

const CARDS = [
  {
    title: 'Malibu Beach House',
    location: 'California, USA',
    price: '$480',
    rating: '4.97',
    img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=320&h=140&fit=crop&auto=format',
    Icon: Waves,
    amenities: [Wifi, UtensilsCrossed, Car],
    rotate: '-7deg',
    top: 68,
    zIndex: 30,
    delay: 0.45,
  },
  {
    title: 'Alpine Chalet',
    location: 'Zermatt, Switzerland',
    price: '$620',
    rating: '4.95',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=320&h=140&fit=crop&auto=format',
    Icon: Mountain,
    amenities: [Wifi, UtensilsCrossed, Car],
    rotate: '1deg',
    top: 112,
    zIndex: 20,
    delay: 0.65,
  },
  {
    title: 'Desert Oasis Villa',
    location: 'Sedona, Arizona',
    price: '$380',
    rating: '4.93',
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=320&h=140&fit=crop&auto=format',
    Icon: Sun,
    amenities: [Wifi, UtensilsCrossed, Car],
    rotate: '7deg',
    top: 156,
    zIndex: 10,
    delay: 0.85,
  },
]

const STATS = [
  { target: 10,  suffix: 'K+', decimals: 0, label: 'Properties'   },
  { target: 4.9, suffix: '★',  decimals: 1, label: 'Avg Rating'   },
  { target: 50,  suffix: 'K+', decimals: 0, label: 'Happy Guests' },
]

// ── Animated counter ──────────────────────────────────────
function Counter({ target, suffix, decimals, label }: typeof STATS[0]) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctrl = animate(0, target, {
      duration: 1.8,
      delay: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix
      },
    })
    return ctrl.stop
  }, [target, suffix, decimals])

  return (
    <div>
      <span ref={ref} className="block text-[15px] font-bold text-white leading-none tabular-nums">
        {target.toFixed(decimals) + suffix}
      </span>
      <span className="block text-[10px] text-neutral-500 mt-0.5">{label}</span>
    </div>
  )
}

// ── Rotating headline word ────────────────────────────────
function RotatingWord() {
  const [idx, setIdx] = useState(0)
  const word          = WORDS[idx]

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % WORDS.length), 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="block relative min-h-[1.2em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          className="block"
          style={{
            backgroundImage: `linear-gradient(90deg, ${word.from}, ${word.via}, ${word.to})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
          exit={  { opacity: 0, y: -28, filter: 'blur(6px)' }}
          transition={{ duration: 0.48, ease: EASE_OUT }}
        >
          {word.text}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// ── Magnetic CTA link ─────────────────────────────────────
function MagneticBtn({ href, children }: { href: string; children: React.ReactNode }) {
  const ref  = useRef<HTMLAnchorElement>(null)
  const x    = useMotionValue(0)
  const y    = useMotionValue(0)
  const sx   = useSpring(x, { stiffness: 260, damping: 24 })
  const sy   = useSpring(y, { stiffness: 260, damping: 24 })

  function onMove(e: React.MouseEvent) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width  / 2)) * 0.3)
    y.set((e.clientY - (r.top  + r.height / 2)) * 0.3)
  }
  function onLeave() { x.set(0); y.set(0) }

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.04 }}
      whileTap={{   scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className="inline-flex items-center gap-2 rounded-full px-7 h-12 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-[14px] shadow-2xl shadow-orange-500/35 transition-colors duration-200 select-none cursor-pointer"
    >
      {children}
    </motion.a>
  )
}

// ── 3D tilt card stack ────────────────────────────────────
function CardStack() {
  const wrap  = useRef<HTMLDivElement>(null)
  const mx    = useMotionValue(0)
  const my    = useMotionValue(0)
  const rotX  = useSpring(useTransform(my, [-200, 200], [ 8, -8]), { stiffness: 140, damping: 22 })
  const rotY  = useSpring(useTransform(mx, [-200, 200], [-8,  8]), { stiffness: 140, damping: 22 })

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = wrap.current?.getBoundingClientRect()
    if (!r) return
    mx.set(e.clientX - r.left  - r.width  / 2)
    my.set(e.clientY - r.top   - r.height / 2)
  }
  function onLeave() { mx.set(0); my.set(0) }

  return (
    <motion.div
      ref={wrap}
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: '1100px' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Ambient glow behind stack */}
      <motion.div
        className="absolute w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,90,31,0.22) 0%, transparent 68%)' }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Tilt group */}
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        className="relative w-72 h-[460px]"
      >
        {/* Badge — Live Availability — anchored just below card stack */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.5, ease: EASE_OUT }}
          className="absolute left-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-white/10 z-50"
          style={{
            top: '372px',
            background: 'rgba(10,16,34,0.88)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
          }}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-white text-[11px] font-semibold tracking-wide">Live Availability</span>
        </motion.div>

        {/* Badge — Instant Book — anchored top-right of stack */}
        <motion.div
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.65, duration: 0.5, ease: EASE_OUT }}
          className="absolute right-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-orange-500/25 z-50"
          style={{
            top: '38px',
            background: 'rgba(255,90,31,0.13)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 24px rgba(255,90,31,0.18)',
          }}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-orange-400 text-[11px] font-bold">Instant Book</span>
        </motion.div>

        {CARDS.map((card) => (
          <motion.div
            key={card.title}
            className="absolute inset-x-0"
            style={{ zIndex: card.zIndex, top: `${card.top}px`, rotate: card.rotate }}
            initial={{ opacity: 0, y: 48, scale: 0.88 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            transition={{ delay: card.delay, duration: 0.72, ease: EASE_OUT }}
          >
            <div
              className="overflow-hidden rounded-[20px] border border-white/12"
              style={{
                background:    'rgba(10, 16, 36, 0.82)',
                backdropFilter:'blur(24px)',
                boxShadow:     '0 28px 56px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              {/* Photo + overlay */}
              <div className="relative h-[132px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {/* Dark vignette so text is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1024]/80 via-transparent to-transparent" />

                {/* Property type icon */}
                <div className="absolute bottom-2.5 left-3 h-8 w-8 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <card.Icon className="h-4 w-4 text-white/90" />
                </div>

                {/* Rating */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/45 backdrop-blur-sm rounded-full px-2 py-0.5 border border-white/8">
                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                  <span className="text-white text-[11px] font-bold">{card.rating}</span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-3.5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-white text-[13px] font-semibold leading-tight">{card.title}</p>
                  <span className="text-orange-400 font-bold text-[13px] whitespace-nowrap tabular-nums">
                    {card.price}
                    <span className="text-white/30 text-[10px] font-normal">/nt</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-white/40 text-[11px] mb-3">
                  <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                  {card.location}
                </div>

                <div className="flex items-center gap-1.5">
                  {card.amenities.map((Icon, j) => (
                    <div
                      key={j}
                      className="h-6 w-6 rounded-lg flex items-center justify-center border border-white/8"
                      style={{ background: 'rgba(255,255,255,0.07)' }}
                    >
                      <Icon className="h-3 w-3 text-white/55" />
                    </div>
                  ))}
                  {/* Availability dot row */}
                  <div className="ml-auto flex items-center gap-1">
                    {[...Array(5)].map((_, k) => (
                      <span
                        key={k}
                        className="h-1 w-1 rounded-full"
                        style={{ background: k < 4 ? '#f97316' : 'rgba(255,255,255,0.15)' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </motion.div>
  )
}

// ── Stagger presets ───────────────────────────────────────
const container: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item: Variants = {
  hidden:  { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE_OUT } },
}

// ── Hero ──────────────────────────────────────────────────
export function HeroSection3D() {
  return (
    <section className="relative w-full min-h-[640px] lg:min-h-[720px] bg-[#060b18] overflow-hidden">

      {/* Ambient mesh orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,90,31,0.14) 0%, transparent 62%)' }}
          animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/4 right-0 w-[520px] h-[520px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 65%)' }}
          animate={{ x: [0, -22, 0], y: [0, 28, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        <motion.div
          className="absolute -bottom-40 right-1/3 w-[440px] h-[440px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)' }}
          animate={{ x: [0, -18, 0], y: [0, -26, 0], scale: [1, 1.14, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
      </div>

      {/* Fine dot-grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          opacity: 0.025,
        }}
      />

      {/* Diagonal light streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[{ left: '36%', h: '48vh', delay: 0 }, { left: '52%', h: '36vh', delay: 0 }].map((s, i) => (
          <div
            key={i}
            className="absolute -top-20 w-px"
            style={{
              left: s.left,
              height: s.h,
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.07), transparent)',
              transform: 'rotate(18deg)',
              opacity: i === 0 ? 1 : 0.6,
            }}
          />
        ))}
      </div>

      {/* Horizontal shimmer line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,90,31,0.35), transparent)' }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Spotlight size={500} />

      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* ── LEFT copy ──────────────────────────────── */}
        <div className="flex-1 py-16 lg:py-0 flex flex-col justify-center">
          <motion.div variants={container} initial="hidden" animate="visible" className="max-w-[560px]">

            {/* Pill */}
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/8 text-orange-400 text-[10.5px] font-bold tracking-[0.15em] uppercase mb-7 select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                Premium Vacation Rentals
              </span>
            </motion.div>

            {/* Headline with rotating word */}
            <motion.h1
              variants={item}
              className="text-[2.5rem] sm:text-5xl lg:text-[3.5rem] font-bold font-display tracking-tight mb-5"
              style={{ lineHeight: 1.08 }}
            >
              <span className="block text-white mb-1">Discover Your</span>
              <RotatingWord />
            </motion.h1>

            <motion.p
              variants={item}
              className="text-neutral-400 text-[15px] leading-[1.7] mb-8 max-w-[430px]"
            >
              Luxury villas, coastal retreats, mountain hideaways - curated for travellers who demand the extraordinary.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-3 mb-10">
              <MagneticBtn href={ROUTES.PROPERTIES}>
                Browse Properties
                <ArrowRight className="h-4 w-4" />
              </MagneticBtn>

              <Link href={ROUTES.REGISTER}>
                <motion.div
                  whileHover={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 rounded-full px-7 h-12 border border-white/10 bg-white/5 text-white font-semibold text-[14px] cursor-pointer select-none transition-colors duration-200"
                >
                  <Home className="h-4 w-4" />
                  List Your Home
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats — animated counters */}
            <motion.div variants={item} className="flex items-center gap-6">
              {STATS.map((s, i) => (
                <React.Fragment key={s.label}>
                  <Counter {...s} />
                  {i < STATS.length - 1 && (
                    <div className="h-7 w-px bg-white/8 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── RIGHT card stack ────────────────────────── */}
        <div className="flex-1 relative w-full h-[480px] lg:h-full lg:min-h-[640px]">
          <CardStack />
          {/* Edge fades */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#060b18] to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#060b18] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Fade into search section */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#060b18] to-transparent pointer-events-none" />
    </section>
  )
}
