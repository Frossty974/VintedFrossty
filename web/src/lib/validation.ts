import { z } from "zod";

// Schémas partagés entre les formulaires (client) et les routes API (serveur).

const email = z.string().trim().min(1, "Indique ton adresse e-mail.").email("Adresse e-mail invalide.").max(200);

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Indique ton prénom (2 caractères minimum).").max(60),
  email,
  password: z.string().min(8, "8 caractères minimum.").max(128).regex(/[A-Za-z]/, "Au moins une lettre.").regex(/[0-9]/, "Au moins un chiffre."),
  consent: z.literal(true, { error: "Tu dois accepter les conditions pour continuer." }),
  age: z.literal(true, { error: "Cette confirmation est nécessaire." }),
});

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Indique ton mot de passe."),
});

export const resetSchema = z.object({ email });

export const waitlistSchema = z.object({
  email,
  name: z.string().trim().max(60).optional().default(""),
  course: z.string().trim().max(120),
  consent: z.literal(true, { error: "Ton accord est nécessaire pour être recontacté." }),
  website: z.string().max(0).optional().default(""), // champ piège anti-robots
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indique ton nom.").max(80),
  email,
  subject: z.enum(["orientation", "formation", "partenariat", "presse", "autre"], { error: "Choisis un sujet." }),
  message: z.string().trim().min(20, "Ton message doit faire au moins 20 caractères.").max(4000, "4 000 caractères maximum."),
  consent: z.literal(true, { error: "Ton accord est nécessaire pour traiter ta demande." }),
  website: z.string().max(0).optional().default(""),
});

export type FieldErrors = Record<string, string>;

export function toFieldErrors(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const k = String(issue.path[0] ?? "form");
    if (!out[k]) out[k] = issue.message;
  }
  return out;
}

// ---------- Soumission d'une formation par la communauté ----------

const line = (min: number, max: number, label: string) =>
  z.string().trim().min(min, `${label} : ${min} caractères minimum.`).max(max, `${label} : ${max} caractères maximum.`);

export const courseSubmissionSchema = z.object({
  title: line(6, 90, "Titre"),
  subtitle: line(10, 140, "Sous-titre"),
  domain: z.enum(["e-commerce", "trading", "ia-contenu", "business-digital"], { error: "Choisis un domaine." }),
  level: z.enum(["Débutant", "Intermédiaire", "Avancé"], { error: "Choisis un niveau." }),
  price: z.number({ error: "Indique un prix." }).min(0, "Prix invalide.").max(2000, "2 000 € maximum."),
  presentation: line(80, 2000, "Présentation"),
  objectives: z.array(line(5, 160, "Objectif")).min(2, "Au moins 2 objectifs.").max(8, "8 objectifs maximum."),
  skills: z.array(line(2, 40, "Compétence")).min(2, "Au moins 2 compétences.").max(10, "10 compétences maximum."),
  prerequisites: line(3, 300, "Prérequis"),
  startBudget: z
    .object({ min: z.number().min(0).max(100000), max: z.number().min(0).max(100000), note: z.string().trim().max(200) })
    .refine((b) => b.max >= b.min, { message: "Le budget maximum doit être supérieur au minimum." }),
  modules: z
    .array(
      z.object({
        title: line(3, 90, "Titre de module"),
        hours: z.number({ error: "Durée invalide." }).min(0.25, "Durée minimum : 0,25 h.").max(40, "40 h maximum par module."),
        lessons: z.array(line(3, 120, "Leçon")).min(1, "Au moins 1 leçon par module.").max(15, "15 leçons maximum."),
      }),
    )
    .min(2, "Au moins 2 modules.")
    .max(15, "15 modules maximum."),
  resources: z.array(line(3, 120, "Ressource")).max(10),
});

export const submissionCommitmentsSchema = z.object({
  original: z.literal(true, { error: "Engagement requis." }),
  noPromise: z.literal(true, { error: "Engagement requis." }),
  accuracy: z.literal(true, { error: "Engagement requis." }),
});

export const trackSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]{3,80}$/),
  type: z.enum(["view", "enroll", "lesson"]),
  visitor: z.string().regex(/^[a-z0-9-]{8,64}$/),
});

/** Erreurs indexées par chemin complet (ex. "modules.1.lessons.0"), pour les formulaires imbriqués. */
export function toPathErrors(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const k = issue.path.join(".") || "form";
    if (!out[k]) out[k] = issue.message;
  }
  return out;
}
