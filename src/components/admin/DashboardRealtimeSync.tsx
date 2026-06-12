"use client"

import { useEffect, useState, useCallback, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

/** Refreshes every 10 s to keep "Updated Xs ago" text current without a full re-render. */
function useTimeAgo(date: Date | null): string | null {
  const [, tick] = useState(0)

  useEffect(() => {
    if (!date) return
    const id = setInterval(() => tick((n) => n + 1), 10_000)
    return () => clearInterval(id)
  }, [date])

  if (!date) return null
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 10) return "just now"
  if (secs < 60) return `${secs}s ago`
  return `${Math.floor(secs / 60)}m ago`
}

export default function DashboardRealtimeSync() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const timeAgo = useTimeAgo(lastUpdated)

  const refresh = useCallback(() => {
    // Debounce: if multiple DB events fire in quick succession (e.g. bulk update)
    // collapse them into a single router.refresh() call.
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      // startTransition keeps the existing UI visible while new server data loads —
      // Suspense boundaries won't flash back to skeletons during the refresh.
      startTransition(() => router.refresh())
      setLastUpdated(new Date())
    }, 300)
  }, [router, startTransition])

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to any INSERT / UPDATE / DELETE on bookings or properties.
    // Requires Realtime to be enabled for these tables in the Supabase dashboard
    // (Database → Replication → supabase_realtime publication).
    const channel = supabase
      .channel("admin-dashboard-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "properties" }, refresh)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [refresh])

  return (
    <div className="flex items-center gap-2 text-xs select-none">
      {/* Pulsing green dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>

      <span className="text-emerald-600 font-semibold">Live</span>

      {timeAgo && (
        <>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground">Updated {timeAgo}</span>
        </>
      )}

      {/* Manual refresh */}
      <button
        onClick={refresh}
        disabled={isPending}
        aria-label="Refresh dashboard now"
        title="Refresh now"
        className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
      >
        <RefreshCw className={cn("h-3.5 w-3.5", isPending && "animate-spin")} />
      </button>
    </div>
  )
}
