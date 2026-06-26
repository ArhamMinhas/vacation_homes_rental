"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu, X, LogOut, LayoutDashboard, CalendarDays, ShieldCheck, Globe, LayoutGrid,
} from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser]             = useState<SupabaseUser | null>(null)
  const [role, setRole]             = useState<string | null>(null)
  const [isLoading, setIsLoading]   = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function loadUser(u: SupabaseUser | null) {
      setUser(u)
      if (!u) { setRole(null); setIsLoading(false); return }
      setIsLoading(false)
      try {
        const { data } = await supabase.from("profiles").select("role").eq("id", u.id).single()
        setRole(data?.role ?? null)
      } catch { setRole(null) }
    }

    supabase.auth.getUser()
      .then(({ data: { user: u } }) => loadUser(u))
      .catch(() => setIsLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => loadUser(session?.user ?? null)
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
    try { await fetch("/api/auth/logout", { method: "POST" }) }
    finally { window.location.href = role === "admin" ? "/admin/login" : ROUTES.LOGIN }
  }

  const isAdmin = role === "admin"

  const navLinks = [
    { href: ROUTES.PROPERTIES, label: "Explore"        },
    { href: "#experiences",    label: "Experiences"    },
    { href: ROUTES.REGISTER,   label: "Host Your Home" },
  ]

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-white border-b border-gray-100"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link href={ROUTES.HOME} className="flex items-center shrink-0">
            <span className="text-xl font-bold font-display tracking-tight">
              <span className="text-primary">Luxe</span>
              <span className="text-gray-900">Stay</span>
            </span>
          </Link>

          {/* ── Desktop centre nav ────────────────────────────── */}
          {!isLoading && !isAdmin && (
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors duration-200",
                    isActive(link.href)
                      ? "text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Admin badge */}
          {!isLoading && isAdmin && (
            <div className="hidden md:flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium flex-1 justify-center max-w-xs mx-auto">
              <ShieldCheck className="h-4 w-4" />
              Admin session
            </div>
          )}

          {/* ── Desktop right side ────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-10 bg-gray-100 animate-pulse rounded" />
                <div className="h-8 w-8 bg-gray-100 animate-pulse rounded-full" />
              </div>
            ) : user ? (
              isAdmin ? (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="ml-1 p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={ROUTES.USER_DASHBOARD}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </Link>
                  <Link
                    href={ROUTES.USER_BOOKINGS}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <CalendarDays className="h-3.5 w-3.5" />
                    Bookings
                  </Link>
                  <div className="w-px h-5 bg-gray-200 mx-1" />
                  {/* User avatar */}
                  <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    {initials}
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              )
            ) : (
              // ── Unauthenticated: Sign In + icons ──────────────
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Language">
                  <Globe className="h-4.5 w-4.5" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setMobileOpen((o) => !o)}
                  aria-label="Menu"
                >
                  <LayoutGrid className="h-4.5 w-4.5" />
                </button>
                <Link
                  href={ROUTES.REGISTER}
                  className="ml-1 h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 transition-colors"
                  aria-label="Account"
                >
                  U
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ─────────────────────────────── */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* ── Mobile menu ──────────────────────────────────────── */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="border-t border-gray-100 py-4 space-y-1 pb-5">
            {!isLoading && !isAdmin && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t border-gray-100 space-y-1">
              {isLoading ? (
                <div className="px-3 space-y-2">
                  <div className="h-9 bg-gray-100 animate-pulse rounded-lg" />
                </div>
              ) : user ? (
                isAdmin ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Signed in as Admin
                    </div>
                    <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Panel
                    </Link>
                    <button onClick={handleLogout} disabled={loggingOut} className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                      <LogOut className="h-4 w-4" />
                      {loggingOut ? "Signing out…" : "Sign out"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href={ROUTES.USER_DASHBOARD} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link href={ROUTES.USER_BOOKINGS} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                      <CalendarDays className="h-4 w-4" />
                      My Bookings
                    </Link>
                    <button onClick={handleLogout} disabled={loggingOut} className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                      <LogOut className="h-4 w-4" />
                      {loggingOut ? "Signing out…" : "Sign out"}
                    </button>
                  </>
                )
              ) : (
                <>
                  <Link href={ROUTES.LOGIN} className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                    Sign In
                  </Link>
                  <Link href={ROUTES.REGISTER} className="flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors">
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
