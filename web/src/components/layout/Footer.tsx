import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { domains } from "@/data/domains";
import { site } from "@/data/site";

const cols = [
  { title: "Domaines", links: domains.map((d) => ({ href: `/domaines/${d.slug}`, label: d.name })) },
  {
    title: "Plateforme",
    links: [
      { href: "/orientation", label: "Trouver ma voie" },
      { href: "/formations", label: "Formations" },
      { href: "/methode", label: "Méthode" },
      { href: "/espace", label: "Mon espace" },
    ],
  },
  {
    title: "No Larp",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/legal/mentions-legales", label: "Mentions légales" },
      { href: "/legal/cgv", label: "Conditions générales" },
      { href: "/legal/confidentialite", label: "Confidentialité" },
      { href: "/legal/remboursement", label: "Remboursement" },
    ],
  },
];

const steps = ["Découvrir", "Tester", "Apprendre", "Construire", "Progresser"];

export function Footer() {
  return (
    <footer className="relative mt-32">
      {/* Bandeau papier déchiré */}
      <div className="paper torn -rotate-[0.6deg] py-5">
        <p className="hand flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 text-center text-lg text-[#171717] sm:text-2xl">
          {steps.map((s, i) => (
            <span key={s} className="inline-flex items-center gap-4">
              {s}
              {i < steps.length - 1 && <span className="text-[#171717]/40">/</span>}
            </span>
          ))}
          <span className="hl">— à ton rythme.</span>
        </p>
      </div>

      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <LogoMark className="size-12" />
            <span className="display text-5xl">No Larp</span>
          </div>
          <p className="display mt-6 text-3xl leading-none">
            Pas de cinéma. <span className="text-lime">Du concret.</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="eyebrow">{c.title}</p>
              <ul className="mt-4 grid gap-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted transition hover:text-lime">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p className="max-w-xl sm:text-right">Formations finance : contenu pédagogique, pas de conseil en investissement. Risque de perte en capital.</p>
        </div>
      </div>
      <div className="hazard h-3" aria-hidden="true" />
    </footer>
  );
}
