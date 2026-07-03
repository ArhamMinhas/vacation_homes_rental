'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, MapPin, Wifi, UtensilsCrossed, Waves, Mountain, Home, Building2, Users } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

const FEATURE_CARDS = [
  {
    Icon: Waves,
    title: 'Malibu Beach House',
    location: 'California, USA',
    rating: '4.97',
    price: '$480/night',
    color: 'from-blue-500/20 to-cyan-600/20',
    iconColor: 'text-cyan-300',
    top: '8%',
    left: '10%',
    delay: 0.3,
    rotate: '-3deg',
    floatDuration: 4.2,
  },
  {
    Icon: Mountain,
    title: 'Alpine Chalet',
    location: 'Zermatt, Switzerland',
    rating: '4.95',
    price: '$620/night',
    color: 'from-emerald-500/20 to-teal-600/20',
    iconColor: 'text-emerald-300',
    top: '42%',
    left: '28%',
    delay: 0.5,
    rotate: '2deg',
    floatDuration: 5.0,
  },
  {
    Icon: Home,
    title: 'Santorini Cave Villa',
    location: 'Oia, Greece',
    rating: '5.0',
    price: '$1,200/night',
    color: 'from-violet-500/20 to-blue-600/20',
    iconColor: 'text-violet-300',
    top: '72%',
    left: '6%',
    delay: 0.7,
    rotate: '-2deg',
    floatDuration: 4.7,
  },
]

const STAT_BADGES = [
  { label: '10K+ Properties', Icon: Building2, top: '18%', right: '8%', delay: 0.8 },
  { label: '50K+ Happy Guests', Icon: Users, top: '58%', right: '4%', delay: 1.0 },
]

function FloatingCard({ card }: { card: typeof FEATURE_CARDS[0] }) {
  const { Icon } = card
  return (
    <motion.div
      className="absolute w-56"
      style={{ top: card.top, left: card.left }}
      initial={{ opacity: 0, y: 20, rotate: card.rotate }}
      animate={{ opacity: 1, y: 0, rotate: card.rotate }}
      transition={{ delay: card.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: card.floatDuration, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3.5 shadow-2xl"
      >
        <div className={`h-20 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
          <Icon className={`h-9 w-9 ${card.iconColor}`} />
        </div>
        <div className="flex items-start justify-between mb-1.5">
          <p className="text-white text-xs font-semibold leading-tight line-clamp-1">{card.title}</p>
          <div className="flex items-center gap-0.5 ml-2 flex-shrink-0">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            <span className="text-white text-[10px] font-bold">{card.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-white/50 text-[10px] mb-2">
          <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
          {card.location}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <div className="h-5 w-5 rounded-md bg-white/10 flex items-center justify-center">
              <Wifi className="h-2.5 w-2.5 text-white/60" />
            </div>
            <div className="h-5 w-5 rounded-md bg-white/10 flex items-center justify-center">
              <UtensilsCrossed className="h-2.5 w-2.5 text-white/60" />
            </div>
          </div>
          <span className="text-primary text-[11px] font-bold">{card.price}</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

function AuthLeftBase({
  headline,
  sub,
}: {
  headline: React.ReactNode
  sub: string
}) {
  return (
    <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] relative flex-col overflow-hidden bg-[#080d1a]">
      {/* Ambient orbs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-primary/25 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber-500/15 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[100px] pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Logo */}
      <motion.div
        className="relative z-10 p-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href={ROUTES.HOME} className="inline-flex items-center gap-2">
          <span className="text-xl font-bold font-display">
            <span className="text-primary">Coastal</span><span className="text-white">Horizon</span>
          </span>
        </Link>
      </motion.div>

      {/* Floating property cards */}
      <div className="relative flex-1">
        {FEATURE_CARDS.map((card) => (
          <FloatingCard key={card.title} card={card} />
        ))}

        {/* Stat badges */}
        {STAT_BADGES.map((badge) => (
          <motion.div
            key={badge.label}
            className="absolute"
            style={{ top: badge.top, right: badge.right }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: badge.delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
              <badge.Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span className="text-white text-xs font-semibold whitespace-nowrap">{badge.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom text */}
      <motion.div
        className="relative z-10 p-10 pb-12"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-3 font-display">
          {headline}
        </h2>
        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
          {sub}
        </p>
      </motion.div>
    </div>
  )
}

export function LoginLeftPanel() {
  return (
    <AuthLeftBase
      headline={<>Your next coastal<br />escape awaits.</>}
      sub="Handpicked villas, chalets, and retreats — every property curated for guests who care about the details."
    />
  )
}

export function RegisterLeftPanel() {
  return (
    <AuthLeftBase
      headline={<>Extraordinary homes,<br />remarkable hosts.</>}
      sub="Join thousands of hosts and guests who trust Coastal Horizon for their most memorable stays."
    />
  )
}
