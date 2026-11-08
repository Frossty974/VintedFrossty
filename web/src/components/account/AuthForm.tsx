"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Checkbox, Field, FormMessage } from "@/components/forms/Field";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/primitives";
import { useAccount } from "@/lib/account/AccountProvider";
import { resetSchema, signInSchema, signUpSchema, toFieldErrors, type FieldErrors } from "@/lib/validation";

type Mode = "signin" | "signup" | "reset";

export function AuthForm({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("suite");
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/espace";
  const { backend } = useAccount();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<{ tone: "error" | "success" | "info"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
      consent: fd.get("consent") === "on",
      age: fd.get("age") === "on",
    };
    const schema = mode === "signup" ? signUpSchema : mode === "signin" ? signInSchema : resetSchema;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      setMessage(null);
      return;
    }
    setErrors({});
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { needsConfirmation } = await backend.signUp(raw.email, raw.password, raw.name);
        if (needsConfirmation) setMessage({ tone: "success", text: "Compte créé. Confirme ton adresse e-mail grâce au lien que nous venons de t'envoyer." });
        else router.push(safeNext);
      } else if (mode === "signin") {
        await backend.signIn(raw.email, raw.password);
        router.push(safeNext);
      } else {
        await backend.resetPassword(raw.email);
        setMessage({ tone: "success", text: "Si un compte existe pour cette adresse, tu vas recevoir un lien de réinitialisation." });
      }
    } catch (err) {
      setMessage({ tone: "error", text: err instanceof Error ? err.message : "Une erreur est survenue. Réessaie dans un instant." });
    } finally {
      setLoading(false);
    }
  }

  const titles: Record<Mode, { h: string; p: string; cta: string }> = {
    signin: { h: "Bon retour.", p: "Connecte-toi pour retrouver tes résultats et tes formations.", cta: "Se connecter" },
    signup: { h: "Crée ton espace.", p: "Sauvegarde tes résultats d'orientation et suis ta progression.", cta: "Créer mon compte" },
    reset: { h: "Mot de passe oublié", p: "Indique ton adresse e-mail pour recevoir un lien de réinitialisation.", cta: "Envoyer le lien" },
  };
  const t = titles[mode];

  return (
    <div className="ring-gradient w-full max-w-md rounded-[28px] bg-[linear-gradient(180deg,#0e1226,#090b16)] p-7 shadow-[0_40px_100px_-30px_rgb(76_125_255/0.4)] sm:p-9">
      <h1 className="text-3xl font-semibold tracking-[-0.03em]">{t.h}</h1>
      <p className="mt-2 text-muted">{t.p}</p>

      {backend.mode === "demo" && mode !== "reset" && (
        <div className="mt-6">
          <FormMessage tone="info">
            <strong className="font-medium">Mode démonstration.</strong> L&apos;authentification n&apos;est pas encore branchée : ton compte est créé uniquement dans ce navigateur et aucun mot de passe n&apos;est enregistré.
          </FormMessage>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-7 grid gap-5">
        {mode === "signup" && <Field label="Prénom" name="name" autoComplete="given-name" error={errors.name} />}
        <Field label="Adresse e-mail" name="email" type="email" autoComplete="email" inputMode="email" error={errors.email} />
        {mode !== "reset" && (
          <Field label="Mot de passe" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} error={errors.password} hint={mode === "signup" ? "8 caractères minimum, avec au moins une lettre et un chiffre." : undefined} />
        )}
        {mode === "signup" && (
          <div className="grid gap-3">
            <Checkbox name="age" label="J'ai 15 ans ou plus, ou j'ai l'accord d'un parent pour créer ce compte." error={errors.age} />
            <Checkbox
              name="consent"
              error={errors.consent}
              label={<>J&apos;accepte les <Link href="/legal/cgv" className="text-fg underline underline-offset-2">conditions générales</Link> et la <Link href="/legal/confidentialite" className="text-fg underline underline-offset-2">politique de confidentialité</Link>.</>}
            />
          </div>
        )}
        {mode === "signin" && (
          <button type="button" onClick={() => { setMode("reset"); setErrors({}); setMessage(null); }} className="-mt-2 justify-self-end text-sm text-[#9db4ff] hover:text-fg">
            Mot de passe oublié ?
          </button>
        )}
        {message && <FormMessage tone={message.tone}>{message.text}</FormMessage>}
        <button type="submit" disabled={loading} className={buttonClass("primary", "lg", "w-full")}>
          {loading ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" /> : null}
          {loading ? "Un instant…" : t.cta}
          {!loading && <Icon name="arrow-right" className="size-4" />}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-muted">
        {mode === "signup" ? (
          <>Déjà un compte ? <Link href={`/connexion${next ? `?suite=${encodeURIComponent(next)}` : ""}`} className="text-fg hover:underline">Se connecter</Link></>
        ) : mode === "signin" ? (
          <>Pas encore de compte ? <Link href={`/inscription${next ? `?suite=${encodeURIComponent(next)}` : ""}`} className="text-fg hover:underline">Créer un compte</Link></>
        ) : (
          <button type="button" onClick={() => { setMode("signin"); setMessage(null); }} className="text-fg hover:underline">Retour à la connexion</button>
        )}
      </p>
    </div>
  );
}
