"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Building2, CalendarCheck, CalendarOff, Users,
  Home, X, Menu, LogOut, ExternalLink, ShieldCheck, Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES, APP_NAME } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"

const NAV_ITEMS = [
  { href: ROUTES.ADMIN_DASHBOARD,     label: "Dashboard",     icon: LayoutDashboard, grad: "from-orange-500 to-red-600"   },
  { href: ROUTES.ADMIN_BOOKINGS,      label: "Bookings",      icon: CalendarCheck,   grad: "from-blue-500 to-indigo-600"  },
  { href: ROUTES.ADMIN_PROPERTIES,    label: "Properties",    icon: Building2,       grad: "from-amber-500 to-orange-500" },
  { href: ROUTES.ADMIN_BLOCKED_DATES, label: "Blocked Dates", icon: CalendarOff,     grad: "from-rose-500 to-pink-600"    },
  { href: ROUTES.ADMIN_USERS,         label: "Users",         icon: Users,           grad: "from-emerald-500 to-teal-600" },
]

export default function AdminSidebar() {
  const pathname    = usePathname()
  const router      = useRouter()
  const [open,       setOpen]       = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [adminName,  setAdminName]  = useState<string>("")
  const [adminEmail, setAdminEmail] = useState<string>("")

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setAdminEmail(user.email ?? "")
      setAdminName(user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Admin")
    })
  }, [])

  const initials = adminName
    ? adminName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : adminEmail?.[0]?.toUpperCase() ?? "A"

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      router.push("/admin/login")
    }
  }

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="space-y-0.5 px-3 flex-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon, grad }) => {
        const active =
          pathname === href ||
          (href !== ROUTES.ADMIN_DASHBOARD && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            className={cn(
              "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
              active
                ? "text-white"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            {/* Sliding active background */}
            {active && (
              <motion.div
                layoutId="admin-nav-active"
                className="absolute inset-0 rounded-xl bg-white/12 border border-white/10 shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {/* Hover background (only when not active) */}
            {!active && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-white/6 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              />
            )}
            <motion.div
              className={cn(
                "relative h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                active
                  ? `bg-gradient-to-br ${grad} shadow-md`
                  : "bg-white/8 group-hover:bg-white/12"
              )}
              whileHover={!active ? { scale: 1.1, rotate: 4, transition: { duration: 0.15 } } : undefined}
            >
              <Icon className="h-3.5 w-3.5 text-white" />
            </motion.div>
            <span className="relative flex-1">{label}</span>
            {active && (
              <motion.div
                className="relative h-1.5 w-1.5 rounded-full bg-white/60 flex-shrink-0"
                layoutId="admin-nav-dot"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )

  const sidebarContent = (isMobile = false) => (
    <>
      {/* ── Logo ───────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center gap-3 px-5 h-16 border-b border-white/8 flex-shrink-0",
          isMobile && "justify-between"
        )}
      >
        <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Home className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm font-display">
            <span className="text-primary">Coastal</span><span className="text-white">Horizon</span>
          </span>
        </Link>
        {isMobile && (
          <button
            onClick={() => setOpen(false)}
            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── User profile section ────────────────────────────────── */}
      <div className="px-4 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md ring-2 ring-orange-500/30">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-semibold truncate leading-tight">
              {adminName || "Administrator"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="h-2.5 w-2.5 text-orange-400" />
              <span className="text-[10px] font-medium text-orange-400 leading-none">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav section label ───────────────────────────────────── */}
      <div className="px-6 pt-4 pb-1.5">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em]">Navigation</span>
      </div>

      {/* ── Nav links ───────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <NavLinks onClick={isMobile ? () => setOpen(false) : undefined} />
      </div>

      {/* ── Add New Listing CTA ─────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-white/8">
        <Link href="/admin/properties/create" onClick={isMobile ? () => setOpen(false) : undefined}>
          <div className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white text-sm font-semibold shadow-sm cursor-pointer">
            <Plus className="h-4 w-4" />
            Add New Listing
          </div>
        </Link>
      </div>

      {/* ── Bottom links ────────────────────────────────────────── */}
      <div className="px-3 pb-4 space-y-0.5">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/6 transition-all duration-200 border border-transparent hover:border-white/8"
          onClick={isMobile ? () => setOpen(false) : undefined}
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          View public site
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200 border border-transparent hover:border-rose-500/15 disabled:opacity-50"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {loggingOut ? "Signing out…" : "Logout"}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* ── Mobile fixed top header ─────────────────────────────── */}
      <div
        className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center gap-3 px-4 border-b border-white/8"
        style={{ background: "rgba(2,6,23,0.95)", backdropFilter: "blur(12px)" }}
      >
        <button
          onClick={() => setOpen(true)}
          className="h-9 w-9 rounded-xl bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors text-slate-300"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <Home className="h-3 w-3 text-white" />
          </div>
          <span className="font-semibold text-sm font-display">
            <span className="text-primary">Coastal</span><span className="text-white">Horizon</span>
          </span>
          <span className="text-[10px] text-orange-400 font-medium px-1.5 py-0.5 bg-orange-500/10 rounded-md border border-orange-500/20">Admin</span>
        </div>
        <Link href={ROUTES.HOME} className="ml-auto text-slate-500 hover:text-slate-300 transition-colors">
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {/* ── Mobile backdrop ─────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="drawer"
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-white/8"
            style={{ background: "linear-gradient(180deg,#0A0F1E 0%,#060B16 100%)" }}
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            {sidebarContent(true)}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-60 min-h-screen flex-shrink-0 sticky top-0 h-screen border-r border-white/8"
        style={{ background: "linear-gradient(180deg,#0A0F1E 0%,#060B16 100%)" }}
      >
        {sidebarContent(false)}
      </aside>
    </>
  )
}

