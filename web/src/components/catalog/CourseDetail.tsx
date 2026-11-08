import Link from "next/link";
import { CertifiedBadge } from "@/components/community/CertifiedBadge";
import { TrackView } from "@/components/community/TrackView";
import { Icon } from "@/components/ui/Icon";
import { accentText, ButtonLink, DemoBadge, Eyebrow, formatBudget, formatHours, formatPrice, RiskNotice } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { lessonCount } from "@/data/courses";
import { getDomain } from "@/data/domains";
import type { Course } from "@/data/types";
import { courseHref } from "@/lib/community/types";
import { CourseCard } from "./CourseCard";
import { ProgramAccordion } from "./ProgramAccordion";

/** Fiche complète d'une formation, officielle ou proposée par la communauté. */
export function CourseDetail({ course, related = [] }: { course: Course; related?: Course[] }) {
  const domain = getDomain(course.domain)!;
  const href = courseHref(course);
  const community = course.community;

  const facts = [
    { icon: "layers" as const, label: "Niveau requis", value: course.level },
    { icon: "clock" as const, label: "Durée estimée", value: `${formatHours(course.hours)} · ${lessonCount(course)} leçons` },
    { icon: "wallet" as const, label: "Budget de départ", value: formatBudget(course.startBudget.min, course.startBudget.max) },
    { icon: "book" as const, label: "Modules", value: `${course.modules.length} modules` },
  ];

  return (
    <>
      <TrackView slug={course.slug} />
      <section className="relative pb-12 pt-28 sm:pt-36">
        <div className="container-x relative">
          <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 text-sm text-faint">
            <Link href="/formations" className="hover:text-fg">Formations</Link>
            <span>/</span>
            <Link href={`/domaines/${domain.slug}`} className="hover:text-fg">{domain.name}</Link>
          </nav>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <p className={`mt-8 inline-flex items-center gap-2 text-sm font-medium ${accentText[domain.accent]}`}>
                <Icon name={domain.icon} className="size-4" /> {domain.name}
              </p>
              <h1 className="display mt-4 max-w-4xl text-[clamp(2.6rem,6vw,4.6rem)] text-balance">{course.title}</h1>
              <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted">{course.subtitle}</p>
              {community && (
                <p className="mt-5 text-sm text-muted">
                  Formation proposée par <strong className="text-fg">{community.author}</strong>, vérifiée par l&apos;équipe NO LARP.
                </p>
              )}
            </Reveal>
            {community && <CertifiedBadge size="lg" date={community.certifiedAt} />}
          </div>
        </div>
      </section>

      <div className="container-x grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
        <div className="min-w-0">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-ink p-4">
                <dt className="flex items-center gap-1.5 text-xs text-faint"><Icon name={f.icon} className="size-3.5" />{f.label}</dt>
                <dd className="mt-1.5 text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>

          {domain.riskNotice && <div className="mt-8"><RiskNotice text={domain.riskNotice} /></div>}

          <Block title="Présentation">
            <p className="whitespace-pre-line text-lg leading-relaxed text-fg/85">{course.presentation}</p>
          </Block>

          <Block title="Objectifs">
            <ul className="grid gap-3 sm:grid-cols-2">
              {course.objectives.map((o) => (
                <li key={o} className="flex gap-3 rounded-md border border-line p-4 text-sm leading-relaxed">
                  <Icon name="target" className="mt-0.5 size-4 shrink-0 text-lime" />
                  {o}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Compétences">
            <ul className="flex flex-wrap gap-2">
              {course.skills.map((s) => <li key={s} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm">{s}</li>)}
            </ul>
          </Block>

          <Block title="Programme" aside={`${course.modules.length} modules · ${lessonCount(course)} leçons · ${formatHours(course.hours)}`}>
            <ProgramAccordion modules={course.modules} />
          </Block>

          <Block title="Avant de commencer">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-line p-5">
                <p className="text-sm font-medium">Niveau requis · {course.level}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{course.prerequisites}</p>
              </div>
              <div className="rounded-md border border-line p-5">
                <p className="text-sm font-medium">Budget de départ indicatif · {formatBudget(course.startBudget.min, course.startBudget.max)}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{course.startBudget.note || "Aucune précision."} Ce budget s&apos;ajoute au prix de la formation.</p>
              </div>
            </div>
          </Block>

          {course.resources.length > 0 && (
            <Block title="Ressources incluses">
              <ul className="grid gap-2.5">
                {course.resources.map((r) => (
                  <li key={r} className="flex items-center gap-3 text-muted"><Icon name="book" className="size-4 text-lime" /> {r}</li>
                ))}
              </ul>
            </Block>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="ring-gradient rounded-lg bg-night p-6">
            <div className="flex items-center justify-between">
              <Eyebrow>{community ? "Communauté" : "Formation"}</Eyebrow>
              {!community && <DemoBadge>Tarif indicatif</DemoBadge>}
            </div>
            <p className="display mt-5 text-5xl">{formatPrice(course.price)}</p>
            <p className="mt-1 text-sm text-faint">TTC · paiement unique</p>
            <ButtonLink href={`${href}/inscription`} size="lg" arrow className="mt-6 w-full">S&apos;inscrire</ButtonLink>
            <ul className="mt-6 grid gap-2.5 text-sm text-muted">
              {[`${course.modules.length} modules, ${lessonCount(course)} leçons`, "Suivi de progression", community ? "Contenu vérifié par NO LARP" : "Mises à jour incluses"].map((t) => (
                <li key={t} className="flex items-center gap-2.5"><Icon name="check" className="size-4 text-lime" />{t}</li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-faint">
              Aucune promesse de résultat financier. Voir la <Link href="/legal/remboursement" className="underline underline-offset-2 hover:text-fg">politique de remboursement</Link>.
            </p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[#121212]/95 px-5 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="display text-2xl leading-none">{formatPrice(course.price)}</p>
            <p className="mt-1 text-xs text-faint">{formatHours(course.hours)} · {course.level}</p>
          </div>
          <ButtonLink href={`${href}/inscription`} arrow>S&apos;inscrire</ButtonLink>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-x mt-24">
          <h2 className="display text-4xl">Dans le même domaine</h2>
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
        <h2 className="display text-3xl">{title}</h2>
        {aside && <span className="font-mono text-xs text-faint">{aside}</span>}
      </div>
      {children}
    </section>
  );
}
