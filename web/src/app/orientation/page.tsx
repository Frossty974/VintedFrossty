import type { Metadata } from "next";
import { Quiz } from "@/components/orientation/Quiz";

export const metadata: Metadata = {
  title: "Questionnaire d'orientation",
  description: "10 questions pour découvrir les domaines qui te correspondent : e-commerce, IA, création de contenu, finance, business digital. Gratuit et sans inscription.",
  alternates: { canonical: "/orientation" },
};

export default function OrientationPage() {
  return (
    <section className="relative overflow-hidden pb-10 pt-24 sm:pt-32">
      <div className="container-x relative">
        <div className="ring-gradient mx-auto max-w-2xl overflow-hidden rounded-lg bg-night">
          <Quiz variant="page" />
        </div>
      </div>
    </section>
  );
}
