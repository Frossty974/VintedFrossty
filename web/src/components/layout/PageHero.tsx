import { Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: string; title: React.ReactNode; lead?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0 opacity-70" />
        <div className="absolute -top-48 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(76_125_255/0.18),transparent)]" />
      </div>
      <div className="container-x relative">
        <Reveal>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="mt-5 max-w-4xl text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[1.0] tracking-[-0.045em] text-gradient text-balance">{title}</h1>
          {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted text-pretty">{lead}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
