import { test } from "node:test";
import assert from "node:assert/strict";
import { computeOrientation } from "./engine.ts";
import { encodeAnswers, decodeAnswers, type Answers } from "./questions.ts";
import { tracks } from "./tracks.ts";
import { courses } from "../../data/courses/index.ts";
import { domains } from "../../data/domains.ts";

const base: Answers = {
  age: "18-21", situation: "student", time: "3-5", budget: "50-100", goal: "income",
  interests: ["tech", "marketing"], level: "beginner", workStyle: "create", horizon: "2-3m", difficulty: "start",
};

const show = (a: Answers) => computeOrientation(a, courses).ranking.map((r) => `${r.track.id}:${r.score}`).join("  ");

test("exemple du brief : contenu IA en tête, trading en bas", () => {
  const r = computeOrientation(base, courses).ranking;
  console.log("  brief  ", show(base));
  assert.equal(r[0].track.id, "contenu-ia");
  assert.ok(r.findIndex((x) => x.track.id === "trading") >= 5);
  assert.ok(r.find((x) => x.track.id === "ecommerce")!.warnings.some((w) => w.kind === "budget"));
});

test("budget nul : e-commerce plafonné et signalé", () => {
  const a = { ...base, budget: "0", interests: ["business"], workStyle: "sell", goal: "company" } as Answers;
  console.log("  budget0", show(a));
  const e = computeOrientation(a, courses).ranking.find((x) => x.track.id === "ecommerce")!;
  assert.ok(e.score <= 62);
  assert.ok(e.warnings.some((w) => w.kind === "budget"));
});

test("mineur intéressé par la finance : trading plafonné avec avertissement d'âge", () => {
  const a = { ...base, age: "u18", interests: ["finance"], workStyle: "analyze", goal: "longterm", horizon: "1y" } as Answers;
  console.log("  minor  ", show(a));
  const t = computeOrientation(a, courses).ranking.find((x) => x.track.id === "trading")!;
  assert.ok(t.score <= 40);
  assert.ok(t.warnings.some((w) => w.kind === "age"));
});

test("profil finance patient : investissement long terme en tête", () => {
  const a = { ...base, age: "22-25", interests: ["finance"], workStyle: "analyze", goal: "longterm", horizon: "1y", time: "5-10" } as Answers;
  console.log("  finance", show(a));
  assert.equal(computeOrientation(a, courses).ranking[0].track.id, "investissement");
});

test("les scores restent entre 5 et 97 et les pistes à risque sont toujours signalées", () => {
  const a = { ...base, interests: ["unknown"], workStyle: "open" } as Answers;
  for (const r of computeOrientation(a, courses).ranking) {
    assert.ok(r.score >= 5 && r.score <= 97);
    if (r.track.financialRisk) assert.ok(r.warnings.some((w) => w.kind === "risk"));
  }
});

test("encodage des réponses aller-retour", () => {
  const code = encodeAnswers(base);
  assert.deepEqual(decodeAnswers(code), base);
  assert.equal(decodeAnswers("1-2-3"), null);
  assert.equal(decodeAnswers("9-9-9-9-9-0-9-9-9-9"), null);
});

test("cohérence du catalogue", () => {
  const slugs = new Set(courses.map((c) => c.slug));
  assert.equal(slugs.size, courses.length, "slugs uniques");
  for (const t of tracks) {
    assert.ok(domains.some((d) => d.slug === t.domain), t.id);
    for (const c of t.courses) assert.ok(slugs.has(c), `${t.id} -> ${c}`);
  }
  for (const c of courses) {
    assert.ok(domains.some((d) => d.slug === c.domain), c.slug);
    const sum = c.modules.reduce((s, m) => s + m.hours, 0);
    assert.equal(sum, c.hours, `${c.slug}: modules ${sum}h vs ${c.hours}h`);
  }
});
