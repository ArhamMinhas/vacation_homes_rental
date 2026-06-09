import { createClient } from "@supabase/supabase-js";

// Ensure this code ONLY runs on the server
if (typeof window !== "undefined") {
  throw new Error("Supabase Admin client cannot be used in the browser!");
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL can be public
  process.env.SUPABASE_SERVICE_ROLE_KEY! // KEY MUST REMAIN SECRET (No NEXT_PUBLIC_ prefix)
);