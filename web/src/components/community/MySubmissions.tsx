"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { buttonClass, ButtonLink } from "@/components/ui/primitives";
import type { CommunityCourse, SubmissionStatus } from "@/lib/community/types";
import { statusLabel } from "@/lib/community/types";
import { useAccount } from "@/lib/account/AccountProvider";

export const statusStyle: Record<SubmissionStatus, string> = {
  pending: "bg-warn text-[#121212]",
  changes: "bg-paper text-[#121212]",
  approved: "bg-lime text-[#121212]",
  rejected: "bg-red text-white",
};

export function StatusTag({ status }: { status: SubmissionStatus }) {
  return <span className={`inline-block px-2 py-0.5 font-display text-sm uppercase tracking-wide ${statusStyle[status]}`}>{statusLabel[status]}</span>;
}

/** Formations proposées par l'utilisateur, avec leur statut de modération. */
export function MySubmissions() {
  const { backend, user } = useAccount();
  const [list, setList] = useState<CommunityCourse[] | null>(null);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    backend.listMySubmissions().then(setList).catch(() => setList([]));
    backend.isAdmin().then(setAdmin).catch(() => setAdmin(false));
  }, [backend, user]);

  return (
    <section className="mt-14" aria-labelledby="mes-propositions">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="mes-propositions" className="display text-4xl">Mes formations proposées</h2>
        <div className="flex gap-2">
          {admin && <ButtonLink href="/admin" variant="secondary" size="sm">Modération</ButtonLink>}
          <ButtonLink href="/proposer" size="sm" arrow>Proposer une formation</ButtonLink>
        </div>
      </div>
      {list && list.length === 0 && (
        <p className="mt-5 rounded-md border border-dashed border-line-strong p-6 text-muted">
          Tu as un vrai savoir-faire ? Propose ta formation : on la vérifie, puis on la certifie.
        </p>
      )}
      {list && list.length > 0 && (
        <ul className="mt-5 grid gap-3">
          {list.map((c) => (
            <li key={c.id} className="rounded-md border border-line bg-night p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{c.content.title}</p>
                  <p className="mt-1 text-xs text-faint">Envoyée le {new Date(c.createdAt).toLocaleDateString("fr-FR")} · mise à jour le {new Date(c.updatedAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <StatusTag status={c.status} />
              </div>
              {c.reviewNote && (
                <p className="mt-4 border-l-4 border-lime bg-lime/[0.06] p-3 text-sm text-fg/85">
                  <strong className="font-semibold">Retour de l&apos;équipe :</strong> {c.reviewNote}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {c.status === "approved" && <Link href={`/formations/c/${c.id}`} className={buttonClass("secondary", "sm")}>Voir la fiche publique</Link>}
                {(c.status === "changes" || c.status === "pending") && (
                  <Link href={`/proposer?modifier=${c.id}`} className={buttonClass(c.status === "changes" ? "primary" : "ghost", "sm")}>
                    <Icon name="refresh" className="size-4" />
                    {c.status === "changes" ? "Corriger et renvoyer" : "Modifier"}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
