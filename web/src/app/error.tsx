"use client";

import { useEffect } from "react";
import { buttonClass } from "@/components/ui/primitives";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-center justify-center pt-24 text-center">
      <p className="font-mono text-sm text-faint">Erreur inattendue</p>
      <h1 className="mt-4 text-[clamp(2rem,5vw,3.4rem)] display">Quelque chose s&apos;est mal passé.</h1>
      <p className="mt-4 max-w-md text-muted">L&apos;erreur a été enregistrée. Tu peux réessayer, ou revenir un peu plus tard.</p>
      <button type="button" onClick={reset} className={buttonClass("primary", "lg", "mt-8")}>Réessayer</button>
    </section>
  );
}
