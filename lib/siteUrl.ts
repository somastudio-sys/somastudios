export function getSiteUrl(req?: Request): string {
  if (req) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    if (host) {
      const proto =
        req.headers.get("x-forwarded-proto") ||
        (host.startsWith("localhost") || host.startsWith("127.0.0.1")
          ? "http"
          : "https");
      const origin = `${proto}://${host}`.replace(/\/$/, "");
      // Local dev should use the running server, not production NEXT_PUBLIC_SITE_URL.
      if (process.env.NODE_ENV === "development") {
        return origin;
      }
    }
  }

  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (req) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "http";
    if (host) return `${proto}://${host}`.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}
