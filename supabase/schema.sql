create table if not exists public.portal_clients (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_admin_client_access (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_tasks (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_documents (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_criteria (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_team_members (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_pr_articles (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_awards (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_research_papers (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_monthly_activity (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_service_progress (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_notifications (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_messages (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_memberships (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_webinars (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_podcasts (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_books (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_jury_work (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_settings (
  key text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  role text not null check (role in ('superadmin', 'admin', 'client', 'team', 'consultant')),
  avatar text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portal_clients enable row level security;
alter table public.portal_admin_client_access enable row level security;
alter table public.portal_tasks enable row level security;
alter table public.portal_documents enable row level security;
alter table public.portal_criteria enable row level security;
alter table public.portal_team_members enable row level security;
alter table public.portal_pr_articles enable row level security;
alter table public.portal_awards enable row level security;
alter table public.portal_research_papers enable row level security;
alter table public.portal_monthly_activity enable row level security;
alter table public.portal_service_progress enable row level security;
alter table public.portal_notifications enable row level security;
alter table public.portal_messages enable row level security;
alter table public.portal_memberships enable row level security;
alter table public.portal_webinars enable row level security;
alter table public.portal_podcasts enable row level security;
alter table public.portal_books enable row level security;
alter table public.portal_jury_work enable row level security;
alter table public.portal_settings enable row level security;
alter table public.portal_profiles enable row level security;

drop policy if exists "portal profiles authenticated read" on public.portal_profiles;
drop policy if exists "portal profiles own update" on public.portal_profiles;
drop policy if exists "portal profiles superadmin manage" on public.portal_profiles;

create policy "portal profiles authenticated read" on public.portal_profiles
  for select to authenticated using (true);

create policy "portal profiles own update" on public.portal_profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "portal profiles superadmin manage" on public.portal_profiles
  for all to authenticated
  using (exists (
    select 1 from public.portal_profiles p
    where p.id = auth.uid() and p.role = 'superadmin' and p.active = true
  ))
  with check (exists (
    select 1 from public.portal_profiles p
    where p.id = auth.uid() and p.role = 'superadmin' and p.active = true
  ));

drop policy if exists "portal anon read clients" on public.portal_clients;
drop policy if exists "portal anon read access" on public.portal_admin_client_access;
drop policy if exists "portal anon write access" on public.portal_admin_client_access;
drop policy if exists "portal anon read tasks" on public.portal_tasks;
drop policy if exists "portal anon read documents" on public.portal_documents;
drop policy if exists "portal anon read criteria" on public.portal_criteria;
drop policy if exists "portal anon read team" on public.portal_team_members;
drop policy if exists "portal anon read pr" on public.portal_pr_articles;
drop policy if exists "portal anon read awards" on public.portal_awards;
drop policy if exists "portal anon read research" on public.portal_research_papers;
drop policy if exists "portal anon read activity" on public.portal_monthly_activity;
drop policy if exists "portal anon read service progress" on public.portal_service_progress;
drop policy if exists "portal anon read notifications" on public.portal_notifications;
drop policy if exists "portal anon read messages" on public.portal_messages;
drop policy if exists "portal anon read memberships" on public.portal_memberships;
drop policy if exists "portal anon read webinars" on public.portal_webinars;
drop policy if exists "portal anon read podcasts" on public.portal_podcasts;
drop policy if exists "portal anon read books" on public.portal_books;
drop policy if exists "portal anon read jury" on public.portal_jury_work;
drop policy if exists "portal anon read settings" on public.portal_settings;

create policy "portal anon read clients" on public.portal_clients for select to anon using (true);
create policy "portal anon read access" on public.portal_admin_client_access for select to anon using (true);
create policy "portal anon write access" on public.portal_admin_client_access for all to anon using (true) with check (true);
create policy "portal anon read tasks" on public.portal_tasks for select to anon using (true);
create policy "portal anon read documents" on public.portal_documents for select to anon using (true);
create policy "portal anon read criteria" on public.portal_criteria for select to anon using (true);
create policy "portal anon read team" on public.portal_team_members for select to anon using (true);
create policy "portal anon read pr" on public.portal_pr_articles for select to anon using (true);
create policy "portal anon read awards" on public.portal_awards for select to anon using (true);
create policy "portal anon read research" on public.portal_research_papers for select to anon using (true);
create policy "portal anon read activity" on public.portal_monthly_activity for select to anon using (true);
create policy "portal anon read service progress" on public.portal_service_progress for select to anon using (true);
create policy "portal anon read notifications" on public.portal_notifications for select to anon using (true);
create policy "portal anon read messages" on public.portal_messages for select to anon using (true);
create policy "portal anon read memberships" on public.portal_memberships for select to anon using (true);
create policy "portal anon read webinars" on public.portal_webinars for select to anon using (true);
create policy "portal anon read podcasts" on public.portal_podcasts for select to anon using (true);
create policy "portal anon read books" on public.portal_books for select to anon using (true);
create policy "portal anon read jury" on public.portal_jury_work for select to anon using (true);
create policy "portal anon read settings" on public.portal_settings for select to anon using (true);
