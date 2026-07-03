'use client'

import { motion, type Variants } from 'framer-motion'
import { Clock, CalendarCheck, TrendingUp, Building2 } from 'lucide-react'
import { CountUp } from '@/components/ui/animations'
import { cn } from '@/lib/utils'

const ICON_MAP = { Clock, CalendarCheck, TrendingUp, Building2 }

interface StatCardData {
  label: string
  numericValue: number | null
  displayValue: string
  iconName: keyof typeof ICON_MAP
  gradient: string
  ring: string
  badge: string
  badgeColor: string
  valueColor: string
  trend: string | null
}

interface DashboardStatsCardsProps {
  cards: StatCardData[]
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

/* Maps gradient strings to a matching bottom-bar color */
const GRADIENT_TO_BAR: Record<string, string> = {
  'from-amber-500 to-orange-500': 'bg-gradient-to-r from-amber-400 to-orange-400',
  'from-gray-400 to-gray-500':    'bg-gradient-to-r from-gray-300 to-gray-400',
  'from-blue-500 to-indigo-600':  'bg-gradient-to-r from-blue-400 to-indigo-500',
  'from-orange-500 to-red-600':   'bg-gradient-to-r from-orange-400 to-red-500',
  'from-emerald-500 to-teal-600': 'bg-gradient-to-r from-emerald-400 to-teal-500',
}

export function DashboardStatsCards({ cards }: DashboardStatsCardsProps) {
  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {cards.map((c, cardIdx) => {
        const Icon = ICON_MAP[c.iconName]
        const barColor = GRADIENT_TO_BAR[c.gradient] ?? 'bg-gradient-to-r from-gray-300 to-gray-400'
        return (
          <motion.div
            key={c.label}
            variants={item}
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)', transition: { duration: 0.2 } }}
            className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-card cursor-default relative"
          >
            {/* Coloured top accent bar */}
            <div className={cn('h-1 w-full', barColor)} />
            {/* Live pulse dot (stitch-skill: perpetual micro-interaction) */}
            <motion.div
              className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.2, 1], scale: [1, 0.8, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: cardIdx * 0.4 }}
            />

            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  className={cn(
                    'h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0',
                    'bg-gradient-to-br ring-4 shadow-sm',
                    c.gradient, c.ring
                  )}
                  whileHover={{ rotate: 8, scale: 1.08, transition: { duration: 0.18 } }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </motion.div>
                <motion.span
                  className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full', c.badgeColor)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + cardIdx * 0.07, duration: 0.3 }}
                >
                  {c.badge}
                </motion.span>
              </div>

              <p className={cn('text-2xl sm:text-3xl font-bold tracking-tight', c.valueColor)}>
                {c.numericValue !== null ? (
                  <CountUp to={c.numericValue} />
                ) : (
                  c.displayValue
                )}
              </p>

              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
                {c.trend && (
                  <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                    ↑ {c.trend}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
