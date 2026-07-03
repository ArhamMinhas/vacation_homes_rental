'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Shield, Zap, Heart } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { FadeInUp, StaggerContainer, StaggerItem, Tilt3DCard } from '@/components/ui/animations'
import { cn } from '@/lib/utils'

interface NearbyCategory {
  label: string
  distance: string
  image: string
  type: string
  accent: string
}

const TRUST_BADGES = [
  { icon: Shield, label: 'Verified Listings',  desc: 'Every property personally vetted'  },
  { icon: Zap,    label: 'Instant Booking',    desc: 'Confirm in under 60 seconds'       },
  { icon: Heart,  label: 'Guest Guarantee',    desc: 'Full refund if anything goes wrong' },
]

interface HomeAnimationsProps {
  nearbyCats: NearbyCategory[]
  featuredFallback: React.ReactNode
}

export function HomeAnimations({ nearbyCats, featuredFallback }: HomeAnimationsProps) {
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          TRUST STRIP — single cohesive bar, not 3 equal cards
      ══════════════════════════════════════════════════════ */}
      <section className="py-8 px-4 bg-[#f9f9ff]">
        <div className="max-w-5xl mx-auto">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TRUST_BADGES.map(({ icon: Icon, label, desc }) => (
              <StaggerItem key={label}>
                <Tilt3DCard intensity={8} innerClassName="rounded-2xl" className="h-full">
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-full flex items-center gap-4">
                    <motion.div
                      className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: 12, scale: 1.12, transition: { duration: 0.2 } }}
                    >
                      <Icon className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                </Tilt3DCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EXPLORE NEARBY — asymmetric bento grid
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeInUp className="mb-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-display" style={{ textWrap: 'balance' } as React.CSSProperties}>Explore Nearby</h2>
                <p className="text-gray-400 mt-1.5 text-sm sm:text-base">Unique stays just a short drive away</p>
              </div>
              <Link
                href={ROUTES.PROPERTIES}
                className="hidden sm:flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all duration-200 shrink-0"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeInUp>

          {/* Bento grid: first card is double height on desktop */}
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 sm:grid-rows-2 gap-4 sm:gap-5 sm:h-[520px]">
            {nearbyCats.map(({ label, distance, image, type, accent }, i) => (
              <StaggerItem
                key={label}
                className={cn(
                  "h-full",
                  i === 0 ? "sm:col-span-2 sm:row-span-2" : "sm:col-span-1 sm:row-span-1"
                )}
              >
                <Link href={`${ROUTES.PROPERTIES}?property_type=${encodeURIComponent(type)}`} className="group block h-full">
                  <Tilt3DCard intensity={i === 0 ? 5 : 9} innerClassName="rounded-2xl" className="h-full">
                    <div className={cn(
                      "relative rounded-2xl overflow-hidden bg-gray-100 h-full",
                      i !== 0 && "min-h-[160px]",
                    )}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={label}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={cn("absolute inset-0 bg-gradient-to-t", accent)} />
                      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                        <p className={cn(
                          "font-bold text-white leading-tight",
                          i === 0 ? "text-xl sm:text-2xl" : "text-sm sm:text-base"
                        )}>{label}</p>
                        <p className="text-white/70 text-xs mt-0.5">{distance}</p>
                      </div>
                      <motion.div
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        whileHover={{ scale: 1.1 }}
                      >
                        <ArrowRight className="h-4 w-4 text-white" />
                      </motion.div>
                    </div>
                  </Tilt3DCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURED VACATION HOMES
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 bg-[#f9f9ff]">
        <div className="max-w-7xl mx-auto">
          <FadeInUp className="mb-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-display" style={{ textWrap: 'balance' } as React.CSSProperties}>Featured Vacation Homes</h2>
                <p className="text-gray-400 mt-1.5 text-sm sm:text-base">Curated stays for the ultimate getaway</p>
              </div>
              <Link
                href={ROUTES.PROPERTIES}
                className="hidden sm:flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all duration-200 shrink-0"
              >
                View all properties
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeInUp>

          {featuredFallback}

          <FadeInUp delay={0.2} className="mt-8 sm:hidden text-center">
            <Link
              href={ROUTES.PROPERTIES}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              View all properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeInUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DESTINATIONS BENTO — proper grid spans
      ══════════════════════════════════════════════════════ */}
      <DestinationsBento />

      {/* ══════════════════════════════════════════════════════
          HOST CTA — cinematic dark card
      ══════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-16 px-4 bg-[#f9f9ff]">
        <div className="max-w-7xl mx-auto">
          <FadeInUp>
            <Tilt3DCard intensity={3} innerClassName="rounded-3xl" shimmer={false} className="w-full">
            <div
              className="relative rounded-3xl overflow-hidden flex flex-col sm:flex-row items-stretch min-h-[300px]"
              style={{ background: "linear-gradient(135deg, #1c0800 0%, #3d1500 35%, #5c1f00 65%, #7c2d12 100%)" }}
            >
              {/* Animated ambient orb */}
              <motion.div
                className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-amber-500/15 rounded-full blur-[60px] pointer-events-none" />

              {/* Left content */}
              <div className="relative flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center max-w-xl z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/8 text-white/70 text-[11px] font-bold tracking-widest uppercase w-fit mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  For Property Owners
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-bold text-white font-display leading-[1.15] mb-4" style={{ textWrap: 'balance' } as React.CSSProperties}>
                  Your home,<br />
                  the next luxury<br />
                  destination.
                </h2>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
                  Join our exclusive community of hosts and turn your premium property into an extraordinary experience for travellers worldwide.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={ROUTES.REGISTER}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white text-white text-sm font-semibold hover:bg-white hover:text-gray-900 transition-all duration-200"
                  >
                    Host Your Home
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={ROUTES.PROPERTIES}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/8 text-white/80 text-sm font-medium hover:bg-white/15 transition-all duration-200"
                  >
                    Learn more
                  </Link>
                </div>

                {/* Social proof */}
                <div className="flex items-center gap-4 mt-8">
                  <div className="flex -space-x-2">
                    {[
                      { initials: 'SR', bg: '#FF5A1F' },
                      { initials: 'MK', bg: '#f59e0b' },
                      { initials: 'AL', bg: '#10b981' },
                      { initials: 'JD', bg: '#6366f1' },
                    ].map(({ initials, bg }) => (
                      <div
                        key={initials}
                        className="h-8 w-8 rounded-full border-2 border-white/20 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: bg }}
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">2,400+ active hosts</p>
                    <p className="text-white/50 text-xs">earning $3,200/mo on average</p>
                  </div>
                </div>
              </div>

              {/* Right decorative image */}
              <div className="hidden sm:block relative flex-1 min-h-[300px]">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-50"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=600&fit=crop&q=80')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#3d1500]/90" />

                {/* Floating stats card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 shadow-xl"
                >
                  <p className="text-white/60 text-xs font-medium mb-1">Average earnings</p>
                  <p className="text-white text-2xl font-bold">$3,200</p>
                  <p className="text-primary text-xs font-semibold mt-0.5">↑ 24% vs last year</p>
                </motion.div>
              </div>
            </div>
            </Tilt3DCard>
          </FadeInUp>
        </div>
      </section>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Destinations bento grid — separate so useInView triggers per-item stagger
───────────────────────────────────────────────────────────────────────────── */

const DESTINATIONS = [
  {
    title: "Santorini, Greece",
    subtitle: "47 properties",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-2",
  },
  {
    title: "Amalfi Coast, Italy",
    subtitle: "23 properties",
    image: "https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=600&h=400&fit=crop",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
  },
  {
    title: "Bali, Indonesia",
    subtitle: "89 properties",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
  },
  {
    title: "Maldives",
    subtitle: "12 properties",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=400&fit=crop",
    colSpan: "col-span-2 md:col-span-1",
    rowSpan: "md:row-span-2",
  },
]

function DestinationsBento() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-14 sm:py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <FadeInUp className="mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-display" style={{ textWrap: 'balance' } as React.CSSProperties}>Where Will You Go Next?</h2>
          <p className="text-gray-400 mt-1.5 text-sm sm:text-base max-w-xl mx-auto">
            From private islands to mountain retreats, discover extraordinary places that feel like home.
          </p>
        </FadeInUp>

        <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-4 sm:gap-5 md:h-[540px]">
          {DESTINATIONS.map(({ title, subtitle, image, colSpan, rowSpan }, i) => (
            <motion.div
              key={title}
              className={cn(colSpan, rowSpan, "h-full min-h-[160px]")}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`${ROUTES.PROPERTIES}?location=${encodeURIComponent(title.split(',')[0])}`}
                className="group block h-full"
              >
                <Tilt3DCard intensity={7} innerClassName="rounded-2xl" className="h-full">
                  <div className="relative rounded-2xl overflow-hidden bg-gray-100 h-full w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={title}
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <p className="font-bold text-white text-base sm:text-lg leading-tight">{title}</p>
                      <p className="text-white/60 text-sm mt-0.5">{subtitle}</p>
                    </div>
                  </div>
                </Tilt3DCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
