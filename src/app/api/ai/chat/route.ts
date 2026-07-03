import { NextRequest, NextResponse } from "next/server"
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages"
import { anthropic } from "@/lib/anthropic"
import { getFilteredProperties } from "@/services/property.service"
import { logger } from "@/lib/logger"

const SYSTEM = `You are a friendly booking assistant for CoastalHorizon, a premium vacation rental platform.
Help guests find the perfect vacation home. Be warm, concise, and specific.
When property search results are provided in [RESULTS], use them to answer naturally.
If no results match, suggest the guest broaden their search or try different dates.
Never make up property details — only reference properties provided in [RESULTS].
Keep replies under 120 words.`

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 })
  }

  const { messages } = await request.json()
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 })
  }

  try {
    // Phase 1: extract search intent from the latest user message
    const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === "user")
    let properties: Awaited<ReturnType<typeof getFilteredProperties>>["properties"] = []

    if (lastUserMsg) {
      const intentRes = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        system:
          'Extract vacation rental search intent. Reply ONLY with JSON: {"search":true/false,"location":"...","property_type":"...","max_price":null,"bedrooms":null,"max_guests":null}. Use null for unspecified fields.',
        messages: [{ role: "user" as const, content: lastUserMsg.content }],
      })

      const intentText =
        intentRes.content[0].type === "text" ? intentRes.content[0].text.trim() : ""

      try {
        const intent = JSON.parse(intentText.replace(/```json\s*/g, "").replace(/```\s*/g, ""))
        if (intent.search) {
          const result = await getFilteredProperties({
            location:      intent.location      ?? undefined,
            property_type: intent.property_type ?? undefined,
            max_price:     intent.max_price      ?? undefined,
            bedrooms:      intent.bedrooms       ?? undefined,
            max_guests:    intent.max_guests     ?? undefined,
            pageSize: 4,
          })
          properties = result.properties
        }
      } catch {
        // No search intent — answer conversationally
      }
    }

    // Phase 2: generate the assistant reply, injecting search results
    const resultsBlock =
      properties.length > 0
        ? `\n\n[RESULTS]\n${properties
            .map(
              (p) =>
                `• "${p.title}" — ${p.location} | ${p.property_type} | $${p.price_per_night}/night | ` +
                `${p.bedrooms} bed | max ${p.max_guests} guests | ID:${p.id}`
            )
            .join("\n")}`
        : ""

    const enrichedMessages: MessageParam[] = (messages as { role: "user" | "assistant"; content: string }[]).map(
      (m, i) =>
        i === messages.length - 1 && m.role === "user"
          ? { role: "user" as const, content: m.content + resultsBlock }
          : { role: m.role, content: m.content }
    )

    const reply = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM,
      messages: enrichedMessages,
    })

    const text =
      reply.content[0].type === "text" ? reply.content[0].text.trim() : "I couldn't find anything — try rephrasing."

    return NextResponse.json({ text, properties })
  } catch (e) {
    logger.error("[ai/chat]", { error: String(e) })
    return NextResponse.json({ error: "AI unavailable" }, { status: 500 })
  }
}
