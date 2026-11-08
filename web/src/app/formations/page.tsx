import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { PageHero } from "@/components/layout/PageHero";
import { FindPathButton } from "@/components/orientation/FindPathButton";
import { courses } from "@/data/courses";
import { domains } from "@/data/domains";

export const metadata: Metadata = {
  title: "Formations",
  description: "Toutes nos formations en e-commerce, intelligence artificielle, création de contenu, marchés financiers et business digital. Programmes détaillés, niveau requis, durée et budget de départ.",
  alternates: { canonical: "/formations" },
};

export default async function FormationsPage({ searchParams }: { searchParams: Promise<{ domaine?: string }> }) {
  const { domaine } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Catalogue"
        title="Des formations pour apprendre ce qui compte vraiment."
        lead={`${courses.length} formations réparties en ${domains.length} domaines. Chaque programme est public : objectifs, compétences, durée, budget de départ et contenu de chaque module.`}
      >
        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted">
          <FindPathButton variant="secondary">Pas sûr ? Trouve ta voie</FindPathButton>
        </div>
      </PageHero>
      <section className="container-x">
        <CatalogExplorer initialDomain={domaine} />
        <p className="mt-8 text-xs text-faint">Tarifs de lancement indicatifs, susceptibles d&apos;évoluer avant l&apos;ouverture des inscriptions.</p>
      </section>
    </>
  );
}
