import Link from "next/link"
import {
  ShieldCheck, CreditCard, HeadphonesIcon, ArrowRight,
  Star, MapPin, Building2, Users, TrendingUp, Quote,
} from "lucide-react"
import { getFilteredProperties } from "@/services/property.service"
import PropertyCarousel from "@/components/property/PropertyCarousel"
import PropertyFilters from "@/components/property/PropertyFilters"
import { Button } from "@/components/ui/button"
import { APP_NAME, ROUTES } from "@/lib/constants"
import type { Property } from "@/types/property"

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const all = await getFilteredProperties()
    return all.slice(0, 9)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProperties()

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════ */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen px-4 py-24 sm:py-32 overflow-hidden animate-gradient"
        style={{
          background:
            "linear-gradient(135deg,#0F766E 0%,#0D9488 20%,#0891B2 45%,#0E7490 65%,#1D4ED8 100%)",
        }}
      >
        {/* Background blobs */}
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl animate-float pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl animate-float pointer-events-none" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-blue-400/8 blur-2xl animate-float pointer-events-none" style={{ animationDelay: "1s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-5%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />

        {/* Floating stat cards — desktop only */}
        <div className="hidden xl:block absolute left-8 top-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: "0.5s" }}>
          <div className="bg-white/12 backdrop-blur-xl rounded-2xl p-4 border border-white/25 shadow-2xl w-52">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
              </div>
              <div>
                <p className="text-white font-bold text-xl leading-none">4.9★</p>
                <p className="text-white/65 text-xs mt-0.5">Average rating</p>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-1.5 flex-1 rounded-full bg-yellow-400/70" />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden xl:block absolute right-8 top-[30%] animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="bg-white/12 backdrop-blur-xl rounded-2xl p-4 border border-white/25 shadow-2xl w-52">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-300/25 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-200" />
              </div>
              <div>
                <p className="text-white font-bold text-xl leading-none">10k+</p>
                <p className="text-white/65 text-xs mt-0.5">Happy guests</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {["A","M","S","J","K"].map((l) => (
                <div key={l} className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-[11px] text-white font-bold border border-white/30">
                  {l}
                </div>
              ))}
              <span className="text-white/50 text-xs ml-1">+more</span>
            </div>
          </div>
        </div>

        <div className="hidden xl:block absolute right-10 bottom-[28%] animate-float" style={{ animationDelay: "2.5s" }}>
          <div className="bg-white/12 backdrop-blur-xl rounded-2xl p-4 border border-white/25 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-300/25 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-violet-200" />
              </div>
              <div>
                <p className="text-white font-bold text-xl leading-none">500+</p>
                <p className="text-white/65 text-xs mt-0.5">Active listings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main hero content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-8 sm:space-y-10">

          {/* Trust badge */}
          <div className="animate-fade-in-up flex justify-center">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-5 py-2 text-white text-xs sm:text-sm font-medium shadow-lg hover:bg-white/22 transition-colors">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              Trusted by 10,000+ happy travellers
            </span>
          </div>

          {/* Headline */}
          <div className="animate-fade-in-up delay-100 space-y-4 px-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight">
              Find your perfect
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg,#5EEAD4,#BAE6FD,#A5F3FC)" }}
              >
                vacation home
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
              Browse hundreds of hand-picked properties — beachfront villas, mountain
              cabins, city apartments, and everything in between.
            </p>
          </div>

          {/* Search */}
          <div className="animate-fade-in-up delay-200 w-full max-w-4xl mx-auto">
            <PropertyFilters />
          </div>

          {/* Category chips */}
          <div className="animate-fade-in-up delay-300 flex flex-wrap justify-center gap-2 px-4">
            {[
              { label: "🏖 Beach Houses", type: "Beach House" },
              { label: "🏔 Cabins",        type: "Cabin"       },
              { label: "🏙 Apartments",    type: "Apartment"   },
              { label: "🏡 Villas",        type: "Villa"       },
            ].map(({ label, type }) => (
              <Link
                key={type}
                href={`${ROUTES.PROPERTIES}?type=${encodeURIComponent(type)}`}
                className="bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 hover:border-white/45 rounded-full px-4 py-1.5 text-white text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in delay-800 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="hidden sm:block text-xs font-medium tracking-wide">Scroll to explore</span>
          <div className="h-9 w-5 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="h-2 w-1 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. STATS STRIP
      ══════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 px-4 bg-white border-b border-border/40">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
            {[
              { value: "500+", label: "Active properties", icon: Building2, grad: "from-teal-500 to-emerald-600"  },
              { value: "10k+", label: "Happy guests",      icon: Users,     grad: "from-blue-500 to-cyan-600"     },
              { value: "4.9★", label: "Average rating",   icon: Star,      grad: "from-amber-500 to-orange-500"  },
              { value: "50+",  label: "Destinations",     icon: MapPin,    grad: "from-violet-500 to-purple-600" },
            ].map(({ value, label, icon: Icon, grad }, i) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground leading-none">{value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3. FEATURED PROPERTIES — CAROUSEL
      ══════════════════════════════════════════════════ */}
      <section id="properties" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div className="animate-fade-in-up">
              <span className="text-xs font-bold text-primary uppercase tracking-[0.15em]">✦ Featured Stays</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-2 leading-tight">
                Hand-picked for every traveller
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-md">
                Curated stays for every kind of adventure — cozy cabins to luxury beachfront villas.
              </p>
            </div>
            <Link href={ROUTES.PROPERTIES} className="shrink-0 animate-fade-in-up delay-100">
              <Button
                variant="outline"
                className="gap-2 rounded-xl border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-semibold group"
              >
                View all listings
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="relative px-6 sm:px-8">
              <PropertyCarousel properties={featured} />
            </div>
          ) : (
            <div className="text-center py-16 sm:py-24 border-2 border-dashed border-border rounded-2xl bg-muted/10 px-4">
              <div className="text-5xl mb-4">🏡</div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Properties coming soon</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                Our collection is being curated. Check back shortly.
              </p>
              <Link href={ROUTES.PROPERTIES}>
                <Button variant="outline" className="gap-2 rounded-xl">
                  Browse listings <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. POPULAR DESTINATIONS
      ══════════════════════════════════════════════════ */}
      <section
        id="destinations"
        className="py-16 sm:py-20 px-4 scroll-mt-16"
        style={{ background: "linear-gradient(145deg,#0F172A 0%,#1E293B 50%,#0F172A 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 animate-fade-in-up">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-[0.15em]">✦ Explore</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2">
              Dream destinations await
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-lg mx-auto">
              From tropical islands to alpine retreats — every destination is a new story waiting to be written.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              { city: "Maldives",   emoji: "🌊", desc: "Island paradise",  grad: "135deg,#06B6D4,#0EA5E9,#2563EB", delay: 0   },
              { city: "Santorini",  emoji: "🏛",  desc: "Aegean beauty",   grad: "135deg,#F97316,#EF4444,#EC4899", delay: 60  },
              { city: "Bali",       emoji: "🌴", desc: "Tropical escape",  grad: "135deg,#22C55E,#10B981,#0D9488", delay: 120 },
              { city: "Swiss Alps", emoji: "⛷",  desc: "Mountain magic",  grad: "135deg,#3B82F6,#6366F1,#8B5CF6", delay: 180 },
              { city: "Tuscany",    emoji: "🍷", desc: "Italian charm",   grad: "135deg,#F59E0B,#EF4444,#EC4899", delay: 240 },
              { city: "Kyoto",      emoji: "🎋", desc: "Zen & culture",   grad: "135deg,#8B5CF6,#A855F7,#D946EF", delay: 300 },
            ].map(({ city, emoji, desc, grad, delay }) => (
              <Link
                key={city}
                href={`${ROUTES.PROPERTIES}?location=${encodeURIComponent(city)}`}
                className="group relative rounded-2xl overflow-hidden flex flex-col justify-between p-5 min-h-[160px] sm:min-h-[200px] animate-fade-in-up hover:-translate-y-1.5 transition-all duration-300 shadow-lg hover:shadow-2xl"
                style={{
                  background: `linear-gradient(${grad})`,
                  animationDelay: `${delay}ms`,
                }}
              >
                {/* Radial highlight */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)] pointer-events-none" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Emoji */}
                <div className="relative text-4xl sm:text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300 self-center mt-2">
                  {emoji}
                </div>

                {/* Text */}
                <div className="relative z-10">
                  <p className="text-white font-bold text-base sm:text-lg leading-tight">{city}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-white/70" />
                    <p className="text-white/70 text-xs">{desc}</p>
                  </div>
                </div>

                {/* Arrow on hover */}
                <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowRight className="h-3.5 w-3.5 text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 bg-slate-50 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.15em]">✦ Simple Process</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-2">How it works</h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Book your dream stay in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-[52px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5 bg-gradient-to-r from-emerald-300 via-violet-300 to-rose-300 rounded-full" />

            {[
              { step: "01", title: "Search",  desc: "Enter destination, dates, and guests to discover available homes in seconds.",        icon: "🔍", grad: "from-teal-500 to-emerald-600",  ring: "ring-teal-100"   },
              { step: "02", title: "Book",    desc: "Review transparent pricing, add your details, and submit your request instantly.",    icon: "📋", grad: "from-violet-500 to-purple-600", ring: "ring-violet-100" },
              { step: "03", title: "Enjoy",   desc: "Pack your bags and relax — we handle every detail so you can focus on making memories.", icon: "🎉", grad: "from-orange-500 to-rose-600",  ring: "ring-orange-100" },
            ].map(({ step, title, desc, icon, grad, ring }, i) => (
              <div
                key={step}
                className="relative flex flex-col items-center text-center px-4 animate-fade-in-up group"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div
                  className={`relative z-10 h-[104px] w-[104px] rounded-3xl bg-gradient-to-br ${grad} ring-8 ${ring} flex items-center justify-center text-4xl mb-5 shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300`}
                >
                  {icon}
                </div>
                <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-2">Step {step}</span>
                <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 animate-fade-in-up">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.15em]">✦ Guest Reviews</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-2">
              Loved by travellers worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                name: "Sarah Mitchell", location: "London, UK",
                text: "StayFinder made our anniversary trip completely effortless. The property was exactly as described — stunning views, immaculate space. We'll definitely be back!",
                grad: "from-teal-50 to-cyan-50", border: "border-teal-100/80",
              },
              {
                name: "James Park", location: "New York, USA",
                text: "Found a gorgeous Santorini villa for our family vacation. The booking process was seamless and transparent — no hidden fees, no surprises. Absolutely perfect.",
                grad: "from-violet-50 to-purple-50", border: "border-violet-100/80",
              },
              {
                name: "Aisha Noor", location: "Dubai, UAE",
                text: "The Bali property was even better in person. Responsive support, easy check-in, and incredibly fair pricing. StayFinder is my go-to platform now.",
                grad: "from-amber-50 to-orange-50", border: "border-amber-100/80",
              },
            ].map(({ name, location, text, grad, border }, i) => (
              <div
                key={name}
                className={`relative rounded-2xl bg-gradient-to-br ${grad} border ${border} p-6 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Quote className="absolute top-5 right-5 h-8 w-8 text-muted-foreground/12" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground/75 text-sm leading-relaxed mb-5 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                    {name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          7. WHY CHOOSE US
      ══════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 animate-fade-in-up">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.15em]">✦ Our Promise</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-2">Why {APP_NAME}?</h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Everything you need for the perfect getaway</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: ShieldCheck,   title: "Verified properties",  desc: "Every listing is manually reviewed for quality and accuracy — no surprises on arrival.",              grad: "from-emerald-500 to-teal-600"   },
              { icon: CreditCard,    title: "Transparent pricing",  desc: "See the full cost upfront — nightly rate, cleaning fee, taxes. What you see is what you pay.",       grad: "from-blue-500 to-cyan-600"       },
              { icon: HeadphonesIcon, title: "24/7 support",        desc: "Our dedicated team is available around the clock to help with any questions or last-minute needs.",   grad: "from-violet-500 to-purple-600"   },
            ].map(({ icon: Icon, title, desc, grad }, i) => (
              <div
                key={title}
                className="group bg-white rounded-2xl p-7 border border-border/60 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`h-12 w-12 inline-flex items-center justify-center rounded-2xl mb-5 shadow-md bg-gradient-to-br ${grad} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          8. CTA
      ══════════════════════════════════════════════════ */}
      <section
        className="py-20 sm:py-28 px-4 text-center relative overflow-hidden animate-gradient"
        style={{
          background:
            "linear-gradient(135deg,#0F766E 0%,#0D9488 25%,#0891B2 55%,#1D4ED8 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto space-y-5 sm:space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-white text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            Join 10,000+ travellers
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready for your<br />next adventure?
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed">
            Discover unique vacation homes that match your style and budget — around the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link href={ROUTES.PROPERTIES} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/92 font-bold px-8 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 rounded-xl h-12 text-base group"
              >
                Explore properties
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href={ROUTES.REGISTER} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white/40 bg-transparent text-white hover:bg-white/15 hover:border-white/70 px-8 transition-all duration-200 rounded-xl h-12 text-base font-semibold"
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
