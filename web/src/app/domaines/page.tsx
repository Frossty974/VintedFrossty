import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { FindPathButton } from "@/components/orientation/FindPathButton";
import { Icon } from "@/components/ui/Icon";
import { accentSoft, accentText, formatBudget } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { getCoursesByDomain } from "@/data/courses";
import { domains } from "@/data/domains";

export const metadata: Metadata = {
  title: "Domaines",
  description: "Comparez les domaines : e-commerce, marchés financiers, IA et création de contenu, business digital. Opportunités, difficultés, temps et budget nécessaires.",
  alternates: { canonical: "/domaines" },
};

export default function DomainesPage() {
  const rows: { label: string; get: (d: (typeof domains)[number]) => React.ReactNode }[] = [
    { label: "Ce que tu vends", get: (d) => d.short },
    { label: "Temps conseillé", get: (d) => d.weeklyTime },
    { label: "Budget de départ", get: (d) => formatBudget(d.startBudget.min, d.startBudget.max) },
    { label: "Pour démarrer", get: (d) => d.timeToStart },
    { label: "Risque financier", get: (d) => (d.riskNotice ? <span className="text-[#ffb3b3]">Élevé (perte en capital)</span> : "Faible à modéré") },
    { label: "Formations", get: (d) => getCoursesByDomain(d.slug).length },
  ];

  return (
    <>
      <PageHero
        eyebrow="Domaines"
        title="Chaque domaine, tel qu'il est vraiment."
        lead="Nous avons analysé chaque domaine : ses opportunités, ses difficultés, les compétences nécessaires, le temps à investir et le budget pour débuter. Compare-les, puis laisse le questionnaire affiner."
      >
        <div className="mt-8"><FindPathButton variant="secondary">Comparer avec mon profil</FindPathButton></div>
      </PageHero>

      <section className="container-x">
        <div className="grid gap-4 md:grid-cols-2">
          {domains.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 2) * 0.06}>
              <SpotlightCard glow={accentSoft[d.accent]} className="h-full">
                <Link href={`/domaines/${d.slug}`} className="flex h-full flex-col p-7">
                  <div className={`flex items-center gap-3 ${accentText[d.accent]}`}>
                    <Icon name={d.icon} className="size-6" />
                    <span className="text-sm font-medium">{d.short}</span>
                  </div>
                  <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">{d.name}</h2>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{d.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted group-hover/spot:text-fg">Voir l&apos;analyse complète <Icon name="arrow-right" className="size-4" /></span>
                </Link>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h2 className="mt-24 text-[clamp(1.8rem,3.6vw,2.6rem)] font-semibold tracking-[-0.035em]">Comparatif rapide</h2>
          <p className="mt-3 text-muted">Ordres de grandeur indicatifs, établis par notre équipe pédagogique. Ils varient selon les projets.</p>
          <div className="mt-8 overflow-x-auto rounded-3xl border border-line">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-white/[0.02]">
                  <th scope="col" className="p-5 font-normal text-faint">Critère</th>
                  {domains.map((d) => (
                    <th key={d.slug} scope="col" className="p-5 font-medium">
                      <span className={`inline-flex items-center gap-2 ${accentText[d.accent]}`}><Icon name={d.icon} className="size-4" /></span> {d.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-line last:border-0">
                    <th scope="row" className="p-5 font-normal text-faint">{r.label}</th>
                    {domains.map((d) => <td key={d.slug} className="p-5 text-fg/90">{r.get(d)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>
    </>
  );
}
