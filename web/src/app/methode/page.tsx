import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { FindPathButton } from "@/components/orientation/FindPathButton";
import { Icon } from "@/components/ui/Icon";
import { formatBudget } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { WEIGHTS } from "@/lib/orientation/engine";
import { tracks } from "@/lib/orientation/tracks";

export const metadata: Metadata = {
  title: "Notre méthode",
  description: "Comment fonctionne notre questionnaire d'orientation : critères, pondérations, contraintes et limites. Une méthode transparente, documentée publiquement.",
  alternates: { canonical: "/methode" },
};

const factors: { key: keyof typeof WEIGHTS; label: string; text: string }[] = [
  { key: "interest", label: "Intérêts", text: "Les univers qui t'attirent spontanément. Si tu ne sais pas, tous les domaines partent à égalité." },
  { key: "workStyle", label: "Type de travail", text: "Ordinateur, création, analyse ou relationnel : chaque domaine sollicite des activités différentes au quotidien." },
  { key: "goal", label: "Objectif", text: "Revenu complémentaire, entreprise, compétences, orientation ou projet long terme : tous les domaines ne servent pas les mêmes buts." },
  { key: "time", label: "Temps disponible", text: "Comparé au temps minimum et au rythme confortable de chaque domaine." },
  { key: "budget", label: "Budget", text: "Comparé au budget minimum réaliste pour démarrer. Un budget insuffisant plafonne le score et déclenche un avertissement." },
  { key: "level", label: "Niveau actuel", text: "Certains domaines sont plus exigeants pour un débutant complet." },
  { key: "horizon", label: "Horizon de résultats", text: "Comparé au délai habituel avant un premier résultat concret dans le domaine." },
];

export default function MethodePage() {
  const total = Object.values(WEIGHTS).reduce((s, w) => s + w, 0);
  return (
    <>
      <PageHero
        eyebrow="Méthode"
        title="Comment on calcule."
        lead="Tout est public. Ce que le score mesure, et ce qu'il ne prétend pas faire."
      />

      <div className="container-x grid gap-20">
        <Reveal>
          <section className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="text-[clamp(1.7rem,3.4vw,2.4rem)] display">Ce que mesure le score</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Pour chaque domaine, nous calculons un score de compatibilité entre 0 et 100 %. Il exprime à quel point ta situation actuelle correspond aux exigences de ce domaine.
              </p>
              <div className="mt-6 rounded-md border border-warn/25 bg-warn/[0.05] p-5 text-sm leading-relaxed text-fg/85">
                <strong className="font-medium text-warn">Ce n&apos;est pas une probabilité de réussite.</strong> Ta réussite dépend de ton travail, de ta régularité et de ton contexte, que personne ne peut prédire. Les scores sont plafonnés à 97 % pour cette raison.
              </div>
            </div>
            <div className="rounded-lg border border-line">
              <div className="flex items-center justify-between border-b border-line px-6 py-4 text-sm text-faint"><span>Critère</span><span>Poids</span></div>
              <ul>
                {factors.map((f) => (
                  <li key={f.key} className="border-b border-line px-6 py-5 last:border-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-medium">{f.label}</span>
                      <span className="font-mono text-sm text-lime">{Math.round((WEIGHTS[f.key] / total) * 100)} %</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-lime" style={{ width: `${(WEIGHTS[f.key] / 30) * 100}%` }} /></div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{f.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section>
            <h2 className="text-[clamp(1.7rem,3.4vw,2.4rem)] display">Les garde-fous</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { icon: "wallet" as const, t: "Budget insuffisant", d: "Si ton budget est inférieur au minimum réaliste d'un domaine, son score est plafonné à 62 % et la limite est affichée clairement." },
                { icon: "user" as const, t: "Conditions d'âge", d: "Les activités réservées aux majeurs (ouverture d'un compte de trading) sont plafonnées à 40 % pour les moins de 18 ans, avec explication." },
                { icon: "alert" as const, t: "Risque financier", d: "Les domaines comportant un risque de perte en capital affichent systématiquement un avertissement, quel que soit le score." },
              ].map((g) => (
                <div key={g.t} className="rounded-lg border border-line bg-white/[0.02] p-6">
                  <Icon name={g.icon} className="size-6 text-cyan" />
                  <h3 className="mt-5 font-semibold">{g.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{g.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-faint">
              Ta principale difficulté (temps, discipline, moyens, peur de te lancer) ajuste légèrement les scores, de quelques points au maximum : elle départage des domaines proches sans renverser le classement.
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section>
            <h2 className="text-[clamp(1.7rem,3.4vw,2.4rem)] display">Les critères de chaque piste</h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">Ces valeurs sont des ordres de grandeur établis par notre équipe pédagogique. Elles sont revues régulièrement.</p>
            <div className="mt-8 overflow-x-auto rounded-lg border border-line">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-white/[0.02] text-faint">
                    <th scope="col" className="p-4 font-normal">Piste</th>
                    <th scope="col" className="p-4 font-normal">Temps minimum</th>
                    <th scope="col" className="p-4 font-normal">Budget de départ</th>
                    <th scope="col" className="p-4 font-normal">Exigence débutant</th>
                    <th scope="col" className="p-4 font-normal">Premiers résultats</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((t) => (
                    <tr key={t.id} className="border-b border-line last:border-0">
                      <th scope="row" className="p-4 font-medium">{t.name}{t.financialRisk && <span className="ml-2 text-xs text-red">risque</span>}</th>
                      <td className="p-4 text-muted">{t.minHours} h / sem.</td>
                      <td className="p-4 text-muted">{formatBudget(t.minBudget, t.comfortBudget)}</td>
                      <td className="p-4 text-muted">{t.demand < 0.35 ? "Faible" : t.demand < 0.6 ? "Moyenne" : "Élevée"}</td>
                      <td className="p-4 text-muted">≈ {t.firstResultMonths < 1 ? "quelques semaines" : `${t.firstResultMonths.toLocaleString("fr-FR")} mois`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-[clamp(1.7rem,3.4vw,2.4rem)] display">Le parcours en cinq étapes</h2>
              <p className="mt-4 leading-relaxed text-muted">Pour le domaine le plus compatible, nous construisons un parcours dont la durée est calculée à partir de ton temps disponible et du volume horaire réel des formations.</p>
            </div>
            <ol className="grid gap-3">
              {["Découverte du domaine", "Apprentissage des fondamentaux", "Mise en pratique", "Réalisation d'un premier projet", "Développement des compétences"].map((s, i) => (
                <li key={s} className="flex items-center gap-4 rounded-md border border-line p-4">
                  <span className="grid size-9 place-items-center rounded-md border border-line-strong font-mono text-xs text-lime">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </section>
        </Reveal>

        <section className="rounded-lg border border-line bg-white/[0.02] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Teste la méthode sur ton profil</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Deux minutes, gratuit, sans inscription.</p>
          <div className="mt-7 flex justify-center"><FindPathButton /></div>
        </section>
      </div>
    </>
  );
}
