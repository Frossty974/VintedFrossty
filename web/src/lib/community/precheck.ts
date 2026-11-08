// Vérification automatique avant modération humaine : repère les formulations
// contraires à la charte NO LARP. Ne remplace pas la relecture par l'équipe.

import type { CourseContent } from "./types.ts";

export interface Flag {
  level: "block" | "warn";
  text: string;
}

const PATTERNS: { re: RegExp; level: Flag["level"]; text: string }[] = [
  { re: /(revenus?|gains?|argent)\s+(garanti|assuré|facile|passif garanti)/i, level: "block", text: "Promesse de revenus ou d'argent facile" },
  { re: /\d[\d\s.,]*\s?(k|k€|€|euros?)\s*(\/|par)\s*(mois|semaine|jour)/i, level: "block", text: "Montant de revenu promis (€ par mois/semaine/jour)" },
  { re: /(devenir|deviens)\s+(riche|millionnaire)/i, level: "block", text: "Promesse d'enrichissement" },
  { re: /(sans\s+risque|0\s?%\s?risque|risque\s+z[ée]ro)/i, level: "block", text: "Absence de risque affirmée" },
  { re: /(liberté financière|indépendance financière)\s+en\s+\d+/i, level: "warn", text: "Délai de « liberté financière » annoncé" },
  { re: /(places?\s+limitées?|derni[èe]res?\s+places?|offre\s+expire|plus que \d+)/i, level: "warn", text: "Fausse urgence commerciale" },
  { re: /(lambo|rolex|dubaï|dubai)/i, level: "warn", text: "Imagerie de réussite ostentatoire" },
];

export function precheck(c: CourseContent): Flag[] {
  const text = [c.title, c.subtitle, c.presentation, c.prerequisites, c.startBudget.note, ...c.objectives, ...c.skills, ...c.resources, ...c.modules.flatMap((m) => [m.title, ...m.lessons])].join("\n");
  const flags: Flag[] = [];
  for (const p of PATTERNS) if (p.re.test(text)) flags.push({ level: p.level, text: p.text });
  if (c.domain === "trading" && !/risque/i.test(text)) {
    flags.push({ level: "warn", text: "Formation finance sans mention des risques dans le contenu" });
  }
  return flags;
}
