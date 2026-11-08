"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FormMessage } from "@/components/forms/Field";
import { Icon } from "@/components/ui/Icon";
import { buttonClass, ButtonLink } from "@/components/ui/primitives";
import { getCourse } from "@/data/courses";
import { getDomain } from "@/data/domains";
import type { Course } from "@/data/types";
import { useAccount } from "@/lib/account/AccountProvider";
import { courseHref } from "@/lib/community/types";
import { useCommunityCourses } from "@/lib/community/useCommunity";
import { addDays, POPULARITY_WEIGHTS, rank, weekStart, type RankRow } from "@/lib/ranking";
import { CertifiedBadge } from "./CertifiedBadge";

const fmtDay = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

function Movement({ row }: { row: RankRow }) {
  if (row.previousRank === null) return <span className="bg-lime px-1.5 py-0.5 font-display text-xs uppercase text-[#121212]">Nouveau</span>;
  const diff = row.previousRank - row.rank;
  if (diff === 0) return <span className="font-display text-lg text-faint" aria-label="Même place">=</span>;
  return (
    <span className={`font-display text-lg ${diff > 0 ? "text-lime" : "text-red"}`} aria-label={diff > 0 ? `Gagne ${diff} place${diff > 1 ? "s" : ""}` : `Perd ${-diff} place${diff < -1 ? "s" : ""}`}>
      {diff > 0 ? "▲" : "▼"} {Math.abs(diff)}
    </span>
  );
}

export function RankingBoard({ compact = false }: { compact?: boolean }) {
  const { backend, mode } = useAccount();
  const { list: community } = useCommunityCourses();
  const [offset, setOffset] = useState(0); // 0 = cette semaine, -1 = semaine dernière
  const [rows, setRows] = useState<RankRow[] | null>(null);
  const [error, setError] = useState(false);

  const start = useMemo(() => addDays(weekStart(), offset * 7), [offset]);

  useEffect(() => {
    let alive = true;
    setRows(null);
    Promise.all([backend.weekCounts(start), backend.weekCounts(addDays(start, -7))])
      .then(([cur, prev]) => alive && setRows(rank(cur, prev)))
      .catch(() => alive && (setError(true), setRows([])));
    return () => {
      alive = false;
    };
  }, [backend, start]);

  const resolve = (slug: string): Course | undefined => getCourse(slug) ?? community.find((c) => c.slug === slug);
  const visible = (rows ?? []).map((r) => ({ r, c: resolve(r.slug) })).filter((x): x is { r: RankRow; c: Course } => Boolean(x.c));
  const shown = compact ? visible.slice(0, 5) : visible;

  return (
    <div>
      {!compact && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2" role="tablist" aria-label="Semaine">
            {[0, -1].map((o) => (
              <button key={o} role="tab" aria-selected={offset === o} onClick={() => setOffset(o)} className={`rounded-md border-2 px-4 py-2 font-display text-lg uppercase ${offset === o ? "border-lime bg-lime text-[#121212]" : "border-line-strong text-fg/80 hover:border-fg"}`}>
                {o === 0 ? "Cette semaine" : "Semaine dernière"}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">Du {fmtDay(start)} au {fmtDay(addDays(start, 6))}</p>
        </div>
      )}
      {mode === "demo" && !compact && (
        <div className="mt-5"><FormMessage tone="info">Mode démo : le classement ne compte que l&apos;activité de ce navigateur. Il deviendra public dès que la base de données sera connectée.</FormMessage></div>
      )}
      {error && <div className="mt-5"><FormMessage tone="error">Classement indisponible pour le moment.</FormMessage></div>}

      {rows === null ? (
        <div className="grid min-h-40 place-items-center"><span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-lime" /></div>
      ) : shown.length === 0 ? (
        <div className={`${compact ? "mt-8" : "mt-8"} rounded-md border-2 border-dashed border-line-strong p-8 text-center`}>
          <p className="display text-3xl">Le classement se remplit au fil de la semaine.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">Aucune activité enregistrée pour l&apos;instant. Pas de faux chiffres ici : seulement de vraies visites, inscriptions et leçons terminées.</p>
          <ButtonLink href="/formations" variant="secondary" className="mt-6" arrow>Explorer les formations</ButtonLink>
        </div>
      ) : (
        <>
          {!compact && shown.length >= 3 && (
            <ol className="mt-10 grid items-end gap-6 sm:grid-cols-3" aria-label="Podium">
              {[1, 0, 2].map((i) => {
                const { r, c } = shown[i];
                return (
                  <li key={r.slug} className={`${i === 0 ? "sm:order-2" : i === 1 ? "sm:order-1" : "sm:order-3"}`}>
                    <Link href={courseHref(c)} className={`paper tape block p-6 pt-8 transition-transform hover:-translate-y-1 ${i === 0 ? "sm:pb-14" : ""}`} style={{ rotate: `${[-1.5, 1, -0.6][i]}deg` }}>
                      <span className={`display block leading-none ${i === 0 ? "text-8xl text-[#171717]" : "text-6xl text-[#171717]/80"}`}>#{r.rank}</span>
                      <span className="mt-3 block text-lg font-extrabold leading-tight text-[#171717]">{c.title}</span>
                      <span className="mt-2 block text-xs font-semibold text-[#171717]/60">{r.score} pts · {getDomain(c.domain)?.name}</span>
                      {c.community && <span className="mt-3 block"><CertifiedBadge size="sm" /></span>}
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}

          <ol className={`${compact ? "mt-8" : "mt-12"} grid gap-px border-2 border-line-strong bg-line-strong`}>
            {(compact ? shown : shown.slice(shown.length >= 3 ? 3 : 0)).map(({ r, c }) => (
              <li key={r.slug} className="bg-ink">
                <Link href={courseHref(c)} className="grid grid-cols-[3.2rem_1fr_auto] items-center gap-4 p-4 transition-colors hover:bg-panel sm:grid-cols-[4rem_1fr_auto_auto] sm:p-5">
                  <span className={`display text-4xl ${r.rank <= 3 ? "text-lime" : "text-fg"}`}>#{r.rank}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold">{c.title}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-faint">
                      {getDomain(c.domain)?.name}
                      {c.community ? <CertifiedBadge size="sm" /> : <span>NO LARP</span>}
                      {!compact && <span>{r.views} vue{r.views > 1 ? "s" : ""} · {r.enrollments} inscription{r.enrollments > 1 ? "s" : ""} · {r.lessons} leçon{r.lessons > 1 ? "s" : ""} terminée{r.lessons > 1 ? "s" : ""}</span>}
                    </span>
                  </span>
                  <span className="hidden text-right sm:block"><Movement row={r} /></span>
                  <span className="text-right">
                    <span className="display block text-2xl leading-none">{r.score}</span>
                    <span className="text-[0.7rem] uppercase tracking-wide text-faint">pts</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}

      {!compact && (
        <div className="mt-10 grid gap-4 rounded-md border border-line p-6 text-sm text-muted sm:grid-cols-[auto_1fr] sm:items-center">
          <p className="display text-2xl text-fg">Comment c&apos;est calculé</p>
          <p>
            Score = visites × {POPULARITY_WEIGHTS.view} + inscriptions × {POPULARITY_WEIGHTS.enroll} + leçons terminées × {POPULARITY_WEIGHTS.lesson}. Une visite = un visiteur unique par jour. Remise à zéro chaque lundi. Aucun classement acheté, aucun chiffre gonflé. Le prix n&apos;entre pas en compte.
          </p>
        </div>
      )}
      {compact && (
        <div className="mt-6 flex justify-end">
          <Link href="/classement" className={buttonClass("secondary", "md")}>Classement complet <Icon name="arrow-right" className="size-4" /></Link>
        </div>
      )}
    </div>
  );
}
