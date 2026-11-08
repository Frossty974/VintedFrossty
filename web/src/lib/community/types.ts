import type { Course, CourseModule, Level } from "../../data/types.ts";

export type SubmissionStatus = "pending" | "changes" | "approved" | "rejected";

/** Contenu saisi par l'auteur (la durée totale est calculée à partir des modules). */
export interface CourseContent {
  title: string;
  subtitle: string;
  domain: string;
  level: Level;
  price: number;
  presentation: string;
  objectives: string[];
  skills: string[];
  prerequisites: string;
  startBudget: { min: number; max: number; note: string };
  modules: CourseModule[];
  resources: string[];
}

export interface CommunityCourse {
  id: string;
  status: SubmissionStatus;
  authorId: string;
  authorName: string;
  content: CourseContent;
  createdAt: string;
  updatedAt: string;
  reviewNote?: string;
  certifiedAt?: string;
}

export const statusLabel: Record<SubmissionStatus, string> = {
  pending: "En cours de vérification",
  changes: "Modifications demandées",
  approved: "Certifiée NO LARP",
  rejected: "Refusée",
};

export const communitySlug = (id: string) => `c-${id}`;
export const isCommunitySlug = (slug: string) => /^c-[a-z0-9]{6,32}$/.test(slug);
export const idFromSlug = (slug: string) => slug.slice(2);

export function totalHours(modules: CourseModule[]): number {
  return Math.round(modules.reduce((s, m) => s + (Number(m.hours) || 0), 0) * 10) / 10;
}

export function toCourse(cc: CommunityCourse): Course {
  const c = cc.content;
  return {
    slug: communitySlug(cc.id),
    domain: c.domain,
    title: c.title,
    subtitle: c.subtitle,
    presentation: c.presentation,
    objectives: c.objectives,
    skills: c.skills,
    level: c.level,
    prerequisites: c.prerequisites,
    hours: totalHours(c.modules),
    startBudget: c.startBudget,
    price: c.price,
    modules: c.modules,
    resources: c.resources,
    community: { id: cc.id, author: cc.authorName, certifiedAt: cc.certifiedAt },
  };
}

export function courseHref(course: Pick<Course, "slug" | "community">): string {
  return course.community ? `/formations/c/${course.community.id}` : `/formations/${course.slug}`;
}
