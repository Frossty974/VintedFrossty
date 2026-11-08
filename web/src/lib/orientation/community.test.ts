import { test } from "node:test";
import assert from "node:assert/strict";
import { aggregate, rank, weekStart, addDays, type CourseEvent } from "../ranking/index.ts";
import { precheck } from "../community/precheck.ts";
import { toCourse, isCommunitySlug, communitySlug, type CommunityCourse } from "../community/types.ts";

test("classement : pondération, tri et évolution", () => {
  const ws = weekStart(new Date("2026-11-11T12:00:00"));
  assert.equal(ws.getDay(), 1);
  const at = (d: number) => addDays(ws, d).toISOString();
  const prevAt = (d: number) => addDays(ws, d - 7).toISOString();
  const ev: CourseEvent[] = [
    ...Array(10).fill(0).map(() => ({ slug: "a", type: "view" as const, at: at(1) })),
    { slug: "b", type: "enroll", at: at(2) }, { slug: "b", type: "enroll", at: at(2) }, { slug: "b", type: "view", at: at(2) },
    { slug: "c", type: "lesson", at: at(3) },
    { slug: "a", type: "enroll", at: prevAt(1) },
    { slug: "c", type: "view", at: at(9) }, // hors semaine
  ];
  const cur = aggregate(ev, ws, addDays(ws, 7));
  const prev = aggregate(ev, addDays(ws, -7), ws);
  const r = rank(cur, prev);
  assert.deepEqual(r.map((x) => [x.slug, x.score]), [["b", 11], ["a", 10], ["c", 2]]);
  assert.equal(r[1].previousRank, 1);
  assert.equal(r[0].previousRank, null);
});

test("pré-contrôle : promesses de revenus détectées", () => {
  const base = { title: "Vendre en ligne", subtitle: "x", domain: "e-commerce", level: "Débutant" as const, price: 50, presentation: "Gagne 5000 €/mois sans risque", objectives: [], skills: [], prerequisites: "", startBudget: { min: 0, max: 0, note: "" }, modules: [], resources: [] };
  const flags = precheck(base);
  assert.ok(flags.filter((f) => f.level === "block").length >= 2);
  assert.equal(precheck({ ...base, presentation: "Apprendre à analyser un marché." }).length, 0);
});

test("formation communautaire → fiche catalogue", () => {
  const cc: CommunityCourse = { id: "ab12cd34", status: "approved", authorId: "u", authorName: "Lina", createdAt: "", updatedAt: "", certifiedAt: "2026-11-08",
    content: { title: "T", subtitle: "S", domain: "ia-contenu", level: "Débutant", price: 30, presentation: "P", objectives: ["o"], skills: ["s"], prerequisites: "", startBudget: { min: 0, max: 0, note: "" }, modules: [{ title: "M1", hours: 1.5, lessons: ["l"] }, { title: "M2", hours: 2, lessons: ["l"] }], resources: [] } };
  const c = toCourse(cc);
  assert.equal(c.slug, communitySlug("ab12cd34"));
  assert.equal(c.hours, 3.5);
  assert.ok(isCommunitySlug(c.slug));
  assert.ok(!isCommunitySlug("analyse-technique"));
});
