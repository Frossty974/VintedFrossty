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
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(76_125_255/0.2),transparent)]" />
      <div className="container-x relative">
        <div className="ring-gradient mx-auto max-w-2xl overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#0d1122,#080a14)] shadow-[0_40px_120px_-30px_rgb(76_125_255/0.35)]">
          <Quiz variant="page" />
        </div>
      </div>
    </section>
  );
}
