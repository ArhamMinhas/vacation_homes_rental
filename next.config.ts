import type { NextConfig } from "next";

// ── Supabase domain ───────────────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
let supabaseHostname = "**.supabase.co"
try {
  if (supabaseUrl) supabaseHostname = new URL(supabaseUrl).hostname
} catch {}

// ── Content-Security-Policy ───────────────────────────────────────────────────
// next/image serves optimised images from /_next/image so img-src needs 'self'.
// Next.js App Router injects inline scripts for hydration → script-src needs
// 'unsafe-inline'. Tighten to nonce-based CSP once React Server Components
// stabilise (requires a custom server or Vercel's built-in nonce support).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://${supabaseHostname} wss://${supabaseHostname}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ")

const securityHeaders = [
  // Blocks clickjacking — belt-and-suspenders alongside CSP frame-ancestors
  { key: "X-Frame-Options",           value: "DENY" },
  // Stops browsers from MIME-sniffing a response away from its declared type
  { key: "X-Content-Type-Options",    value: "nosniff" },
  // Sends the full URL as referrer only for same-origin requests
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  // Disallow sensitive hardware APIs the app doesn't use
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  // Forces HTTPS for 2 years once deployed; remove for local HTTP dev if needed
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy",   value: csp },
]

const nextConfig: NextConfig = {
  reactCompiler: true,
  compress: true,
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: supabaseHostname },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
};

export default nextConfig;
