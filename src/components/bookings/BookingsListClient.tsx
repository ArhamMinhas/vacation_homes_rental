'use client'

import { motion, AnimatePresence, type Variants } from 'framer-motion'
import Link from 'next/link'
import { CalendarX, MapPin, Users, Clock, CheckCircle2, XCircle, MinusCircle, ArrowRight, Home, CreditCard } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/common/EmptyState'
import { cn } from '@/lib/utils'
import { CountUp } from '@/components/ui/animations'
import CancelBookingButton from '@/app/(user)/bookings/CancelBookingButton'
import type { BookingStatus } from '@/types/booking'

const STATUS_CONFIG: Record<BookingStatus, { label: string; classes: string; dot: string; icon: React.ElementType }> = {
  pending:   { label: 'Pending',   classes: 'bg-amber-50 text-amber-700 border border-amber-200',        dot: 'bg-amber-400',   icon: Clock        },
  confirmed: { label: 'Confirmed', classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200',  dot: 'bg-emerald-500', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', classes: 'bg-muted text-muted-foreground border border-border',        dot: 'bg-gray-400',    icon: MinusCircle  },
  rejected:  { label: 'Rejected',  classes: 'bg-red-50 text-red-700 border border-red-200',              dot: 'bg-red-500',     icon: XCircle      },
}

interface Booking {
  id: string
  status: BookingStatus
  check_in: string
  check_out: string
  guests: number
  total_price: number
  nights: number
  property_id: string
  property?: {
    title: string
    location?: string | null
    images?: string[] | null
  } | null
}

interface BookingsListClientProps {
  bookings: Booking[]
  confirmedCount: number
  pendingCount: number
}

const statCards = [
  { key: 'total',     label: 'Total Bookings', color: 'text-gray-900',    bg: 'bg-white border-gray-100 shadow-sm',           dotColor: 'bg-gray-400'    },
  { key: 'confirmed', label: 'Confirmed',       color: 'text-emerald-700', bg: 'bg-emerald-50/80 border-emerald-200',           dotColor: 'bg-emerald-500' },
  { key: 'pending',   label: 'Pending',         color: 'text-amber-700',   bg: 'bg-amber-50/80 border-amber-200',               dotColor: 'bg-amber-400'   },
]

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const card: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export function BookingsListClient({ bookings, confirmedCount, pendingCount }: BookingsListClientProps) {
  const values: Record<string, number> = {
    total:     bookings.length,
    confirmed: confirmedCount,
    pending:   pendingCount,
  }

  return (
    <div>
      {/* Stats strip */}
      {bookings.length > 0 && (
        <motion.div
          className="grid grid-cols-3 gap-3 mb-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {statCards.map(({ key, label, color, bg, dotColor }, i) => (
            <motion.div
              key={key}
              className={cn('rounded-2xl border px-4 py-3.5 text-center', bg)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', dotColor)} />
                <p className="text-[11px] text-gray-500">{label}</p>
              </div>
              <p className={cn('text-2xl font-bold leading-none', color)}>
                <CountUp to={values[key]} />
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty state */}
      {bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarX className="h-6 w-6" />}
          title="No bookings yet"
          description="Find a property and book your next coastal escape."
          action={
            <Link href={ROUTES.PROPERTIES}>
              <Button>Browse properties</Button>
            </Link>
          }
        />
      ) : (
        <motion.div
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {bookings.map((booking) => {
              const s = STATUS_CONFIG[booking.status]
              const StatusIcon = s.icon

              return (
                <motion.div
                  key={booking.id}
                  variants={card}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Property image */}
                    <div className="sm:w-44 h-44 sm:h-auto flex-shrink-0 overflow-hidden relative">
                      {booking.property?.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={booking.property.images[0]}
                          alt={booking.property?.title ?? 'Property'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                          <Home className="h-10 w-10 text-gray-300" />
                        </div>
                      )}
                      {/* Status overlay */}
                      <div className={cn(
                        'absolute bottom-2 left-2 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border shadow-sm',
                        s.classes
                      )}>
                        <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', s.dot)} />
                        {s.label}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 p-5 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 line-clamp-1 text-base font-display">
                              {booking.property?.title ?? 'Property'}
                            </h3>
                            {booking.property?.location && (
                              <div className="flex items-center gap-1 mt-1 text-sm text-gray-400">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{booking.property.location}</span>
                              </div>
                            )}
                          </div>
                          <StatusIcon className={cn('h-4 w-4 flex-shrink-0 mt-0.5', s.classes.includes('emerald') ? 'text-emerald-600' : s.classes.includes('amber') ? 'text-amber-600' : s.classes.includes('red') ? 'text-red-500' : 'text-gray-400')} />
                        </div>

                        {/* Date + guests — inline journey format */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                            <div>
                              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Check-in</span>
                              <span className="text-xs font-semibold text-gray-800">{formatDate(booking.check_in)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-300 mx-1">
                              <div className="h-px w-4 bg-gray-200" />
                              <span className="text-[10px] font-medium text-gray-400">{booking.nights}n</span>
                              <div className="h-px w-4 bg-gray-200" />
                            </div>
                            <div>
                              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Check-out</span>
                              <span className="text-xs font-semibold text-gray-800">{formatDate(booking.check_out)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Guests</span>
                            <span className="text-xs font-semibold text-gray-800 mt-0.5 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {booking.guests}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 pt-3 border-t border-gray-100">
                        <div>
                          <p className="font-bold text-lg text-gray-900 leading-none">{formatCurrency(booking.total_price)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{booking.nights} night{booking.nights !== 1 ? 's' : ''} total</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {booking.property && (
                            <Link href={ROUTES.PROPERTY_DETAIL(booking.property_id)}>
                              <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5 rounded-xl border-gray-200 hover:border-primary/40 hover:text-primary">
                                View property
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          )}
                          {booking.status === 'pending' && (
                            <CancelBookingButton bookingId={booking.id} />
                          )}
                          {booking.status === 'confirmed' && (
                            <Link href={ROUTES.BOOKING_PAYMENT(booking.id)}>
                              <Button size="sm" className="text-xs h-8 gap-1.5 rounded-xl shadow-sm">
                                <CreditCard className="h-3 w-3" />
                                Pay now
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
