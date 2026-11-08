import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/catalog/CourseCard";
import { ProgramAccordion } from "@/components/catalog/ProgramAccordion";
import { Icon } from "@/components/ui/Icon";
import { accentText, ButtonLink, DemoBadge, Eyebrow, formatBudget, formatHours, formatPrice, RiskNotice } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { courses, getCourse, getCoursesByDomain, lessonCount } from "@/data/courses";
import { getDomain } from "@/data/domains";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse((await params).slug);
  if (!course) return {};
  return {
    title: course.title,
    description: `${course.subtitle} ${course.presentation.slice(0, 120)}…`,
    alternates: { canonical: `/formations/${course.slug}` },
    openGraph: { title: `${course.title} · ${site.name}`, description: course.subtitle },
  };
}

export default async function CoursePage({ params }: Props) {
  const course = getCourse((await params).slug);
  if (!course) notFound();
  const domain = getDomain(course.domain)!;
  const related = getCoursesByDomain(domain.slug).filter((c) => c.slug !== course.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.presentation,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    educationalLevel: course.level,
    inLanguage: "fr",
    timeRequired: `PT${course.hours}H`,
    teaches: course.skills,
    offers: { "@type": "Offer", price: course.price, priceCurrency: "EUR", category: "Paid" },
  };

  const facts = [
    { icon: "layers" as const, label: "Niveau requis", value: course.level },
    { icon: "clock" as const, label: "Durée estimée", value: `${formatHours(course.hours)} · ${lessonCount(course)} leçons` },
    { icon: "wallet" as const, label: "Budget de départ", value: formatBudget(course.startBudget.min, course.startBudget.max) },
    { icon: "book" as const, label: "Modules", value: `${course.modules.length} modules` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden pb-12 pt-28 sm:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="grid-bg absolute inset-0 opacity-60" />
          <div className="absolute -top-40 right-0 h-[520px] w-[720px] rounded-full bg-[radial-gradient(closest-side,rgb(123_92_255/0.16),transparent)]" />
        </div>
        <div className="container-x relative">
          <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 text-sm text-faint">
            <Link href="/formations" className="hover:text-fg">Formations</Link>
            <span>/</span>
            <Link href={`/domaines/${domain.slug}`} className="hover:text-fg">{domain.name}</Link>
          </nav>
          <Reveal>
            <p className={`mt-8 inline-flex items-center gap-2 text-sm font-medium ${accentText[domain.accent]}`}>
              <Icon name={domain.icon} className="size-4" /> {domain.name}
            </p>
            <h1 className="mt-4 max-w-4xl text-[clamp(2.3rem,5.6vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-gradient text-balance">{course.title}</h1>
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted">{course.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <div className="container-x grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
        <div className="min-w-0">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-ink p-4">
                <dt className="flex items-center gap-1.5 text-xs text-faint"><Icon name={f.icon} className="size-3.5" />{f.label}</dt>
                <dd className="mt-1.5 text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>

          {domain.riskNotice && <div className="mt-8"><RiskNotice text={domain.riskNotice} /></div>}

          <Block title="Présentation">
            <p className="text-lg leading-relaxed text-fg/85">{course.presentation}</p>
          </Block>

          <Block title="Objectifs pédagogiques">
            <ul className="grid gap-3 sm:grid-cols-2">
              {course.objectives.map((o) => (
                <li key={o} className="flex gap-3 rounded-2xl border border-line bg-white/[0.02] p-4 text-sm leading-relaxed">
                  <Icon name="target" className="mt-0.5 size-4 shrink-0 text-cyan" />
                  {o}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Compétences développées">
            <ul className="flex flex-wrap gap-2">
              {course.skills.map((s) => (
                <li key={s} className="rounded-full border border-line-strong bg-white/[0.03] px-3.5 py-1.5 text-sm">{s}</li>
              ))}
            </ul>
          </Block>

          <Block title="Programme détaillé" aside={`${course.modules.length} modules · ${lessonCount(course)} leçons · ${formatHours(course.hours)}`}>
            <ProgramAccordion modules={course.modules} />
          </Block>

          <Block title="Avant de commencer">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line p-5">
                <p className="text-sm font-medium">Niveau requis · {course.level}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{course.prerequisites}</p>
              </div>
              <div className="rounded-2xl border border-line p-5">
                <p className="text-sm font-medium">Budget de départ indicatif · {formatBudget(course.startBudget.min, course.startBudget.max)}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{course.startBudget.note} Ce budget s&apos;ajoute au prix de la formation et reste facultatif pour suivre les cours.</p>
              </div>
            </div>
          </Block>

          <Block title="Ressources incluses">
            <ul className="grid gap-2.5">
              {course.resources.map((r) => (
                <li key={r} className="flex items-center gap-3 text-muted">
                  <Icon name="book" className="size-4 text-[#9db4ff]" /> {r}
                </li>
              ))}
            </ul>
          </Block>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="ring-gradient rounded-3xl bg-[linear-gradient(180deg,#0e1226,#090b16)] p-6 shadow-[0_30px_80px_-30px_rgb(76_125_255/0.4)]">
            <div className="flex items-center justify-between">
              <Eyebrow>Formation</Eyebrow>
              <DemoBadge>Tarif indicatif</DemoBadge>
            </div>
            <p className="mt-5 text-4xl font-semibold tracking-tight">{formatPrice(course.price)}</p>
            <p className="mt-1 text-sm text-faint">TTC · paiement unique · accès sans limite de durée</p>
            <ButtonLink href={`/formations/${course.slug}/inscription`} size="lg" arrow className="mt-6 w-full">
              S&apos;inscrire
            </ButtonLink>
            <ul className="mt-6 grid gap-2.5 text-sm text-muted">
              {[`${course.modules.length} modules, ${lessonCount(course)} leçons`, "Ressources téléchargeables", "Suivi de progression", "Mises à jour incluses"].map((t) => (
                <li key={t} className="flex items-center gap-2.5"><Icon name="check" className="size-4 text-cyan" />{t}</li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-faint">
              Aucune promesse de résultat financier. Voir la <Link href="/legal/remboursement" className="underline underline-offset-2 hover:text-fg">politique de remboursement</Link>.
            </p>
          </div>
        </aside>
      </div>

      {/* Barre d'inscription fixe sur mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[#05060b]/90 px-5 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold leading-none">{formatPrice(course.price)}</p>
            <p className="mt-1 text-xs text-faint">{formatHours(course.hours)} · {course.level}</p>
          </div>
          <ButtonLink href={`/formations/${course.slug}/inscription`} arrow>S&apos;inscrire</ButtonLink>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-x mt-24">
          <h2 className="text-2xl font-semibold tracking-tight">Dans le même domaine</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => <CourseCard key={c.slug} course={c} />)}
          </div>
        </section>
      )}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </>
  );
}

function Block({ title, aside, children }: { title: string; aside?: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4">
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h2>
        {aside && <span className="font-mono text-xs text-faint">{aside}</span>}
      </div>
      {children}
    </section>
  );
}
