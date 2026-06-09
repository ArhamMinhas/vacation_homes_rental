import Link from "next/link"
import { redirect } from "next/navigation"
import { CalendarDays, ArrowRight, Home, ArrowLeft, User } from "lucide-react"
import { getCurrentProfile } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants"
import BackButton from "@/components/common/BackButton"

export const metadata = { title: "Dashboard — StayFinder" }

export default async function UserDashboardPage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect(ROUTES.LOGIN)

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : profile.email[0].toUpperCase()

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* Back button */}
        <BackButton />

        {/* Profile header */}
        <div className="bg-background rounded-2xl border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-md shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
              Welcome back, {profile.full_name || "traveller"} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5 truncate">{profile.email}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full shrink-0">
            <User className="h-3.5 w-3.5" />
            Member since {new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
          </div>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href={ROUTES.USER_BOOKINGS}>
            <div className="group bg-background rounded-2xl border border-border p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                My Bookings
              </h3>
              <p className="text-sm text-muted-foreground">
                View and manage your booking requests
              </p>
              <div className="flex items-center gap-1 mt-4 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View bookings <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>

          <Link href={ROUTES.PROPERTIES}>
            <div className="group bg-background rounded-2xl border border-border p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                Browse Properties
              </h3>
              <p className="text-sm text-muted-foreground">
                Find your next perfect vacation home
              </p>
              <div className="flex items-center gap-1 mt-4 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Explore now <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        </div>

        {/* Account details */}
        <div className="bg-background rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Account details</h2>
          </div>
          <div className="divide-y divide-border">
            {[
              { label: "Full name",     value: profile.full_name || "—" },
              { label: "Email address", value: profile.email },
              {
                label: "Member since",
                value: new Date(profile.created_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                }),
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center px-6 py-4 gap-4">
                <span className="text-sm text-muted-foreground shrink-0">{label}</span>
                <span className="text-sm font-medium text-foreground text-right truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
