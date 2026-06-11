import { z } from "zod"

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL:    z.string().min(1, "NEXT_PUBLIC_SUPABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY:   z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  NEXT_PUBLIC_APP_NAME:        z.string().default("StayFinder"),
  NEXT_PUBLIC_APP_URL:         z.string().default("http://localhost:3000"),
})

export type Env = z.infer<typeof schema>

/**
 * Called once at server startup via instrumentation.ts.
 * Throws with a clear list of missing/invalid vars so the server
 * refuses to start rather than silently misbehaving at runtime.
 */
export function validateEnv(): Env {
  const result = schema.safeParse(process.env)
  if (!result.success) {
    const lines = result.error.issues
      .map((i) => `  • ${String(i.path[0])}: ${i.message}`)
      .join("\n")
    throw new Error(`\n\n❌ Missing or invalid environment variables:\n${lines}\n\nCheck your .env file.\n`)
  }
  return result.data
}
