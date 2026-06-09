import Link from "next/link"
import { Home, Mail, Phone, MapPin } from "lucide-react"
import { APP_NAME, ROUTES } from "@/lib/constants"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 text-white">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Discover hand-picked vacation rentals around the world. Book your perfect escape with confidence.
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <a href="mailto:hello@stayfinder.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="h-4 w-4 flex-shrink-0" />
                hello@stayfinder.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="h-4 w-4 flex-shrink-0" />
                +1 (234) 567-890
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                Available worldwide
              </span>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "All Properties", href: ROUTES.PROPERTIES },
                { label: "Beach Houses", href: `${ROUTES.PROPERTIES}?type=Beach+House` },
                { label: "Mountain Cabins", href: `${ROUTES.PROPERTIES}?type=Cabin` },
                { label: "City Apartments", href: `${ROUTES.PROPERTIES}?type=Apartment` },
                { label: "Luxury Villas", href: `${ROUTES.PROPERTIES}?type=Villa` },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Account</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Sign in", href: ROUTES.LOGIN },
                { label: "Create account", href: ROUTES.REGISTER },
                { label: "My dashboard", href: ROUTES.USER_DASHBOARD },
                { label: "My bookings", href: ROUTES.USER_BOOKINGS },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Help centre", href: "#" },
                { label: "Cancellation policy", href: "#" },
                { label: "Safety information", href: "#" },
                { label: "Terms of service", href: "#" },
                { label: "Privacy policy", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {year} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with Next.js &amp; Supabase
          </p>
        </div>
      </div>
    </footer>
  )
}
