import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { FindPathButton } from "@/components/orientation/FindPathButton";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink, DemoBadge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import type { IconName } from "@/data/types";

export const metadata: Metadata = {
  title: "À propos",
  description: `${site.name} aide les jeunes à découvrir les domaines qui leur correspondent et à acquérir des compétences concrètes, sans promesse d'argent facile.`,
  alternates: { canonical: "/a-propos" },
};

const values: { icon: IconName; t: string; d: string }[] = [
  { icon: "eye", t: "L'honnêteté avant la vente", d: "Nous montrons les difficultés de chaque domaine autant que ses opportunités. Si un domaine ne te correspond pas, nous te le disons." },
  { icon: "book", t: "Des compétences, pas des promesses", d: "Nos formations transmettent des savoir-faire utiles toute une carrière, que tu deviennes indépendant, salarié ou entrepreneur." },
  { icon: "route", t: "La méthode avant la motivation", d: "La motivation fluctue. Un parcours clair, découpé en étapes réalistes, permet d'avancer même les semaines difficiles." },
  { icon: "shield", t: "Le respect de notre public", d: "Notre public est jeune. Cela nous impose une exigence particulière : pas de pression commerciale, pas de fausse urgence, pas de données revendues." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="On ne vend pas du rêve. On aide à choisir, puis à apprendre."
        lead={`${site.name} est né d'un constat simple : les jeunes ne manquent ni d'ambition ni de motivation, mais de repères fiables pour décider où investir leur temps.`}
      />

      <div className="container-x grid gap-24">
        <Reveal>
          <section className="grid gap-10 lg:grid-cols-2">
            <h2 className="text-[clamp(1.7rem,3.4vw,2.4rem)] font-semibold leading-tight tracking-[-0.035em]">Pourquoi nous existons</h2>
            <div className="grid gap-5 text-lg leading-relaxed text-muted">
              <p>Internet regorge d&apos;opportunités : vendre en ligne, créer du contenu, utiliser l&apos;intelligence artificielle, comprendre la finance, proposer ses compétences. Mais il regorge aussi de promesses irréalistes et de conseils contradictoires.</p>
              <p>Résultat : beaucoup de jeunes hésitent, se dispersent, ou se lancent dans une voie qui ne leur correspond pas. Nous avons étudié chaque domaine — ses opportunités, ses difficultés, les compétences, le temps et les ressources qu&apos;il exige — pour proposer une vision honnête et une méthode pour avancer.</p>
              <p className="text-fg">Notre conviction : tu n&apos;as pas besoin de savoir ce que tu veux faire de ta vie. Tu as besoin de découvrir ce qui te correspond.</p>
            </div>
          </section>
        </Reveal>

        <section>
          <Reveal><h2 className="text-[clamp(1.7rem,3.4vw,2.4rem)] font-semibold tracking-[-0.035em]">Nos principes</h2></Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={(i % 2) * 0.06}>
                <div className="h-full rounded-3xl border border-line bg-white/[0.02] p-7">
                  <Icon name={v.icon} className="size-6 text-cyan" />
                  <h3 className="mt-5 text-lg font-semibold">{v.t}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <section className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-[clamp(1.7rem,3.4vw,2.4rem)] font-semibold tracking-[-0.035em]">Ce que nous refusons de faire</h2>
              <p className="mt-4 leading-relaxed text-muted">Ces engagements s&apos;appliquent à notre site, nos formations et notre communication.</p>
            </div>
            <ul className="grid gap-3">
              {[
                "Promettre des revenus ou afficher des captures de gains.",
                "Publier de faux avis, de faux témoignages ou des statistiques invérifiables.",
                "Utiliser des comptes à rebours, de fausses promotions ou de fausses places limitées.",
                "Présenter le trading ou les crypto-actifs comme une source de revenu garanti.",
                "Revendre ou exploiter commercialement les réponses au questionnaire.",
              ].map((x) => (
                <li key={x} className="flex gap-3 rounded-2xl border border-line p-4 text-sm leading-relaxed">
                  <Icon name="close" className="mt-0.5 size-4 shrink-0 text-risk" />{x}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <section className="rounded-[28px] border border-dashed border-line-strong p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold tracking-tight">L&apos;équipe</h2>
              <DemoBadge>Section à compléter</DemoBadge>
            </div>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">
              Cette section présentera les fondateurs et les formateurs, leur parcours et leurs domaines d&apos;expertise vérifiables. Nous préférons la laisser vide plutôt que d&apos;y afficher des profils fictifs.
            </p>
          </section>
        </Reveal>

        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Envie de voir ce qui te correspond ?</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <FindPathButton />
            <ButtonLink href="/contact" variant="secondary">Nous écrire</ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
