import { Suspense } from "react"
import Link from "next/link"
import { Home, Star } from "lucide-react"
import LoginForm from "@/components/auth/LoginForm"
import { APP_NAME, ROUTES } from "@/lib/constants"

export const metadata = {
  title: `Sign in — ${APP_NAME}`,
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0F766E 0%, #0D9488 40%, #0891B2 100%)",
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Top — logo */}
        <div className="relative z-10">
          <Link href={ROUTES.HOME} className="flex items-center gap-2 text-white">
            <Home className="h-6 w-6" />
            <span className="text-xl font-bold">{APP_NAME}</span>
          </Link>
        </div>

        {/* Middle — headline */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Find your perfect<br />vacation escape
            </h1>
            <p className="text-teal-100 text-lg leading-relaxed">
              Browse hundreds of hand-picked properties — from oceanfront villas to cozy mountain cabins.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {[
              { value: "500+", label: "Properties" },
              { value: "10k+", label: "Happy guests" },
              { value: "50+", label: "Destinations" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-teal-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — testimonial */}
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-white text-sm leading-relaxed italic">
              &ldquo;StayFinder made our anniversary trip effortless. The property was exactly as described and the booking was seamless.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
                S
              </div>
              <div>
                <p className="text-white text-sm font-medium">Sarah Mitchell</p>
                <p className="text-teal-200 text-xs">Verified guest</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">{APP_NAME}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-1">Sign in to your account to continue</p>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-xs text-muted-foreground">
              Are you an admin?{" "}
              <Link href={ROUTES.ADMIN_LOGIN} className="text-primary hover:underline font-medium">
                Admin portal →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
