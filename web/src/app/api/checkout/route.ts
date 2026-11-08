import { NextResponse } from "next/server";
import { getCourse } from "@/data/courses";
import { config, hasStripe, stripe, supabaseUserFromToken } from "@/lib/server/services";

// Phase 2 : crée une session Stripe Checkout pour une formation.
// Nécessite STRIPE_SECRET_KEY et une connexion Supabase (jeton envoyé dans l'en-tête Authorization).
export async function POST(req: Request) {
  if (!hasStripe()) return NextResponse.json({ error: "Les paiements ne sont pas encore ouverts." }, { status: 503 });
  const { course: slug } = (await req.json().catch(() => ({}))) as { course?: string };
  const course = slug ? getCourse(slug) : undefined;
  if (!course) return NextResponse.json({ error: "Formation inconnue." }, { status: 400 });

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const user = token ? await supabaseUserFromToken(token) : null;
  if (!user) return NextResponse.json({ error: "Connecte-toi pour finaliser ton inscription." }, { status: 401 });

  try {
    // Le prix est toujours lu côté serveur depuis le catalogue, jamais depuis la requête.
    const session = await stripe("checkout/sessions", {
      mode: "payment",
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "eur",
      "line_items[0][price_data][unit_amount]": String(Math.round(course.price * 100)),
      "line_items[0][price_data][product_data][name]": course.title,
      customer_email: user.email,
      client_reference_id: user.id,
      "metadata[course_slug]": course.slug,
      "metadata[user_id]": user.id,
      success_url: `${config.siteUrl}/espace/formations/${course.slug}?paiement=ok`,
      cancel_url: `${config.siteUrl}/formations/${course.slug}/inscription?paiement=annule`,
      locale: "fr",
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout]", e);
    return NextResponse.json({ error: "Le paiement n'a pas pu être initialisé." }, { status: 502 });
  }
}
