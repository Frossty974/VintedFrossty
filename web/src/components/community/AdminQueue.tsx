"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProgramAccordion } from "@/components/catalog/ProgramAccordion";
import { FormMessage } from "@/components/forms/Field";
import { Icon } from "@/components/ui/Icon";
import { buttonClass, ButtonLink, formatBudget, formatHours, formatPrice } from "@/components/ui/primitives";
import { getDomain } from "@/data/domains";
import { useAccount } from "@/lib/account/AccountProvider";
import { precheck } from "@/lib/community/precheck";
import { statusLabel, totalHours, type CommunityCourse, type SubmissionStatus } from "@/lib/community/types";
import { StatusTag } from "./MySubmissions";

const tabs: SubmissionStatus[] = ["pending", "changes", "approved", "rejected"];

export function AdminQueue() {
  const { backend, user, ready, mode } = useAccount();
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<SubmissionStatus>("pending");
  const [list, setList] = useState<CommunityCourse[]>([]);
  const [counts, setCounts] = useState<Record<SubmissionStatus, number>>({ pending: 0, changes: 0, approved: 0, rejected: 0 });
  const [open, setOpen] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const all = await Promise.all(tabs.map((t) => backend.listForReview(t)));
    setCounts(Object.fromEntries(tabs.map((t, i) => [t, all[i].length])) as Record<SubmissionStatus, number>);
    setList(all[tabs.indexOf(tab)]);
  }, [backend, tab]);

  useEffect(() => {
    if (!ready) return;
    if (!user) return setAdmin(false);
    backend.isAdmin().then((a) => {
      setAdmin(a);
      if (a) load();
    });
  }, [ready, user, backend, load]);

  if (admin === null) return <div className="grid min-h-[40vh] place-items-center"><span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-lime" /></div>;
  if (!admin) {
    return (
      <div className="rounded-lg border-2 border-line-strong p-8 text-center">
        <p className="display text-4xl">Accès réservé à l&apos;équipe.</p>
        <div className="mt-6 flex justify-center">{user ? <ButtonLink href="/espace">Mon espace</ButtonLink> : <ButtonLink href="/connexion?suite=%2Fadmin" arrow>Se connecter</ButtonLink>}</div>
      </div>
    );
  }

  const decide = async (id: string, decision: "approved" | "changes" | "rejected", note: string) => {
    if (decision !== "approved" && note.trim().length < 10) {
      setMessage("Explique ta décision à l'auteur (10 caractères minimum).");
      return;
    }
    await backend.review(id, decision, note.trim());
    setMessage(decision === "approved" ? "Formation approuvée et certifiée." : decision === "changes" ? "Modifications demandées à l'auteur." : "Formation refusée.");
    setOpen(null);
    load();
  };

  return (
    <div>
      {mode === "demo" && <div className="mb-6"><FormMessage tone="info">Mode démo : tout compte connecté peut tester la modération. Avec Supabase, seuls les comptes de la table « admins » y ont accès.</FormMessage></div>}
      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setOpen(null); }} className={`rounded-md border-2 px-4 py-2 font-display text-lg uppercase ${tab === t ? "border-lime bg-lime text-[#121212]" : "border-line-strong text-fg/80 hover:border-fg"}`}>
            {statusLabel[t]} <span className="opacity-60">({counts[t]})</span>
          </button>
        ))}
      </div>
      {message && <div className="mt-5"><FormMessage tone="success">{message}</FormMessage></div>}
      {list.length === 0 ? (
        <p className="mt-8 rounded-md border border-dashed border-line-strong p-8 text-center text-muted">Rien ici pour l&apos;instant.</p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {list.map((cc) => <ReviewItem key={cc.id} cc={cc} open={open === cc.id} onToggle={() => setOpen(open === cc.id ? null : cc.id)} onDecide={decide} />)}
        </ul>
      )}
    </div>
  );
}

function ReviewItem({ cc, open, onToggle, onDecide }: { cc: CommunityCourse; open: boolean; onToggle: () => void; onDecide: (id: string, d: "approved" | "changes" | "rejected", note: string) => void }) {
  const [note, setNote] = useState(cc.reviewNote ?? "");
  const c = cc.content;
  const flags = precheck(c);
  const domain = getDomain(c.domain);
  const reviewable = cc.status === "pending" || cc.status === "changes";
  return (
    <li className="rounded-md border border-line-strong bg-night">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left">
        <span>
          <span className="block text-lg font-bold">{c.title}</span>
          <span className="mt-1 block text-xs text-faint">Par {cc.authorName} · {domain?.name} · {c.level} · {formatHours(totalHours(c.modules))} · {formatPrice(c.price)} · mis à jour le {new Date(cc.updatedAt).toLocaleDateString("fr-FR")}</span>
        </span>
        <span className="flex items-center gap-3">
          {flags.length > 0 && <span className="bg-red px-2 py-0.5 text-xs font-bold text-white">{flags.length} alerte{flags.length > 1 ? "s" : ""}</span>}
          <StatusTag status={cc.status} />
          <Icon name="chevron-down" className={`size-5 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && (
        <div className="grid gap-6 border-t border-line p-5">
          {flags.length > 0 && (
            <ul className="grid gap-1 border-l-4 border-red bg-red/[0.07] p-4 text-sm">
              {flags.map((f) => <li key={f.text}>{f.level === "block" ? "Bloquant" : "À vérifier"} : {f.text}</li>)}
            </ul>
          )}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="grid content-start gap-4 text-sm">
              <p className="text-muted">{c.subtitle}</p>
              <p className="whitespace-pre-line leading-relaxed">{c.presentation}</p>
              <div><p className="font-semibold">Objectifs</p><ul className="mt-1 list-disc pl-5 text-muted">{c.objectives.map((o) => <li key={o}>{o}</li>)}</ul></div>
              <div><p className="font-semibold">Compétences</p><p className="mt-1 text-muted">{c.skills.join(" · ")}</p></div>
              <div><p className="font-semibold">Prérequis</p><p className="mt-1 text-muted">{c.prerequisites}</p></div>
              <div><p className="font-semibold">Budget de départ</p><p className="mt-1 text-muted">{formatBudget(c.startBudget.min, c.startBudget.max)} — {c.startBudget.note || "sans précision"}</p></div>
            </div>
            <ProgramAccordion modules={c.modules} />
          </div>
          {reviewable ? (
            <div className="grid gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Message à l&apos;auteur</span>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Obligatoire pour une demande de modification ou un refus." className="w-full rounded-md border border-line-strong bg-ink px-3.5 py-3 text-sm focus:border-lime focus:outline-none" />
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={flags.some((f) => f.level === "block")} onClick={() => onDecide(cc.id, "approved", note)} className={buttonClass("primary", "md")} title={flags.some((f) => f.level === "block") ? "Alerte bloquante : demander des modifications" : undefined}>
                  <Icon name="check" className="size-4" />Approuver et certifier
                </button>
                <button type="button" onClick={() => onDecide(cc.id, "changes", note)} className={buttonClass("secondary", "md")}>Demander des modifications</button>
                <button type="button" onClick={() => onDecide(cc.id, "rejected", note)} className={buttonClass("ghost", "md", "hover:text-red")}>Refuser</button>
              </div>
            </div>
          ) : (
            cc.status === "approved" && <Link href={`/formations/c/${cc.id}`} className={buttonClass("secondary", "sm", "justify-self-start")}>Voir la fiche publique</Link>
          )}
        </div>
      )}
    </li>
  );
}
