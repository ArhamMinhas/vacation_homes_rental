import Link from "next/link"
import { Home, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { APP_NAME, ROUTES } from "@/lib/constants"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="text-slate-300"
      style={{ background: "linear-gradient(180deg,#0A0F1E 0%,#060B16 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 sm:pt-16">

        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-2.5 text-white group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
                <Home className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Discover hand-picked vacation rentals around the world. Book your perfect escape with confidence.
            </p>
            <div className="space-y-2.5 text-sm text-slate-400">
              <a href="mailto:hello@stayfinder.com" className="flex items-center gap-2 hover:text-teal-300 transition-colors">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                hello@stayfinder.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-teal-300 transition-colors">
                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                +1 (234) 567-890
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-teal-500/70" />
                Available worldwide
              </span>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "All Properties",  href: ROUTES.PROPERTIES },
                { label: "Beach Houses",    href: `${ROUTES.PROPERTIES}?type=Beach+House` },
                { label: "Mountain Cabins", href: `${ROUTES.PROPERTIES}?type=Cabin` },
                { label: "City Apartments", href: `${ROUTES.PROPERTIES}?type=Apartment` },
                { label: "Luxury Villas",   href: `${ROUTES.PROPERTIES}?type=Villa` },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1 group">
                    <span>{item.label}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider">Account</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Sign in",      href: ROUTES.LOGIN },
                { label: "Register",     href: ROUTES.REGISTER },
                { label: "My dashboard", href: ROUTES.USER_DASHBOARD },
                { label: "My bookings",  href: ROUTES.USER_BOOKINGS },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1 group">
                    <span>{item.label}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Help centre",         href: "#" },
                { label: "Cancellation policy", href: "#" },
                { label: "Safety information",  href: "#" },
                { label: "Terms of service",    href: "#" },
                { label: "Privacy policy",      href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1 group">
                    <span>{item.label}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500 text-center sm:text-left">
            © {year} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <Link href="#" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-400 transition-colors">Terms</Link>
            <span>Built with Next.js &amp; Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
