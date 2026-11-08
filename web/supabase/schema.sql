-- Schéma Supabase pour la plateforme.
-- À exécuter dans Supabase > SQL Editor. Toutes les tables sont protégées par Row Level Security (RLS).

-- Résultats du questionnaire d'orientation
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null check (code ~ '^[0-9]+(-[0-9]+){9}$'),
  top jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists quiz_results_user_idx on public.quiz_results(user_id, created_at desc);
alter table public.quiz_results enable row level security;
create policy "quiz: lecture de ses résultats" on public.quiz_results for select using (auth.uid() = user_id);
create policy "quiz: ajout de ses résultats" on public.quiz_results for insert with check (auth.uid() = user_id);
create policy "quiz: suppression de ses résultats" on public.quiz_results for delete using (auth.uid() = user_id);

-- Inscriptions aux formations ("preview" = accès aperçu gratuit, "paid" = achat confirmé par le webhook Stripe)
create table if not exists public.enrollments (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  status text not null default 'preview' check (status in ('preview', 'paid')),
  stripe_session_id text,
  created_at timestamptz not null default now(),
  primary key (user_id, course_slug)
);
alter table public.enrollments enable row level security;
create policy "enrollments: lecture des siennes" on public.enrollments for select using (auth.uid() = user_id);
-- Un utilisateur ne peut créer lui-même qu'un accès aperçu. Le statut "paid" est écrit uniquement par le serveur (clé service).
create policy "enrollments: activation aperçu" on public.enrollments for insert with check (auth.uid() = user_id and status = 'preview');

-- Progression par leçon (clé "module-leçon", ex. "0-2")
create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_key text not null check (lesson_key ~ '^[0-9]+-[0-9]+$'),
  completed_at timestamptz not null default now(),
  primary key (user_id, course_slug, lesson_key)
);
alter table public.lesson_progress enable row level security;
create policy "progress: lecture" on public.lesson_progress for select using (auth.uid() = user_id);
create policy "progress: ajout" on public.lesson_progress for insert with check (
  auth.uid() = user_id and exists (select 1 from public.enrollments e where e.user_id = auth.uid() and e.course_slug = lesson_progress.course_slug)
);
create policy "progress: mise à jour" on public.lesson_progress for update using (auth.uid() = user_id);
create policy "progress: suppression" on public.lesson_progress for delete using (auth.uid() = user_id);

-- Liste d'attente et messages de contact : écrits uniquement par les routes API (clé service), aucune lecture publique.
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null,
  name text,
  course_slug text not null,
  created_at timestamptz not null default now(),
  unique (email, course_slug)
);
alter table public.waitlist enable row level security;

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
