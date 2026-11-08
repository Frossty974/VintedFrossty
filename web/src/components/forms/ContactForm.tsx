"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/primitives";
import { contactSchema, toFieldErrors, type FieldErrors } from "@/lib/validation";
import { Checkbox, Field, FormMessage } from "./Field";

const subjects = [
  { v: "orientation", l: "Orientation" },
  { v: "formation", l: "Une formation" },
  { v: "partenariat", l: "Partenariat" },
  { v: "presse", l: "Presse" },
  { v: "autre", l: "Autre" },
];

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
    };
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) return setErrors(toFieldErrors(parsed.error));
    setErrors({});
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) {
        if (json.fields) setErrors(json.fields);
        throw new Error(json.error ?? "Erreur");
      }
      setStatus({ tone: "success", text: "Message envoyé. Merci, nous te répondons rapidement." });
      form.reset();
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Une erreur est survenue." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="ring-gradient grid gap-5 rounded-[28px] bg-[linear-gradient(180deg,#0e1226,#090b16)] p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom" name="name" autoComplete="name" error={errors.name} />
        <Field label="Adresse e-mail" name="email" type="email" autoComplete="email" error={errors.email} />
      </div>
      <fieldset>
        <legend className="mb-2 text-sm text-fg/85">Sujet</legend>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s, i) => (
            <label key={s.v} className="cursor-pointer">
              <input type="radio" name="subject" value={s.v} defaultChecked={i === 0} className="peer sr-only" />
              <span className="inline-block rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-muted transition peer-checked:border-electric/60 peer-checked:bg-electric/[0.12] peer-checked:text-fg peer-focus-visible:outline-2 peer-focus-visible:outline-cyan">{s.l}</span>
            </label>
          ))}
        </div>
        {errors.subject && <p className="mt-1.5 text-xs text-[#ff9c9c]">{errors.subject}</p>}
      </fieldset>
      <Field label="Message" name="message" textarea error={errors.message} hint="20 caractères minimum." />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Checkbox name="consent" error={errors.consent} label={<>J&apos;accepte que mes données soient utilisées pour traiter ma demande (<Link href="/legal/confidentialite" className="text-fg underline underline-offset-2">en savoir plus</Link>).</>} />
      {status && <FormMessage tone={status.tone}>{status.text}</FormMessage>}
      <button type="submit" disabled={busy} className={buttonClass("primary", "lg", "w-full sm:w-auto sm:justify-self-start")}>
        {busy ? "Envoi…" : "Envoyer"}
        {!busy && <Icon name="arrow-right" className="size-4" />}
      </button>
    </form>
  );
}
