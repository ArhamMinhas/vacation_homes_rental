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
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0F766E 0%, #0D9488 40%, #0891B2 100%)",
        }}
      >
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link href={ROUTES.HOME} className="flex items-center gap-2 text-white">
            <Home className="h-6 w-6" />
            <span className="text-xl font-bold">{APP_NAME}</span>
          </Link>
        </div>

        {/* Middle content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Your next great<br />adventure starts here
            </h1>
            <p className="text-teal-100 text-lg leading-relaxed">
              Join thousands of travellers discovering unique stays around the world.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              {
                icon: ShieldCheck,
                title: "Secure bookings",
                desc: "Every reservation is protected and backed by our guarantee.",
              },
              {
                icon: CreditCard,
                title: "Transparent pricing",
                desc: "No hidden fees. What you see is what you pay.",
              },
              {
                icon: HeadphonesIcon,
                title: "24/7 support",
                desc: "Our team is always available to help with your stay.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{title}</p>
                  <p className="text-teal-200 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="relative z-10">
          <p className="text-teal-200 text-xs">
            By creating an account you agree to our{" "}
            <span className="text-white underline cursor-pointer">Terms of Service</span>{" "}
            and{" "}
            <span className="text-white underline cursor-pointer">Privacy Policy</span>.
          </p>
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
            <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
            <p className="text-muted-foreground mt-1">Start booking your dream vacation today</p>
          </div>

          <Suspense>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
