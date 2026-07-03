import { NextRequest, NextResponse } from "next/server"
import { anthropic } from "@/lib/anthropic"
import { getFilteredProperties, getPropertyById } from "@/services/property.service"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 })
  }

  const { property_id, check_in, check_out, guests } = await request.json()

  if (!property_id) {
    return NextResponse.json({ error: "property_id is required" }, { status: 400 })
  }

  try {
    const current = await getPropertyById(property_id)
    if (!current) return NextResponse.json({ error: "Property not found" }, { status: 404 })

    // Fetch candidates: same type first, then any type as fallback
    const { properties: sameType } = await getFilteredProperties({
      property_type: current.property_type,
      max_guests: guests ? Number(guests) : 1,
      pageSize: 8,
    })

    const { properties: broader } = await getFilteredProperties({
      max_guests: guests ? Number(guests) : 1,
      pageSize: 10,
    })

    // Merge, dedupe, exclude current property, cap at 8
    const seen = new Set<string>([property_id])
    const candidates = [...sameType, ...broader]
      .filter((p) => !seen.has(p.id) && seen.add(p.id))
      .slice(0, 8)

    if (candidates.length === 0) {
      return NextResponse.json({ recommendations: [] })
    }

    const summaries = candidates
      .map(
        (p, i) =>
          `${i + 1}. ID:${p.id} | "${p.title}" | ${p.location} | ${p.property_type} | ` +
          `$${p.price_per_night}/night | ${p.bedrooms} bed | max ${p.max_guests} guests | ` +
          `amenities: ${p.amenities.slice(0, 5).join(", ")}`
      )
      .join("\n")

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `A guest wants to book "${current.title}" in ${current.location} (${check_in} → ${check_out}, ${guests ?? 1} guests) but it's unavailable.

Choose the 3 best alternatives from this list and write one warm sentence explaining why each is a great fit:

${summaries}

Reply ONLY with valid JSON (no markdown):
{"recommendations":[{"id":"...","reason":"..."},{"id":"...","reason":"..."},{"id":"...","reason":"..."}]}`,
        },
      ],
    })

    const raw = message.content[0].type === "text" ? message.content[0].text.trim() : "{}"
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "")
    const parsed = JSON.parse(cleaned)
    const recs: { id: string; reason: string }[] = parsed.recommendations ?? []

    const withProperties = recs
      .map((r) => ({ ...r, property: candidates.find((p) => p.id === r.id) ?? null }))
      .filter((r) => r.property !== null)

    return NextResponse.json({ recommendations: withProperties })
  } catch (e) {
    logger.error("[ai/recommend]", { error: String(e) })
    return NextResponse.json({ recommendations: [] })
  }
}
