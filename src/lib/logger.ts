type Level = "info" | "warn" | "error"

function log(level: Level, message: string, meta?: Record<string, unknown>) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ?? {}),
  }

  if (process.env.NODE_ENV === "production") {
    // Structured JSON — readable by Datadog, CloudWatch, Sentry, etc.
    const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log
    fn(JSON.stringify(entry))
  } else {
    const icon = level === "error" ? "❌" : level === "warn" ? "⚠️" : "ℹ️"
    const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log
    if (meta && Object.keys(meta).length > 0) {
      fn(`${icon} [${level.toUpperCase()}] ${message}`, meta)
    } else {
      fn(`${icon} [${level.toUpperCase()}] ${message}`)
    }
  }
}

export const logger = {
  info:  (message: string, meta?: Record<string, unknown>) => log("info",  message, meta),
  warn:  (message: string, meta?: Record<string, unknown>) => log("warn",  message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta),
}
