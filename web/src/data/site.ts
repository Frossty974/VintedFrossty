// Informations de marque centralisées. Le nom "Kairos" est provisoire : le changer ici suffit.
export const site = {
  name: "Kairos",
  legalName: "[Raison sociale à compléter]",
  tagline: "Trouve ce qui te correspond. Apprends ce qui compte.",
  description:
    "Kairos aide les 16-30 ans à découvrir les domaines qui leur correspondent — e-commerce, IA, création de contenu, finance, business digital — et à se former avec des programmes concrets, sans promesse d'argent facile.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "contact@exemple.fr",
  locale: "fr_FR",
};

export const nav = [
  { href: "/formations", label: "Formations" },
  { href: "/domaines", label: "Domaines" },
  { href: "/methode", label: "Méthode" },
  { href: "/a-propos", label: "À propos" },
  { href: "/faq", label: "FAQ" },
];
