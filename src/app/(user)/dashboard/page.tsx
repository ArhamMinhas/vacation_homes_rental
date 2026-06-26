import Link from "next/link"
import { redirect } from "next/navigation"
import {
  CalendarDays, ArrowRight, Home, User, MapPin,
  Settings, CheckCircle2, Clock, TrendingUp
} from "lucide-react"
import { getCurrentProfile, getCurrentUser } from "@/lib/auth"
import { getUserBookings } from "@/services/booking.service"
import { ROUTES } from "@/lib/constants"
import BackButton from "@/components/common/BackButton"
import { formatCurrency } from "@/utils/formatCurrency"
import type { Booking } from "@/types/booking"

export const metadata = { title: "Dashboard — LuxeStay" }

export default async function UserDashboardPage() {
  const [profile, user] = await Promise.all([getCurrentProfile(), getCurrentUser()])
  if (!profile || !user) redirect(ROUTES.LOGIN)

  let bookings: Booking[] = []
  try {
    bookings = await getUserBookings(user.id)
  } catch {
    bookings = []
  }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : profile.email[0].toUpperCase()

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed")
  const pendingBookings   = bookings.filter((b) => b.status === "pending")
  const totalSpend        = confirmedBookings.reduce((sum, b) => sum + b.total_price, 0)

  return (
    <div className="min-h-screen bg-[#f9f9ff]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">

        <BackButton />

        {/* ── Hero profile card ────────────────────────────────────── */}
        <div className="rounded-3xl overflow-hidden shadow-sm">
          {/* Background image strip */}
          <div
            className="h-28 sm:h-36 relative"
            style={{
              backgroundImage: `linear-gradient(to bottom right, rgba(100,35,8,0.88) 0%, rgba(180,60,10,0.78) 40%, rgba(80,20,0,0.86) 100%), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80')`,
              backgroundSize: "cover",
              backgroundPosition: "center 40%",
            }}
          >
            {/* Avatar anchored to bottom */}
            <div className="absolute -bottom-8 left-6 sm:left-8">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white border-4 border-white flex items-center justify-center text-primary text-2xl font-bold shadow-md font-display">
                {initials}
              </div>
            </div>
          </div>

          {/* Info strip */}
          <div className="bg-white pt-10 sm:pt-12 pb-5 px-6 sm:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight font-display">
                {profile.full_name || "Traveller"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{profile.email}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 w-fit">
              <User className="h-3.5 w-3.5" />
              Member since {new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 bg-white border-t border-gray-100">
            {[
              { label: "Total Bookings",  value: bookings.length,        icon: CalendarDays },
              { label: "Confirmed Stays", value: confirmedBookings.length, icon: CheckCircle2 },
              { label: "Total Spent",     value: formatCurrency(totalSpend), icon: TrendingUp   },
            ].map(({ label, value, icon: Icon }, i) => (
              <div key={label} className="px-5 py-4 text-center border-r border-gray-100 last:border-r-0">
                <Icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                <p className="text-gray-900 font-bold text-lg sm:text-xl leading-none">{value}</p>
                <p className="text-gray-500 text-[11px] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick action cards ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href={ROUTES.USER_BOOKINGS} className="col-span-1">
            <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">My Bookings</h3>
                {pendingBookings.length > 0 && (
                  <span className="text-[11px] bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                    {pendingBookings.length} pending
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">View and manage your reservation requests</p>
              <div className="flex items-center gap-1 mt-4 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View bookings <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>

          <Link href={ROUTES.PROPERTIES} className="col-span-1">
            <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">Browse Properties</h3>
              <p className="text-sm text-gray-500">Discover your next perfect vacation home</p>
              <div className="flex items-center gap-1 mt-4 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Explore now <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>

          <Link href={ROUTES.PROPERTIES + "?location=Santorini"} className="col-span-1">
            <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">Top Destinations</h3>
              <p className="text-sm text-gray-500">Explore our most popular coastal locations</p>
              <div className="flex items-center gap-1 mt-4 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        </div>

        {/* ── Account details ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Account details</h2>
            <Settings className="h-4 w-4 text-gray-400" />
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { label: "Full name",     value: profile.full_name || "—" },
              { label: "Email address", value: profile.email },
              {
                label: "Member since",
                value: new Date(profile.created_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                }),
              },
              { label: "Account type", value: "Guest" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center px-6 py-4 gap-4">
                <span className="text-sm text-gray-500 shrink-0">{label}</span>
                <span className="text-sm font-medium text-gray-900 text-right truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
