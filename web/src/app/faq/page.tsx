import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/primitives";
import { faq } from "@/data/faq";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: "Questionnaire d'orientation, formations, risques financiers, compte et paiement : toutes les réponses à vos questions.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const categories = [...new Set(faq.map((f) => f.category))];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="FAQ" title="Questions fréquentes" lead="Des réponses claires, y compris aux questions qui fâchent." />
      <div className="container-x grid gap-14">
        {categories.map((c) => (
          <section key={c} className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <h2 className="text-xl font-semibold tracking-tight lg:sticky lg:top-24 lg:self-start">{c}</h2>
            <Accordion items={faq.filter((f) => f.category === c)} />
          </section>
        ))}
        <div className="rounded-[28px] border border-line bg-white/[0.02] p-8 text-center">
          <p className="text-lg font-medium">Ta question n&apos;est pas dans la liste ?</p>
          <div className="mt-5 flex justify-center"><ButtonLink href="/contact" arrow>Nous contacter</ButtonLink></div>
        </div>
      </div>
    </>
  );
}
