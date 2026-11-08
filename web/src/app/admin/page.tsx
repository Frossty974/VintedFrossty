import type { Metadata } from "next";
import { AdminQueue } from "@/components/community/AdminQueue";

export const metadata: Metadata = { title: "Modération", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <section className="container-x pb-10 pt-28 sm:pt-36">
      <p className="eyebrow">Équipe NO LARP</p>
      <h1 className="display mt-4 text-[clamp(3rem,8vw,6rem)]">Modération.</h1>
      <p className="mt-4 max-w-lg text-muted">Relis chaque leçon. Certifie seulement ce que tu recommanderais à un ami.</p>
      <div className="mt-10"><AdminQueue /></div>
    </section>
  );
}
