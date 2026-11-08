import type { Course } from "@/data/types";
import { site } from "@/data/site";

/** Génère et télécharge le programme d'une formation au format texte (Markdown). */
export function downloadSyllabus(course: Course) {
  const lines = [
    `# ${course.title}`,
    "",
    course.subtitle,
    "",
    `Niveau : ${course.level} · Durée estimée : ${course.hours} h · Prérequis : ${course.prerequisites}`,
    "",
    "## Objectifs pédagogiques",
    ...course.objectives.map((o) => `- ${o}`),
    "",
    "## Compétences développées",
    ...course.skills.map((s) => `- ${s}`),
    "",
    "## Programme",
    ...course.modules.flatMap((m, i) => [`### Module ${i + 1} — ${m.title} (${m.hours} h)`, ...m.lessons.map((l) => `- ${l}`), ""]),
    `Budget de départ indicatif : ${course.startBudget.note}`,
    "",
    `— ${site.name}`,
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `programme-${course.slug}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
