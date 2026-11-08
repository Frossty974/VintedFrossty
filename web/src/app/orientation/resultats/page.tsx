import type { Metadata } from "next";
import { ResultsView } from "@/components/orientation/ResultsView";
import { FindPathButton } from "@/components/orientation/FindPathButton";
import { courses } from "@/data/courses";
import { computeOrientation } from "@/lib/orientation/engine";
import { decodeAnswers } from "@/lib/orientation/questions";

export const metadata: Metadata = {
  title: "Tes résultats d'orientation",
  robots: { index: false, follow: true },
};

export default async function ResultsPage({ searchParams }: { searchParams: Promise<{ r?: string }> }) {
  const { r } = await searchParams;
  const answers = decodeAnswers(r);

  if (!answers || !r) {
    return (
      <section className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Aucun résultat à afficher</h1>
        <p className="mt-4 max-w-md text-muted">Ce lien de résultats est incomplet ou a expiré. Réponds au questionnaire pour obtenir ton analyse personnalisée.</p>
        <div className="mt-8"><FindPathButton size="lg">Commencer le questionnaire</FindPathButton></div>
      </section>
    );
  }

  const result = computeOrientation(answers, courses);
  return <ResultsView code={r} answers={answers} result={result} />;
}
