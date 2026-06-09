import Link from "next/link"
import { ShieldCheck, CreditCard, HeadphonesIcon, ArrowRight, Star, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import PropertyCard from "@/components/property/PropertyCard"
import PropertyFilters from "@/components/property/PropertyFilters"
import { Button } from "@/components/ui/button"
import { APP_NAME, ROUTES } from "@/lib/constants"
import type { Property } from "@/types/property"

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(6)
    return (data as Property[]) ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProperties()

  return (
    <div className="min-h-screen">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center min-h-[92vh] px-4 py-20 sm:py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg,#0F766E 0%,#0D9488 35%,#0891B2 65%,#0E7490 100%)",
        }}
      >
        {/* Animated decorative orbs */}
        <div className="absolute -top-40 -right-40 h-80 w-80 sm:h-[500px] sm:w-[500px] rounded-full bg-white/5 blur-3xl animate-float pointer-events-none" />
        <div
          className="absolute -bottom-24 -left-24 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-white/5 blur-3xl animate-float pointer-events-none"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-8 sm:space-y-10">

          {/* Trust badge */}
          <div className="animate-fade-in-up delay-100 flex justify-center">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-white text-xs sm:text-sm font-medium shadow-lg">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
              Trusted by 10,000+ happy travellers
            </span>
          </div>

          {/* Headline */}
          <div className="animate-fade-in-up delay-200 space-y-3 sm:space-y-4 px-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Find your perfect
              <br />
              <span className="text-teal-200">vacation home</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-teal-100 max-w-2xl mx-auto leading-relaxed">
              Browse hundreds of unique properties — beachfront villas, mountain
              cabins, city apartments, and everything in between.
            </p>
          </div>

          {/* Search bar */}
          <div className="animate-fade-in-up delay-300 w-full max-w-4xl mx-auto px-0 sm:px-4">
            <PropertyFilters />
          </div>

          {/* Quick filter chips */}
          <div className="animate-fade-in-up delay-400 flex flex-wrap justify-center gap-2 px-4">
            {[
              { label: "🏖 Beach Houses", type: "Beach House" },
              { label: "🏔 Cabins",        type: "Cabin" },
              { label: "🏙 Apartments",    type: "Apartment" },
              { label: "🏡 Villas",        type: "Villa" },
            ].map(({ label, type }) => (
              <Link
                key={type}
                href={`${ROUTES.PROPERTIES}?type=${encodeURIComponent(type)}`}
                className="bg-white/15 hover:bg-white/28 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="animate-fade-in delay-800 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/50 text-xs">
          <span className="hidden sm:block">Scroll to explore</span>
          <div className="h-6 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── Featured Properties ───────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {featured.length > 0 ? "Featured properties" : "Browse all properties"}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Hand-picked stays for your next adventure
              </p>
            </div>
            <Link href={ROUTES.PROPERTIES} className="shrink-0">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-24 border-2 border-dashed border-border rounded-2xl bg-muted/20 px-4">
              <div className="text-5xl mb-4">🏡</div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                Properties coming soon
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                Our collection is being curated. Check back shortly for amazing vacation homes.
              </p>
              <Link href={ROUTES.PROPERTIES}>
                <Button variant="outline" className="gap-2">
                  Browse listings
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Popular Destinations ─────────────────────────── */}
      <section className="py-14 sm:py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Popular destinations</h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Explore top-rated locations</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { city: "Maldives",   emoji: "🌊" },
              { city: "Santorini",  emoji: "🏛" },
              { city: "Bali",       emoji: "🌴" },
              { city: "Swiss Alps", emoji: "⛷" },
            ].map(({ city, emoji }) => (
              <Link
                key={city}
                href={`${ROUTES.PROPERTIES}?location=${encodeURIComponent(city)}`}
                className="group relative bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/12 hover:to-primary/20 border border-primary/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{emoji}</div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">
                  {city}
                </h3>
                <div className="flex items-center justify-center gap-1 mt-0.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  Explore
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">How it works</h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Book your dream stay in 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 relative">
            <div className="hidden sm:block absolute top-10 left-1/3 right-1/3 h-px bg-border" />
            {[
              { step: "01", title: "Search",  desc: "Enter your destination, travel dates, and number of guests to find available properties.", icon: "🔍" },
              { step: "02", title: "Book",    desc: "Choose your perfect home, review pricing, and submit your booking request instantly.",    icon: "📋" },
              { step: "03", title: "Enjoy",   desc: "Pack your bags and enjoy your stay. We'll be here if you need anything.",                 icon: "🎉" },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="relative flex flex-col items-center text-center px-4">
                <div className="relative z-10 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl sm:text-3xl mb-4 shadow-sm">
                  {icon}
                </div>
                <div className="text-xs font-bold text-primary mb-1.5 tracking-widest uppercase">
                  Step {step}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Why {APP_NAME}?</h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Everything you need for a perfect stay
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Verified properties",
                desc: "Every listing is manually reviewed by our team to ensure quality and accuracy.",
                bg: "bg-emerald-50 text-emerald-600",
              },
              {
                icon: CreditCard,
                title: "Transparent pricing",
                desc: "See the full cost upfront — price per night, cleaning fee, no hidden charges.",
                bg: "bg-blue-50 text-blue-600",
              },
              {
                icon: HeadphonesIcon,
                title: "24/7 support",
                desc: "Our team is available around the clock to assist with any questions or issues.",
                bg: "bg-purple-50 text-purple-600",
              },
            ].map(({ icon: Icon, title, desc, bg }) => (
              <div
                key={title}
                className="bg-background rounded-2xl p-6 sm:p-7 border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className={`inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl mb-4 sm:mb-5 ${bg}`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section
        className="py-20 sm:py-24 px-4 text-center"
        style={{ background: "linear-gradient(135deg,#0F766E 0%,#0891B2 100%)" }}
      >
        <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
            Ready for your next adventure?
          </h2>
          <p className="text-teal-100 text-base sm:text-lg">
            Join thousands of travellers who found their perfect vacation home on {APP_NAME}.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link href={ROUTES.PROPERTIES} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore properties
              </Button>
            </Link>
            <Link href={ROUTES.REGISTER} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/40 bg-transparent text-white hover:bg-white/15 hover:border-white/60 px-8 transition-all duration-200"
              >
                Create free account
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
