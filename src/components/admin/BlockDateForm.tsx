"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { blockedDateSchema, type BlockedDateInput } from "@/validations/blocked-date.schema"
import type { BlockedDate } from "@/types/blocked-date"
import type { Property } from "@/types/property"
import { formatDate } from "@/utils/formatDate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toInputDate } from "@/utils/formatDate"

interface BlockDateFormProps {
  properties: Property[]
  initialBlockedDates: BlockedDate[]
}

export default function BlockDateForm({
  properties,
  initialBlockedDates,
}: BlockDateFormProps) {
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const today = toInputDate(new Date())

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BlockedDateInput>({
    resolver: zodResolver(blockedDateSchema),
  })

  const onSubmit = async (data: BlockedDateInput) => {
    setIsLoading(true)
    setServerError(null)
    try {
      const res = await fetch("/api/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setServerError(json.error?.message ?? json.error ?? "Failed to block dates")
        return
      }
      setBlockedDates((prev) => [...prev, json.blocked_date])
      reset()
    } catch {
      setServerError("Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      await fetch(`/api/blocked-dates/${id}`, { method: "DELETE" })
      setBlockedDates((prev) => prev.filter((d) => d.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground">Block new dates</h3>

        {serverError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
            <p className="text-sm text-destructive font-medium">{serverError}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-2">
            <Label>Property</Label>
            <Select onValueChange={(v) => setValue("property_id", v)}>
              <SelectTrigger className={errors.property_id ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title} — {p.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.property_id && (
              <p className="text-xs text-destructive">{errors.property_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_date">Start date</Label>
            <Input
              id="start_date"
              type="date"
              min={today}
              {...register("start_date")}
              className={errors.start_date ? "border-destructive" : ""}
            />
            {errors.start_date && (
              <p className="text-xs text-destructive">{errors.start_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">End date</Label>
            <Input
              id="end_date"
              type="date"
              min={today}
              {...register("end_date")}
              className={errors.end_date ? "border-destructive" : ""}
            />
            {errors.end_date && (
              <p className="text-xs text-destructive">{errors.end_date.message}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input id="reason" placeholder="e.g. Owner stay, maintenance…" {...register("reason")} />
          </div>
        </div>

        <Button type="submit" disabled={isLoading} size="sm">
          {isLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Blocking…</>
          ) : (
            <><Plus className="h-4 w-4 mr-1" /> Block Dates</>
          )}
        </Button>
      </form>

      {/* Existing blocked dates */}
      {blockedDates.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="bg-muted/40 px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Blocked Periods</p>
          </div>
          <div className="divide-y divide-border">
            {blockedDates.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {d.property?.title ?? "Unknown property"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(d.start_date)} → {formatDate(d.end_date)}
                    {d.reason ? ` · ${d.reason}` : ""}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 flex-shrink-0"
                  disabled={deleting === d.id}
                  onClick={() => handleDelete(d.id)}
                >
                  {deleting === d.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {blockedDates.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-6">No blocked dates yet.</p>
      )}
    </div>
  )
}
