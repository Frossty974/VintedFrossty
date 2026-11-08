// Moteur de recommandation : calcule un score de compatibilité entre un profil et chaque piste.
// Le score mesure l'adéquation entre tes réponses et les exigences d'un domaine.
// Ce n'est PAS une probabilité de réussite.

import type { Answers } from "./questions.ts";
import { optionLabel } from "./questions.ts";
import { tracks, type Track } from "./tracks.ts";

export const WEIGHTS = {
  interest: 30,
  workStyle: 18,
  goal: 14,
  time: 14,
  budget: 12,
  level: 6,
  horizon: 6,
} as const;

type Factor = keyof typeof WEIGHTS;

const HOURS: Record<string, number> = { lt3: 2, "3-5": 4, "5-10": 7.5, "10-20": 15, "20+": 25 };
const BUDGET: Record<string, number> = { "0": 0, "50-100": 75, "100-300": 200, "300-500": 400, "500+": 700 };
const LEVEL: Record<string, number> = { beginner: 0, some: 0.33, intermediate: 0.66, advanced: 1 };
const HORIZON: Record<string, number> = { weeks: 0.75, "2-3m": 2.5, "6m": 6, "1y": 12 };

export interface Warning {
  kind: "budget" | "risk" | "age" | "time" | "horizon";
  text: string;
}

export interface TrackResult {
  track: Track;
  score: number;
  factors: Record<Factor, number>;
  reasons: string[];
  warnings: Warning[];
}

export interface Profile {
  archetype: string;
  summary: string;
  strengths: string[];
  constraints: string[];
  advice: string;
  weeklyHours: number;
  budget: number;
}

export interface PathStep {
  title: string;
  description: string;
  action: string;
  courses: string[];
  weeks: number;
}

export interface OrientationResult {
  profile: Profile;
  ranking: TrackResult[];
  path: PathStep[];
}

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;

function interestFit(a: Answers, t: Track): number {
  const sel = a.interests.filter((i) => i !== "unknown") as (keyof Track["interests"])[];
  if (sel.length === 0) return 0.6;
  const values = sel.map((i) => t.interests[i]);
  const max = Math.max(...values);
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  return max * 0.8 + mean * 0.2;
}

function workFit(a: Answers, t: Track): number {
  if (a.workStyle === "open") return 0.65;
  return t.workStyle[a.workStyle as keyof Track["workStyle"]] ?? 0.5;
}

function goalFit(a: Answers, t: Track): number {
  return t.goals[a.goal as keyof Track["goals"]] ?? 0.5;
}

function timeFit(hours: number, t: Track): number {
  if (hours >= t.idealHours) return 1;
  if (hours >= t.minHours) return 0.75 + (0.25 * (hours - t.minHours)) / Math.max(1, t.idealHours - t.minHours);
  return 0.75 * Math.pow(hours / t.minHours, 1.5);
}

function budgetFit(budget: number, t: Track): number {
  if (budget >= t.comfortBudget) return 1;
  if (budget >= t.minBudget) return 0.7 + (0.3 * (budget - t.minBudget)) / Math.max(1, t.comfortBudget - t.minBudget);
  return 0.4 * (budget / t.minBudget);
}

function levelFit(level: number, t: Track): number {
  return clamp(1 - Math.max(0, t.demand - level) * 0.9);
}

function horizonFit(months: number, t: Track): number {
  if (months >= t.firstResultMonths) return 1;
  return Math.pow(months / t.firstResultMonths, 0.6);
}

function scoreTrack(a: Answers, t: Track): TrackResult {
  const hours = HOURS[a.time];
  const budget = BUDGET[a.budget];
  const level = LEVEL[a.level];
  const months = HORIZON[a.horizon];

  const factors: Record<Factor, number> = {
    interest: interestFit(a, t),
    workStyle: workFit(a, t),
    goal: goalFit(a, t),
    time: timeFit(hours, t),
    budget: budgetFit(budget, t),
    level: levelFit(level, t),
    horizon: horizonFit(months, t),
  };

  const total = Object.values(WEIGHTS).reduce((s, w) => s + w, 0);
  let raw = (Object.keys(WEIGHTS) as Factor[]).reduce((s, f) => s + WEIGHTS[f] * factors[f], 0) / total;

  // Ajustements liés à la difficulté déclarée : faibles, ils départagent sans renverser le classement.
  if (a.difficulty === "money" && (t.minBudget > 0 || t.financialRisk)) raw -= 0.04;
  if (a.difficulty === "fear" && t.financialRisk) raw -= 0.04;
  if (a.difficulty === "fear" && t.demand <= 0.4) raw += 0.02;
  if (a.difficulty === "time" && t.minHours >= 5) raw -= 0.03;
  if (a.difficulty === "discipline" && t.firstResultMonths >= 6) raw -= 0.03;

  let score = Math.round(15 + clamp(raw) * 82);

  const warnings: Warning[] = [];
  const isMinor = a.age === "u18";
  if (t.minAge && isMinor) {
    score = Math.min(score, 40);
    warnings.push({
      kind: "age",
      text: "Les plateformes de trading et d'investissement sont réservées aux personnes majeures. Avant 18 ans, tu peux uniquement apprendre et t'entraîner sur compte de démonstration.",
    });
  }
  if (budget < t.minBudget) {
    score = Math.min(score, 62);
    warnings.push({
      kind: "budget",
      text: `Démarrer demande généralement au moins ${euros(t.minBudget)} (${t.budgetNote.toLowerCase().replace(/\.$/, "")}). Ton budget actuel est inférieur : commence par la théorie et une validation gratuite avant d'engager de l'argent.`,
    });
  }
  if (t.financialRisk) {
    warnings.push({
      kind: "risk",
      text: "Risque de perte en capital. Aucun argent n'est nécessaire pour apprendre : n'engage jamais d'argent dont tu as besoin, et jamais avant de maîtriser la gestion du risque.",
    });
  }
  if (hours < t.minHours) {
    warnings.push({
      kind: "time",
      text: `Ce domaine demande plutôt ${t.minHours} h ou plus par semaine. Avec ton temps disponible, compte une progression plus lente.`,
    });
  }
  if (months < t.firstResultMonths * 0.6) {
    warnings.push({
      kind: "horizon",
      text: `Ici, les premiers résultats concrets prennent souvent plus de temps que ce que tu espères (${t.firstResultLabel.toLowerCase()}).`,
    });
  }

  return { track: t, score: clamp(score, 5, 97), factors, reasons: buildReasons(a, t, factors), warnings };
}

function buildReasons(a: Answers, t: Track, f: Record<Factor, number>): string[] {
  const r: { w: number; text: string }[] = [];
  const sel = a.interests.filter((i) => i !== "unknown") as (keyof Track["interests"])[];
  if (sel.length && f.interest >= 0.7) {
    const best = sel.reduce((b, i) => (t.interests[i] > t.interests[b] ? i : b), sel[0]);
    r.push({ w: WEIGHTS.interest * f.interest, text: `Il rejoint ton intérêt pour « ${optionLabel("interests", best).toLowerCase()} ».` });
  }
  if (a.workStyle !== "open" && f.workStyle >= 0.7) {
    r.push({ w: WEIGHTS.workStyle * f.workStyle, text: `Il correspond à ta façon de travailler : ${optionLabel("workStyle", a.workStyle).toLowerCase()}.` });
  }
  if (f.goal >= 0.7) {
    r.push({ w: WEIGHTS.goal * f.goal, text: `Il sert directement ton objectif : ${optionLabel("goal", a.goal).toLowerCase()}.` });
  }
  if (f.budget >= 0.85) {
    r.push({ w: WEIGHTS.budget * f.budget, text: t.minBudget === 0 ? "Il peut démarrer sans capital, ce qui colle à ton budget." : "Ton budget couvre les besoins de départ." });
  }
  if (f.time >= 0.85) {
    r.push({ w: WEIGHTS.time * f.time, text: "Ton temps disponible permet de progresser à un bon rythme." });
  }
  if (f.horizon >= 0.95 && t.firstResultMonths >= 6) {
    r.push({ w: WEIGHTS.horizon * 2, text: "Ta patience est un atout : c'est un domaine qui récompense le long terme." });
  } else if (f.horizon >= 0.95) {
    r.push({ w: WEIGHTS.horizon, text: "Des premiers résultats sont envisageables dans ton horizon de temps." });
  }
  if (f.level >= 0.95 && t.demand >= 0.5) {
    r.push({ w: WEIGHTS.level, text: "Ton niveau actuel te permet d'aborder ce domaine exigeant." });
  } else if (t.demand <= 0.3 && a.level === "beginner") {
    r.push({ w: WEIGHTS.level, text: "Il est accessible quand on débute complètement." });
  }
  r.sort((x, y) => y.w - x.w);
  const out = r.slice(0, 3).map((x) => x.text);
  if (out.length === 0) out.push("Il reste une option cohérente avec plusieurs de tes réponses, sans être un choix évident.");
  return out;
}

const ARCHETYPES: Record<string, { name: string; line: string }> = {
  create: { name: "Créatif", line: "Tu as besoin de créer et de voir tes idées prendre forme." },
  analyze: { name: "Analytique", line: "Tu aimes comprendre avant d'agir et décider sur des faits." },
  sell: { name: "Communicant", line: "Le contact, la conviction et l'échange sont tes moteurs." },
  computer: { name: "Bâtisseur numérique", line: "Tu es à l'aise avec les outils et tu aimes construire des choses concrètes en ligne." },
  open: { name: "Explorateur", line: "Tu es ouvert à plusieurs voies : l'enjeu est de tester pour mieux choisir." },
};

const ADVICE: Record<string, string> = {
  start: "Ne cherche pas le choix parfait. Commence par une seule formation de découverte dans le domaine en tête, puis réévalue après deux semaines.",
  knowledge: "Le manque de connaissances se comble vite avec un programme structuré. Avance module par module, en pratiquant à chaque étape.",
  discipline: "Bloque des créneaux fixes dans ta semaine et fixe-toi des objectifs courts. La régularité compte plus que l'intensité.",
  money: "Privilégie d'abord les domaines de compétences, qui démarrent sans capital. Ton temps et ton apprentissage sont ton premier investissement.",
  fear: "Avance par petites étapes réversibles : tester une idée, réaliser un projet pour un proche, s'entraîner sans argent réel. Le risque reste maîtrisé.",
  time: "Même 30 minutes par jour suffisent pour avancer. Choisis un domaine compatible avec un rythme réduit et protège ce temps.",
};

function buildProfile(a: Answers): Profile {
  const hours = HOURS[a.time];
  const budget = BUDGET[a.budget];
  const arch = ARCHETYPES[a.workStyle] ?? ARCHETYPES.open;

  const strengths: string[] = [];
  if (hours >= 10) strengths.push("Du temps disponible pour progresser rapidement");
  else if (hours >= 5) strengths.push("Un rythme hebdomadaire suffisant pour avancer régulièrement");
  if (a.level === "intermediate" || a.level === "advanced") strengths.push("Des bases déjà solides sur lesquelles construire");
  if (a.horizon === "6m" || a.horizon === "1y") strengths.push("De la patience et une vision réaliste des délais");
  if (a.goal === "longterm" || a.goal === "company") strengths.push("Une ambition orientée vers la construction");
  if (a.goal === "skills") strengths.push("Une démarche d'apprentissage, la plus solide qui soit");
  if (a.situation === "student") strengths.push("Une période idéale pour apprendre et tester");
  if (a.situation === "entrepreneur") strengths.push("Une première expérience entrepreneuriale");
  if (budget >= 300) strengths.push("Une marge financière pour tester des idées");
  if (a.interests.includes("unknown")) strengths.push("Une ouverture d'esprit qui permet d'explorer sans a priori");
  else if (a.interests.length <= 2) strengths.push("Des centres d'intérêt déjà identifiés");
  if (strengths.length < 2) strengths.push("La volonté de te poser les bonnes questions avant d'agir");

  const constraints: string[] = [];
  if (hours < 3) constraints.push("Peu de temps disponible : il faudra choisir un seul objectif à la fois");
  if (budget === 0) constraints.push("Aucun budget de départ : les domaines de compétences sont à privilégier");
  else if (budget < 150) constraints.push("Un budget limité qui exclut certains lancements coûteux");
  if (a.horizon === "weeks") constraints.push("Une attente de résultats rapide, source possible de découragement");
  if (a.level === "beginner") constraints.push("Tout est à apprendre : c'est normal, et ça se planifie");
  if (a.age === "u18") constraints.push("Certaines activités (statut d'entreprise, marchés financiers) ont des conditions d'âge");
  const diffMap: Record<string, string> = {
    discipline: "La discipline, à soutenir par une organisation simple",
    fear: "La peur de te lancer, à apprivoiser par de petites étapes",
    time: "Le manque de temps, qui impose de prioriser",
    money: "Des moyens financiers limités",
  };
  if (diffMap[a.difficulty] && !constraints.some((c) => c.toLowerCase().includes(a.difficulty === "money" ? "budget" : "temps"))) {
    constraints.push(diffMap[a.difficulty]);
  }

  const summary = `${arch.line} ${optionLabel("situation", a.situation)}, tu disposes de ${optionLabel("time", a.time).toLowerCase()} et d'un budget de départ de ${optionLabel("budget", a.budget)}.`;

  return { archetype: arch.name, summary, strengths: strengths.slice(0, 4), constraints: constraints.slice(0, 4), advice: ADVICE[a.difficulty] ?? ADVICE.start, weeklyHours: hours, budget };
}

export function courseHours(slug: string, catalog: { slug: string; hours: number }[]): number {
  return catalog.find((c) => c.slug === slug)?.hours ?? 8;
}

function buildPath(t: Track, hours: number, catalog: { slug: string; hours: number }[]): PathStep[] {
  const [c1, c2, ...rest] = t.courses;
  const weeks = (h: number) => Math.max(1, Math.ceil(h / hours));
  const fundamentals = [c2, rest[0]].filter(Boolean) as string[];
  return [
    {
      title: "Découverte du domaine",
      description: `Comprendre ce qu'implique réellement « ${t.name} » : métiers, réalités, compétences et risques.`,
      action: "Suivre la formation de découverte et noter ce qui t'attire ou te freine.",
      courses: [c1],
      weeks: weeks(courseHours(c1, catalog)),
    },
    {
      title: "Apprentissage des fondamentaux",
      description: "Acquérir les bases techniques et la méthode, module par module.",
      action: "Terminer les formations fondamentales en appliquant chaque module.",
      courses: fundamentals,
      weeks: weeks(fundamentals.reduce((s, c) => s + courseHours(c, catalog), 0)),
    },
    {
      title: "Mise en pratique",
      description: "Passer de la théorie à l'action sur des exercices réels.",
      action: t.practice,
      courses: [],
      weeks: weeks(12),
    },
    {
      title: "Réalisation d'un premier projet",
      description: "Un projet concret, de bout en bout, pour valider tes acquis.",
      action: t.firstProject,
      courses: [],
      weeks: weeks(25),
    },
    {
      title: "Développement des compétences",
      description: "Approfondir, te spécialiser et construire dans la durée.",
      action: "Choisir une spécialisation selon tes résultats et suivre les formations avancées.",
      courses: rest.slice(1),
      weeks: weeks(rest.slice(1).reduce((s, c) => s + courseHours(c, catalog), 0) || 10),
    },
  ];
}

export function computeOrientation(a: Answers, catalog: { slug: string; hours: number }[] = []): OrientationResult {
  const ranking = tracks.map((t) => scoreTrack(a, t)).sort((x, y) => y.score - x.score || y.factors.interest - x.factors.interest);
  const profile = buildProfile(a);
  const path = buildPath(ranking[0].track, profile.weeklyHours, catalog);
  return { profile, ranking, path };
}
