import { Suspense } from "react"
import Link from "next/link"
import RegisterForm from "@/components/auth/RegisterForm"
import SocialLoginButtons from "@/components/auth/SocialLoginButtons"
import { APP_NAME, ROUTES } from "@/lib/constants"
import { RegisterLeftPanel } from "@/components/auth/AuthPanels"
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper"
import type { Metadata } from "next"

export const metadata: Metadata = { title: `Create account — ${APP_NAME}` }

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      <RegisterLeftPanel />

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

        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-14 xl:px-20 relative z-10">
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Create an account</h1>
                <p className="text-gray-500 text-sm mt-1.5">
                  Join our community of world-class owners and hosts
                </p>
              </div>

              <Suspense>
                <RegisterForm />
              </Suspense>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Or sign up with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <SocialLoginButtons action="Sign up" />

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Link href={ROUTES.LOGIN} className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  Log in
                </Link>
              </p>
            </AuthFormWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}
