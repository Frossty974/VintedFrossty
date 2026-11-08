import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBadge, Eyebrow } from "@/components/ui/primitives";
import { getLegalDoc, legalDocs } from "@/data/legal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = getLegalDoc((await params).slug);
  return d ? { title: d.title, alternates: { canonical: `/legal/${d.slug}` } } : {};
}

export default async function LegalPage({ params }: Props) {
  const doc = getLegalDoc((await params).slug);
  if (!doc) notFound();
  return (
    <div className="container-x grid gap-12 pb-10 pt-28 sm:pt-36 lg:grid-cols-[220px_1fr]">
      <nav aria-label="Documents légaux" className="lg:sticky lg:top-28 lg:self-start">
        <Eyebrow>Légal</Eyebrow>
        <ul className="mt-5 flex flex-wrap gap-2 lg:grid lg:gap-1">
          {legalDocs.map((d) => (
            <li key={d.slug}>
              <Link href={`/legal/${d.slug}`} aria-current={d.slug === doc.slug ? "page" : undefined} className={`block rounded-lg px-3 py-2 text-sm transition ${d.slug === doc.slug ? "bg-white/[0.06] text-fg" : "text-muted hover:text-fg"}`}>
                {d.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <article className="max-w-3xl">
        <DemoBadge>Modèle à compléter et à faire valider</DemoBadge>
        <h1 className="mt-5 text-[clamp(2rem,4.6vw,3rem)] display">{doc.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{doc.intro}</p>
        <div className="prose-legal mt-4">
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p?.map((p) => <p key={p}>{p}</p>)}
              {s.ul && <ul>{s.ul.map((li) => <li key={li}>{li}</li>)}</ul>}
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-faint">Dernière mise à jour : [date]</p>
      </article>
    </div>
  );
}
