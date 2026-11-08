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

-- =====================================================================
-- Formations proposées par la communauté + modération + certification
-- =====================================================================

-- Comptes autorisés à modérer. Ajouter un modérateur :
--   insert into public.admins (user_id) values ('<uuid de l''utilisateur>');
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create table if not exists public.community_courses (
  id text primary key default substr(md5(random()::text || clock_timestamp()::text), 1, 10),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  status text not null default 'pending' check (status in ('pending', 'changes', 'approved', 'rejected')),
  content jsonb not null,
  review_note text,
  reviewed_at timestamptz,
  certified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists community_courses_status_idx on public.community_courses(status);
alter table public.community_courses enable row level security;

-- Lecture : formations certifiées pour tous, ses propres soumissions, tout pour les modérateurs.
create policy "community: lecture" on public.community_courses for select
  using (status = 'approved' or author_id = auth.uid() or public.is_admin());
-- Création : uniquement en attente, jamais pré-certifiée.
create policy "community: soumission" on public.community_courses for insert
  with check (author_id = auth.uid() and status = 'pending' and certified_at is null);
-- Modification par l'auteur : tant que non validée, et repasse forcément en vérification.
create policy "community: modification auteur" on public.community_courses for update
  using (author_id = auth.uid() and status in ('pending', 'changes'))
  with check (author_id = auth.uid() and status = 'pending' and certified_at is null);
-- Modération.
create policy "community: modération" on public.community_courses for update
  using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- Popularité : événements anonymes et classement hebdomadaire
-- =====================================================================
create table if not exists public.course_events (
  id bigint generated always as identity primary key,
  course_slug text not null,
  type text not null check (type in ('view', 'enroll', 'lesson')),
  visitor text not null,
  created_at timestamptz not null default now()
);
create index if not exists course_events_time_idx on public.course_events(created_at);
alter table public.course_events enable row level security; -- écriture via l'API serveur uniquement

-- Agrégat public (aucune donnée individuelle exposée). Une vue = un visiteur distinct par jour.
create or replace function public.course_popularity(from_ts timestamptz, to_ts timestamptz)
returns table (course_slug text, views bigint, enrollments bigint, lessons bigint)
language sql stable security definer set search_path = public as $$
  select course_slug,
         count(distinct (visitor, date_trunc('day', created_at))) filter (where type = 'view') as views,
         count(*) filter (where type = 'enroll') as enrollments,
         count(*) filter (where type = 'lesson') as lessons
  from public.course_events
  where created_at >= from_ts and created_at < to_ts
  group by course_slug;
$$;
grant execute on function public.course_popularity(timestamptz, timestamptz) to anon, authenticated;
grant execute on function public.is_admin() to authenticated;
