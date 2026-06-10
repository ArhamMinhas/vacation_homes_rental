"use client"

import { useState, useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Loader2, AlertTriangle, CalendarX } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { bookingSchema, type BookingInput } from "@/validations/booking.schema"
import { calculateNights } from "@/utils/calculateNights"
import type { Property } from "@/types/property"
import type { DateRange } from "@/services/availability.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import DateRangePicker from "./DateRangePicker"
import GuestSelector from "./GuestSelector"
import BookingSummary from "./BookingSummary"
import { ROUTES } from "@/lib/constants"
import { formatCurrency } from "@/utils/formatCurrency"

interface BookingFormProps {
  property: Property
  unavailable: DateRange[]
}

export default function BookingForm({ property, unavailable }: BookingFormProps) {
  const router = useRouter()
  const [isLoading,       setIsLoading]       = useState(false)
  const [serverError,     setServerError]     = useState<string | null>(null)
  const [conflictMessage, setConflictMessage] = useState<string | null>(null)
  const [success,         setSuccess]         = useState(false)
  const [checkIn,         setCheckIn]         = useState("")
  const [checkOut,        setCheckOut]        = useState("")
  const [guests,          setGuests]          = useState(1)

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema) as Resolver<BookingInput>,
    defaultValues: { property_id: property.id, guests: 1 },
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        if (u.user_metadata?.full_name) setValue("guest_name", u.user_metadata.full_name)
        if (u.email) setValue("guest_email", u.email)
      }
    })
  }, [setValue])

  const onSubmit = async (data: BookingInput) => {
    if (!checkIn || !checkOut) {
      setServerError("Please select check-in and check-out dates")
      return
    }

    setIsLoading(true)
    setServerError(null)
    setConflictMessage(null)

    try {
      // Pre-check availability before creating the booking
      const availRes = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: property.id,
          check_in: checkIn,
          check_out: checkOut,
          guests,
        }),
      })
      const avail = await availRes.json()
      if (!avail.available) {
        // Show conflict dialog for date/overlap issues
        setConflictMessage(avail.reason ?? "Selected dates are not available")
        setIsLoading(false)
        return
      }

      const payload = { ...data, check_in: checkIn, check_out: checkOut, guests }
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (res.status === 409) {
        setConflictMessage(json.error ?? "Selected dates are no longer available")
        return
      }

      if (!res.ok) {
        setServerError(json.error ?? "Failed to create booking")
        return
      }

      setSuccess(true)
      setTimeout(() => router.push(ROUTES.USER_BOOKINGS), 2000)
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Success state ───────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="text-center py-8 space-y-3 animate-scale-in">
        <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Booking submitted!</h3>
        <p className="text-sm text-muted-foreground">
          Your request is pending confirmation. Redirecting…
        </p>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Price header */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">
            {formatCurrency(property.price_per_night)}
          </span>
          <span className="text-muted-foreground text-sm">/ night</span>
        </div>

        {serverError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
            <p className="text-sm text-destructive font-medium">{serverError}</p>
          </div>
        )}

        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={(v) => {
            setCheckIn(v)
            setValue("check_in", v)
          }}
          onCheckOutChange={(v) => {
            setCheckOut(v)
            setValue("check_out", v)
          }}
          unavailable={unavailable}
          errorCheckIn={errors.check_in?.message}
          errorCheckOut={errors.check_out?.message}
        />

        <GuestSelector
          value={guests}
          max={property.max_guests}
          onChange={(v) => {
            setGuests(v)
            setValue("guests", v)
          }}
          error={errors.guests?.message}
        />

        {nights > 0 && (
          <BookingSummary
            pricePerNight={property.price_per_night}
            cleaningFee={property.cleaning_fee}
            nights={nights}
            checkIn={checkIn}
            checkOut={checkOut}
          />
        )}

        <div className="border-t border-border pt-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Guest information</h3>

          <div className="space-y-2">
            <Label htmlFor="guest_name">Full name</Label>
            <Input
              id="guest_name"
              placeholder="Your full name"
              {...register("guest_name")}
              className={errors.guest_name ? "border-destructive" : ""}
            />
            {errors.guest_name && (
              <p className="text-xs text-destructive">{errors.guest_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest_email">Email</Label>
            <Input
              id="guest_email"
              type="email"
              placeholder="you@example.com"
              {...register("guest_email")}
              className={errors.guest_email ? "border-destructive" : ""}
            />
            {errors.guest_email && (
              <p className="text-xs text-destructive">{errors.guest_email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest_phone">Phone (optional)</Label>
            <Input
              id="guest_phone"
              type="tel"
              placeholder="+1 555 000 0000"
              {...register("guest_phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to host (optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell the host about your trip…"
              rows={3}
              {...register("message")}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading || !checkIn || !checkOut}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Checking availability…
            </>
          ) : nights > 0 ? (
            `Reserve · ${formatCurrency(
              property.price_per_night * nights + property.cleaning_fee
            )}`
          ) : (
            "Select dates to reserve"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          You won&apos;t be charged until the booking is confirmed
        </p>
      </form>

      {/* ── Dates-unavailable dialog ──────────────────────────────────────────── */}
      <Dialog open={!!conflictMessage} onOpenChange={(o) => !o && setConflictMessage(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <CalendarX className="h-5 w-5 flex-shrink-0" />
              Dates not available
            </DialogTitle>
            <DialogDescription className="sr-only">
              These dates are already reserved for this property.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm font-semibold text-amber-800 mb-1">These dates are already reserved</p>
            <p className="text-sm text-amber-700">{conflictMessage}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Please choose different dates. Unavailable periods are highlighted on the calendar.
          </p>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              className="w-full"
              onClick={() => setConflictMessage(null)}
            >
              Choose different dates
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setConflictMessage(null)}
            >
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
