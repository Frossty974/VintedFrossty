"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FindPathButton } from "@/components/orientation/FindPathButton";
import { FormMessage } from "@/components/forms/Field";
import { Icon } from "@/components/ui/Icon";
import { buttonClass, ButtonLink, DemoBadge, Eyebrow } from "@/components/ui/primitives";
import { getCourse, lessonCount } from "@/data/courses";
import { useAccount } from "@/lib/account/AccountProvider";
import { useAccountData } from "@/lib/account/useAccountData";
import { downloadSyllabus } from "@/lib/download";
import { getTrack } from "@/lib/orientation/tracks";

export function Dashboard() {
  const router = useRouter();
  const { backend } = useAccount();
  const { user, loading, error, quiz, enrollments, progress } = useAccountData();
  if (!user) return null;

  const enrolled = enrollments.map((e) => ({ e, course: getCourse(e.courseSlug) })).filter((x) => x.course);
  const doneLessons = Object.values(progress).reduce((s, l) => s + l.length, 0);
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const signOut = async () => {
    await backend.signOut();
    router.push("/");
  };

  return (
    <div className="container-x pb-10 pt-28 sm:pt-36">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Espace personnel</Eyebrow>
          <h1 className="mt-4 text-[clamp(2rem,4.6vw,3.2rem)] font-semibold tracking-[-0.04em]">Bonjour {user.name}.</h1>
          <p className="mt-2 text-muted">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {backend.mode === "demo" && <DemoBadge>Mode démo · données locales</DemoBadge>}
          <button type="button" onClick={signOut} className={buttonClass("secondary", "sm")}><Icon name="logout" className="size-4" />Déconnexion</button>
        </div>
      </div>

      {error && <div className="mt-6"><FormMessage tone="error">{error}</FormMessage></div>}

      <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
        {[
          { k: "Formations", v: enrolled.length },
          { k: "Leçons terminées", v: doneLessons },
          { k: "Questionnaires", v: quiz.length },
        ].map((s) => (
          <div key={s.k} className="bg-ink p-5">
            <dt className="text-xs text-faint sm:text-sm">{s.k}</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{loading ? "—" : s.v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="mes-formations">
          <h2 id="mes-formations" className="text-xl font-semibold tracking-tight">Mes formations</h2>
          {enrolled.length === 0 && !loading ? (
            <div className="mt-5 rounded-3xl border border-dashed border-line-strong p-8 text-center">
              <p className="text-muted">Tu ne suis encore aucune formation.</p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="/formations" size="sm" arrow>Explorer le catalogue</ButtonLink>
              </div>
            </div>
          ) : (
            <ul className="mt-5 grid gap-3">
              {enrolled.map(({ e, course }) => {
                const c = course!;
                const total = lessonCount(c);
                const done = (progress[c.slug] ?? []).length;
                const pct = Math.round((done / total) * 100);
                return (
                  <li key={c.slug} className="rounded-2xl border border-line bg-white/[0.02] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <Link href={`/espace/formations/${c.slug}`} className="font-medium hover:text-[#9db4ff]">{c.title}</Link>
                        <p className="mt-1 text-xs text-faint">{e.status === "preview" ? "Accès aperçu" : "Formation achetée"} · depuis le {fmt(e.enrolledAt)}</p>
                      </div>
                      <span className="font-mono text-sm text-muted">{pct} %</span>
                    </div>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progression ${c.title}`}>
                      <div className="h-full rounded-full bg-[linear-gradient(90deg,#4c7dff,#8b6cff,#3fd0e8)] transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <ButtonLink href={`/espace/formations/${c.slug}`} size="sm" variant="secondary">{done ? "Continuer" : "Commencer"}</ButtonLink>
                      <button type="button" onClick={() => downloadSyllabus(c)} className={buttonClass("ghost", "sm")}><Icon name="download" className="size-4" />Programme</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-labelledby="historique">
          <div className="flex items-center justify-between">
            <h2 id="historique" className="text-xl font-semibold tracking-tight">Mes orientations</h2>
            <FindPathButton size="sm" variant="ghost">Refaire</FindPathButton>
          </div>
          {quiz.length === 0 && !loading ? (
            <div className="mt-5 rounded-3xl border border-dashed border-line-strong p-8 text-center">
              <p className="text-muted">Aucun questionnaire pour l&apos;instant.</p>
              <div className="mt-5 flex justify-center"><FindPathButton size="sm" /></div>
            </div>
          ) : (
            <ul className="mt-5 grid gap-3">
              {quiz.map((q) => (
                <li key={q.id}>
                  <Link href={`/orientation/resultats?r=${q.code}`} className="block rounded-2xl border border-line bg-white/[0.02] p-5 transition hover:border-line-strong">
                    <p className="text-xs text-faint">{fmt(q.createdAt)}</p>
                    <ol className="mt-3 grid gap-1.5 text-sm">
                      {q.top.map((t, i) => (
                        <li key={t.trackId} className="flex justify-between gap-3">
                          <span className={i === 0 ? "text-fg" : "text-muted"}>{i + 1}. {getTrack(t.trackId)?.name ?? t.trackId}</span>
                          <span className="font-mono text-muted">{t.score} %</span>
                        </li>
                      ))}
                    </ol>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
