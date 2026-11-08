import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { config, hasSupabaseAdmin, supabaseInsert } from "@/lib/server/services";

// Phase 2 : reçoit les événements Stripe et active l'accès à la formation après paiement.
function verify(payload: string, header: string | null, secret: string, toleranceSec = 300): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  const signatures = header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  return signatures.some((s) => s.length === expected.length && timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}

export async function POST(req: Request) {
  if (!config.stripeWebhookSecret) return NextResponse.json({ error: "Webhook non configuré." }, { status: 503 });
  const payload = await req.text();
  if (!verify(payload, req.headers.get("stripe-signature"), config.stripeWebhookSecret)) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }
  const event = JSON.parse(payload);
  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const userId = s.metadata?.user_id;
    const slug = s.metadata?.course_slug;
    if (userId && slug && hasSupabaseAdmin()) {
      await supabaseInsert("enrollments", { user_id: userId, course_slug: slug, status: "paid", stripe_session_id: s.id }, { upsert: "user_id,course_slug" });
    }
  }
  return NextResponse.json({ received: true });
}
