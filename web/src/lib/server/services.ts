import "server-only";

// Accès serveur aux services externes. Chaque fonction indique clairement si le service est configuré.

export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const hasSupabaseAdmin = () => Boolean(config.supabaseUrl && config.supabaseServiceKey);
export const hasStripe = () => Boolean(config.stripeSecret);

/** Insère une ligne via l'API REST de Supabase avec la clé de service (contourne la RLS : usage serveur uniquement). */
export async function supabaseInsert(table: string, row: Record<string, unknown>, opts: { upsert?: string } = {}) {
  if (!hasSupabaseAdmin()) throw new Error("Supabase non configuré");
  const url = `${config.supabaseUrl}/rest/v1/${table}${opts.upsert ? `?on_conflict=${opts.upsert}` : ""}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: config.supabaseServiceKey!,
      Authorization: `Bearer ${config.supabaseServiceKey}`,
      "Content-Type": "application/json",
      Prefer: opts.upsert ? "resolution=merge-duplicates,return=minimal" : "return=minimal",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
}

/** Récupère l'utilisateur correspondant à un jeton d'accès Supabase. */
export async function supabaseUserFromToken(token: string): Promise<{ id: string; email: string } | null> {
  if (!config.supabaseUrl || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const res = await fetch(`${config.supabaseUrl}/auth/v1/user`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const u = await res.json();
  return { id: u.id, email: u.email };
}

/** Appel minimal à l'API Stripe (sans dépendance au SDK). */
export async function stripe(path: string, params: Record<string, string>) {
  if (!hasStripe()) throw new Error("Stripe non configuré");
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.stripeSecret}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? `Stripe ${res.status}`);
  return data;
}

// Limitation de débit simple, en mémoire (suffisante pour une instance ; utiliser Redis/Upstash en production multi-instances).
const hits = new Map<string, { n: number; t: number }>();
export function rateLimit(key: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.t > windowMs) {
    hits.set(key, { n: 1, t: now });
    return true;
  }
  h.n += 1;
  return h.n <= max;
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}
