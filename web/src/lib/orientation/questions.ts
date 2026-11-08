// Questions du questionnaire d'orientation. L'ordre et les identifiants d'options servent à
// l'encodage des réponses dans l'URL : ne pas réordonner les options d'une question publiée.

export type QuestionId =
  | "age"
  | "situation"
  | "time"
  | "budget"
  | "goal"
  | "interests"
  | "level"
  | "workStyle"
  | "horizon"
  | "difficulty";

export interface Option {
  id: string;
  label: string;
  hint?: string;
}

export interface Question {
  id: QuestionId;
  title: string;
  help?: string;
  multiple?: boolean;
  /** Option qui désélectionne toutes les autres (choix multiple). */
  exclusive?: string;
  options: Option[];
}

export const questions: Question[] = [
  {
    id: "age",
    title: "Quel âge as-tu ?",
    help: "Certaines activités ont des contraintes légales liées à l'âge.",
    options: [
      { id: "u18", label: "Moins de 18 ans" },
      { id: "18-21", label: "18 – 21 ans" },
      { id: "22-25", label: "22 – 25 ans" },
      { id: "26-30", label: "26 – 30 ans" },
      { id: "30+", label: "Plus de 30 ans" },
    ],
  },
  {
    id: "situation",
    title: "Quelle est ta situation actuelle ?",
    options: [
      { id: "student", label: "Étudiant" },
      { id: "employee", label: "Salarié" },
      { id: "jobless", label: "Sans emploi" },
      { id: "entrepreneur", label: "Entrepreneur" },
      { id: "other", label: "Autre" },
    ],
  },
  {
    id: "time",
    title: "Combien de temps peux-tu consacrer à ce projet ?",
    help: "Sois réaliste : mieux vaut un rythme tenable qu'un objectif abandonné.",
    options: [
      { id: "lt3", label: "Moins de 3 heures par semaine" },
      { id: "3-5", label: "3 à 5 heures par semaine" },
      { id: "5-10", label: "5 à 10 heures par semaine" },
      { id: "10-20", label: "10 à 20 heures par semaine" },
      { id: "20+", label: "Plus de 20 heures par semaine" },
    ],
  },
  {
    id: "budget",
    title: "Quel budget peux-tu investir pour commencer ?",
    help: "Hors prix de la formation. Nous ne te recommanderons jamais un domaine au-delà de tes moyens sans te le signaler.",
    options: [
      { id: "0", label: "0 €" },
      { id: "50-100", label: "50 à 100 €" },
      { id: "100-300", label: "100 à 300 €" },
      { id: "300-500", label: "300 à 500 €" },
      { id: "500+", label: "Plus de 500 €" },
    ],
  },
  {
    id: "goal",
    title: "Quel est ton objectif principal ?",
    options: [
      { id: "income", label: "Générer un revenu complémentaire" },
      { id: "company", label: "Créer ma propre entreprise" },
      { id: "independence", label: "Devenir indépendant financièrement" },
      { id: "skills", label: "Acquérir des compétences recherchées" },
      { id: "orientation", label: "Trouver une orientation professionnelle" },
      { id: "longterm", label: "Construire un projet à long terme" },
    ],
  },
  {
    id: "interests",
    title: "Quels domaines t'attirent spontanément ?",
    help: "Plusieurs choix possibles.",
    multiple: true,
    exclusive: "unknown",
    options: [
      { id: "tech", label: "Technologie et intelligence artificielle" },
      { id: "business", label: "Business et entrepreneuriat" },
      { id: "finance", label: "Finance et marchés financiers" },
      { id: "marketing", label: "Marketing et création de contenu" },
      { id: "unknown", label: "Je ne sais absolument pas" },
    ],
  },
  {
    id: "level",
    title: "Quel est ton niveau actuel ?",
    help: "Dans le domaine qui t'attire le plus, ou en général si tu ne sais pas.",
    options: [
      { id: "beginner", label: "Débutant complet" },
      { id: "some", label: "Quelques connaissances" },
      { id: "intermediate", label: "Niveau intermédiaire" },
      { id: "advanced", label: "Avancé" },
    ],
  },
  {
    id: "workStyle",
    title: "Quel type de travail préfères-tu ?",
    options: [
      { id: "computer", label: "Travailler derrière un ordinateur" },
      { id: "create", label: "Créer et imaginer des projets" },
      { id: "analyze", label: "Analyser des données et prendre des décisions" },
      { id: "sell", label: "Vendre et communiquer" },
      { id: "open", label: "Je suis ouvert à tout" },
    ],
  },
  {
    id: "horizon",
    title: "Dans combien de temps aimerais-tu obtenir des résultats ?",
    help: "Un résultat peut être une compétence maîtrisée, un premier client ou un premier projet abouti.",
    options: [
      { id: "weeks", label: "Quelques semaines" },
      { id: "2-3m", label: "2 à 3 mois" },
      { id: "6m", label: "6 mois" },
      { id: "1y", label: "1 an ou plus" },
    ],
  },
  {
    id: "difficulty",
    title: "Quelle est ta principale difficulté actuellement ?",
    options: [
      { id: "start", label: "Je ne sais pas par où commencer" },
      { id: "knowledge", label: "Je manque de connaissances" },
      { id: "discipline", label: "Je manque de discipline" },
      { id: "money", label: "Je manque de moyens financiers" },
      { id: "fear", label: "J'ai peur de me lancer" },
      { id: "time", label: "Je manque de temps" },
    ],
  },
];

/** Réponses : un identifiant d'option par question, un tableau pour les questions à choix multiple. */
export type Answers = {
  age: string;
  situation: string;
  time: string;
  budget: string;
  goal: string;
  interests: string[];
  level: string;
  workStyle: string;
  horizon: string;
  difficulty: string;
};

export function optionLabel(qid: QuestionId, oid: string): string {
  const q = questions.find((x) => x.id === qid);
  return q?.options.find((o) => o.id === oid)?.label ?? oid;
}

/** Encode les réponses en chaîne courte et partageable : indices séparés par des tirets, masque binaire pour les choix multiples. */
export function encodeAnswers(a: Answers): string {
  return questions
    .map((q) => {
      if (q.multiple) {
        const sel = a[q.id] as string[];
        return q.options.reduce((mask, o, i) => (sel.includes(o.id) ? mask | (1 << i) : mask), 0).toString();
      }
      return q.options.findIndex((o) => o.id === a[q.id]).toString();
    })
    .join("-");
}

export function decodeAnswers(code: string | null | undefined): Answers | null {
  if (!code || !/^[0-9]+(-[0-9]+){9}$/.test(code)) return null;
  const parts = code.split("-").map(Number);
  const out: Record<string, string | string[]> = {};
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const n = parts[i];
    if (q.multiple) {
      const sel = q.options.filter((_, j) => n & (1 << j)).map((o) => o.id);
      if (sel.length === 0) return null;
      out[q.id] = sel;
    } else {
      const opt = q.options[n];
      if (!opt) return null;
      out[q.id] = opt.id;
    }
  }
  return out as Answers;
}
