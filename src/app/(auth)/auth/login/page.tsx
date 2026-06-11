import { Suspense } from "react"
import Link from "next/link"
import { Home, Star, MapPin, Building2, Users } from "lucide-react"
import LoginForm from "@/components/auth/LoginForm"
import { APP_NAME, ROUTES } from "@/lib/constants"

export const metadata = {
  title: `Sign in — ${APP_NAME}`,
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">

      {/* ── Left decorative panel ─────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[46%] xl:w-1/2 relative flex-col justify-between p-10 xl:p-14 overflow-hidden"
        style={{
          background: "linear-gradient(145deg,#0F766E 0%,#0D9488 30%,#0891B2 65%,#1D4ED8 100%)",
        }}
      >
        {/* Background blobs */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-16 h-56 w-56 rounded-full bg-cyan-300/12 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Logo */}
        <div className="relative z-10 animate-fade-in-down">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">{APP_NAME}</span>
          </Link>
        </div>

        {/* Middle — headline + stats */}
        <div className="relative z-10 space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <span className="inline-block text-xs font-bold text-teal-200 uppercase tracking-[0.15em]">✦ Welcome back</span>
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
              Your perfect stay
              <br />
              is one click away
            </h1>
            <p className="text-teal-100 text-base leading-relaxed max-w-xs">
              Browse hundreds of hand-picked properties — from oceanfront villas to cozy mountain cabins.
            </p>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Building2, value: "500+", label: "Properties" },
              { icon: Users,     value: "10k+", label: "Guests" },
              { icon: MapPin,    value: "50+",  label: "Destinations" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15 text-center">
                <Icon className="h-4 w-4 text-teal-200 mx-auto mb-1" />
                <p className="text-white font-bold text-lg leading-none">{value}</p>
                <p className="text-teal-200 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — testimonial */}
        <div className="relative z-10 animate-fade-in-up delay-200">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-lg">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-white text-sm leading-relaxed italic">
              &ldquo;StayFinder made our anniversary trip effortless. The property was exactly as described and the booking was seamless.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-300 to-cyan-400 flex items-center justify-center text-teal-900 font-bold text-sm flex-shrink-0">
                S
              </div>
              <div>
                <p className="text-white text-sm font-medium">Sarah Mitchell</p>
                <p className="text-teal-200 text-xs">Verified guest · London</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        {/* Top bar for mobile */}
        <div className="lg:hidden flex items-center gap-3 px-6 py-5 border-b border-border/60">
          <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-foreground">{APP_NAME}</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-[400px] animate-fade-in-up">

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome back</h2>
              <p className="text-muted-foreground mt-1.5 text-sm">Sign in to your account to continue</p>
            </div>

            <Suspense>
              <LoginForm />
            </Suspense>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-center text-xs text-muted-foreground">
                Are you an admin?{" "}
                <Link href={ROUTES.ADMIN_LOGIN} className="text-primary hover:text-primary/80 font-semibold transition-colors">
                  Admin portal →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
