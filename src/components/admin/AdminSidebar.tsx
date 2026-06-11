"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Building2, CalendarCheck, CalendarOff, Users,
  Home, X, Menu, LogOut, ExternalLink, ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES, APP_NAME } from "@/lib/constants"

const NAV_ITEMS = [
  { href: ROUTES.ADMIN_DASHBOARD,     label: "Dashboard",     icon: LayoutDashboard, grad: "from-teal-500 to-emerald-500"  },
  { href: ROUTES.ADMIN_PROPERTIES,    label: "Properties",    icon: Building2,       grad: "from-blue-500 to-cyan-500"     },
  { href: ROUTES.ADMIN_BOOKINGS,      label: "Bookings",      icon: CalendarCheck,   grad: "from-violet-500 to-purple-500" },
  { href: ROUTES.ADMIN_BLOCKED_DATES, label: "Blocked Dates", icon: CalendarOff,     grad: "from-amber-500 to-orange-500"  },
  { href: ROUTES.ADMIN_USERS,         label: "Users",         icon: Users,           grad: "from-rose-500 to-pink-500"     },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

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
      {NAV_ITEMS.map(({ href, label, icon: Icon, grad }) => {
        const active = pathname === href || (href !== ROUTES.ADMIN_DASHBOARD && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              active
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:bg-white/6 hover:text-slate-200 border border-transparent"
            )}
          >
            <div
              className={cn(
                "h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                active
                  ? `bg-gradient-to-br ${grad} shadow-md`
                  : "bg-white/8 group-hover:bg-white/12"
              )}
            >
              <Icon className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="flex-1">{label}</span>
            {active && (
              <div className="h-1.5 w-1.5 rounded-full bg-white/70 flex-shrink-0" />
            )}
          </Link>
        )
      })}
    </nav>
  )

  const sidebarContent = (isMobile = false) => (
    <>
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 h-16 border-b border-white/8 flex-shrink-0",
        isMobile && "justify-between"
      )}>
        <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Home className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">{APP_NAME}</span>
            <div className="flex items-center gap-1 mt-px">
              <ShieldCheck className="h-2.5 w-2.5 text-teal-400" />
              <span className="text-[10px] font-medium text-teal-400 leading-none">Admin</span>
            </div>
          </div>
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

      {/* Nav section label */}
      <div className="px-6 pt-5 pb-2">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em]">Navigation</span>
      </div>

      {/* Nav links */}
      <div className="flex flex-col flex-1 overflow-y-auto pb-4">
        <NavLinks onClick={isMobile ? () => setOpen(false) : undefined} />
      </div>

      {/* Bottom section */}
      <div className="p-3 border-t border-white/8 space-y-1">
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
          {loggingOut ? "Signing out…" : "Sign out"}
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
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
            <Home className="h-3 w-3 text-white" />
          </div>
          <span className="font-semibold text-white text-sm">{APP_NAME}</span>
          <span className="text-[10px] text-teal-400 font-medium px-1.5 py-0.5 bg-teal-500/10 rounded-md border border-teal-500/20">Admin</span>
        </div>
        <Link href={ROUTES.HOME} className="ml-auto text-slate-500 hover:text-slate-300 transition-colors">
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {/* ── Mobile backdrop ─────────────────────────────────────── */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-250 ease-out",
          "border-r border-white/8",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ background: "linear-gradient(180deg,#0A0F1E 0%,#060B16 100%)" }}
      >
        {sidebarContent(true)}
      </aside>

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
