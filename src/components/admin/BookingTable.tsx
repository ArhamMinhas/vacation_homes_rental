"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
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
  pending:   "bg-amber-100 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-muted text-muted-foreground border-border",
  rejected:  "bg-red-100 text-red-700 border-red-200",
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
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/60 rounded">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        </div>
      )}
      <Select
        value={booking.status}
        disabled={updating === booking.id}
        onValueChange={(v) => handleStatusChange(booking.id, v as BookingStatus)}
      >
        <SelectTrigger className={`h-7 text-xs border ${STATUS_COLORS[booking.status]} w-32`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 rounded-xl border border-dashed border-border">
        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
          <CalendarCheck className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground">No bookings yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Bookings will appear here once guests submit requests.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* ── Mobile: card list ───────────────────────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {bookings.map((booking, i) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/20 hover:shadow-sm transition-all duration-200"
          >
            {/* Property image header strip */}
            {booking.property?.images?.[0] ? (
              <div className="relative h-20 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={booking.property.images[0]} alt={booking.property?.title ?? ''} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-2 left-3 text-white text-xs font-semibold truncate max-w-[calc(100%-5rem)]">{booking.property?.title}</p>
                <div className={`absolute bottom-2 right-3 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[booking.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[booking.status]}`} />
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
              </div>
            ) : (
              <div className="h-10 bg-muted/40 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">{booking.property?.title ?? '—'}</span>
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[booking.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[booking.status]}`} />
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
              </div>
            )}
            <div className="p-4 space-y-3">
            {/* Guest */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                {booking.guest_name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{booking.guest_name}</p>
                <p className="text-xs text-muted-foreground truncate">{booking.guest_email}</p>
              </div>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex flex-col gap-0.5 bg-muted/50 rounded-lg px-2.5 py-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" /> Dates
                </div>
                <span className="font-medium text-foreground">{formatDate(booking.check_in)}</span>
                <span className="text-muted-foreground">→ {formatDate(booking.check_out)}</span>
              </div>
              <div className="flex flex-col gap-0.5 bg-muted/50 rounded-lg px-2.5 py-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3 w-3" /> Guests
                </div>
                <span className="font-medium text-foreground">{booking.guests}</span>
                <span className="text-muted-foreground">{booking.nights} nights</span>
              </div>
              <div className="flex flex-col gap-0.5 bg-muted/50 rounded-lg px-2.5 py-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="h-3 w-3" /> Total
                </div>
                <span className="font-semibold text-foreground">{formatCurrency(booking.total_price)}</span>
              </div>
            </div>

            {/* Status change */}
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <span className="text-xs text-muted-foreground">Update status</span>
              <StatusSelect booking={booking} />
            </div>
            </div>{/* end p-4 */}
          </motion.div>
        ))}
      </div>

      {/* ── Desktop: table ──────────────────────────────────────────────────── */}
      <div className="hidden md:block rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Guest</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking, i) => (
              <TableRow
                key={booking.id}
                className="hover:bg-muted/30 transition-colors"
                style={{ animation: `fadeIn 0.35s ease both`, animationDelay: `${i * 50}ms` }}
              >
                <TableCell>
                  <p className="font-medium text-sm text-foreground">{booking.guest_name}</p>
                  <p className="text-xs text-muted-foreground">{booking.guest_email}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-foreground font-medium line-clamp-1">
                    {booking.property?.title ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">{booking.property?.location}</p>
                </TableCell>
                <TableCell>
                  <p className="text-xs font-medium text-foreground">{formatDate(booking.check_in)}</p>
                  <p className="text-xs text-muted-foreground">→ {formatDate(booking.check_out)}</p>
                  <p className="text-xs text-muted-foreground">{booking.nights} nights</p>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-semibold text-foreground">
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              Booking Conflict
            </DialogTitle>
            <DialogDescription className="sr-only">
              This booking cannot be confirmed due to a date conflict with an existing reservation.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 leading-relaxed">
            {conflictError}
          </div>
          <p className="text-sm text-muted-foreground">
            To confirm this booking, first cancel or reject the conflicting confirmed reservation for those dates.
          </p>
          <DialogFooter>
            <Button onClick={() => setConflict(null)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
