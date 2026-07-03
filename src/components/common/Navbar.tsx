"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  Menu, X, LogOut, LayoutDashboard, CalendarDays, ShieldCheck, Globe, LayoutGrid,
  Bell,
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

  const isHomePage = pathname === "/"

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
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [pathname])

  const handleLogout = async () => {
    setLoggingOut(true)
    try { await fetch("/api/auth/logout", { method: "POST" }) }
    finally { window.location.href = role === "admin" ? "/admin/login" : ROUTES.LOGIN }
  }

  const isAdmin = role === "admin"
  const isTransparent = isHomePage && !isScrolled && !mobileOpen

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
        "sticky top-0 z-50 w-full transition-all duration-500",
        isTransparent
          ? "bg-[#080d1a]/90 backdrop-blur-xl border-b border-white/10"
          : isScrolled
          ? "bg-white/96 backdrop-blur-xl shadow-sm border-b border-gray-100/80"
          : "bg-white border-b border-gray-100"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* Logo */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href={ROUTES.HOME} className="flex items-center shrink-0">
              <span className="text-xl font-bold font-display tracking-tight">
                <span className={cn("transition-colors duration-300", isTransparent ? "text-white" : "text-primary")}>
                  Coastal
                </span>
                <span className={cn("transition-colors duration-300", isTransparent ? "text-white/90" : "text-gray-900")}>
                  Horizon
                </span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary ml-0.5 mb-2" />
              </span>
            </Link>
          </motion.div>

          {/* Desktop centre nav */}
          {!isLoading && !isAdmin && (
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300",
                    isTransparent
                      ? isActive(link.href)
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                      : isActive(link.href)
                      ? "text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className={cn("absolute inset-x-3 -bottom-px h-0.5 rounded-full", isTransparent ? "bg-white" : "bg-primary")}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
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

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className={cn("h-4 w-10 animate-pulse rounded", isTransparent ? "bg-white/20" : "bg-gray-100")} />
                <div className={cn("h-8 w-8 animate-pulse rounded-full", isTransparent ? "bg-white/20" : "bg-gray-100")} />
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
                  <motion.button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn("ml-1 p-2 transition-colors", isTransparent ? "text-white/60 hover:text-red-300" : "text-gray-500 hover:text-red-500")}
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </motion.button>
                </>
              ) : (
                <>
                  <Link
                    href={ROUTES.USER_DASHBOARD}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                      isTransparent
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </Link>
                  <Link
                    href={ROUTES.USER_BOOKINGS}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                      isTransparent
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <CalendarDays className="h-3.5 w-3.5" />
                    Bookings
                  </Link>
                  <Link
                    href={ROUTES.USER_NOTIFICATIONS}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                      isTransparent
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <Bell className="h-3.5 w-3.5" />
                    Alerts
                  </Link>
                  <div className={cn("w-px h-5 mx-1", isTransparent ? "bg-white/20" : "bg-gray-200")} />
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 cursor-default transition-colors",
                      isTransparent
                        ? "bg-white/15 border border-white/30 text-white"
                        : "bg-primary/10 border border-primary/20 text-primary"
                    )}
                  >
                    {initials}
                  </motion.div>
                  <motion.button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn("p-2 transition-colors", isTransparent ? "text-white/50 hover:text-red-300" : "text-gray-400 hover:text-red-500")}
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </motion.button>
                </>
              )
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors",
                    isTransparent ? "text-white/80 hover:text-white" : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  Sign In
                </Link>
                <button
                  className={cn("p-2 transition-colors", isTransparent ? "text-white/50 hover:text-white/80" : "text-gray-400 hover:text-gray-600")}
                  aria-label="Language"
                >
                  <Globe className="h-4 w-4" />
                </button>
                <button
                  className={cn("p-2 transition-colors", isTransparent ? "text-white/50 hover:text-white/80" : "text-gray-400 hover:text-gray-600")}
                  onClick={() => setMobileOpen((o) => !o)}
                  aria-label="Menu"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <motion.div whileHover={{ scale: 1.08 }}>
                  <Link
                    href={ROUTES.REGISTER}
                    className={cn(
                      "ml-1 h-8 px-4 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-200",
                      isTransparent
                        ? "bg-white/15 text-white border border-white/30 hover:bg-white/25 backdrop-blur-sm"
                        : "bg-primary text-white hover:bg-primary/90"
                    )}
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className={cn("md:hidden p-2 transition-colors", isTransparent ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-gray-900")}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 0px)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0 round 0px)" }}
              exit={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 0px)" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden"
            >
              <motion.div
                initial={{ y: -6 }}
                animate={{ y: 0 }}
                exit={{ y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={cn("border-t py-4 space-y-1 pb-5", isHomePage && !isScrolled ? "border-white/10" : "border-gray-100")}
              >
                {!isLoading && !isAdmin && navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
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
                  </motion.div>
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
                        <Link href={ROUTES.USER_NOTIFICATIONS} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                          <Bell className="h-4 w-4" />
                          Notifications
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
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
