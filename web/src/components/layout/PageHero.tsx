import { Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: string; title: React.ReactNode; lead?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative pb-12 pt-28 sm:pt-36">
      <div className="container-x relative">
        <Reveal>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="display mt-4 max-w-5xl text-[clamp(3rem,9vw,7rem)] text-balance">{title}</h1>
          {lead && <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">{lead}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
