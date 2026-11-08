"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { useAccount } from "@/lib/account/AccountProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAccount();
  const pathname = usePathname();
  if (!ready) {
    return (
      <div className="container-x grid min-h-[60vh] place-items-center pt-24" aria-busy="true">
        <span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-electric" />
      </div>
    );
  }
  if (!user) {
    const suite = encodeURIComponent(pathname);
    return (
      <section className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <div className="grid size-14 place-items-center rounded-md border border-line-strong bg-white/[0.03] text-lime"><Icon name="lock" className="size-6" /></div>
        <h1 className="mt-6 text-3xl font-bold">Ton espace personnel</h1>
        <p className="mt-3 max-w-md text-muted">Connecte-toi pour retrouver tes résultats d&apos;orientation, tes formations et ta progression.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/connexion?suite=${suite}`} arrow>Se connecter</ButtonLink>
          <ButtonLink href={`/inscription?suite=${suite}`} variant="secondary">Créer un compte</ButtonLink>
        </div>
      </section>
    );
  }
  return <>{children}</>;
}
