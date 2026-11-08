import type { Metadata } from "next";
import { RankingBoard } from "@/components/community/RankingBoard";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Classement de la semaine",
  description: "Les formations NO LARP les plus suivies cette semaine : visites, inscriptions et leçons terminées. Calcul public, remise à zéro chaque lundi.",
  alternates: { canonical: "/classement" },
};

export default function ClassementPage() {
  return (
    <section className="container-x pb-10 pt-28 sm:pt-36">
      <Reveal>
        <p className="eyebrow">Mis à jour en continu · remise à zéro le lundi</p>
        <h1 className="display mt-4 text-[clamp(3.2rem,10vw,8rem)]">Le top <span className="text-lime">de la semaine.</span></h1>
        <p className="mt-5 max-w-lg text-lg text-muted">Les formations que les gens suivent vraiment. Pas celles qui crient le plus fort.</p>
      </Reveal>
      <div className="mt-12"><RankingBoard /></div>
    </section>
  );
}
