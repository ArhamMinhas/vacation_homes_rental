import { NextRequest, NextResponse } from "next/server"
import { anthropic } from "@/lib/anthropic"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 })
  }

  const { title, property_type, location, bedrooms, bathrooms, max_guests, amenities } =
    await request.json()

  if (!title || !location) {
    return NextResponse.json({ error: "title and location are required" }, { status: 400 })
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Write a compelling vacation rental listing description.

Property: ${title}
Type: ${property_type ?? "vacation home"} in ${location}
${bedrooms ?? 1} bedroom${bedrooms !== 1 ? "s" : ""} · ${bathrooms ?? 1} bathroom${bathrooms !== 1 ? "s" : ""} · up to ${max_guests ?? 2} guests
Amenities: ${Array.isArray(amenities) && amenities.length ? amenities.join(", ") : "standard amenities"}

Write 2–3 paragraphs (150–200 words total). Evoke the experience, atmosphere, and lifestyle this property offers. Be specific and warm — describe what guests will feel, see, and enjoy. No bullet points, no headers, no "Welcome to". Pure flowing prose.`,
        },
      ],
    })

    const text =
      message.content[0].type === "text" ? message.content[0].text.trim() : ""

    return NextResponse.json({ description: text })
  } catch (e) {
    logger.error("[ai/generate-description]", { error: String(e) })
    return NextResponse.json({ error: "Failed to generate description" }, { status: 500 })
  }
}
