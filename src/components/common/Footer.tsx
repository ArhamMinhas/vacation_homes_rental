import Link from "next/link"
import { ROUTES } from "@/lib/constants"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href={ROUTES.HOME} className="inline-flex items-center">
              <span className="text-xl font-bold font-display tracking-tight">
                <span className="text-primary">Luxe</span>
                <span className="text-white">Stay</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Exquisite vacation rentals for the discerning traveller. We curate only the finest properties globally.
            </p>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider">Support</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Help Center",          href: "#" },
                { label: "Cancellation Options", href: "#" },
                { label: "Safety Information",   href: "#" },
                { label: "Accessibility",        href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-gray-500 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider">Destinations</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Europe",        href: `${ROUTES.PROPERTIES}?location=Europe`    },
                { label: "North America", href: `${ROUTES.PROPERTIES}?location=California` },
                { label: "Asia Pacific",  href: `${ROUTES.PROPERTIES}?location=Bali`      },
                { label: "Middle East",   href: `${ROUTES.PROPERTIES}?location=Dubai`     },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-gray-500 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Privacy",      href: "#" },
                { label: "Terms",        href: "#" },
                { label: "Sitemap",      href: "#" },
                { label: "Cookie Policy",href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-gray-500 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            © {year} LuxeStay. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>🇺🇸 English (US)</span>
            <span>$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
