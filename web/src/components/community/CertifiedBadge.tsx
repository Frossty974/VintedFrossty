import { LogoMark } from "@/components/ui/Logo";

/** Tampon « Certifié NO LARP », attribué après validation par l'équipe. */
export function CertifiedBadge({ size = "md", date }: { size?: "sm" | "md" | "lg"; date?: string }) {
  if (size === "sm") {
    return (
      <span className="inline-flex items-center gap-1 bg-[#171717] px-2 py-0.5 font-display text-[0.72rem] uppercase tracking-wide text-lime">
        <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8.5l3 3L13 4.5" /></svg>
        Certifié No Larp
      </span>
    );
  }
  const big = size === "lg";
  return (
    <div className={`paper tape inline-flex rotate-[-3deg] items-center gap-3 ${big ? "px-5 py-4" : "px-4 py-3"}`} role="img" aria-label={`Formation certifiée NO LARP${date ? ` le ${new Date(date).toLocaleDateString("fr-FR")}` : ""}`}>
      <LogoMark className={big ? "size-12" : "size-9"} />
      <span>
        <span className={`display block leading-none text-[#171717] ${big ? "text-3xl" : "text-2xl"}`}>Certifié</span>
        <span className={`display block leading-none text-[#171717] ${big ? "text-3xl" : "text-2xl"}`}>No Larp</span>
        {date && <span className="mt-1 block text-[0.7rem] font-semibold text-[#171717]/60">le {new Date(date).toLocaleDateString("fr-FR")}</span>}
      </span>
    </div>
  );
}
