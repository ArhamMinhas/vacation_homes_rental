import { NextRequest, NextResponse } from "next/server"
import {
  getUnavailableDates,
  checkPropertyAvailability,
} from "@/services/availability.service"

// GET /api/availability?property_id=... — returns unavailable date ranges for the date picker
export async function GET(request: NextRequest) {
  try {
    const propertyId = request.nextUrl.searchParams.get("property_id")
    if (!propertyId) {
      return NextResponse.json({ error: "property_id is required" }, { status: 400 })
    }
    const unavailable = await getUnavailableDates(propertyId)
    return NextResponse.json({ unavailable })
  } catch {
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
  }
}

// POST /api/availability — checks if specific dates are available for booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { property_id, check_in, check_out, guests } = body

    if (!property_id || !check_in || !check_out) {
      return NextResponse.json(
        { error: "property_id, check_in, and check_out are required" },
        { status: 400 }
      )
    }

    const result = await checkPropertyAvailability(
      property_id,
      check_in,
      check_out,
      guests ?? 1
    )
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
  }
}
