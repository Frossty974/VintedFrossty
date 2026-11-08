"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { buttonClass, ButtonLink, DemoBadge, RiskNotice } from "@/components/ui/primitives";
import { getCourse, lessonCount } from "@/data/courses";
import { getDomain } from "@/data/domains";
import { useAccountData } from "@/lib/account/useAccountData";
import { downloadSyllabus } from "@/lib/download";

export function CoursePlayer({ slug }: { slug: string }) {
  const course = getCourse(slug)!;
  const domain = getDomain(course.domain)!;
  const { enrollments, progress, setLesson, loading } = useAccountData();
  const flat = useMemo(() => course.modules.flatMap((m, mi) => m.lessons.map((l, li) => ({ key: `${mi}-${li}`, title: l, module: m.title, mi }))), [course]);
  const done = new Set(progress[slug] ?? []);
  const firstTodo = flat.findIndex((l) => !done.has(l.key));
  const [current, setCurrent] = useState<number | null>(null);
  const idx = current ?? (firstTodo === -1 ? 0 : firstTodo);
  const lesson = flat[idx];
  const pct = Math.round((done.size / lessonCount(course)) * 100);

  if (loading) return <div className="container-x grid min-h-[60vh] place-items-center pt-24"><span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-electric" /></div>;

  if (!enrollments.some((e) => e.courseSlug === slug)) {
    return (
      <section className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <h1 className="text-3xl font-bold">Tu n&apos;es pas encore inscrit à cette formation</h1>
        <p className="mt-3 max-w-md text-muted">{course.title}</p>
        <div className="mt-8 flex gap-3">
          <ButtonLink href={`/formations/${slug}/inscription`} arrow>S&apos;inscrire</ButtonLink>
          <ButtonLink href={`/formations/${slug}`} variant="secondary">Voir le programme</ButtonLink>
        </div>
      </section>
    );
  }

  const isDone = done.has(lesson.key);
  const complete = async () => {
    await setLesson(slug, lesson.key, !isDone);
    if (!isDone && idx < flat.length - 1) setCurrent(idx + 1);
  };

  return (
    <div className="container-x pb-10 pt-24 sm:pt-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/espace" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"><Icon name="arrow-left" className="size-4" />Mon espace</Link>
        <div className="flex items-center gap-3">
          <DemoBadge>Aperçu · contenus en production</DemoBadge>
          <button type="button" onClick={() => downloadSyllabus(course)} className={buttonClass("secondary", "sm")}><Icon name="download" className="size-4" />Programme</button>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <div className="relative grid aspect-video place-items-center overflow-hidden rounded-lg border border-line bg-[radial-gradient(ellipse_at_30%_20%,#18214a,#0a0c18_60%)]">
            <div className="grid-bg absolute inset-0 opacity-60" />
            <div className="relative px-6 text-center">
              <Icon name="play" className="mx-auto size-10 text-white/40" />
              <p className="mt-4 text-sm text-muted">La vidéo de cette leçon sera disponible à l&apos;ouverture de la formation.</p>
            </div>
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-wider text-faint">Module {lesson.mi + 1} · {lesson.module}</p>
          <h1 className="mt-2 text-[clamp(1.6rem,3.4vw,2.3rem)] display">{lesson.title}</h1>
          {domain.riskNotice && <div className="mt-6"><RiskNotice compact text="Contenu pédagogique uniquement, pas de conseil en investissement. Risque de perte en capital." /></div>}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={complete} className={buttonClass(isDone ? "secondary" : "primary", "md")}>
              <Icon name="check" className="size-4" />
              {isDone ? "Marquer comme non terminée" : "Marquer comme terminée"}
            </button>
            <button type="button" disabled={idx === 0} onClick={() => setCurrent(idx - 1)} className={buttonClass("ghost", "md")}><Icon name="arrow-left" className="size-4" />Précédente</button>
            <button type="button" disabled={idx === flat.length - 1} onClick={() => setCurrent(idx + 1)} className={buttonClass("ghost", "md")}>Suivante<Icon name="arrow-right" className="size-4" /></button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-line bg-white/[0.02] p-5">
            <p className="font-medium">{course.title}</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-lime transition-all duration-700" style={{ width: `${pct}%` }} /></div>
              <span className="font-mono text-xs text-muted">{pct} %</span>
            </div>
            <ol className="mt-5 grid max-h-[60vh] gap-4 overflow-y-auto pr-1">
              {course.modules.map((m, mi) => (
                <li key={m.title}>
                  <p className="text-xs font-medium text-faint">{mi + 1}. {m.title}</p>
                  <ul className="mt-2 grid gap-0.5">
                    {m.lessons.map((l, li) => {
                      const key = `${mi}-${li}`;
                      const i = flat.findIndex((x) => x.key === key);
                      const active = i === idx;
                      return (
                        <li key={key}>
                          <button type="button" onClick={() => setCurrent(i)} aria-current={active ? "step" : undefined} className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition ${active ? "bg-white/[0.06] text-fg" : "text-muted hover:text-fg"}`}>
                            <span className={`grid size-4 shrink-0 place-items-center rounded-full border ${done.has(key) ? "border-transparent bg-ok text-ink" : "border-line-strong"}`}>{done.has(key) && <Icon name="check" className="size-3" strokeWidth={2.5} />}</span>
                            {l}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
