import { ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-center justify-center pt-24 text-center">
      <p className="font-mono text-sm text-faint">Erreur 404</p>
      <h1 className="mt-4 text-[clamp(2.2rem,6vw,4rem)] display text-gradient">Cette page n&apos;existe pas.</h1>
      <p className="mt-4 max-w-md text-muted">Mais ta voie, elle, existe sûrement. Reprenons depuis le début.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" arrow>Retour à l&apos;accueil</ButtonLink>
        <ButtonLink href="/formations" variant="secondary">Voir les formations</ButtonLink>
      </div>
    </section>
  );
}
