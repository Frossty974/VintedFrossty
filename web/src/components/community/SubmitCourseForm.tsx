"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Checkbox, FormMessage } from "@/components/forms/Field";
import { Icon } from "@/components/ui/Icon";
import { buttonClass, ButtonLink, formatHours } from "@/components/ui/primitives";
import { domains } from "@/data/domains";
import type { Level } from "@/data/types";
import { useAccount } from "@/lib/account/AccountProvider";
import { precheck } from "@/lib/community/precheck";
import { totalHours, type CourseContent } from "@/lib/community/types";
import { courseSubmissionSchema, submissionCommitmentsSchema, toPathErrors, type FieldErrors } from "@/lib/validation";

const empty: CourseContent = {
  title: "",
  subtitle: "",
  domain: "",
  level: "Débutant",
  price: 0,
  presentation: "",
  objectives: ["", ""],
  skills: ["", ""],
  prerequisites: "",
  startBudget: { min: 0, max: 0, note: "" },
  modules: [
    { title: "", hours: 1, lessons: [""] },
    { title: "", hours: 1, lessons: [""] },
  ],
  resources: [],
};

const input = "w-full rounded-md border bg-ink px-3.5 text-[0.95rem] text-fg placeholder:text-faint focus:outline-none";
const border = (err?: string) => (err ? "border-red focus:border-red" : "border-line-strong focus:border-lime");

function Err({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1.5 text-xs text-red">{msg}</p> : null;
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="mb-2 flex items-baseline justify-between gap-3">
      <span className="text-sm font-semibold">{children}</span>
      {hint && <span className="text-xs text-faint">{hint}</span>}
    </span>
  );
}

function ListEditor({ label, hint, items, onChange, errors, path, placeholder, min = 0, max = 10 }: {
  label: string; hint?: string; items: string[]; onChange: (v: string[]) => void; errors: FieldErrors; path: string; placeholder: string; min?: number; max?: number;
}) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <ul className="grid gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <div className="flex-1">
              <input aria-label={`${label} ${i + 1}`} value={it} placeholder={placeholder} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} className={`${input} ${border(errors[`${path}.${i}`])} h-11`} />
              <Err msg={errors[`${path}.${i}`]} />
            </div>
            {items.length > min && (
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="grid size-11 shrink-0 place-items-center rounded-md border border-line-strong text-muted hover:text-red" aria-label={`Retirer ${label.toLowerCase()} ${i + 1}`}>
                <Icon name="close" className="size-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <Err msg={errors[path]} />
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, ""])} className="mt-2 text-sm font-semibold text-lime hover:underline">+ Ajouter</button>
      )}
    </div>
  );
}

export function SubmitCourseForm() {
  const { user, ready, backend } = useAccount();
  const params = useSearchParams();
  const editId = params.get("modifier");
  const [c, setC] = useState<CourseContent>(empty);
  const [commit, setCommit] = useState({ original: false, noPromise: false, accuracy: false });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(Boolean(editId));

  useEffect(() => {
    if (!editId || !user) return;
    backend
      .getCommunityCourse(editId)
      .then((cc) => {
        if (cc && cc.authorId === user.id && (cc.status === "pending" || cc.status === "changes")) setC(cc.content);
        else setStatus({ tone: "error", text: "Cette formation ne peut pas être modifiée." });
      })
      .finally(() => setLoadingEdit(false));
  }, [editId, user, backend]);

  const flags = useMemo(() => precheck(c), [c]);
  const hours = totalHours(c.modules);
  const set = <K extends keyof CourseContent>(k: K, v: CourseContent[K]) => setC((x) => ({ ...x, [k]: v }));
  const setModule = (i: number, patch: Partial<CourseContent["modules"][number]>) => set("modules", c.modules.map((m, j) => (j === i ? { ...m, ...patch } : m)));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean: CourseContent = {
      ...c,
      objectives: c.objectives.map((x) => x.trim()).filter(Boolean),
      skills: c.skills.map((x) => x.trim()).filter(Boolean),
      resources: c.resources.map((x) => x.trim()).filter(Boolean),
      modules: c.modules.map((m) => ({ ...m, lessons: m.lessons.map((l) => l.trim()).filter(Boolean) })),
    };
    const parsed = courseSubmissionSchema.safeParse(clean);
    const parsedCommit = submissionCommitmentsSchema.safeParse(commit);
    const errs: FieldErrors = { ...(parsed.success ? {} : toPathErrors(parsed.error)), ...(parsedCommit.success ? {} : toPathErrors(parsedCommit.error)) };
    if (flags.some((f) => f.level === "block")) errs.form = "Ton contenu contient des formulations interdites par la charte (voir le pré-contrôle).";
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus({ tone: "error", text: "Certains champs sont à corriger." });
      window.setTimeout(() => document.querySelector("[aria-invalid='true'], .text-red")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      await backend.submitCourse(parsed.data as CourseContent, editId ?? undefined);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus({ tone: "error", text: err instanceof Error ? err.message : "Envoi impossible." });
    } finally {
      setBusy(false);
    }
  }

  if (!ready || loadingEdit) return <div className="grid min-h-[30vh] place-items-center"><span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-lime" /></div>;

  if (!user) {
    return (
      <div className="rounded-lg border-2 border-line-strong p-8 text-center">
        <p className="display text-4xl">Connecte-toi pour proposer ta formation.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/inscription?suite=%2Fproposer" arrow>Créer un compte</ButtonLink>
          <ButtonLink href="/connexion?suite=%2Fproposer" variant="secondary">Se connecter</ButtonLink>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="lime-block torn px-8 py-14 text-center">
        <p className="display text-6xl text-[#171717]">C&apos;est envoyé.</p>
        <p className="mx-auto mt-4 max-w-md font-semibold text-[#171717]">L&apos;équipe vérifie ta formation. Tu suis son statut et nos retours dans ton espace.</p>
        <Link href="/espace" className="mt-8 inline-flex h-12 items-center rounded-md bg-[#171717] px-6 font-display text-xl uppercase text-lime">Mon espace</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10">
      {editId && <FormMessage tone="info">Tu modifies une formation déjà envoyée. Elle repassera en vérification.</FormMessage>}

      <Section n="01" title="L'essentiel">
        <div className="grid gap-5">
          <label className="block">
            <Label hint="6 à 90 caractères">Titre</Label>
            <input value={c.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex. : Monter ses premières vidéos courtes" aria-invalid={!!errors.title} className={`${input} ${border(errors.title)} h-12`} />
            <Err msg={errors.title} />
          </label>
          <label className="block">
            <Label hint="Une phrase">Sous-titre</Label>
            <input value={c.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Ce que la personne saura faire à la fin." aria-invalid={!!errors.subtitle} className={`${input} ${border(errors.subtitle)} h-12`} />
            <Err msg={errors.subtitle} />
          </label>
          <div className="grid gap-5 sm:grid-cols-3">
            <label className="block">
              <Label>Domaine</Label>
              <select value={c.domain} onChange={(e) => set("domain", e.target.value)} aria-invalid={!!errors.domain} className={`${input} ${border(errors.domain)} h-12`}>
                <option value="">Choisir…</option>
                {domains.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
              <Err msg={errors.domain} />
            </label>
            <label className="block">
              <Label>Niveau</Label>
              <select value={c.level} onChange={(e) => set("level", e.target.value as Level)} className={`${input} ${border()} h-12`}>
                {["Débutant", "Intermédiaire", "Avancé"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label className="block">
              <Label>Prix (€ TTC)</Label>
              <input type="number" min={0} max={2000} step={1} value={c.price} onChange={(e) => set("price", Number(e.target.value))} aria-invalid={!!errors.price} className={`${input} ${border(errors.price)} h-12`} />
              <Err msg={errors.price} />
            </label>
          </div>
          <label className="block">
            <Label hint={`${c.presentation.length} / 2000 · 80 minimum`}>Présentation</Label>
            <textarea value={c.presentation} onChange={(e) => set("presentation", e.target.value)} rows={6} placeholder="À qui s'adresse la formation, ce qu'elle apporte, ce qu'elle ne promet pas." aria-invalid={!!errors.presentation} className={`${input} ${border(errors.presentation)} py-3`} />
            <Err msg={errors.presentation} />
          </label>
        </div>
      </Section>

      <Section n="02" title="Objectifs et compétences">
        <div className="grid gap-8 lg:grid-cols-2">
          <ListEditor label="Objectifs" hint="2 à 8" items={c.objectives} onChange={(v) => set("objectives", v)} errors={errors} path="objectives" placeholder="Ex. : Écrire un script de 30 secondes" min={2} max={8} />
          <ListEditor label="Compétences" hint="2 à 10" items={c.skills} onChange={(v) => set("skills", v)} errors={errors} path="skills" placeholder="Ex. : Montage vidéo" min={2} max={10} />
        </div>
      </Section>

      <Section n="03" title="Programme" aside={`${c.modules.length} modules · ${formatHours(hours)} au total`}>
        <ol className="grid gap-4">
          {c.modules.map((m, i) => (
            <li key={i} className="rounded-md border border-line-strong bg-night p-5">
              <div className="flex items-start gap-3">
                <span className="display mt-1 text-3xl text-lime">{String(i + 1).padStart(2, "0")}</span>
                <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_120px]">
                  <div>
                    <input aria-label={`Titre du module ${i + 1}`} value={m.title} placeholder="Titre du module" onChange={(e) => setModule(i, { title: e.target.value })} className={`${input} ${border(errors[`modules.${i}.title`])} h-11`} />
                    <Err msg={errors[`modules.${i}.title`]} />
                  </div>
                  <div>
                    <input aria-label={`Durée du module ${i + 1} en heures`} type="number" min={0.25} max={40} step={0.25} value={m.hours} onChange={(e) => setModule(i, { hours: Number(e.target.value) })} className={`${input} ${border(errors[`modules.${i}.hours`])} h-11`} />
                    <Err msg={errors[`modules.${i}.hours`]} />
                  </div>
                </div>
                {c.modules.length > 2 && (
                  <button type="button" onClick={() => set("modules", c.modules.filter((_, j) => j !== i))} className="grid size-11 shrink-0 place-items-center rounded-md border border-line-strong text-muted hover:text-red" aria-label={`Supprimer le module ${i + 1}`}>
                    <Icon name="close" className="size-4" />
                  </button>
                )}
              </div>
              <div className="mt-4 sm:pl-11">
                <ListEditor label="Leçons" hint="1 à 15" items={m.lessons} onChange={(v) => setModule(i, { lessons: v })} errors={errors} path={`modules.${i}.lessons`} placeholder="Titre de la leçon" min={1} max={15} />
              </div>
            </li>
          ))}
        </ol>
        <Err msg={errors.modules} />
        {c.modules.length < 15 && (
          <button type="button" onClick={() => set("modules", [...c.modules, { title: "", hours: 1, lessons: [""] }])} className={buttonClass("secondary", "sm", "mt-4")}>+ Ajouter un module</button>
        )}
      </Section>

      <Section n="04" title="Avant de commencer">
        <div className="grid gap-5">
          <label className="block">
            <Label>Prérequis</Label>
            <input value={c.prerequisites} onChange={(e) => set("prerequisites", e.target.value)} placeholder="Ex. : Aucun prérequis." className={`${input} ${border(errors.prerequisites)} h-12`} />
            <Err msg={errors.prerequisites} />
          </label>
          <div className="grid gap-5 sm:grid-cols-[140px_140px_1fr]">
            <label className="block">
              <Label>Budget min (€)</Label>
              <input type="number" min={0} value={c.startBudget.min} onChange={(e) => set("startBudget", { ...c.startBudget, min: Number(e.target.value) })} className={`${input} ${border()} h-12`} />
            </label>
            <label className="block">
              <Label>Budget max (€)</Label>
              <input type="number" min={0} value={c.startBudget.max} onChange={(e) => set("startBudget", { ...c.startBudget, max: Number(e.target.value) })} className={`${input} ${border(errors.startBudget)} h-12`} />
            </label>
            <label className="block">
              <Label hint="Hors prix de la formation">À quoi sert ce budget ?</Label>
              <input value={c.startBudget.note} onChange={(e) => set("startBudget", { ...c.startBudget, note: e.target.value })} placeholder="Ex. : Abonnement à un outil de montage (facultatif)." className={`${input} ${border()} h-12`} />
            </label>
          </div>
          <Err msg={errors.startBudget} />
          <ListEditor label="Ressources incluses (facultatif)" hint="10 maximum" items={c.resources} onChange={(v) => set("resources", v)} errors={errors} path="resources" placeholder="Ex. : Modèle de script (PDF)" max={10} />
        </div>
      </Section>

      <Section n="05" title="Pré-contrôle et engagements">
        <div className={`rounded-md border-l-4 p-5 ${flags.length ? (flags.some((f) => f.level === "block") ? "border-red bg-red/[0.07]" : "border-warn bg-warn/[0.07]") : "border-lime bg-lime/[0.06]"}`} aria-live="polite">
          <p className="display text-2xl">{flags.length ? "À revoir avant envoi" : "Rien à signaler"}</p>
          {flags.length ? (
            <ul className="mt-3 grid gap-1.5 text-sm">
              {flags.map((f) => <li key={f.text} className="flex gap-2"><Icon name="alert" className={`mt-0.5 size-4 shrink-0 ${f.level === "block" ? "text-red" : "text-warn"}`} />{f.text}{f.level === "block" ? " — bloquant" : ""}</li>)}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">Le pré-contrôle automatique ne détecte pas de promesse interdite. L&apos;équipe relira tout de même chaque leçon.</p>
          )}
        </div>
        <div className="mt-6 grid gap-3">
          <Checkbox checked={commit.original} onChange={(e) => setCommit({ ...commit, original: e.target.checked })} error={errors.original} label="Je suis l'auteur de ce contenu ou je dispose des droits pour le diffuser." />
          <Checkbox checked={commit.noPromise} onChange={(e) => setCommit({ ...commit, noPromise: e.target.checked })} error={errors.noPromise} label="Ma formation ne promet aucun revenu ni résultat garanti, et affiche les risques s'il y en a." />
          <Checkbox checked={commit.accuracy} onChange={(e) => setCommit({ ...commit, accuracy: e.target.checked })} error={errors.accuracy} label={<>J&apos;accepte que l&apos;équipe NO LARP vérifie, demande des modifications ou refuse ma formation, selon la <a href="#charte" className="text-fg underline underline-offset-2">charte</a>.</>} />
        </div>
      </Section>

      {(status || errors.form) && <FormMessage tone={status?.tone ?? "error"}>{errors.form ?? status?.text}</FormMessage>}
      <button type="submit" disabled={busy} className={buttonClass("primary", "lg", "justify-self-start")}>
        {busy ? "Envoi…" : editId ? "Renvoyer en vérification" : "Envoyer en vérification"}
        {!busy && <Icon name="arrow-right" className="size-5" />}
      </button>
    </form>
  );
}

function Section({ n, title, aside, children }: { n: string; title: string; aside?: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-6 flex w-full flex-wrap items-baseline justify-between gap-2 border-b-2 border-line-strong pb-3">
        <span className="display text-4xl"><span className="text-lime">{n}</span> {title}</span>
        {aside && <span className="font-mono text-xs text-faint">{aside}</span>}
      </legend>
      {children}
    </fieldset>
  );
}
