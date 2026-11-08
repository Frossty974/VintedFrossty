// Modèles de documents légaux. Les éléments entre crochets [ ] sont à compléter.
// Ces textes doivent être relus et validés par un professionnel du droit avant la mise en production.

import { site } from "./site";

export interface LegalSection {
  h: string;
  p?: string[];
  ul?: string[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}

const n = site.name;

export const legalDocs: LegalDoc[] = [
  {
    slug: "mentions-legales",
    title: "Mentions légales",
    intro: "Informations relatives à l'éditeur et à l'hébergeur du site, conformément à la loi pour la confiance dans l'économie numérique.",
    sections: [
      { h: "Éditeur du site", ul: [`Raison sociale : ${site.legalName}`, "Forme juridique et capital : [à compléter]", "Siège social : [adresse]", "RCS / SIREN : [numéro]", "Numéro de TVA intracommunautaire : [numéro]", "Directeur de la publication : [nom]", `Contact : ${site.email}`] },
      { h: "Hébergement", ul: ["Hébergeur : [nom de l'hébergeur]", "Adresse : [adresse]", "Téléphone : [numéro]"] },
      { h: "Propriété intellectuelle", p: [`L'ensemble des contenus du site (textes, programmes, visuels, logo, code) est la propriété de ${n} ou de ses partenaires. Toute reproduction sans autorisation écrite est interdite.`] },
      { h: "Activité de formation", p: ["Numéro de déclaration d'activité de prestataire de formation : [à compléter le cas échéant]. Cet enregistrement ne vaut pas agrément de l'État.", "Les contenus relatifs aux marchés financiers sont exclusivement pédagogiques. Ils ne constituent ni un conseil en investissement, ni une recommandation personnalisée, ni une incitation à investir."] },
    ],
  },
  {
    slug: "cgv",
    title: "Conditions générales d'utilisation et de vente",
    intro: `Les présentes conditions régissent l'utilisation du site ${n} et l'achat de formations en ligne.`,
    sections: [
      { h: "1. Objet", p: [`${n} propose un questionnaire d'orientation gratuit et des formations en ligne payantes. L'utilisation du site implique l'acceptation des présentes conditions.`] },
      { h: "2. Compte utilisateur", p: ["La création d'un compte est gratuite. L'utilisateur s'engage à fournir des informations exactes et à préserver la confidentialité de ses identifiants.", "Les mineurs de moins de 15 ans doivent disposer de l'accord d'un titulaire de l'autorité parentale. Tout achat par un mineur requiert l'accord de ses représentants légaux."] },
      { h: "3. Formations et prix", p: ["Le contenu de chaque formation (objectifs, programme, durée estimée, niveau requis) est décrit sur sa fiche. Les prix sont indiqués en euros toutes taxes comprises.", "Le budget de départ indiqué sur chaque fiche correspond à des dépenses facultatives et indépendantes du prix de la formation (outils, abonnements, tests)."] },
      { h: "4. Absence de garantie de résultat", p: [`${n} s'engage sur la qualité pédagogique de ses contenus, mais ne garantit aucun résultat professionnel ou financier. Les résultats dépendent de l'implication de chacun et de facteurs extérieurs.`, "Les formations relatives aux marchés financiers et aux crypto-actifs ne constituent pas un conseil en investissement. Investir comporte un risque de perte en capital."] },
      { h: "5. Paiement et accès", p: ["Le paiement s'effectue en ligne par l'intermédiaire d'un prestataire de paiement sécurisé. L'accès à la formation est ouvert dès confirmation du paiement, pour une durée illimitée sous réserve de la poursuite de l'activité de la plateforme."] },
      { h: "6. Droit de rétractation et remboursement", p: ["Les conditions de rétractation et de remboursement sont détaillées dans la politique de remboursement, qui fait partie intégrante des présentes conditions."] },
      { h: "7. Propriété intellectuelle", p: ["L'accès à une formation confère un droit d'utilisation personnel et non transférable. Le partage des identifiants et la diffusion des contenus sont interdits."] },
      { h: "8. Droit applicable et litiges", p: ["Les présentes conditions sont soumises au droit français. En cas de litige, le consommateur peut recourir gratuitement à un médiateur de la consommation : [nom et coordonnées du médiateur]."] },
    ],
  },
  {
    slug: "confidentialite",
    title: "Politique de confidentialité",
    intro: "Nous collectons le minimum de données nécessaires et ne les revendons jamais. Cette politique explique quelles données sont traitées, pourquoi et comment exercer tes droits.",
    sections: [
      { h: "Responsable du traitement", p: [`${site.legalName}, joignable à ${site.email}.`] },
      { h: "Questionnaire d'orientation", p: ["Sans compte, tes réponses ne quittent pas ton navigateur : elles sont encodées dans l'adresse de la page de résultats et conservées localement sur ton appareil.", "Si tu es connecté, ton résultat est enregistré dans ton espace pour que tu puisses le retrouver. Il n'est jamais utilisé à des fins publicitaires ni cédé à des tiers."] },
      { h: "Données collectées", ul: ["Compte : prénom, adresse e-mail, mot de passe (chiffré par notre prestataire d'authentification).", "Formations : inscriptions, progression, achats.", "Formulaires : nom, e-mail et contenu de ton message ou de ta demande d'information.", "Données techniques : journaux de sécurité nécessaires au fonctionnement du service."] },
      { h: "Finalités et bases légales", ul: ["Fournir le service et l'accès aux formations (exécution du contrat).", "Répondre à tes demandes (consentement).", "Te prévenir de l'ouverture d'une formation (consentement, retirable à tout moment).", "Respecter nos obligations comptables (obligation légale)."] },
      { h: "Durées de conservation", ul: ["Compte : jusqu'à sa suppression, puis 3 ans maximum pour les données de facturation non obligatoires.", "Messages de contact et liste d'attente : 3 ans après le dernier échange.", "Pièces comptables : 10 ans."] },
      { h: "Sous-traitants", p: ["Hébergement : [hébergeur]. Base de données et authentification : Supabase. Paiement : Stripe. Ces prestataires agissent sur nos instructions et offrent des garanties conformes au RGPD."] },
      { h: "Tes droits", p: [`Tu disposes d'un droit d'accès, de rectification, d'effacement, d'opposition, de limitation et de portabilité. Pour les exercer : ${site.email}. Tu peux également introduire une réclamation auprès de la CNIL.`] },
      { h: "Cookies", p: ["Le site n'utilise pas de cookies publicitaires. Seuls des éléments techniques strictement nécessaires (session, préférences) sont stockés sur ton appareil."] },
    ],
  },
  {
    slug: "remboursement",
    title: "Politique de remboursement",
    intro: "Nous voulons que tu achètes en confiance. Voici comment fonctionnent la rétractation et le remboursement.",
    sections: [
      { h: "Garantie 14 jours", p: ["Tu peux demander le remboursement intégral d'une formation dans les 14 jours suivant l'achat, sans avoir à te justifier, tant que tu as consulté moins de 30 % de ses leçons. [Seuils à valider avant l'ouverture des paiements.]"] },
      { h: "Droit légal de rétractation", p: ["Conformément au Code de la consommation, le droit de rétractation de 14 jours ne s'applique plus aux contenus numériques dont l'exécution a commencé avec ton accord exprès et ta renonciation expresse à ce droit. Notre garantie commerciale ci-dessus va au-delà de cette obligation légale."] },
      { h: "Comment demander un remboursement", ul: [`Écris à ${site.email} depuis l'adresse de ton compte en précisant la formation concernée.`, "Nous confirmons la recevabilité sous 5 jours ouvrés.", "Le remboursement est effectué sur le moyen de paiement utilisé, sous 14 jours maximum."] },
      { h: "Après remboursement", p: ["L'accès à la formation remboursée est désactivé. Ta progression et tes résultats d'orientation restent dans ton espace."] },
    ],
  },
];

export function getLegalDoc(slug: string) {
  return legalDocs.find((d) => d.slug === slug);
}
