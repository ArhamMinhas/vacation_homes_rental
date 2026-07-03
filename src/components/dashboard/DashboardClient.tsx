'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Home, MapPin, TrendingUp, CheckCircle2, User, Settings, Sparkles } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { StaggerContainer, StaggerItem, CountUp, FadeInUp, HoverLift } from '@/components/ui/animations'

interface DashboardClientProps {
  profile: { full_name: string | null; email: string; created_at: string }
  initials: string
  totalBookings: number
  confirmedCount: number
  totalSpend: number
  pendingCount: number
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

function formatCurrencySimple(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const QUICK_ACTIONS = [
  {
    href: ROUTES.USER_BOOKINGS,
    icon: CalendarDays,
    title: 'My Bookings',
    desc: 'View and manage your reservation requests',
    ctaLabel: 'View bookings',
    hasBadge: true,
  },
  {
    href: ROUTES.PROPERTIES,
    icon: Home,
    title: 'Browse Properties',
    desc: 'Discover your next perfect vacation home',
    ctaLabel: 'Explore now',
    hasBadge: false,
  },
  {
    href: `${ROUTES.PROPERTIES}?location=Santorini`,
    icon: MapPin,
    title: 'Top Destinations',
    desc: 'Explore our most popular coastal locations',
    ctaLabel: 'Explore',
    hasBadge: false,
  },
]

export function DashboardClient({
  profile,
  initials,
  totalBookings,
  confirmedCount,
  totalSpend,
  pendingCount,
}: DashboardClientProps) {
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Hero profile card ───────────────────────────────── */}
      <motion.div variants={itemVariants} className="rounded-3xl overflow-hidden shadow-sm">
        {/* Banner with animated orbs */}
        <div
          className="h-28 sm:h-36 relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgba(100,35,8,0.88) 0%, rgba(180,60,10,0.78) 40%, rgba(80,20,0,0.86) 100%), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }}
        >
          {/* Subtle animated orb */}
          <motion.div
            className="absolute -top-10 right-1/4 w-40 h-40 rounded-full bg-primary/30 blur-[50px] pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="absolute -bottom-8 left-6 sm:left-8">
            <motion.div
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white border-4 border-white flex items-center justify-center text-primary text-2xl font-bold shadow-md font-display"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
            >
              {initials}
            </motion.div>
          </div>

          {/* Top right sparkle */}
          <motion.div
            className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span className="text-white text-[11px] font-semibold">Guest Member</span>
          </motion.div>
        </div>

        {/* Name strip */}
        <div className="bg-white pt-10 sm:pt-12 pb-5 px-6 sm:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight font-display">
              {profile.full_name || 'Traveller'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{profile.email}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 w-fit">
            <User className="h-3.5 w-3.5" />
            Member since {memberSince}
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 bg-white border-t border-gray-100">
          {[
            { label: 'Total Bookings',  value: totalBookings,  icon: CalendarDays, isNum: true,  accent: 'text-blue-600',    bg: 'bg-blue-50'    },
            { label: 'Confirmed Stays', value: confirmedCount, icon: CheckCircle2, isNum: true,  accent: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Total Spent',     value: totalSpend,     icon: TrendingUp,   isNum: false, accent: 'text-primary',     bg: 'bg-orange-50'  },
          ].map(({ label, value, icon: Icon, isNum, accent, bg }, i) => (
            <motion.div
              key={label}
              className="px-5 py-4 text-center border-r border-gray-100 last:border-r-0 group cursor-default"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              whileHover={{ backgroundColor: 'rgba(249,249,255,0.8)', transition: { duration: 0.15 } }}
            >
              <motion.div
                className={`h-7 w-7 rounded-lg ${bg} flex items-center justify-center mx-auto mb-1.5`}
                whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.15 } }}
              >
                <Icon className={`h-3.5 w-3.5 ${accent}`} />
              </motion.div>
              <p className="text-gray-900 font-bold text-lg sm:text-xl leading-none">
                {isNum ? (
                  <CountUp to={value as number} />
                ) : (
                  formatCurrencySimple(value as number)
                )}
              </p>
              <p className="text-gray-500 text-[11px] mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Quick action cards ─────────────────────────────── */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_ACTIONS.map(({ href, icon: Icon, title, desc, ctaLabel, hasBadge }) => (
          <StaggerItem key={href}>
            <HoverLift>
              <Link href={href} className="block h-full">
                <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(255,90,31,0.08)] transition-all duration-300 cursor-pointer h-full shadow-sm">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{title}</h3>
                    {hasBadge && pendingCount > 0 && (
                      <span className="text-[11px] bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                        {pendingCount} pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-0 group-hover:translate-x-1">
                    {ctaLabel} <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </HoverLift>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* ── Account details ───────────────────────────────── */}
      <FadeInUp delay={0.15}>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Account details</h2>
            <Settings className="h-4 w-4 text-gray-400" />
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { label: 'Full name',     value: profile.full_name || '—'  },
              { label: 'Email address', value: profile.email               },
              {
                label: 'Member since',
                value: new Date(profile.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                }),
              },
              { label: 'Account type', value: 'Guest' },
            ].map(({ label, value }, i) => (
              <motion.div
                key={label}
                className="flex justify-between items-center px-6 py-4 gap-4 hover:bg-gray-50/60 transition-colors"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.3 }}
              >
                <span className="text-sm text-gray-500 shrink-0">{label}</span>
                <span className="text-sm font-medium text-gray-900 text-right truncate">{value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInUp>
    </motion.div>
  )
}
