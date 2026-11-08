// Informations de marque centralisées.
export const site = {
  name: "NO LARP",
  legalName: "[Raison sociale à compléter]",
  tagline: "Pas de cinéma. Du concret.",
  description:
    "L'écosystème de formations en ligne pour entreprendre sur internet, sans cinéma. Trouve ton modèle, teste-le, construis — e-commerce, IA, contenu, finance, business digital.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "contact@exemple.fr",
  locale: "fr_FR",
};

export const nav = [
  { href: "/formations", label: "Formations" },
  { href: "/classement", label: "Classement" },
  { href: "/domaines", label: "Domaines" },
  { href: "/proposer", label: "Proposer" },
  { href: "/methode", label: "Méthode" },
  { href: "/faq", label: "FAQ" },
];
