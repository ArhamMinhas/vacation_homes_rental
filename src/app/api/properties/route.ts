import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getFilteredProperties, createProperty } from "@/services/property.service"
import { propertySchema } from "@/validations/property.schema"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams
    const result = await getFilteredProperties({
      location:      p.get("location") ?? undefined,
      property_type: p.get("property_type") ?? undefined,
      min_price:     p.get("min_price")  ? Number(p.get("min_price"))  : undefined,
      max_price:     p.get("max_price")  ? Number(p.get("max_price"))  : undefined,
      bedrooms:      p.get("bedrooms")   ? Number(p.get("bedrooms"))   : undefined,
      max_guests:    p.get("guests")     ? Number(p.get("guests"))     : undefined,
      page:          p.get("page")       ? Number(p.get("page"))       : 1,
      pageSize:      p.get("pageSize")   ? Number(p.get("pageSize"))   : 12,
    })
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" },
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single()
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = propertySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const property = await createProperty(parsed.data, user.id)
    return NextResponse.json({ property }, { status: 201 })
  } catch (e) {
    logger.error("[POST /api/properties]", { error: String(e) })
    const msg = e instanceof Error ? e.message : "Failed to create property"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
