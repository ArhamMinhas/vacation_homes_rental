'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowRight } from "lucide-react"
import { ROUTES } from "@/lib/constants"
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/animations"

const LINKS = {
  Support: [
    { label: "Help Center",          href: "#" },
    { label: "Cancellation Options", href: "#" },
    { label: "Safety Information",   href: "#" },
    { label: "Accessibility",        href: "#" },
  ],
  Destinations: [
    { label: "Europe",        href: `${ROUTES.PROPERTIES}?location=Europe`     },
    { label: "North America", href: `${ROUTES.PROPERTIES}?location=California` },
    { label: "Asia Pacific",  href: `${ROUTES.PROPERTIES}?location=Bali`       },
    { label: "Middle East",   href: `${ROUTES.PROPERTIES}?location=Dubai`      },
  ],
  Legal: [
    { label: "Privacy",       href: "#" },
    { label: "Terms",         href: "#" },
    { label: "Sitemap",       href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
}

const SOCIAL: { label: string; path: string }[] = [
  {
    label: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z",
  },
  {
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-[#090e1a] text-gray-400 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-64 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-48 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Newsletter strip */}
      <div className="relative border-b border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <FadeInUp className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-primary tracking-widest uppercase mb-1">Stay in the loop</p>
              <h3 className="text-white text-lg font-bold font-display">Get exclusive property drops</h3>
              <p className="text-gray-500 text-sm mt-0.5">New coastal homes, curated for you weekly.</p>
            </div>
            <motion.div
              className="flex w-full sm:w-auto max-w-sm"
              whileHover={{ scale: 1.01 }}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 sm:w-64 h-11 px-4 rounded-l-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
              />
              <button className="h-11 px-5 rounded-r-xl bg-primary hover:bg-primary/90 transition-colors text-white flex items-center gap-1.5 text-sm font-semibold">
                Subscribe
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          </FadeInUp>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

          {/* Brand column */}
          <FadeInUp className="col-span-2 lg:col-span-1 space-y-5">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                <Home className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold font-display">
                <span className="text-primary">Coastal</span>
                <span className="text-white">Horizon</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Exquisite vacation rentals for the discerning traveller. We curate only the finest coastal properties worldwide.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {SOCIAL.map(({ label, path }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  whileHover={{ y: -2 }}
                  className="h-8 w-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 hover:bg-primary/8 transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                    <path d={path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </FadeInUp>

          {/* Link columns */}
          <StaggerContainer className="contents">
            {Object.entries(LINKS).map(([heading, items]) => (
              <StaggerItem key={heading} className="space-y-4">
                <h3 className="text-white font-semibold text-xs uppercase tracking-widest">{heading}</h3>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                        <Link href={item.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                          {item.label}
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Bottom bar */}
        <FadeInUp delay={0.3} className="pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {year} Coastal Horizon. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-600">
            <span>en · US</span>
            <span>$ USD</span>
          </div>
        </FadeInUp>
      </div>
    </footer>
  )
}
