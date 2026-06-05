/** Hosts só resolvíveis na rede interna do Railway — inacessíveis no Safari/celular. */
function isInternalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === "localhost" ||
    host.endsWith(".internal") ||
    host.endsWith(".railway.internal") ||
    host.endsWith(".local")
  );
}

export function isPublicAppUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== "http:" && protocol !== "https:") return false;
    return !isInternalHostname(hostname);
  } catch {
    return false;
  }
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

/** URL pública do app (NEXTAUTH_URL ou domínio gerado pelo Railway). */
export function getAppBaseUrl(fallback?: string): string {
  const candidates = [
    process.env.NEXTAUTH_URL,
    process.env.AUTH_URL,
    process.env.RAILWAY_STATIC_URL,
    process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : undefined,
    fallback,
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    if (isPublicAppUrl(candidate)) {
      return normalizeBaseUrl(candidate);
    }
  }

  if (fallback) return normalizeBaseUrl(fallback);
  return "http://localhost:3000";
}

/**
 * Garante que NextAuth use URL pública em produção.
 * Evita redirect para *.railway.internal após login (comum no Safari).
 */
export function ensurePublicNextAuthUrl(): void {
  const current = process.env.NEXTAUTH_URL;
  if (current && isPublicAppUrl(current)) return;

  const resolved = getAppBaseUrl();
  if (isPublicAppUrl(resolved)) {
    process.env.NEXTAUTH_URL = resolved;
    if (process.env.NODE_ENV === "production" && current && !isPublicAppUrl(current)) {
      console.warn(
        "[auth] NEXTAUTH_URL apontava para host interno; usando URL pública:",
        resolved
      );
    }
  }
}
