"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Building2, CalendarCheck, CalendarOff,
  Home, X, Menu, LogOut, ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES, APP_NAME } from "@/lib/constants"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { href: ROUTES.ADMIN_DASHBOARD,      label: "Dashboard",     icon: LayoutDashboard },
  { href: ROUTES.ADMIN_PROPERTIES,     label: "Properties",    icon: Building2 },
  { href: ROUTES.ADMIN_BOOKINGS,       label: "Bookings",      icon: CalendarCheck },
  { href: ROUTES.ADMIN_BLOCKED_DATES,  label: "Blocked Dates", icon: CalendarOff },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // Close drawer on navigation
  useEffect(() => setOpen(false), [pathname])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      router.push("/admin/login")
    }
  }

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="space-y-1 px-3 flex-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== ROUTES.ADMIN_DASHBOARD && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* ── Mobile fixed top header ────────────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 bg-card border-b border-border flex items-center gap-3 px-4">
        <button
          onClick={() => setOpen(true)}
          className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-semibold text-foreground text-sm">{APP_NAME}</span>
        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">Admin</span>
        <Link href={ROUTES.HOME} className="ml-auto">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground text-xs">
            <ExternalLink className="h-3.5 w-3.5" />
            Public site
          </Button>
        </Link>
      </div>

      {/* ── Mobile backdrop ────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* ── Mobile slide-out drawer ────────────────────────────────────────────── */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
              <Home className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-sm">{APP_NAME}</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto py-4 gap-4">
          <NavLinks onClick={() => setOpen(false)} />
        </div>

        <div className="p-3 border-t border-border space-y-1">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="h-4 w-4" />
            View public site
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      {/* ── Desktop sidebar ─────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-card border-r border-border flex-shrink-0 sticky top-0 h-screen">
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border flex-shrink-0">
          <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Home className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground text-sm">{APP_NAME}</span>
          <span className="text-xs text-muted-foreground ml-auto px-1.5 py-0.5 bg-muted rounded-md">Admin</span>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto py-4">
          <NavLinks />
        </div>

        <div className="p-3 border-t border-border space-y-1">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View public site
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>
    </>
  )
}
