import { NextResponse } from "next/server";
import { clientIp, hasSupabaseAdmin, rateLimit, supabaseInsert } from "@/lib/server/services";
import { contactSchema, toFieldErrors } from "@/lib/validation";

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`, 3)) {
    return NextResponse.json({ error: "Trop de messages envoyés. Réessaie dans une minute." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Formulaire invalide.", fields: toFieldErrors(parsed.error) }, { status: 400 });
  const { name, email, subject, message, website } = parsed.data;
  if (website) return NextResponse.json({ ok: true });

  if (!hasSupabaseAdmin()) {
    console.info("[contact] Supabase non configuré — message non persisté :", { subject, length: message.length });
    return NextResponse.json({ ok: true, stored: false });
  }
  try {
    await supabaseInsert("contact_messages", { name, email: email.toLowerCase(), subject, message });
    return NextResponse.json({ ok: true, stored: true });
  } catch (e) {
    console.error("[contact]", e);
    return NextResponse.json({ error: "Envoi impossible pour le moment. Réessaie plus tard." }, { status: 502 });
  }
}
