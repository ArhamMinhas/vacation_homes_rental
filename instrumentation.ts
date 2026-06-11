export async function register() {
  // Runs once in the Node.js server process at startup — not in browser or edge runtime.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // 1 — Validate all required environment variables immediately on boot.
    const { validateEnv } = await import("./src/lib/env")
    validateEnv()

    const { logger } = await import("./src/lib/logger")
    logger.info("Environment validated — server starting", {
      appName: process.env.NEXT_PUBLIC_APP_NAME ?? "StayFinder",
      nodeEnv: process.env.NODE_ENV,
    })

    // 2 — Ensure the Supabase Storage bucket exists so uploads work on first boot
    //     without requiring manual Supabase Dashboard steps.
    try {
      const { createAdminClient } = await import("./src/lib/supabase/server")
      const storage = createAdminClient().storage

      const { error } = await storage.createBucket("property-images", {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024,   // 5 MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      })

      if (!error || error.message.toLowerCase().includes("already exists")) {
        logger.info("Storage bucket ready", { bucket: "property-images" })
      } else {
        // Non-fatal — uploads will still show a helpful error message to the admin
        logger.warn("Could not create storage bucket — create it manually in Supabase Dashboard", {
          bucket: "property-images",
          error: error.message,
        })
      }
    } catch (e) {
      // Never crash the server over storage setup; log and continue
      const { logger } = await import("./src/lib/logger")
      logger.warn("Storage bucket setup skipped", { error: String(e) })
    }
  }
}
