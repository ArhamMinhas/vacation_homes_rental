"use client"

import { useState, useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, CalendarX, CheckCircle2, Lock } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface BookingFormProps {
  property: Property
  unavailable: DateRange[]
}

export default function BookingForm({ property, unavailable }: BookingFormProps) {
  const router = useRouter()
  const [isLoading,       setIsLoading]       = useState(false)
  const [serverError,     setServerError]     = useState<string | null>(null)
  const [conflictMessage, setConflictMessage] = useState<string | null>(null)
  const [conflictType,    setConflictType]    = useState<"booking" | "blocked">("booking")
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

  const showConflict = (msg: string, type: "booking" | "blocked") => {
    setConflictType(type)
    setConflictMessage(msg)
  }

  const clearConflict = () => setConflictMessage(null)

  const onSubmit = async (data: BookingInput) => {
    if (!checkIn || !checkOut) {
      setServerError("Please select check-in and check-out dates")
      return
    }

    setIsLoading(true)
    setServerError(null)
    setConflictMessage(null)

    try {
      const availRes = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property_id: property.id, check_in: checkIn, check_out: checkOut, guests }),
      })
      const avail = await availRes.json()
      if (!avail.available) {
        showConflict(
          avail.reason ?? "Selected dates are not available",
          avail.conflictType ?? "booking"
        )
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
        showConflict(
          json.error ?? "Selected dates are no longer available",
          json.conflictType ?? "booking"
        )
        return
      }
      if (!res.ok) {
        setServerError(json.error ?? "Failed to create booking")
        return
      }

      setSuccess(true)
      setTimeout(() => router.push(ROUTES.USER_BOOKINGS), 2200)
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Success state ───────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="text-center py-10 space-y-4 animate-scale-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Booking submitted!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your request is pending confirmation. Redirecting to your bookings…
          </p>
        </div>
        <div className="flex justify-center">
          <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-[slide-progress_2.2s_ease-in-out_forwards]" />
          </div>
        </div>
      </div>
    )
  }

  const isBlocked = conflictType === "blocked"

  return (
    <>
      {/* ── Property image ──────────────────────────────────────────────────── */}
      {property.images[0] && (
        <div className="relative h-40 w-full overflow-hidden rounded-xl bg-muted mb-5">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="360px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pt-8 pb-2.5">
            <p className="text-white text-sm font-semibold truncate leading-tight">{property.title}</p>
            <p className="text-white/70 text-xs truncate">{property.location}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Price header */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">
            {formatCurrency(property.price_per_night)}
          </span>
          <span className="text-muted-foreground text-sm">/ night</span>
        </div>

        {serverError && (
          <div className="rounded-xl bg-destructive/8 border border-destructive/20 px-4 py-3">
            <p className="text-sm text-destructive font-medium">{serverError}</p>
          </div>
        )}

        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={(v) => { setCheckIn(v); setValue("check_in", v) }}
          onCheckOutChange={(v) => { setCheckOut(v); setValue("check_out", v) }}
          unavailable={unavailable}
          errorCheckIn={errors.check_in?.message}
          errorCheckOut={errors.check_out?.message}
          onConflict={showConflict}
        />

        <GuestSelector
          value={guests}
          max={property.max_guests}
          onChange={(v) => { setGuests(v); setValue("guests", v) }}
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

        {/* Guest information */}
        <div className="border-t border-border pt-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Guest information</h3>

          <div className="space-y-2">
            <Label htmlFor="guest_name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full name</Label>
            <Input
              id="guest_name"
              placeholder="Your full name"
              {...register("guest_name")}
              className={errors.guest_name ? "border-destructive rounded-xl" : "rounded-xl"}
            />
            {errors.guest_name && (
              <p className="text-xs text-destructive">{errors.guest_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest_email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</Label>
            <Input
              id="guest_email"
              type="email"
              placeholder="you@example.com"
              {...register("guest_email")}
              className={errors.guest_email ? "border-destructive rounded-xl" : "rounded-xl"}
            />
            {errors.guest_email && (
              <p className="text-xs text-destructive">{errors.guest_email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest_phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone (optional)</Label>
            <Input
              id="guest_phone"
              type="tel"
              placeholder="+1 555 000 0000"
              {...register("guest_phone")}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message to host (optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell the host about your trip…"
              rows={3}
              {...register("message")}
              className="rounded-xl resize-none"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl h-12 text-base font-semibold shadow-sm"
          size="lg"
          disabled={isLoading || !checkIn || !checkOut}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Checking availability…
            </>
          ) : nights > 0 ? (
            `Reserve · ${formatCurrency(property.price_per_night * nights + property.cleaning_fee)}`
          ) : (
            "Select dates to reserve"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          You won&apos;t be charged until the booking is confirmed
        </p>
      </form>

      {/* ── Conflict dialog — appearance differs for guest reservations vs admin blocks ── */}
      <Dialog open={!!conflictMessage} onOpenChange={(o) => !o && clearConflict()}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className={cn(
              "flex items-center gap-2",
              isBlocked ? "text-orange-600" : "text-amber-600"
            )}>
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                isBlocked ? "bg-orange-50" : "bg-amber-50"
              )}>
                {isBlocked
                  ? <Lock className="h-4 w-4" />
                  : <CalendarX className="h-4 w-4" />
                }
              </div>
              {isBlocked ? "Dates Blocked by Host" : "Already Reserved"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {isBlocked
                ? "These dates have been blocked by the host for maintenance or personal use."
                : "These dates are already booked by another guest."
              }
            </DialogDescription>
          </DialogHeader>

          <div className={cn(
            "rounded-xl p-4 border",
            isBlocked
              ? "bg-orange-50 border-orange-200"
              : "bg-amber-50 border-amber-200"
          )}>
            <p className={cn(
              "text-sm font-semibold mb-1",
              isBlocked ? "text-orange-800" : "text-amber-800"
            )}>
              {isBlocked ? "Host-blocked period" : "Guest reservation conflict"}
            </p>
            <p className={cn(
              "text-sm leading-relaxed",
              isBlocked ? "text-orange-700" : "text-amber-700"
            )}>
              {conflictMessage}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            {isBlocked
              ? "These dates are reserved for owner use or maintenance. Please choose different dates."
              : "Please select dates that don't overlap with the existing reservation."
            }
          </p>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button className="w-full rounded-xl" onClick={clearConflict}>
              Choose different dates
            </Button>
            <Button variant="outline" className="w-full rounded-xl" onClick={clearConflict}>
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
