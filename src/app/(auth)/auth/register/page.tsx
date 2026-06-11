import { Suspense } from "react"
import Link from "next/link"
import { Home, ShieldCheck, CreditCard, HeadphonesIcon } from "lucide-react"
import RegisterForm from "@/components/auth/RegisterForm"
import { APP_NAME, ROUTES } from "@/lib/constants"

export const metadata = {
  title: `Create account — ${APP_NAME}`,
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">

      {/* ── Left decorative panel ─────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[46%] xl:w-1/2 relative flex-col justify-between p-10 xl:p-14 overflow-hidden"
        style={{
          background: "linear-gradient(145deg,#7C3AED 0%,#6D28D9 25%,#0891B2 65%,#0F766E 100%)",
        }}
      >
        {/* Blobs */}
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
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

        {/* Middle */}
        <div className="relative z-10 space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <span className="inline-block text-xs font-bold text-violet-200 uppercase tracking-[0.15em]">✦ Join us today</span>
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
              Your next great
              <br />
              adventure starts here
            </h1>
            <p className="text-violet-100 text-base leading-relaxed max-w-xs">
              Join thousands of travellers discovering unique stays around the world.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            {[
              { icon: ShieldCheck,    title: "Secure bookings",     desc: "Every reservation is protected by our guarantee." },
              { icon: CreditCard,     title: "Transparent pricing", desc: "No hidden fees. What you see is what you pay." },
              { icon: HeadphonesIcon, title: "24/7 support",        desc: "Our team is always available to help." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 items-start">
                <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center mt-0.5">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-violet-200 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 animate-fade-in-up delay-200">
          <p className="text-violet-200 text-xs leading-relaxed">
            By creating an account you agree to our{" "}
            <span className="text-white underline cursor-pointer hover:text-white/80 transition-colors">Terms of Service</span>{" "}
            and{" "}
            <span className="text-white underline cursor-pointer hover:text-white/80 transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-6 py-5 border-b border-border/60">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
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
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Create your account</h2>
              <p className="text-muted-foreground mt-1.5 text-sm">Start booking your dream vacation today</p>
            </div>

            <Suspense>
              <RegisterForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
