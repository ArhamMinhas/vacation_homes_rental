import { Suspense } from "react"
import Link from "next/link"
import { ShieldCheck, Home, Lock, BarChart3, Users, Building2 } from "lucide-react"
import LoginForm from "@/components/auth/LoginForm"
import { APP_NAME, ROUTES } from "@/lib/constants"

export const metadata = {
  title: `Admin Login — ${APP_NAME}`,
}

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg,#0c0400 0%,#1a0800 40%,#251000 75%,#1a0800 100%)",
      }}
    >
      {/* Background orbs — warm brand palette */}
      <div
        className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle,#FF5A1F,transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] h-96 w-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle,#f59e0b,transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle,#ea580c,transparent 70%)" }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-5xl mx-auto animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">

          {/* ── Left info panel ── */}
          <div className="hidden lg:flex flex-col gap-8 pr-8">
            {/* Logo */}
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-3 group w-fit">
              <div className="h-11 w-11 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-xl font-bold font-display">
                  <span className="text-primary">Luxe</span><span className="text-white">Stay</span>
                </span>
              </div>
            </Link>

            {/* Headline */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-[0.15em]">✦ Admin Portal</span>
              <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
                Manage your
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg,#FF5A1F,#f59e0b)" }}
                >
                  rental platform
                </span>
              </h1>
              <p className="text-[#b8a090] text-sm leading-relaxed max-w-xs">
                Access the full admin dashboard to manage properties, bookings, users and blocked dates.
              </p>
            </div>

            {/* Feature tiles */}
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  icon: BarChart3,
                  title: "Real-time analytics",
                  desc: "Revenue, occupancy & booking stats",
                  grad: "from-orange-500/20 to-red-500/10",
                  border: "border-orange-500/20",
                },
                {
                  icon: Building2,
                  title: "Property management",
                  desc: "Create, edit and toggle listings",
                  grad: "from-amber-500/20 to-yellow-500/10",
                  border: "border-amber-500/20",
                },
                {
                  icon: Users,
                  title: "User & role control",
                  desc: "Manage accounts and admin access",
                  grad: "from-emerald-500/20 to-green-500/10",
                  border: "border-emerald-500/20",
                },
              ].map(({ icon: Icon, title, desc, grad, border }) => (
                <div
                  key={title}
                  className={`flex items-start gap-3.5 p-4 rounded-xl bg-gradient-to-br ${grad} border ${border} backdrop-blur-sm`}
                >
                  <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <p className="text-[#b8a090] text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right login card ── */}
          <div className="w-full">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold font-display">
                <span className="text-primary">Luxe</span><span className="text-white">Stay</span>
              </span>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              {/* ── Dark header ── */}
              <div
                className="px-8 py-7 text-center space-y-4"
                style={{
                  background: "linear-gradient(135deg,#1a0600 0%,#2d1000 50%,#1a0600 100%)",
                  borderBottom: "1px solid rgba(255,100,0,0.12)",
                }}
              >
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg" />
                    <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/30 to-orange-500/10 border border-primary/30 flex items-center justify-center shadow-lg">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Admin Portal</h2>
                  <p className="text-[#b8a090] text-sm mt-1">Restricted access — authorised personnel only</p>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/25 rounded-full px-3 py-1">
                  <Lock className="h-3 w-3 text-primary" />
                  <span className="text-primary text-xs font-medium">Encrypted &amp; secured</span>
                </div>
              </div>

              {/* ── White form body ── */}
              <div className="bg-white px-8 py-8">
                <Suspense>
                  <LoginForm isAdmin />
                </Suspense>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-6 text-center">
              <Link
                href={ROUTES.HOME}
                className="inline-flex items-center gap-1.5 text-[#b8a090] hover:text-orange-300 text-sm transition-colors duration-200"
              >
                <Home className="h-3.5 w-3.5" />
                Back to {APP_NAME}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
