// Pistes d'orientation : chaque piste est rattachée à un domaine du catalogue et décrit
// les conditions dans lesquelles elle est adaptée. Les affinités vont de 0 (aucune) à 1 (très forte).
// Ces valeurs sont des choix éditoriaux de l'équipe pédagogique, documentés sur la page Méthode.

export interface Track {
  id: string;
  domain: string;
  name: string;
  pitch: string;
  interests: Record<"tech" | "business" | "finance" | "marketing", number>;
  workStyle: Record<"computer" | "create" | "analyze" | "sell", number>;
  goals: Record<"income" | "company" | "independence" | "skills" | "orientation" | "longterm", number>;
  /** Heures par semaine : minimum pour progresser, et rythme confortable. */
  minHours: number;
  idealHours: number;
  /** Budget de départ en euros (hors formation) : minimum réaliste et niveau confortable. */
  minBudget: number;
  comfortBudget: number;
  budgetNote: string;
  /** Exigence du domaine pour un débutant : 0 = très accessible, 1 = exigeant. */
  demand: number;
  /** Délai habituel (en mois) avant un premier résultat concret. */
  firstResultMonths: number;
  firstResultLabel: string;
  startTime: string;
  challenges: string[];
  skills: string[];
  courses: string[];
  practice: string;
  firstProject: string;
  minAge?: number;
  financialRisk?: boolean;
}

export const tracks: Track[] = [
  {
    id: "contenu-ia",
    domain: "ia-contenu",
    name: "Création de contenu avec l'IA",
    pitch: "Créer et publier du contenu régulier en t'appuyant sur les outils d'IA.",
    interests: { tech: 0.8, business: 0.4, finance: 0.05, marketing: 1 },
    workStyle: { computer: 0.8, create: 1, analyze: 0.3, sell: 0.55 },
    goals: { income: 0.7, company: 0.5, independence: 0.5, skills: 0.8, orientation: 0.7, longterm: 0.8 },
    minHours: 3,
    idealHours: 7,
    minBudget: 0,
    comfortBudget: 40,
    budgetNote: "Les offres gratuites des outils suffisent pour débuter.",
    demand: 0.25,
    firstResultMonths: 3,
    firstResultLabel: "Premiers contenus en quelques semaines, audience sur plusieurs mois",
    startTime: "1 à 3 semaines",
    challenges: ["La régularité sur plusieurs mois", "Se démarquer du contenu générique", "Ne pas dépendre des chiffres pour rester motivé"],
    skills: ["Prompting", "Storytelling", "Montage vidéo court", "Stratégie éditoriale"],
    courses: ["utiliser-les-outils-ia", "creer-du-contenu-avec-ia", "developper-ses-reseaux-sociaux", "automatiser-la-creation-video", "activite-de-createur-de-contenu"],
    practice: "Publier 3 contenus par semaine pendant un mois sur un sujet que tu maîtrises.",
    firstProject: "Lancer un compte thématique avec une ligne éditoriale écrite et 30 contenus publiés.",
  },
  {
    id: "automatisation-ia",
    domain: "ia-contenu",
    name: "Automatisation & outils d'IA",
    pitch: "Maîtriser les outils d'IA et d'automatisation pour gagner en productivité ou les proposer en service.",
    interests: { tech: 1, business: 0.5, finance: 0.2, marketing: 0.35 },
    workStyle: { computer: 1, create: 0.5, analyze: 0.8, sell: 0.25 },
    goals: { income: 0.6, company: 0.4, independence: 0.45, skills: 1, orientation: 0.65, longterm: 0.6 },
    minHours: 3,
    idealHours: 6,
    minBudget: 0,
    comfortBudget: 30,
    budgetNote: "Offres gratuites des outils d'automatisation et d'IA.",
    demand: 0.4,
    firstResultMonths: 1.5,
    firstResultLabel: "Premières automatisations utiles en quelques semaines",
    startTime: "1 à 2 semaines",
    challenges: ["Des outils qui changent vite", "Une logique à acquérir", "Savoir vérifier les résultats de l'IA"],
    skills: ["Prompting avancé", "Outils no-code", "Logique d'automatisation", "Organisation"],
    courses: ["utiliser-les-outils-ia", "automatisation-et-productivite", "automatiser-la-creation-video"],
    practice: "Automatiser trois tâches répétitives de ton quotidien ou de tes études.",
    firstProject: "Construire une automatisation complète pour un proche, une association ou une petite entreprise.",
  },
  {
    id: "freelance",
    domain: "business-digital",
    name: "Freelancing digital",
    pitch: "Vendre une compétence (rédaction, web, marketing) sous forme de prestations.",
    interests: { tech: 0.55, business: 0.85, finance: 0.15, marketing: 0.75 },
    workStyle: { computer: 0.85, create: 0.65, analyze: 0.4, sell: 1 },
    goals: { income: 1, company: 0.7, independence: 0.9, skills: 0.7, orientation: 0.5, longterm: 0.6 },
    minHours: 5,
    idealHours: 10,
    minBudget: 0,
    comfortBudget: 50,
    budgetNote: "Ta compétence est ton produit : le capital de départ est quasi nul.",
    demand: 0.45,
    firstResultMonths: 2,
    firstResultLabel: "Première mission envisageable en 1 à 3 mois",
    startTime: "3 à 6 semaines",
    challenges: ["Trouver ses premiers clients", "Fixer ses prix", "Gérer l'administratif et l'irrégularité des revenus"],
    skills: ["Définition d'offre", "Prospection", "Copywriting", "Relation client"],
    courses: ["freelancing", "copywriting", "acquisition-de-clients", "vente-de-prestations"],
    practice: "Réaliser deux prestations gratuites ou à prix réduit pour construire un portfolio.",
    firstProject: "Décrocher et livrer une première mission rémunérée, avec devis et facture.",
  },
  {
    id: "web",
    domain: "business-digital",
    name: "Création de sites Internet",
    pitch: "Concevoir des sites professionnels, pour tes projets ou pour des clients.",
    interests: { tech: 1, business: 0.5, finance: 0.1, marketing: 0.5 },
    workStyle: { computer: 1, create: 0.9, analyze: 0.5, sell: 0.4 },
    goals: { income: 0.8, company: 0.6, independence: 0.7, skills: 0.95, orientation: 0.65, longterm: 0.7 },
    minHours: 5,
    idealHours: 10,
    minBudget: 0,
    comfortBudget: 60,
    budgetNote: "Offres gratuites pour apprendre ; nom de domaine et hébergement pour publier.",
    demand: 0.45,
    firstResultMonths: 2,
    firstResultLabel: "Premier site en ligne en quelques semaines",
    startTime: "2 à 4 semaines",
    challenges: ["Beaucoup de notions techniques au départ", "Le sens du design se travaille", "Gérer les demandes des clients"],
    skills: ["Design web", "Outils no-code", "HTML/CSS", "Référencement"],
    courses: ["creation-de-sites-internet", "marketing-digital", "freelancing", "vente-de-prestations"],
    practice: "Refaire le site de trois commerces locaux sous forme de maquettes.",
    firstProject: "Mettre en ligne un site complet pour un vrai client ou un projet personnel.",
  },
  {
    id: "marketing",
    domain: "business-digital",
    name: "Marketing digital",
    pitch: "Comprendre et piloter l'acquisition de clients en ligne.",
    interests: { tech: 0.5, business: 0.75, finance: 0.2, marketing: 1 },
    workStyle: { computer: 0.8, create: 0.7, analyze: 0.85, sell: 0.65 },
    goals: { income: 0.6, company: 0.55, independence: 0.5, skills: 1, orientation: 0.85, longterm: 0.7 },
    minHours: 3,
    idealHours: 8,
    minBudget: 0,
    comfortBudget: 50,
    budgetNote: "Outils gratuits ; petit budget optionnel pour tester une campagne.",
    demand: 0.35,
    firstResultMonths: 2.5,
    firstResultLabel: "Compétences opérationnelles en 2 à 3 mois",
    startTime: "1 à 2 semaines",
    challenges: ["Un domaine vaste : il faut se spécialiser", "Lire les chiffres sans se tromper", "Pratiquer sur de vrais projets"],
    skills: ["Stratégie marketing", "SEO", "Publicité", "Analyse de données"],
    courses: ["marketing-digital", "marketing-et-acquisition-client", "copywriting", "acquisition-de-clients"],
    practice: "Construire un plan marketing pour une marque existante et le présenter.",
    firstProject: "Gérer l'acquisition d'un petit projet réel (association, commerce, boutique) pendant un mois.",
  },
  {
    id: "ecommerce",
    domain: "e-commerce",
    name: "E-commerce",
    pitch: "Lancer et développer une boutique en ligne avec une démarche de commerçant.",
    interests: { tech: 0.4, business: 1, finance: 0.3, marketing: 0.75 },
    workStyle: { computer: 0.7, create: 0.6, analyze: 0.7, sell: 0.9 },
    goals: { income: 0.7, company: 1, independence: 0.8, skills: 0.5, orientation: 0.4, longterm: 0.8 },
    minHours: 5,
    idealHours: 12,
    minBudget: 150,
    comfortBudget: 450,
    budgetNote: "Abonnement boutique, domaine, échantillons et premiers tests publicitaires.",
    demand: 0.55,
    firstResultMonths: 3,
    firstResultLabel: "Boutique testable en 1 à 2 mois, premières ventes ensuite",
    startTime: "4 à 8 semaines",
    challenges: ["Une concurrence forte", "Un budget publicitaire souvent nécessaire", "La logistique et le service client"],
    skills: ["Étude de marché", "Shopify", "Publicité en ligne", "Gestion de marge"],
    courses: ["comprendre-le-commerce-en-ligne", "trouver-et-analyser-un-marche", "creer-une-boutique-shopify", "marketing-et-acquisition-client", "gestion-des-commandes-et-logistique", "construire-une-marque"],
    practice: "Étudier trois niches et valider une idée avec un test à faible coût.",
    firstProject: "Ouvrir une boutique sur un produit validé et obtenir tes premières commandes.",
  },
  {
    id: "investissement",
    domain: "trading",
    name: "Investissement long terme",
    pitch: "Comprendre l'épargne et l'investissement pour construire sur la durée.",
    interests: { tech: 0.25, business: 0.4, finance: 1, marketing: 0.05 },
    workStyle: { computer: 0.45, create: 0.15, analyze: 1, sell: 0.1 },
    goals: { income: 0.15, company: 0.1, independence: 0.7, skills: 0.6, orientation: 0.35, longterm: 1 },
    minHours: 2,
    idealHours: 4,
    minBudget: 0,
    comfortBudget: 100,
    budgetNote: "Apprendre ne coûte rien ; investir suppose d'abord une épargne de précaution.",
    demand: 0.3,
    firstResultMonths: 12,
    firstResultLabel: "Compétences acquises vite, résultats financiers sur plusieurs années",
    startTime: "2 à 4 semaines",
    challenges: ["La patience : les résultats se mesurent en années", "Résister aux effets de mode", "Accepter les baisses temporaires"],
    skills: ["Budget personnel", "Diversification", "Fonds indiciels", "Discipline"],
    courses: ["comprendre-les-marches-financiers", "investissement-long-terme", "gestion-du-risque", "psychologie-du-trading"],
    practice: "Construire ton budget et une épargne de précaution, puis simuler un portefeuille.",
    firstProject: "Rédiger ta stratégie d'investissement personnelle et la tenir six mois.",
    financialRisk: true,
  },
  {
    id: "trading",
    domain: "trading",
    name: "Trading actif",
    pitch: "Analyser les marchés et prendre des décisions encadrées par une gestion du risque stricte.",
    interests: { tech: 0.35, business: 0.3, finance: 1, marketing: 0.05 },
    workStyle: { computer: 0.7, create: 0.1, analyze: 1, sell: 0.15 },
    goals: { income: 0.35, company: 0.1, independence: 0.35, skills: 0.55, orientation: 0.3, longterm: 0.4 },
    minHours: 5,
    idealHours: 10,
    minBudget: 0,
    comfortBudget: 0,
    budgetNote: "L'apprentissage se fait sans argent réel, sur compte de démonstration.",
    demand: 0.85,
    firstResultMonths: 9,
    firstResultLabel: "Plusieurs mois d'entraînement avant toute prise de risque réelle",
    startTime: "2 à 3 mois d'apprentissage",
    challenges: ["Risque élevé de perte en capital", "Une forte pression psychologique", "Beaucoup d'informations trompeuses"],
    skills: ["Analyse technique", "Gestion du risque", "Discipline", "Prise de décision"],
    courses: ["comprendre-les-marches-financiers", "gestion-du-risque", "analyse-technique", "psychologie-du-trading", "comprendre-les-cryptomonnaies"],
    practice: "Trois mois de simulation sur compte démo avec un journal de trading tenu chaque jour.",
    firstProject: "Écrire et tester un plan de trading complet sur compte de démonstration, puis l'évaluer honnêtement.",
    minAge: 18,
    financialRisk: true,
  },
];

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}
