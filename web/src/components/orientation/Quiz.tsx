"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/primitives";
import { encodeAnswers, questions, type Answers } from "@/lib/orientation/questions";

type Draft = Partial<Record<keyof Answers, string | string[]>>;

const ease = [0.22, 1, 0.36, 1] as const;

export function Quiz({ onClose, variant = "modal" }: { onClose?: () => void; variant?: "modal" | "page" }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(-1); // -1 = introduction
  const [dir, setDir] = useState(1);
  const [draft, setDraft] = useState<Draft>({});
  const [analyzing, setAnalyzing] = useState(false);
  const advanceTimer = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const total = questions.length;
  const q = step >= 0 ? questions[step] : null;
  const value = q ? draft[q.id] : undefined;
  const progress = step < 0 ? 0 : analyzing ? 1 : step / total;

  const go = useCallback((next: number) => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    setDir(next > step ? 1 : -1);
    setStep(next);
  }, [step]);

  const finish = useCallback(
    (final: Draft) => {
      setAnalyzing(true);
      const code = encodeAnswers(final as Answers);
      window.setTimeout(() => {
        router.push(`/orientation/resultats?r=${code}`);
        onClose?.();
      }, reduce ? 200 : 1600);
    },
    [router, onClose, reduce],
  );

  const choose = useCallback(
    (optionId: string) => {
      if (!q || analyzing) return;
      if (q.multiple) {
        const cur = (draft[q.id] as string[] | undefined) ?? [];
        let next: string[];
        if (optionId === q.exclusive) next = cur.includes(optionId) ? [] : [optionId];
        else next = cur.includes(optionId) ? cur.filter((x) => x !== optionId) : [...cur.filter((x) => x !== q.exclusive), optionId];
        setDraft({ ...draft, [q.id]: next });
        return;
      }
      const nextDraft = { ...draft, [q.id]: optionId };
      setDraft(nextDraft);
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
      advanceTimer.current = window.setTimeout(() => {
        if (step === total - 1) finish(nextDraft);
        else go(step + 1);
      }, 260);
    },
    [q, draft, step, total, go, finish, analyzing],
  );

  const canContinue = q ? (q.multiple ? ((value as string[] | undefined)?.length ?? 0) > 0 : Boolean(value)) : true;

  const next = useCallback(() => {
    if (step < 0) return go(0);
    if (!canContinue) return;
    if (step === total - 1) finish(draft);
    else go(step + 1);
  }, [step, canContinue, total, finish, draft, go]);

  // Clavier : chiffres pour choisir, Entrée pour continuer, flèche gauche pour revenir.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (analyzing) return;
      if (e.key === "Escape" && onClose) return onClose();
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (q && /^[1-9]$/.test(e.key)) {
        const opt = q.options[Number(e.key) - 1];
        if (opt) choose(opt.id);
      } else if (e.key === "Enter" && (step < 0 || q?.multiple)) {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" && step > 0) {
        go(step - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, step, choose, next, go, onClose, analyzing]);

  // Place le focus sur le premier élément pertinent à chaque écran.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = panelRef.current?.querySelector<HTMLElement>("[data-autofocus]");
      el?.focus({ preventScroll: true });
    }, 60);
    return () => window.clearTimeout(t);
  }, [step, analyzing]);

  useEffect(() => () => { if (advanceTimer.current) window.clearTimeout(advanceTimer.current); }, []);

  const variants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 40, filter: "blur(4px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -40, filter: "blur(4px)" }),
  };

  return (
    <div ref={panelRef} className={`relative flex h-full flex-col ${variant === "page" ? "min-h-[620px]" : ""}`}>
      {/* En-tête */}
      <div className="flex items-center gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
        <button
          type="button"
          onClick={() => go(step - 1)}
          disabled={step <= 0 || analyzing}
          className="grid size-9 place-items-center rounded-full border border-line text-muted transition hover:border-line-strong hover:text-fg disabled:invisible"
          aria-label="Question précédente"
        >
          <Icon name="arrow-left" className="size-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint">
            <span>Trouver ma voie</span>
            <span aria-live="polite">{step < 0 ? "10 questions · 2 min" : analyzing ? "Analyse" : `${String(step + 1).padStart(2, "0")} / ${total}`}</span>
          </div>
          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/[0.06]" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step < 0 ? 0 : step} aria-label="Progression du questionnaire">
            <motion.div className="h-full rounded-full bg-lime" animate={{ width: `${Math.max(progress * 100, step < 0 ? 0 : 3)}%` }} transition={{ duration: 0.6, ease }} />
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full border border-line text-muted transition hover:border-line-strong hover:text-fg" aria-label="Fermer le questionnaire">
            <Icon name="close" className="size-4" />
          </button>
        )}
      </div>

      {/* Contenu */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden px-5 pb-6 pt-8 sm:px-8 sm:pt-10">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          {analyzing ? (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
              <Analyzing />
            </motion.div>
          ) : step < 0 ? (
            <motion.div key="intro" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease }}>
              <Intro onStart={() => go(0)} />
            </motion.div>
          ) : (
            q && (
              <motion.fieldset key={q.id} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease }} className="min-w-0">
                <legend className="text-[clamp(1.5rem,3.6vw,2.15rem)] display text-balance">{q.title}</legend>
                {q.help && <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{q.help}</p>}
                <div className="mt-7 grid gap-2.5" role={q.multiple ? "group" : "radiogroup"} aria-label={q.title}>
                  {q.options.map((o, i) => {
                    const selected = q.multiple ? ((value as string[] | undefined) ?? []).includes(o.id) : value === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        role={q.multiple ? "checkbox" : "radio"}
                        aria-checked={selected}
                        data-autofocus={i === 0 ? true : undefined}
                        onClick={() => choose(o.id)}
                        className={`group/opt relative flex min-h-14 w-full items-center gap-4 rounded-md border px-4 py-3 text-left transition-all duration-300 ${
                          selected
                            ? "border-electric/60 bg-electric/[0.1]"
                            : "border-line bg-white/[0.02] hover:border-line-strong hover:bg-white/[0.045]"
                        }`}
                      >
                        <span className={`grid size-7 shrink-0 place-items-center rounded-lg border font-mono text-xs transition ${selected ? "border-transparent bg-lime text-[#121212]" : "border-line-strong text-faint group-hover/opt:text-muted"}`}>
                          {selected ? <Icon name="check" className="size-3.5" strokeWidth={2.2} /> : i + 1}
                        </span>
                        <span className={`text-[0.98rem] ${selected ? "text-fg" : "text-fg/85"}`}>{o.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.fieldset>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Pied */}
      {!analyzing && step >= 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-8">
          <p className="hidden text-xs text-faint sm:block">
            Raccourcis : <kbd className="font-mono">1</kbd>–<kbd className="font-mono">{q?.options.length}</kbd> pour choisir{q?.multiple ? ", Entrée pour continuer" : ""}
          </p>
          <p className="text-xs text-faint sm:hidden">{q?.multiple ? "Plusieurs choix possibles" : "Touche une réponse"}</p>
          {(q?.multiple || value) && (
            <button type="button" onClick={next} disabled={!canContinue} className={buttonClass("primary", "sm")}>
              {step === total - 1 ? "Voir mes résultats" : "Continuer"}
              <Icon name="arrow-right" className="size-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-lg py-4 text-center sm:py-8">
      <div className="relative mx-auto grid size-20 place-items-center">
        <div className="relative grid size-16 place-items-center rounded-md border border-line-strong bg-white/[0.04]">
          <Icon name="compass" className="size-8 text-lime" />
        </div>
      </div>
      <h2 className="mt-8 text-[clamp(1.7rem,4vw,2.4rem)] display">Découvre ce qui te correspond.</h2>
      <p className="mt-4 leading-relaxed text-muted">
        10 questions sur ta situation, tes envies et tes contraintes. Notre algorithme compare ton profil aux exigences réelles de chaque domaine : temps, budget, niveau, type de travail.
      </p>
      <ul className="mx-auto mt-7 grid max-w-sm gap-2.5 text-left text-sm text-muted">
        {["Environ 2 minutes, sans inscription", "Tes réponses restent dans ton navigateur", "Un résultat utile, même sans acheter de formation"].map((t) => (
          <li key={t} className="flex items-center gap-3">
            <Icon name="check" className="size-4 shrink-0 text-cyan" />
            {t}
          </li>
        ))}
      </ul>
      <button type="button" data-autofocus onClick={onStart} className={buttonClass("primary", "lg", "mt-9")}>
        Commencer
        <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

function Analyzing() {
  const steps = ["Intérêts et type de travail", "Temps et budget disponibles", "Niveau et objectifs", "Calcul des compatibilités"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((x) => Math.min(x + 1, steps.length - 1)), 360);
    return () => window.clearInterval(t);
  }, [steps.length]);
  return (
    <>
      <div className="relative size-24">
        <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-electric border-r-violet [animation-duration:1.4s]" />
        <div className="absolute inset-3 animate-spin rounded-full border border-transparent border-b-cyan [animation-direction:reverse] [animation-duration:2s]" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="size-3 rounded-full bg-white" />
        </div>
      </div>
      <p className="mt-8 text-xl font-bold">Analyse de ton profil</p>
      <ul className="mt-5 grid gap-2 text-sm" aria-live="polite">
        {steps.map((s, j) => (
          <li key={s} className={`flex items-center justify-center gap-2 transition-colors duration-300 ${j <= i ? "text-fg/90" : "text-faint"}`}>
            <Icon name="check" className={`size-3.5 transition-opacity ${j < i ? "opacity-100 text-ok" : "opacity-0"}`} />
            {s}
          </li>
        ))}
      </ul>
    </>
  );
}
