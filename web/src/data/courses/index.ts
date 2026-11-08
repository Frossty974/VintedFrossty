import type { Course } from "../types";
import { ecommerceCourses } from "./e-commerce.ts";
import { tradingCourses } from "./trading.ts";
import { iaCourses } from "./ia-contenu.ts";
import { businessCourses } from "./business-digital.ts";

export const courses: Course[] = [...ecommerceCourses, ...tradingCourses, ...iaCourses, ...businessCourses];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getCoursesByDomain(domain: string): Course[] {
  return courses.filter((c) => c.domain === domain);
}

export const popularCourses = courses.filter((c) => c.popular);

export function lessonCount(course: Course): number {
  return course.modules.reduce((n, m) => n + m.lessons.length, 0);
}
