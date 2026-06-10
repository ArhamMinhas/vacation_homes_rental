import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

function redirect(request: NextRequest, pathname: string, params?: Record<string, string>) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ""
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  }
  return NextResponse.redirect(url)
}

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Lazily fetch role once per request — avoids double DB round-trips
  let _roleFetched = false
  let _role: string | null = null
  async function getRole(): Promise<string | null> {
    if (!user) return null
    if (_roleFetched) return _role
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
    _role = data?.role ?? null
    _roleFetched = true
    return _role
  }

  // ── Admin route protection ────────────────────────────────────────────────
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) return redirect(request, "/admin/login")
    if ((await getRole()) !== "admin") {
      return redirect(request, "/admin/login", { error: "unauthorized" })
    }
  }

  // ── User-only route protection ────────────────────────────────────────────
  const isUserRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/bookings")
  if (isUserRoute) {
    if (!user) {
      return redirect(request, "/auth/login", { redirectTo: pathname })
    }
    // Admins have their own dashboard — send them there instead
    if ((await getRole()) === "admin") {
      const dest = pathname.startsWith("/bookings")
        ? "/admin/bookings"
        : "/admin/dashboard"
      return redirect(request, dest)
    }
  }

  // ── Auth pages: redirect already-signed-in users ─────────────────────────
  if (user) {
    if (pathname === "/auth/login" || pathname === "/auth/register") {
      const role = await getRole()
      return redirect(request, role === "admin" ? "/admin/dashboard" : "/dashboard")
    }

    if (pathname === "/admin/login") {
      if ((await getRole()) === "admin") {
        return redirect(request, "/admin/dashboard")
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
