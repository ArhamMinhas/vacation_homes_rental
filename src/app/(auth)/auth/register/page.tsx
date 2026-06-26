import { Suspense } from "react"
import Link from "next/link"
import RegisterForm from "@/components/auth/RegisterForm"
import SocialLoginButtons from "@/components/auth/SocialLoginButtons"
import { APP_NAME, ROUTES } from "@/lib/constants"

export const metadata = {
  title: `Create account — ${APP_NAME}`,
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">

      {/* ── Left: luxury photo panel ────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative flex-col overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1200&q=85')`,
          }}
        />
        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-2">
            <span className="text-xl font-bold font-display">
              <span className="text-primary">Luxe</span><span className="text-white">Stay</span>
            </span>
          </Link>
        </div>

        {/* Bottom text */}
        <div className="relative z-10 mt-auto p-10 pb-12">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-3">
            Experience luxury in<br />every horizon.
          </h2>
          <p className="text-white/75 text-sm leading-relaxed max-w-xs">
            Join our community of world-class travellers and hosts discovering extraordinary homes around the globe.
          </p>
        </div>
      </div>

      {/* ── Right: register form panel ──────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white min-h-screen">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 py-5 border-b border-gray-100">
          <Link href={ROUTES.HOME}>
            <span className="text-lg font-bold font-display">
              <span className="text-primary">Luxe</span><span className="text-gray-900">Stay</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-[400px]">

            {/* Desktop logo */}
            <div className="hidden lg:block mb-8">
              <Link href={ROUTES.HOME}>
                <span className="text-2xl font-bold font-display">
                  <span className="text-primary">Luxe</span><span className="text-gray-900">Stay</span>
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create an account</h1>
              <p className="text-gray-500 text-sm mt-1.5">
                Join our community of world-class owners and hosts
              </p>
            </div>

            {/* Register form */}
            <Suspense>
              <RegisterForm />
            </Suspense>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Or sign up with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social buttons */}
            <SocialLoginButtons action="Sign up" />

            {/* Login link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link href={ROUTES.LOGIN} className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
