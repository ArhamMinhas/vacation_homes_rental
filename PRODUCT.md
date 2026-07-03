# Coastal Horizon — Product Context

## What is this?

Coastal Horizon is a premium vacation home rental platform. Guests browse and book luxury coastal properties (villas, chalets, retreats); admins manage listings, bookings, and users from a dedicated panel.

## Register

**Brand** — the design IS part of the product identity (premium travel = premium UI).

## Brand

- **Name**: Coastal Horizon
- **Primary color**: `#FF5A1F` (coral-orange, HSL `16 100% 56%`)
- **Background**: `#f9f9ff` (near-white, slightly cool-tinted)
- **Fonts**: Outfit (display/headings) · Inter (body)
- **Tone**: Aspirational, refined, warm. Luxury without stuffiness.

## Surfaces

| Surface | Path | Notes |
|---|---|---|
| Homepage | `/` | Hero, nearby categories, featured listings, destinations bento, host CTA |
| Properties listing | `/properties` | Filter bar, paginated grid |
| Property detail | `/properties/[id]` | Gallery, details, booking form |
| Login | `/auth/login` | Split layout — dark left panel, light form right |
| Register | `/auth/register` | Same split layout |
| User dashboard | `/dashboard` | Profile card, stats, quick actions |
| User bookings | `/bookings` | Booking cards with status |
| Admin dashboard | `/admin/dashboard` | Stats cards, recent bookings, property health |
| Admin bookings | `/admin/bookings` | Booking table with status update |
| Admin properties | `/admin/properties` | Property management table |
| Admin users | `/admin/users` | User management table |

## Key Design Decisions

- Dark hero sections (`#080d1a`) with animated ambient orbs (primary + amber)
- Coral-orange primary used sparingly as accent, not background flood
- Cards use white `bg-white` on `#f9f9ff` page backgrounds for subtle depth
- Motion: Framer Motion throughout — ease-out cubic-bezier(0.22,1,0.36,1) is the house curve
- No gradient text (except hero shimmer on "Dream Escape" — intentional brand moment)
- No 3-equal-card grids for trust signals — use horizontal strip layout

## Stack

- Next.js 16 App Router (TypeScript)
- Tailwind CSS v4
- Framer Motion v12
- Supabase (auth + database)
- Lucide React icons
