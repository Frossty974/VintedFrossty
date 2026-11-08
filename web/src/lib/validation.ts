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
