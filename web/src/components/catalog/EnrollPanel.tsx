"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Checkbox, Field, FormMessage } from "@/components/forms/Field";
import { Icon } from "@/components/ui/Icon";
import { buttonClass, formatPrice } from "@/components/ui/primitives";
import type { Course } from "@/data/types";
import { useAccount } from "@/lib/account/AccountProvider";
import { toFieldErrors, waitlistSchema, type FieldErrors } from "@/lib/validation";

const paymentsOpen = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function EnrollPanel({ course }: { course: Course }) {
  const router = useRouter();
  const { user, backend, ready } = useAccount();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState<"waitlist" | "preview" | "pay" | null>(null);
  const here = encodeURIComponent(`/formations/${course.slug}/inscription`);

  async function joinWaitlist(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { email: String(fd.get("email") ?? ""), name: String(fd.get("name") ?? ""), course: course.slug, consent: fd.get("consent") === "on", website: String(fd.get("website") ?? "") };
    const parsed = waitlistSchema.safeParse(data);
    if (!parsed.success) return setErrors(toFieldErrors(parsed.error));
    setErrors({});
    setBusy("waitlist");
    setStatus(null);
    try {
      const res = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) {
        if (json.fields) setErrors(json.fields);
        throw new Error(json.error ?? "Erreur");
      }
      setStatus({ tone: "success", text: "C'est noté. Tu seras prévenu par e-mail à l'ouverture des inscriptions, sans engagement." });
      e.currentTarget?.reset();
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Une erreur est survenue." });
    } finally {
      setBusy(null);
    }
  }

  async function activatePreview() {
    if (!user) return router.push(`/inscription?suite=${here}`);
    setBusy("preview");
    try {
      await backend.enroll(course.slug);
      router.push(`/espace/formations/${course.slug}`);
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Activation impossible." });
      setBusy(null);
    }
  }

  async function pay() {
    if (!user) return router.push(`/connexion?suite=${here}`);
    setBusy("pay");
    try {
      const token = await backend.getAccessToken();
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ course: course.slug }) });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Paiement indisponible.");
      window.location.href = json.url;
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Paiement indisponible." });
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-5">
      <div className="ring-gradient rounded-lg bg-night p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold">{paymentsOpen ? "Paiement sécurisé" : "Les inscriptions ouvrent bientôt"}</h2>
          <span className="text-2xl font-semibold">{formatPrice(course.price)}</span>
        </div>
        {paymentsOpen ? (
          <>
            <p className="mt-3 text-sm leading-relaxed text-muted">Paiement unique par carte via Stripe. Accès immédiat après paiement.</p>
            <button type="button" onClick={pay} disabled={busy !== null} className={buttonClass("primary", "lg", "mt-6 w-full")}>
              {busy === "pay" ? "Redirection…" : user ? `Payer ${formatPrice(course.price)}` : "Se connecter pour payer"}
              <Icon name="lock" className="size-4" />
            </button>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Laisse ton e-mail pour être prévenu à l&apos;ouverture. Aucun paiement, aucun engagement, et un seul e-mail.
            </p>
            <form onSubmit={joinWaitlist} noValidate className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Prénom (facultatif)" name="name" autoComplete="given-name" error={errors.name} defaultValue={user?.name} />
                <Field label="Adresse e-mail" name="email" type="email" autoComplete="email" error={errors.email} defaultValue={user?.email} />
              </div>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <Checkbox name="consent" error={errors.consent} label={<>J&apos;accepte d&apos;être contacté au sujet de cette formation. Voir la <Link href="/legal/confidentialite" className="text-fg underline underline-offset-2">politique de confidentialité</Link>.</>} />
              <button type="submit" disabled={busy !== null} className={buttonClass("primary", "lg", "w-full")}>
                {busy === "waitlist" ? "Envoi…" : "Être prévenu de l'ouverture"}
              </button>
            </form>
          </>
        )}
        {status && <div className="mt-4"><FormMessage tone={status.tone}>{status.text}</FormMessage></div>}
      </div>

      <div className="rounded-lg border border-line bg-white/[0.02] p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-lg font-bold"><Icon name="eye" className="size-5 text-cyan" />Accès aperçu gratuit</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Découvre l&apos;espace de formation dès maintenant : programme complet, suivi de progression et ressources. Les vidéos seront ajoutées à l&apos;ouverture.
        </p>
        <button type="button" onClick={activatePreview} disabled={!ready || busy !== null} className={buttonClass("secondary", "md", "mt-5")}>
          {busy === "preview" ? "Activation…" : user ? "Activer l'accès aperçu" : "Créer un compte pour l'aperçu"}
          <Icon name="arrow-right" className="size-4" />
        </button>
      </div>
    </div>
  );
}
