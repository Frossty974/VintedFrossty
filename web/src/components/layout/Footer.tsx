import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { domains } from "@/data/domains";
import { site } from "@/data/site";

const cols = [
  {
    title: "Domaines",
    links: domains.map((d) => ({ href: `/domaines/${d.slug}`, label: d.name })),
  },
  {
    title: "Plateforme",
    links: [
      { href: "/orientation", label: "Questionnaire d'orientation" },
      { href: "/formations", label: "Toutes les formations" },
      { href: "/methode", label: "Notre méthode" },
      { href: "/espace", label: "Espace membre" },
    ],
  },
  {
    title: "Entreprise",
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

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-line">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/50 to-transparent" />
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-lg font-semibold tracking-tight">{site.name}</span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted">{site.description}</p>
          <p className="mt-5 text-sm text-faint">
            Nous vendons des compétences et des méthodes, jamais des promesses de revenus.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="eyebrow">{c.title}</p>
              <ul className="mt-4 grid gap-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted transition hover:text-fg">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Tous droits réservés.</p>
          <p className="max-w-xl sm:text-right">
            Les formations liées aux marchés financiers sont pédagogiques et ne constituent pas un conseil en investissement. Investir comporte un risque de perte en capital.
          </p>
        </div>
      </div>
    </footer>
  );
}
