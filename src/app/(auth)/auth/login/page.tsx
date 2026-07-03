import { Suspense } from "react"
import Link from "next/link"
import LoginForm from "@/components/auth/LoginForm"
import SocialLoginButtons from "@/components/auth/SocialLoginButtons"
import { APP_NAME, ROUTES } from "@/lib/constants"
import { LoginLeftPanel } from "@/components/auth/AuthPanels"
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper"
import type { Metadata } from "next"

export const metadata: Metadata = { title: `Sign in — ${APP_NAME}` }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <LoginLeftPanel />

      {/* ── Right: form panel ─────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fafafe 0%, #fff8f5 100%)" }}>
        {/* Ambient decoration */}
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,90,31,0.055) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

        {/* Mobile logo bar */}
        <div className="lg:hidden flex items-center gap-2 px-6 py-5 border-b border-gray-100/80 relative z-10">
          <Link href={ROUTES.HOME}>
            <span className="text-lg font-bold font-display">
              <span className="text-primary">Coastal</span><span className="text-gray-900">Horizon</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-14 xl:px-20 relative z-10">
          <div className="w-full max-w-[400px]">
            <AuthFormWrapper>
              <div className="hidden lg:block mb-8">
                <Link href={ROUTES.HOME}>
                  <span className="text-2xl font-bold font-display">
                    <span className="text-primary">Coastal</span><span className="text-gray-900">Horizon</span>
                  </span>
                </Link>
              </div>

              <div className="mb-7">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Welcome back</h1>
                <p className="text-gray-500 text-sm mt-1.5">
                  Please enter your details to access your account
                </p>
              </div>

              <Suspense>
                <LoginForm />
              </Suspense>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Or continue with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <SocialLoginButtons action="Log in" />

              <p className="text-center text-sm text-gray-500 mt-6">
                Don&apos;t have an account?{" "}
                <Link href={ROUTES.REGISTER} className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  Sign up for free
                </Link>
              </p>

              <p className="text-center text-xs text-gray-400 mt-4">
                Are you an admin?{" "}
                <Link href={ROUTES.ADMIN_LOGIN} className="text-primary/70 hover:text-primary font-medium transition-colors">
                  Admin portal →
                </Link>
              </p>
            </AuthFormWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}
