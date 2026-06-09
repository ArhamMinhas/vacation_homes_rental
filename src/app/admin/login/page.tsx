import { Suspense } from "react"
import Link from "next/link"
import { ShieldCheck, Home } from "lucide-react"
import LoginForm from "@/components/auth/LoginForm"
import { APP_NAME, ROUTES } from "@/lib/constants"

export const metadata = {
  title: `Admin Login — ${APP_NAME}`,
}

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F2027 100%)",
      }}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Card header */}
          <div className="bg-slate-900 px-8 py-7 text-center space-y-3">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Portal</h1>
              <p className="text-slate-400 text-sm mt-1">
                Restricted access — authorised personnel only
              </p>
            </div>
          </div>

          {/* Card body */}
          <div className="px-8 py-8">
            <Suspense>
              <LoginForm isAdmin />
            </Suspense>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to {APP_NAME}
          </Link>
        </div>
      </div>
    </div>
  )
}
