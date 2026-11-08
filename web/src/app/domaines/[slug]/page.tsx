import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/catalog/CourseCard";
import { FindPathButton } from "@/components/orientation/FindPathButton";
import { Icon } from "@/components/ui/Icon";
import { accentText, ButtonLink, formatBudget, RiskNotice } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { getCoursesByDomain } from "@/data/courses";
import { domains, getDomain } from "@/data/domains";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return domains.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = getDomain((await params).slug);
  if (!d) return {};
  return { title: d.name, description: d.tagline + " " + d.description.slice(0, 110), alternates: { canonical: `/domaines/${d.slug}` } };
}

export default async function DomainPage({ params }: Props) {
  const d = getDomain((await params).slug);
  if (!d) notFound();
  const list = getCoursesByDomain(d.slug);

  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-28 sm:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="grid-bg absolute inset-0 opacity-60" />
          <div className="absolute -top-40 left-1/3 h-[520px] w-[820px] rounded-full bg-[radial-gradient(closest-side,rgb(76_125_255/0.16),transparent)]" />
        </div>
        <div className="container-x relative">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-sm text-faint">
            <Link href="/domaines" className="hover:text-fg">Domaines</Link><span>/</span><span className="text-muted">{d.name}</span>
          </nav>
          <Reveal>
            <div className={`mt-8 grid size-14 place-items-center rounded-2xl border border-line-strong bg-white/[0.03] ${accentText[d.accent]}`}>
              <Icon name={d.icon} className="size-7" />
            </div>
            <h1 className="mt-6 text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[1] tracking-[-0.045em] text-gradient">{d.name}</h1>
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted">{d.tagline}</p>
          </Reveal>
        </div>
      </section>

      <div className="container-x">
        {d.riskNotice && <div className="mb-10"><RiskNotice text={d.riskNotice} /></div>}

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="text-lg leading-relaxed text-fg/85">{d.description}</p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <ListCard title="Opportunités" icon="spark" tone="text-ok" items={d.opportunities} />
              <ListCard title="Difficultés" icon="alert" tone="text-warn" items={d.difficulties} />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line">
              {[
                { k: "Temps conseillé", v: d.weeklyTime, icon: "clock" as const },
                { k: "Pour démarrer", v: d.timeToStart, icon: "flag" as const },
                { k: "Budget de départ indicatif", v: formatBudget(d.startBudget.min, d.startBudget.max), note: d.startBudget.note, icon: "wallet" as const },
              ].map((x) => (
                <div key={x.k} className="bg-ink p-6">
                  <dt className="flex items-center gap-2 text-sm text-faint"><Icon name={x.icon} className="size-4" />{x.k}</dt>
                  <dd className="mt-2 text-lg font-medium">{x.v}</dd>
                  {x.note && <dd className="mt-1 text-sm text-muted">{x.note}</dd>}
                </div>
              ))}
              <div className="bg-ink p-6">
                <dt className="text-sm text-faint">Compétences clés</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {d.skills.map((s) => <span key={s} className="rounded-full border border-line-strong px-3 py-1 text-sm">{s}</span>)}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <section className="mt-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)] font-semibold tracking-[-0.035em]">Les formations du domaine</h2>
            <ButtonLink href={`/formations?domaine=${d.slug}`} variant="secondary" arrow>Filtrer le catalogue</ButtonLink>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => <CourseCard key={c.slug} course={c} />)}
          </div>
        </section>

        <section className="mt-24 rounded-[28px] border border-line bg-white/[0.02] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ce domaine est-il fait pour toi ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Le questionnaire compare ton temps, ton budget, ton niveau et tes envies aux exigences de chaque domaine.</p>
          <div className="mt-7 flex justify-center"><FindPathButton /></div>
        </section>
      </div>
    </>
  );
}

function ListCard({ title, icon, tone, items }: { title: string; icon: "spark" | "alert"; tone: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-line bg-white/[0.02] p-6">
      <h2 className={`flex items-center gap-2 font-medium ${tone}`}><Icon name={icon} className="size-4" />{title}</h2>
      <ul className="mt-4 grid gap-3">
        {items.map((it) => <li key={it} className="text-sm leading-relaxed text-muted">{it}</li>)}
      </ul>
    </div>
  );
}
