// Classement hebdomadaire de popularité, calculé à partir d'événements réels.

export type EventType = "view" | "enroll" | "lesson";

export interface CourseEvent {
  slug: string;
  type: EventType;
  at: string; // ISO
}

export interface Counts {
  slug: string;
  views: number;
  enrollments: number;
  lessons: number;
}

export interface RankRow extends Counts {
  rank: number;
  score: number;
  previousRank: number | null;
}

/** Pondération publique : une inscription pèse plus qu'une simple visite. */
export const POPULARITY_WEIGHTS = { view: 1, enroll: 5, lesson: 2 } as const;

/** Début de semaine (lundi 00:00, heure locale). */
export function weekStart(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = (x.getDay() + 6) % 7; // lundi = 0
  x.setDate(x.getDate() - day);
  return x;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function aggregate(events: CourseEvent[], from: Date, to: Date): Counts[] {
  const map = new Map<string, Counts>();
  for (const e of events) {
    const t = new Date(e.at).getTime();
    if (t < from.getTime() || t >= to.getTime()) continue;
    const c = map.get(e.slug) ?? { slug: e.slug, views: 0, enrollments: 0, lessons: 0 };
    if (e.type === "view") c.views++;
    else if (e.type === "enroll") c.enrollments++;
    else c.lessons++;
    map.set(e.slug, c);
  }
  return [...map.values()];
}

export function score(c: Counts): number {
  return c.views * POPULARITY_WEIGHTS.view + c.enrollments * POPULARITY_WEIGHTS.enroll + c.lessons * POPULARITY_WEIGHTS.lesson;
}

function order(list: Counts[]): Counts[] {
  return [...list].filter((c) => score(c) > 0).sort((a, b) => score(b) - score(a) || b.enrollments - a.enrollments || a.slug.localeCompare(b.slug));
}

/** Classe la semaine en cours et indique le rang de la semaine précédente. */
export function rank(current: Counts[], previous: Counts[] = []): RankRow[] {
  const prev = new Map(order(previous).map((c, i) => [c.slug, i + 1]));
  return order(current).map((c, i) => ({ ...c, rank: i + 1, score: score(c), previousRank: prev.get(c.slug) ?? null }));
}
