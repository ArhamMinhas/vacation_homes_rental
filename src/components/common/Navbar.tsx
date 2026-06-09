"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home, Menu, X, LogOut, LayoutDashboard, CalendarDays, User,
} from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { APP_NAME, ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [pathname])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      // Force a full reload so middleware session clears properly
      window.location.href = ROUTES.LOGIN
    }
  }

  const navLinks = [{ href: ROUTES.PROPERTIES, label: "Properties" }]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 animate-fade-in-down",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-background border-b border-border/60"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2.5 text-foreground hover:text-primary transition-colors shrink-0 group"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">{APP_NAME}</span>
          </Link>

          {/* Desktop centre links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute inset-x-4 -bottom-px h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <Link href={ROUTES.USER_DASHBOARD}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-1.5",
                      pathname.startsWith("/dashboard") && "bg-primary/10 text-primary"
                    )}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href={ROUTES.USER_BOOKINGS}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-1.5",
                      pathname.startsWith("/bookings") && "bg-primary/10 text-primary"
                    )}
                  >
                    <CalendarDays className="h-4 w-4" />
                    My Bookings
                  </Button>
                </Link>
                <div className="w-px h-5 bg-border mx-1" />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "Signing out…" : "Sign out"}
                </Button>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button size="sm" className="gap-1.5 shadow-sm">
                    <User className="h-4 w-4" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen
              ? <X className="h-5 w-5" />
              : <Menu className="h-5 w-5" />
            }
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="border-t border-border py-3 space-y-1 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 mt-2 border-t border-border space-y-1">
              {user ? (
                <>
                  <Link
                    href={ROUTES.USER_DASHBOARD}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href={ROUTES.USER_BOOKINGS}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <CalendarDays className="h-4 w-4" />
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Signing out…" : "Sign out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={ROUTES.LOGIN}
                    className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href={ROUTES.REGISTER}
                    className="flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
