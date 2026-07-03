"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Users, Calendar, DollarSign, AlertTriangle, CalendarCheck, Building2 } from "lucide-react"
import type { Booking, BookingStatus } from "@/types/booking"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-gray-50 text-gray-500 border-gray-200",
  rejected:  "bg-red-50 text-red-700 border-red-200",
}

const STATUS_DOT: Record<BookingStatus, string> = {
  pending:   "bg-amber-400",
  confirmed: "bg-emerald-500",
  cancelled: "bg-gray-400",
  rejected:  "bg-red-500",
}

interface BookingTableProps {
  bookings: Booking[]
}

export default function BookingTable({ bookings: initial }: BookingTableProps) {
  const router = useRouter()
  const [bookings, setBookings]       = useState(initial)
  const [updating, setUpdating]       = useState<string | null>(null)
  const [conflictError, setConflict]  = useState<string | null>(null)

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    setUpdating(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.status === 409) {
        const json = await res.json()
        setConflict(json.error ?? "These dates are already reserved for this property.")
        return
      }

      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
        router.refresh()
      }
    } catch {
      setConflict("Something went wrong while updating the booking.")
    } finally {
      setUpdating(null)
    }
  }

  const StatusSelect = ({ booking }: { booking: Booking }) => (
    <div className="relative">
      {updating === booking.id && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/60 rounded-xl">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        </div>
      )}
      <Select
        value={booking.status}
        disabled={updating === booking.id}
        onValueChange={(v) => handleStatusChange(booking.id, v as BookingStatus)}
      >
        <SelectTrigger className={`h-8 text-xs font-semibold border ${STATUS_COLORS[booking.status]} w-32 rounded-xl transition-all`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="pending" className="text-xs">Pending</SelectItem>
          <SelectItem value="confirmed" className="text-xs">Confirmed</SelectItem>
          <SelectItem value="cancelled" className="text-xs">Cancelled</SelectItem>
          <SelectItem value="rejected" className="text-xs">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-white shadow-sm">
        <div className="h-12 w-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
          <CalendarCheck className="h-6 w-6 text-gray-400" />
        </div>
        <p className="font-semibold text-foreground">No bookings yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Bookings will appear here once guests submit requests.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* ── Mobile: card list ───────────────────────────────────────────────── */}
      <div className="md:hidden space-y-4">
        {bookings.map((booking, i) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
          >
            {/* Property image header strip */}
            {booking.property?.images?.[0] ? (
              <div className="relative h-24 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={booking.property.images[0]} alt={booking.property?.title ?? ''} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <p className="absolute bottom-2 left-3 text-white text-sm font-semibold truncate max-w-[calc(100%-8rem)] font-display">{booking.property?.title}</p>
                <div className={`absolute bottom-2 right-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-white/95 backdrop-blur-sm ${STATUS_COLORS[booking.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[booking.status]}`} />
                  {booking.status.toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-600 font-semibold truncate max-w-[160px]">{booking.property?.title ?? '—'}</span>
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[booking.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[booking.status]}`} />
                  {booking.status.toUpperCase()}
                </div>
              </div>
            )}
            <div className="p-4 space-y-4">
              {/* Guest */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                  {booking.guest_name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{booking.guest_name}</p>
                  <p className="text-xs text-gray-400 truncate">{booking.guest_email}</p>
                </div>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex flex-col gap-0.5 bg-gray-50/60 rounded-xl border border-gray-100/50 px-2.5 py-2">
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <Calendar className="h-3 w-3" /> Dates
                  </div>
                  <span className="font-semibold text-gray-800 mt-1">{formatDate(booking.check_in)}</span>
                  <span className="text-gray-400 text-[10px]">to {formatDate(booking.check_out)}</span>
                </div>
                <div className="flex flex-col gap-0.5 bg-gray-50/60 rounded-xl border border-gray-100/50 px-2.5 py-2">
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <Users className="h-3 w-3" /> Guests
                  </div>
                  <span className="font-semibold text-gray-800 mt-1">{booking.guests} guest{booking.guests > 1 ? "s" : ""}</span>
                  <span className="text-gray-400 text-[10px]">{booking.nights} nights</span>
                </div>
                <div className="flex flex-col gap-0.5 bg-gray-50/60 rounded-xl border border-gray-100/50 px-2.5 py-2">
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    <DollarSign className="h-3 w-3" /> Total
                  </div>
                  <span className="font-bold text-primary mt-1">{formatCurrency(booking.total_price)}</span>
                </div>
              </div>

              {/* Status change */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-500">Update status</span>
                <StatusSelect booking={booking} />
              </div>
            </div>{/* end p-4 */}
          </motion.div>
        ))}
      </div>

      {/* ── Desktop: table ──────────────────────────────────────────────────── */}
      <div className="hidden md:block rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Guest</TableHead>
              <TableHead className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Property</TableHead>
              <TableHead className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Dates</TableHead>
              <TableHead className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Amount</TableHead>
              <TableHead className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking, i) => (
              <TableRow
                key={booking.id}
                className="hover:bg-gray-50/30 transition-colors border-b border-gray-100"
                style={{ animation: `fadeIn 0.35s ease both`, animationDelay: `${i * 50}ms` }}
              >
                <TableCell>
                  <p className="font-semibold text-sm text-gray-900">{booking.guest_name}</p>
                  <p className="text-xs text-gray-400">{booking.guest_email}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {booking.property?.title ?? "—"}
                  </p>
                  <p className="text-xs text-gray-400">{booking.property?.location}</p>
                </TableCell>
                <TableCell>
                  <p className="text-xs font-semibold text-gray-900">{formatDate(booking.check_in)}</p>
                  <p className="text-xs text-gray-400">to {formatDate(booking.check_out)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{booking.nights} nights</p>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold text-primary">
                    {formatCurrency(booking.total_price)}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusSelect booking={booking} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Date-conflict dialog ─────────────────────────────────────────────── */}
      <Dialog open={!!conflictError} onOpenChange={(o) => !o && setConflict(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive font-display">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              Booking Conflict
            </DialogTitle>
            <DialogDescription className="sr-only">
              This booking cannot be confirmed due to a date conflict with an existing reservation.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 leading-relaxed font-medium">
            {conflictError}
          </div>
          <p className="text-sm text-gray-500">
            To confirm this booking, first cancel or reject the conflicting confirmed reservation for those dates.
          </p>
          <DialogFooter>
            <Button onClick={() => setConflict(null)} className="rounded-xl bg-primary hover:bg-primary/90 text-white">Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
