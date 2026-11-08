// Modèle de données du catalogue.
// Pour ajouter un domaine : ajouter une entrée dans domains.ts, ses formations dans courses/,
// puis (optionnel) une ou plusieurs pistes d'orientation dans lib/orientation/tracks.ts.

export type Accent = "electric" | "violet" | "cyan" | "emerald";

export type IconName =
  | "cart"
  | "chart"
  | "spark"
  | "compass"
  | "arrow-right"
  | "arrow-left"
  | "check"
  | "close"
  | "chevron-down"
  | "clock"
  | "wallet"
  | "layers"
  | "shield"
  | "alert"
  | "play"
  | "download"
  | "user"
  | "target"
  | "route"
  | "book"
  | "eye"
  | "scale"
  | "flag"
  | "lock"
  | "mail"
  | "menu"
  | "logout"
  | "refresh";

export type Level = "Débutant" | "Intermédiaire" | "Avancé";

export interface BudgetRange {
  min: number;
  max: number;
  note: string;
}

export interface Domain {
  slug: string;
  name: string;
  short: string;
  icon: IconName;
  accent: Accent;
  tagline: string;
  description: string;
  opportunities: string[];
  difficulties: string[];
  skills: string[];
  timeToStart: string;
  weeklyTime: string;
  startBudget: BudgetRange;
  /** Avertissement affiché en évidence sur le domaine et toutes ses formations. */
  riskNotice?: string;
}

export interface CourseModule {
  title: string;
  hours: number;
  lessons: string[];
}

export interface Course {
  slug: string;
  domain: string;
  title: string;
  subtitle: string;
  presentation: string;
  objectives: string[];
  skills: string[];
  level: Level;
  prerequisites: string;
  hours: number;
  startBudget: BudgetRange;
  /** Prix en euros TTC. Tarif de démonstration tant que la grille réelle n'est pas fixée. */
  price: number;
  modules: CourseModule[];
  popular?: boolean;
  resources: string[];
}
