"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { accentText, buttonClass, Eyebrow, formatBudget } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { getCourse } from "@/data/courses";
import { getDomain } from "@/data/domains";
import { localQuiz } from "@/lib/account/backend";
import { useAccount } from "@/lib/account/AccountProvider";
import type { OrientationResult, TrackResult, Warning } from "@/lib/orientation/engine";
import { optionLabel, type Answers } from "@/lib/orientation/questions";
import { useOrientation } from "./OrientationProvider";
import { ScoreRing } from "./ScoreRing";

export function ResultsView({ code, answers, result }: { code: string; answers: Answers; result: OrientationResult }) {
  const { user, backend, ready } = useAccount();
  const { open } = useOrientation();
  const [showPath, setShowPath] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saved" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const pathRef = useRef<HTMLDivElement>(null);
  const { profile, ranking, path } = result;
  const top = ranking.slice(0, 3);
  const others = ranking.slice(3);

  // Enregistre le résultat : dans le compte si connecté, sinon dans le navigateur.
  useEffect(() => {
    if (!ready) return;
    const rec = { code, top: top.map((t) => ({ trackId: t.track.id, score: t.score })) };
    localQuiz.save(rec);
    if (user && backend.mode === "supabase") {
      backend.saveQuiz(rec).then(() => setSaved("saved"), () => setSaved("error"));
    } else if (user) setSaved("saved");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user, code]);

  const revealPath = () => {
    setShowPath(true);
    window.setTimeout(() => pathRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  const totalWeeks = path.slice(0, 4).reduce((s, p) => s + p.weeks, 0);

  return (
    <>
      {/* En-tête */}
      <section className="relative overflow-hidden pb-12 pt-28 sm:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="grid-bg absolute inset-0 opacity-60" />
        </div>
        <div className="container-x relative">
          <Reveal>
            <Eyebrow>Tes résultats</Eyebrow>
            <h1 className="mt-5 max-w-4xl text-[clamp(2.2rem,5.4vw,4rem)] display text-gradient text-balance">
              Nous avons identifié les domaines qui pourraient te correspondre.
            </h1>
            <p className="mt-6 max-w-2xl text-muted">
              Les pourcentages représentent un <strong className="font-medium text-fg">score de compatibilité</strong> entre ton profil et les exigences de chaque domaine. Ils ne mesurent pas tes chances de réussite.{" "}
              <Link href="/methode" className="text-lime underline-offset-4 hover:underline">Comment c&apos;est calculé</Link>
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-x">
        {/* Profil */}
        <Reveal immediate delay={0.1}>
          <div className="ring-gradient grid gap-8 rounded-lg bg-night p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr_1fr]">
            <div>
              <p className="eyebrow">Ton profil</p>
              <p className="mt-3 text-3xl display">
                <span className="text-accent">{profile.archetype}</span>
              </p>
              <p className="mt-3 leading-relaxed text-muted">{profile.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                <Tag>{optionLabel("age", answers.age)}</Tag>
                <Tag>Niveau : {optionLabel("level", answers.level).toLowerCase()}</Tag>
                <Tag>Résultats visés : {optionLabel("horizon", answers.horizon).toLowerCase()}</Tag>
              </div>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-ok"><Icon name="spark" className="size-4" />Tes points forts</p>
              <ul className="mt-4 grid gap-3">
                {profile.strengths.map((s) => <li key={s} className="flex gap-2.5 text-sm leading-relaxed text-fg/85"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-ok" />{s}</li>)}
              </ul>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-warn"><Icon name="flag" className="size-4" />Tes contraintes</p>
              <ul className="mt-4 grid gap-3">
                {profile.constraints.length ? profile.constraints.map((s) => <li key={s} className="flex gap-2.5 text-sm leading-relaxed text-fg/85"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-warn" />{s}</li>) : <li className="text-sm text-muted">Aucune contrainte forte identifiée.</li>}
              </ul>
            </div>
            <div className="rounded-md border border-line bg-white/[0.02] p-5 lg:col-span-3">
              <p className="text-sm font-medium">Notre conseil face à ta difficulté : « {optionLabel("difficulty", answers.difficulty).toLowerCase()} »</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{profile.advice}</p>
            </div>
          </div>
        </Reveal>

        {/* Top 3 */}
        <h2 className="mt-20 text-[clamp(1.7rem,3.4vw,2.4rem)] display">Les trois domaines les plus adaptés</h2>
        <div className="mt-8 grid gap-5">
          {top.map((t, i) => <TrackCard key={t.track.id} result={t} rank={i + 1} delay={i * 0.12} />)}
        </div>

        {/* Autres */}
        <Reveal>
          <div className="mt-12 rounded-lg border border-line p-6 sm:p-8">
            <h2 className="text-lg font-bold">Les autres domaines analysés</h2>
            <ul className="mt-6 grid gap-5">
              {others.map((o) => (
                <li key={o.track.id}>
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-fg/85">{o.track.name}{o.warnings.some((w) => w.kind !== "risk") && <span className="ml-2 text-xs text-warn">· contraintes signalées</span>}</span>
                    <span className="font-mono text-muted">{o.score} %</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div className="h-full rounded-full bg-white/25" initial={{ width: 0 }} whileInView={{ width: `${o.score}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
                  </div>
                  {o.warnings.filter((w) => w.kind === "age" || w.kind === "budget").map((w) => <p key={w.kind} className="mt-2 text-xs leading-relaxed text-faint">{w.text}</p>)}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Actions */}
        <div className="mt-14 flex flex-col items-center gap-5 text-center">
          {!showPath && (
            <button type="button" onClick={revealPath} className={buttonClass("primary", "lg")}>
              Découvrir le parcours recommandé
              <Icon name="arrow-right" className="size-4 rotate-90" />
            </button>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={share} className={buttonClass("secondary", "sm")}>
              <Icon name={copied ? "check" : "route"} className="size-4" />
              {copied ? "Lien copié" : "Copier le lien de mes résultats"}
            </button>
            <button type="button" onClick={open} className={buttonClass("ghost", "sm")}>
              <Icon name="refresh" className="size-4" /> Refaire le questionnaire
            </button>
          </div>
          {ready && (
            <p className="text-sm text-faint">
              {user ? (saved === "error" ? "Impossible d'enregistrer dans ton espace pour le moment." : <>Résultat enregistré dans <Link href="/espace" className="text-lime hover:underline">ton espace</Link>.</>) : <>Résultat conservé sur cet appareil. <Link href="/inscription" className="text-lime hover:underline">Crée un compte</Link> pour le retrouver partout.</>}
            </p>
          )}
        </div>

        {/* Parcours */}
        <AnimatePresence>
          {showPath && (
            <motion.section ref={pathRef} id="parcours" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mt-16 scroll-mt-24">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Eyebrow>Parcours recommandé</Eyebrow>
                  <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.4rem)] display">{top[0].track.name}</h2>
                </div>
                <p className="text-sm text-muted">Environ <strong className="text-fg">{totalWeeks} semaines</strong> jusqu&apos;au premier projet, à {profile.weeklyHours} h par semaine.</p>
              </div>
              <ol className="relative mt-10 grid gap-4">
                <span className="absolute bottom-8 left-[27px] top-8 w-px bg-gradient-to-b from-electric/60 via-violet/40 to-cyan/30" aria-hidden="true" />
                {path.map((p, i) => (
                  <motion.li key={p.title} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }} className="relative flex gap-5">
                    <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-md border border-line-strong bg-night font-mono text-sm text-lime">{i + 1}</span>
                    <div className="flex-1 rounded-md border border-line bg-white/[0.02] p-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-bold">{p.title}</h3>
                        <span className="font-mono text-xs text-faint">{i === 4 ? "En continu" : `≈ ${p.weeks} semaine${p.weeks > 1 ? "s" : ""}`}</span>
                      </div>
                      <p className="mt-1.5 text-sm text-muted">{p.description}</p>
                      <p className="mt-3 flex gap-2 text-sm"><Icon name="arrow-right" className="mt-0.5 size-4 shrink-0 text-cyan" />{p.action}</p>
                      {p.courses.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {p.courses.map((slug) => {
                            const c = getCourse(slug);
                            return c ? <Link key={slug} href={`/formations/${slug}`} className="rounded-full border border-line-strong px-3 py-1 text-xs text-muted transition hover:border-electric/50 hover:text-fg">{c.title}</Link> : null;
                          })}
                        </div>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-faint">Ce parcours est utilisable sans acheter nos formations : les étapes de pratique et de projet se réalisent avec des ressources gratuites.</p>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-line px-2.5 py-1 text-muted">{children}</span>;
}

const warnStyle: Record<Warning["kind"], string> = {
  risk: "border-risk/25 bg-risk/[0.06] text-red",
  age: "border-risk/25 bg-risk/[0.06] text-red",
  budget: "border-warn/25 bg-warn/[0.06] text-fg/85",
  time: "border-warn/20 bg-warn/[0.04] text-fg/85",
  horizon: "border-warn/20 bg-warn/[0.04] text-fg/85",
};

function TrackCard({ result, rank, delay }: { result: TrackResult; rank: number; delay: number }) {
  const { track: t, score, reasons, warnings } = result;
  const domain = getDomain(t.domain)!;
  return (
    <Reveal delay={0.2 + delay} immediate>
      <article className={`overflow-hidden rounded-lg border ${rank === 1 ? "ring-gradient border-transparent bg-night" : "border-line bg-white/[0.015]"}`}>
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[auto_1fr_1fr]">
          <div className="flex items-center gap-5 lg:flex-col lg:items-start">
            <ScoreRing score={score} size={rank === 1 ? 128 : 108} delay={delay} />
            <div>
              <p className="font-mono text-xs text-faint">#{rank} · compatibilité</p>
              <p className={`mt-1 inline-flex items-center gap-1.5 text-xs ${accentText[domain.accent]}`}><Icon name={domain.icon} className="size-3.5" />{domain.name}</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl display">{t.name}</h3>
            <p className="mt-2 text-muted">{t.pitch}</p>
            <p className="mt-6 text-sm font-medium">Pourquoi ça te correspond</p>
            <ul className="mt-3 grid gap-2.5">
              {reasons.map((r) => <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-fg/85"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-cyan" />{r}</li>)}
            </ul>
            <p className="mt-6 text-sm font-medium">Compétences à acquérir</p>
            <div className="mt-3 flex flex-wrap gap-2">{t.skills.map((s) => <span key={s} className="rounded-full border border-line-strong px-3 py-1 text-xs">{s}</span>)}</div>
          </div>
          <div className="grid content-start gap-4">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line text-sm">
              <div className="bg-[#171717] p-4"><dt className="text-xs text-faint">Pour débuter</dt><dd className="mt-1">{t.startTime}</dd></div>
              <div className="bg-[#171717] p-4"><dt className="text-xs text-faint">Budget indicatif</dt><dd className="mt-1">{formatBudget(t.minBudget, t.comfortBudget)}</dd></div>
              <div className="col-span-2 bg-[#171717] p-4"><dt className="text-xs text-faint">Premiers résultats</dt><dd className="mt-1">{t.firstResultLabel}</dd></div>
            </dl>
            <div>
              <p className="text-xs text-faint">Difficultés potentielles</p>
              <ul className="mt-2 grid gap-1.5">{t.challenges.map((c) => <li key={c} className="flex gap-2 text-sm text-muted"><span className="mt-2 size-1 shrink-0 rounded-full bg-faint" />{c}</li>)}</ul>
            </div>
            {warnings.map((w) => (
              <p key={w.kind} role="note" className={`flex gap-2 rounded-md border p-3 text-xs leading-relaxed ${warnStyle[w.kind]}`}>
                <Icon name="alert" className="mt-px size-3.5 shrink-0" />{w.text}
              </p>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-line px-6 py-4 sm:px-8">
          <Link href={`/domaines/${domain.slug}`} className={buttonClass("secondary", "sm")}>Comprendre le domaine</Link>
          <Link href={`/formations/${t.courses[0]}`} className={buttonClass("ghost", "sm")}>Formation de départ <Icon name="arrow-right" className="size-4" /></Link>
        </div>
      </article>
    </Reveal>
  );
}
