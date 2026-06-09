import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl

  // --- Admin route protection ---
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      url.searchParams.set("error", "unauthorized")
      return NextResponse.redirect(url)
    }
  }

  // --- Protected user routes ---
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/bookings")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(url)
    }
  }

  // --- Redirect authenticated users away from auth pages ---
  if (user) {
    if (pathname === "/auth/login" || pathname === "/auth/register") {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }

    if (pathname === "/admin/login") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role === "admin") {
        const url = request.nextUrl.clone()
        url.pathname = "/admin/dashboard"
        return NextResponse.redirect(url)
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
