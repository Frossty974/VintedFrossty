# NO LARP — plateforme d'orientation et de formation

Site Next.js d'une plateforme qui aide les 16-30 ans à découvrir les domaines qui leur correspondent (e-commerce, marchés financiers, IA et création de contenu, business digital) et à se former.


## Démarrer

```bash
cd web
npm install
cp .env.example .env.local   # facultatif : le site fonctionne sans configuration
npm run dev                  # http://localhost:3000
```

Autres commandes :

| Commande | Rôle |
| --- | --- |
| `npm run build` | Build de production (78 pages pré-générées) |
| `npm start` | Lance le build de production |
| `npm run typecheck` | Vérification TypeScript |
| `npm test` | Tests de l'algorithme d'orientation et de la cohérence du catalogue |

## Ce qui fonctionne sans configuration

Tout le site est navigable et fonctionnel sans clé externe :

- **Questionnaire d'orientation** (modale « Trouver ma voie » ou page `/orientation`) : 10 questions, calcul réel des scores, page de résultats et parcours personnalisé.
- **Catalogue** : 4 domaines, 24 fiches formations complètes, filtres et recherche.
- **Espace membre en mode démo** : création de compte, historique des questionnaires, accès aperçu aux formations, suivi de progression par leçon, téléchargement du programme. En mode démo, les données restent dans le navigateur et c'est indiqué à l'écran.
- **Formulaires** (contact, liste d'attente) : validation côté client et serveur, anti-robots, limitation de débit. Sans Supabase, les envois sont acceptés mais ne sont pas enregistrés (un message est écrit dans les logs du serveur).

## Formations de la communauté et certification

- `/proposer` : n'importe quel membre connecté propose une formation (programme complet, objectifs, prix). Un **pré-contrôle automatique** (`src/lib/community/precheck.ts`) bloque les promesses de revenus, l'absence de risque affirmée, etc.
- `/admin` : l'équipe relit, puis **approuve et certifie**, **demande des modifications** (message obligatoire) ou **refuse**. Une alerte bloquante empêche l'approbation.
- L'auteur suit le statut et les retours dans `/espace`, corrige et renvoie.
- Une formation approuvée reçoit le badge **Certifié NO LARP** et rejoint le catalogue (filtre « Communauté certifiée »).
- Avec Supabase, seuls les comptes listés dans la table `admins` accèdent à la modération :
  `insert into public.admins (user_id) values ('<uuid>');`

## Classement hebdomadaire

`/classement` (et un aperçu sur l'accueil) classe les formations selon leur activité réelle de la semaine (lundi → dimanche) :
`score = visites × 1 + inscriptions × 5 + leçons terminées × 2`, une visite = un visiteur unique par jour.
Les événements sont anonymes (identifiant aléatoire du navigateur) et passent par `/api/track`. Le classement est calculé par la fonction SQL `course_popularity`. Sans Supabase, il ne compte que l'activité du navigateur (signalé à l'écran). Aucune donnée n'est inventée : sans activité, la page l'indique.

## Ce qu'il reste à configurer

### 1. Supabase (comptes et base de données)

1. Créer un projet sur supabase.com.
2. Dans *SQL Editor*, exécuter `supabase/schema.sql` (tables + règles de sécurité RLS).
3. Dans *Authentication > URL Configuration*, ajouter l'URL du site (et `http://localhost:3000` en local) aux URL de redirection.
4. Renseigner dans `.env.local` :
   - `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` (*Project Settings > API*)
   - `SUPABASE_SERVICE_ROLE_KEY` (même page ; **ne jamais l'exposer côté client**)

Le site bascule alors automatiquement du mode démo vers Supabase.

### 2. Stripe (paiements, phase 2)

Le code est prêt (`/api/checkout` et `/api/stripe/webhook`) mais inactif tant que les clés sont absentes : les fiches proposent alors une liste d'attente.

1. Renseigner `STRIPE_SECRET_KEY` et `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. Créer un webhook Stripe vers `https://<domaine>/api/stripe/webhook` sur l'événement `checkout.session.completed`, puis renseigner `STRIPE_WEBHOOK_SECRET`.
3. Le prix est toujours lu côté serveur depuis le catalogue. Après paiement, le webhook enregistre l'inscription (`status = 'paid'`).

### 3. Contenu à compléter avant la mise en ligne

- **Pages légales** (`src/data/legal.ts`) : modèles à compléter (éléments entre crochets) et à faire valider par un juriste.
- **Tarifs** (`price` dans `src/data/courses/*`) : tarifs indicatifs, signalés comme tels sur le site.
- **Équipe** (page À propos) : section volontairement vide plutôt que remplie de profils fictifs.
- **Vidéos des leçons** : le lecteur affiche un emplacement en attendant les contenus.
- `NEXT_PUBLIC_SITE_URL` : URL publique (SEO, sitemap).

## Architecture

```
src/
  app/                     Pages (App Router) et routes API
  components/
    orientation/           Questionnaire, modale, page de résultats
    catalog/               Cartes, programme, inscription
    account/               Authentification, tableau de bord, lecteur de formation
    home/, layout/, ui/    Accueil, en-tête/pied de page, composants de base
  data/
    domains.ts             Domaines
    courses/               Une fiche par formation, regroupées par domaine
    faq.ts, legal.ts, site.ts
  lib/
    orientation/           Questions, pistes et moteur de scoring (+ tests)
    account/               Couche données : Supabase ou mode démo
    server/                Accès serveur (Supabase admin, Stripe, limitation de débit)
    validation.ts          Schémas Zod partagés client/serveur
supabase/schema.sql        Schéma de base de données
```

### Ajouter un domaine

1. Ajouter une entrée dans `src/data/domains.ts`.
2. Créer `src/data/courses/<domaine>.ts` et l'ajouter dans `src/data/courses/index.ts`.
3. Ajouter une ou plusieurs pistes dans `src/lib/orientation/tracks.ts` pour que le questionnaire puisse le recommander.
4. `npm test` vérifie que les formations et pistes référencées existent et que les heures des modules sont cohérentes.

Les pages, le sitemap, les filtres et la page Méthode se mettent à jour automatiquement.

### Algorithme d'orientation

`src/lib/orientation/engine.ts` calcule pour chaque piste un score pondéré (intérêts 30, type de travail 18, objectif 14, temps 14, budget 12, niveau 6, horizon 6), puis applique des garde-fous : plafond à 62 % si le budget est insuffisant, à 40 % pour les activités réservées aux majeurs, avertissement systématique sur les risques financiers. Le score est une compatibilité, pas une probabilité de réussite. La méthode est publiée sur la page `/methode`.
