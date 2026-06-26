# Coastal Horizon Design System

## Brand Identity
- **Brand name**: LuxeStay (`NEXT_PUBLIC_APP_NAME` env var)
- **Tagline**: Discover Your Next Getaway
- **Voice**: Aspirational, warm, trustworthy

---

## Color Palette

### Core Tokens
| Token | Hex | HSL | Usage |
|---|---|---|---|
| Primary | `#FF5A1F` | `16 100% 56%` | CTAs, links, active states |
| Primary Dark | `#ae3200` | `17 100% 34%` | Hover/pressed states |
| Background | `#f9f9ff` | `240 100% 99%` | Page background |
| Foreground | `#111c2d` | `216 45% 12%` | Body text |
| Secondary Text | `#4f6073` | `210 19% 38%` | Muted/secondary text |
| Secondary Container | `#d2e4fb` | `213 87% 90%` | Chips, info badges |

### Semantic Tokens (CSS variables)
| Variable | Light value | Usage |
|---|---|---|
| `--primary` | `16 100% 56%` | Brand actions |
| `--background` | `240 100% 99%` | Page BG |
| `--foreground` | `216 45% 12%` | Default text |
| `--card` | `0 0% 100%` | Card surfaces |
| `--muted` | `220 14% 96%` | Skeleton, subtler bg |
| `--muted-foreground` | `210 19% 52%` | Placeholders |
| `--border` | `214 32% 91%` | Dividers, card borders |
| `--ring` | `16 100% 56%` | Focus rings |

### Status Colors
| State | Tailwind | Usage |
|---|---|---|
| Success | `emerald-500` | Confirmed |
| Warning | `amber-500` | Pending |
| Error | `red-500` | Cancelled / Destructive |
| Info | `blue-500` | Informational |

---

## Typography

### Fonts
- **Display / Headlines**: **Outfit** (weight 600–700), CSS var `--font-outfit`
- **Body / UI**: **Inter** (weight 400–600), CSS var `--font-inter`
- Apply Outfit to `h1`–`h4` via Tailwind `font-display` class

### Scale
| Level | Size (desktop) | Weight | Font | Class example |
|---|---|---|---|---|
| Hero H1 | 56–72px | 700 | Outfit | `text-6xl font-bold font-display` |
| Section H2 | 32–48px | 700 | Outfit | `text-4xl font-bold font-display` |
| Card H3 | 20–24px | 600 | Outfit | `text-xl font-semibold` |
| Body large | 18–20px | 400 | Inter | `text-lg` |
| Body | 16px | 400 | Inter | `text-base` |
| Caption | 12–14px | 500–600 | Inter | `text-xs font-semibold` |

---

## Spacing System

- **Base unit**: 8px (Tailwind `2`)
- **Section vertical padding**: 80px (`py-20`) desktop, 64px (`py-16`) mobile
- **Card padding**: 24px (`p-6`)
- **Gutters**: 24px (`gap-6`)
- **Max content width**: `max-w-7xl` centered with `px-4 sm:px-6 lg:px-8`
- **Form field height**: 44px (`h-11`) standard, 48px (`h-12`) large

---

## Layout

### Breakpoints
| Name | Min width |
|---|---|
| xs | 400px |
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

### Grid Patterns
- Property cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Stats strip: `grid-cols-2 md:grid-cols-4`
- Destinations: `grid-cols-2 md:grid-cols-3`
- Admin metrics: `grid-cols-2 lg:grid-cols-4`

---

## Components

### Navbar
- Sticky top, height 64px
- Logo: `bg-primary rounded-lg` icon + Outfit brand name
- Default: `bg-background border-b border-border/60`
- Scrolled: `bg-background/90 backdrop-blur-md shadow-sm border-b border-border`
- Nav links: `text-muted-foreground`, active: `text-primary bg-primary/10`
- Active underline: `h-0.5 bg-primary rounded-full`
- Auth: Ghost "Sign in" + filled "Register" buttons

### Property Card
- `rounded-2xl overflow-hidden border border-border/70`
- Shadow: `shadow-card` → hover `shadow-card-hover -translate-y-1.5`
- Image: `aspect-[4/3]`, zoom on hover
- Type badge: colored `rounded-full` top-left over image
- Price pill: `bg-white/95 rounded-xl` bottom-right
- Wishlist heart: appears on hover, top-right
- Content area: title + location + specs row (beds/baths/guests)

### Booking Card (sidebar)
- `rounded-2xl border shadow-card` sticky panel
- Property image with gradient overlay
- Price header `text-2xl font-bold`
- Date picker: 2-col grid, `h-11 rounded-xl`
- CTA: `h-12 rounded-xl text-base font-semibold w-full`
- Conflict dialogs: amber (guest reservation) / orange (host block)

### Buttons
- Primary: `bg-primary text-white hover:bg-primary/90 rounded-xl`
- Outline: `border border-input hover:border-primary hover:text-primary rounded-xl`
- Ghost: `hover:bg-primary/8 hover:text-primary`
- Heights: sm `h-8`, default `h-10`, lg `h-12`

### Form Inputs
- Height: `h-10` default, `h-11` booking forms
- Radius: `rounded-xl`
- Focus: `ring-2 ring-primary/20 border-primary`
- Label: `text-xs font-semibold text-muted-foreground uppercase tracking-wide`

### Admin Sidebar
- Background: `bg-card border-r border-border`
- Active item: `bg-primary/10 text-primary border-r-2 border-primary`
- Icon + label pattern throughout

### Status Badges
| Status | Classes |
|---|---|
| Pending | `bg-amber-50 text-amber-700 border-amber-200` |
| Confirmed | `bg-emerald-50 text-emerald-700 border-emerald-200` |
| Cancelled | `bg-red-50 text-red-700 border-red-200` |
| Rejected | `bg-red-50 text-red-700 border-red-200` |

---

## Page Sections

### Hero (Home)
- Full viewport, centered content
- Gradient: `linear-gradient(135deg, #7c2d12, #c2410c, #FF5A1F, #f97316, #fb923c)`
- Floating glassmorphism stat cards (xl+)
- Headline: Outfit 700, large gradient text accent (warm peach)
- Search bar: `PropertyFilters` component
- Category chips: `bg-white/15 rounded-full border border-white/20`
- Scroll indicator at bottom

### Stats Strip
- White bg, `py-10 sm:py-14`
- 4-col stat cards: icon + number + label
- Icon backgrounds: gradient squares, `rounded-xl`

### Featured Properties
- White bg, `py-16 sm:py-20`
- Section label: `text-xs font-bold text-primary uppercase tracking-[0.15em]`
- Horizontal carousel with prev/next arrows

### Destinations
- Dark bg with warm undertone
- `grid-cols-2 md:grid-cols-3` gradient cards
- Each card: gradient bg, emoji, city name, descriptor tag

### How It Works
- `bg-slate-50`, 3-step layout
- Connector line: gradient left to right
- Step badges: `rounded-3xl` with gradient background

### Testimonials
- White bg, 3-col grid
- Cards: light gradient bg per card, star rating, quote, avatar initials

### Why Choose Us
- `bg-slate-50`, 3-col grid
- Feature cards with gradient icon + title + description

### CTA Section
- Orange gradient (matches hero)
- Large heading + 2 CTA buttons

### Footer
- Very dark background
- 4-col grid: Brand | Explore | Account | Support
- Orange hover accents on links
- Bottom bar: copyright + legal links

---

## Animations

| Class | Keyframe | Usage |
|---|---|---|
| `animate-fade-in-up` | `fadeInUp 0.7s` | Section entry |
| `animate-fade-in-down` | `fadeInDown 0.5s` | Navbar entry |
| `animate-fade-in` | `fadeIn 0.5s` | Subtle reveals |
| `animate-scale-in` | `scaleIn 0.4s` | Success states |
| `animate-float` | `float 4s infinite` | Decorative blobs |
| `animate-gradient` | `gradient-shift 14s infinite` | Hero gradient |
| `animate-shimmer` | `shimmer 1.8s infinite` | Skeleton loading |

## Delay Helpers
`.delay-75` through `.delay-800` for staggered animations.

---

## Elevation / Shadows

| Level | CSS | Usage |
|---|---|---|
| Card | `0 1px 3px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.06)` | Default cards |
| Card Hover | `0 16px 48px -8px rgb(0 0 0 / 0.14), 0 4px 16px -4px rgb(0 0 0 / 0.08)` | Hovered cards |
| Navbar | `shadow-sm` | Scrolled state |

---

## Responsive Behavior

- **Mobile** (`< 768px`): Hamburger menu, single-col grids, stacked hero
- **Tablet** (`768–1024px`): 2-col grids, smaller nav
- **Desktop** (`> 1024px`): 3-col grids, full nav, floating hero cards
- **All touch targets**: minimum 44px height
- **Images**: `next/image` with responsive `sizes` prop throughout
