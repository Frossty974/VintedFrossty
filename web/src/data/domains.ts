import type { Domain } from "./types";

export const domains: Domain[] = [
  {
    slug: "e-commerce",
    name: "E-commerce",
    short: "Vendre en ligne",
    icon: "cart",
    accent: "electric",
    tagline: "Comprendre, lancer et faire grandir une activité de vente en ligne.",
    description:
      "Le commerce en ligne est accessible techniquement, mais exigeant sur le fond : choix du marché, qualité de l'offre, acquisition de clients et gestion des opérations. On t'apprend à raisonner comme un commerçant, pas seulement à monter une boutique.",
    opportunities: [
      "Des outils (Shopify, paiement, logistique externalisée) qui réduisent fortement la barrière technique.",
      "Possibilité de tester une idée à petite échelle avant d'investir davantage.",
      "Compétences transférables : marketing, négociation, analyse de chiffres, service client.",
    ],
    difficulties: [
      "Concurrence forte sur les produits génériques : la différenciation est indispensable.",
      "Budget publicitaire souvent nécessaire pour obtenir les premières ventes.",
      "Gestion des retours, des délais et du service client qui demande de la rigueur.",
    ],
    skills: ["Étude de marché", "Shopify", "Publicité en ligne", "Copywriting produit", "Gestion des stocks", "Analyse de marge"],
    timeToStart: "4 à 8 semaines pour une première boutique testable",
    weeklyTime: "5 à 15 h / semaine",
    startBudget: { min: 150, max: 600, note: "Abonnement boutique, nom de domaine, échantillons et premiers tests publicitaires." },
  },
  {
    slug: "trading",
    name: "Trading & marchés financiers",
    short: "Comprendre les marchés",
    icon: "chart",
    accent: "violet",
    tagline: "Comprendre le fonctionnement des marchés, le risque et l'investissement long terme.",
    description:
      "Nous abordons les marchés comme une discipline d'analyse et de gestion du risque, pas comme une source de revenu. L'objectif : comprendre ce que tu fais, protéger ton capital et éviter les pièges les plus courants.",
    opportunities: [
      "Culture financière utile toute la vie : épargne, investissement, compréhension de l'économie.",
      "Développement d'une pensée analytique et d'une discipline de décision.",
      "Possibilité de s'entraîner sans argent réel (compte de démonstration).",
    ],
    difficulties: [
      "Risque réel de perte en capital, y compris rapide sur les produits à effet de levier.",
      "Forte dimension psychologique : peur, excès de confiance, impulsivité.",
      "Beaucoup de contenus en ligne trompeurs qui promettent des gains rapides.",
    ],
    skills: ["Lecture des marchés", "Analyse technique", "Gestion du risque", "Discipline", "Analyse fondamentale", "Diversification"],
    timeToStart: "2 à 3 mois d'apprentissage avant tout engagement d'argent réel",
    weeklyTime: "3 à 10 h / semaine",
    startBudget: { min: 0, max: 0, note: "Aucun capital n'est nécessaire pour apprendre : entraînement sur compte de démonstration." },
    riskNotice:
      "Investir sur les marchés financiers comporte un risque de perte partielle ou totale du capital. Une part importante des investisseurs particuliers perd de l'argent, en particulier sur les produits à effet de levier (CFD, options, crypto-actifs à levier). Nos formations sont pédagogiques : elles ne constituent pas un conseil en investissement et ne garantissent aucun gain. N'investis jamais de l'argent dont tu as besoin.",
  },
  {
    slug: "ia-contenu",
    name: "IA & création de contenu",
    short: "Créer avec l'IA",
    icon: "spark",
    accent: "cyan",
    tagline: "Maîtriser les outils d'IA pour créer, publier et automatiser.",
    description:
      "L'intelligence artificielle change la manière de produire du contenu et de travailler. On t'apprend à utiliser ces outils avec méthode et esprit critique, pour construire une présence en ligne ou gagner en productivité.",
    opportunities: [
      "Démarrage possible avec très peu de budget : de nombreux outils proposent une offre gratuite.",
      "Compétences recherchées par les entreprises de toutes tailles.",
      "Possibilité de construire une audience progressivement, en parallèle des études ou d'un emploi.",
    ],
    difficulties: [
      "Les résultats sur les réseaux sociaux demandent de la régularité sur plusieurs mois.",
      "Outils qui évoluent très vite : il faut apprendre à apprendre.",
      "Le contenu générique produit sans réflexion fonctionne mal : le regard humain reste essentiel.",
    ],
    skills: ["Prompting", "Montage vidéo", "Storytelling", "Stratégie éditoriale", "Automatisation", "Analyse d'audience"],
    timeToStart: "1 à 3 semaines pour publier tes premiers contenus",
    weeklyTime: "3 à 10 h / semaine",
    startBudget: { min: 0, max: 80, note: "Offres gratuites suffisantes pour débuter ; un abonnement à un outil d'IA est un plus." },
  },
  {
    slug: "business-digital",
    name: "Business digital",
    short: "Vendre ses compétences",
    icon: "compass",
    accent: "emerald",
    tagline: "Transformer des compétences en prestations et trouver ses premiers clients.",
    description:
      "Freelancing, copywriting, création de sites, marketing : ce domaine consiste à vendre un savoir-faire plutôt qu'un produit. Peu de capital, beaucoup de compétences et de relationnel.",
    opportunities: [
      "Investissement financier de départ faible : ta compétence est ton produit.",
      "Forte demande des petites entreprises pour le web, le marketing et la rédaction.",
      "Expérience concrète valorisable sur un CV, même si tu ne restes pas indépendant.",
    ],
    difficulties: [
      "Trouver les premiers clients demande de la prospection et de la persévérance.",
      "Statut, facturation et obligations administratives à comprendre.",
      "Revenus irréguliers au début, le temps de construire une réputation.",
    ],
    skills: ["Copywriting", "Création de sites", "Prospection", "Négociation", "Gestion de projet", "Marketing digital"],
    timeToStart: "3 à 6 semaines pour proposer une première prestation",
    weeklyTime: "5 à 15 h / semaine",
    startBudget: { min: 0, max: 150, note: "Ordinateur et connexion ; éventuellement un portfolio en ligne et quelques outils." },
  },
];

export function getDomain(slug: string): Domain | undefined {
  return domains.find((d) => d.slug === slug);
}
