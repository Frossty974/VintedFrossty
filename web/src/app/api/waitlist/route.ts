import { NextResponse } from "next/server";
import { getCourse } from "@/data/courses";
import { isCommunitySlug } from "@/lib/community/types";
import { clientIp, hasSupabaseAdmin, rateLimit, supabaseInsert } from "@/lib/server/services";
import { toFieldErrors, waitlistSchema } from "@/lib/validation";

export async function POST(req: Request) {
  if (!rateLimit(`waitlist:${clientIp(req)}`)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessaie dans une minute." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Formulaire invalide.", fields: toFieldErrors(parsed.error) }, { status: 400 });
  const { email, name, course, website } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // robot : on ignore silencieusement
  if (!getCourse(course) && !isCommunitySlug(course)) return NextResponse.json({ error: "Formation inconnue." }, { status: 400 });

  if (!hasSupabaseAdmin()) {
    console.info("[waitlist] Supabase non configuré — inscription non persistée :", { course });
    return NextResponse.json({ ok: true, stored: false });
  }
  try {
    await supabaseInsert("waitlist", { email: email.toLowerCase(), name, course_slug: course }, { upsert: "email,course_slug" });
    return NextResponse.json({ ok: true, stored: true });
  } catch (e) {
    console.error("[waitlist]", e);
    return NextResponse.json({ error: "Enregistrement impossible pour le moment. Réessaie plus tard." }, { status: 502 });
  }
}
