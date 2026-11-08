import type { Metadata } from "next";
import { Suspense } from "react";
import { CertifiedBadge } from "@/components/community/CertifiedBadge";
import { SubmitCourseForm } from "@/components/community/SubmitCourseForm";
import { HandCheck } from "@/components/home/Sticker";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Proposer une formation",
  description: "Tu as un vrai savoir-faire ? Propose ta formation. L'équipe NO LARP la vérifie, puis la certifie.",
  alternates: { canonical: "/proposer" },
};

const steps = [
  { n: "01", t: "Tu proposes", d: "Programme complet, objectifs, prix. Pré-contrôle automatique à la saisie." },
  { n: "02", t: "On vérifie", d: "Un humain relit tout. On valide, on demande des corrections, ou on refuse." },
  { n: "03", t: "Certifié No Larp", d: "Ta formation rejoint le catalogue avec le badge de certification." },
];

const charter = [
  "Aucune promesse de revenus ou de résultat garanti",
  "Risques affichés clairement (surtout en finance)",
  "Programme réel, détaillé leçon par leçon",
  "Contenu original, dont tu détiens les droits",
  "Pas de fausse urgence ni de faux avis",
];

export default function ProposerPage() {
  return (
    <>
      <section className="relative pb-12 pt-28 sm:pt-36">
        <div className="container-x grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="eyebrow">Communauté</p>
            <h1 className="display mt-4 text-[clamp(3.2rem,9vw,7rem)]">
              Tu sais faire ? <span className="text-lime">Transmets.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted">Propose ta formation. On la vérifie. On la certifie.</p>
          </Reveal>
          <Reveal delay={0.1} className="justify-self-start lg:justify-self-end">
            <CertifiedBadge size="lg" />
          </Reveal>
        </div>
      </section>

      <div className="container-x">
        <ol className="grid gap-px border-2 border-line-strong bg-line-strong sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="bg-ink p-6">
              <span className="display text-5xl text-lime">{s.n}</span>
              <p className="display mt-3 text-3xl">{s.t}</p>
              <p className="mt-2 text-sm text-muted">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <Suspense>
              <SubmitCourseForm />
            </Suspense>
          </div>
          <aside id="charte" className="lg:sticky lg:top-24 lg:self-start">
            <div className="paper torn rotate-[1deg] px-6 py-8">
              <p className="display text-4xl text-[#171717]">La charte</p>
              <ul className="mt-5 grid gap-3">
                {charter.map((c) => (
                  <li key={c} className="hand flex gap-2.5 text-lg leading-snug text-[#171717]">
                    <HandCheck className="mt-0.5 size-6 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs font-semibold text-[#171717]/60">Non respectée = refusée. Pas de négociation.</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
