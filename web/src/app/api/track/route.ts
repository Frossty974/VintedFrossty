import { NextResponse } from "next/server";
import { clientIp, hasSupabaseAdmin, rateLimit, supabaseInsert } from "@/lib/server/services";
import { trackSchema } from "@/lib/validation";

// Enregistre un événement de popularité (vue, inscription, leçon terminée).
// Aucune donnée personnelle : seulement un identifiant aléatoire du navigateur.
export async function POST(req: Request) {
  if (!rateLimit(`track:${clientIp(req)}`, 60)) return new NextResponse(null, { status: 429 });
  const parsed = trackSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new NextResponse(null, { status: 400 });
  if (!hasSupabaseAdmin()) return new NextResponse(null, { status: 204 });
  const { slug, type, visitor } = parsed.data;
  try {
    await supabaseInsert("course_events", { course_slug: slug, type, visitor });
  } catch (e) {
    console.error("[track]", e);
  }
  return new NextResponse(null, { status: 204 });
}
