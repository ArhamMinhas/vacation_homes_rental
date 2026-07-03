"use client"

import { useState } from "react"
import { Loader2, LockKeyhole, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentCheckoutButtonProps {
  bookingId: string
  className?: string
  label?: string
}

export default function PaymentCheckoutButton({
  bookingId,
  className,
  label = "Continue to secure payment",
}: PaymentCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      })
      const data = await res.json()
      if (!res.ok || typeof data.url !== "string") {
        throw new Error(data.error ?? "Unable to start checkout")
      }
      window.location.href = data.url
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start checkout")
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="h-12 w-full rounded-full bg-primary text-base font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Opening Stripe...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {label}
          </>
        )}
      </Button>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <LockKeyhole className="h-3.5 w-3.5" />
        <span>Encrypted checkout powered by Stripe</span>
      </div>
      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
