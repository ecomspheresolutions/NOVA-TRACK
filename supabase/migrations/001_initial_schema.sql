-- NOVA TRACK — initial Supabase schema
-- Run after enabling Supabase Auth. All application rows are owned by auth.users.

create extension if not exists pgcrypto;

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  done boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  streak integer not null default 0 check (streak >= 0),
  last_completed_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  started_at timestamptz,
  completed_at timestamptz,
  minutes integer not null check (minutes > 0),
  status text not null default 'completed'
    check (status in ('completed','cancelled','interrupted'))
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  time time not null default localtime,
  type text not null,
  text text not null,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  unlocked_at timestamptz not null default now(),
  unique (user_id, key)
);

create index if not exists goals_user_id_idx on public.goals(user_id);
create index if not exists habits_user_id_idx on public.habits(user_id);
create index if not exists focus_sessions_user_date_idx on public.focus_sessions(user_id, date);
create index if not exists timeline_events_user_date_idx on public.timeline_events(user_id, date);
create index if not exists achievements_user_id_idx on public.achievements(user_id);

alter table public.goals enable row level security;
alter table public.habits enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.timeline_events enable row level security;
alter table public.achievements enable row level security;

create policy "Users can manage their own goals"
on public.goals for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own habits"
on public.habits for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own focus sessions"
on public.focus_sessions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own timeline"
on public.timeline_events for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own achievements"
on public.achievements for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
