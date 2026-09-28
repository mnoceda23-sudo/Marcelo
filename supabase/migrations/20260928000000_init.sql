-- BUILD THE NEXT: initial schema.
-- Every table is owned by one user (auth.uid()) and protected by Row Level Security.

-- Per-user configuration: cycle dates, targets, monthly goals, schedule.
create table public.settings (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  config     jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- One row per user per day: training, deep work, nutrition, body measurements,
-- project KPIs, priorities and notes. Transactions live in their own table.
create table public.daily_logs (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date       date not null,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

create table public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date        date not null,
  tipo        text not null check (tipo in ('gasto', 'ingreso', 'deuda', 'transferencia', 'inversion')),
  monto       numeric(12, 2) not null check (monto > 0),
  cat         text,
  clase       text check (clase is null or clase in ('fijo', 'variable', 'viaje', 'proyecto')),
  descripcion text,
  trip_id     text,
  created_at  timestamptz not null default now()
);
create index transactions_user_date_idx on public.transactions (user_id, date);

create table public.weekly_reviews (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  semana     int not null check (semana between 1 and 53),
  score      int check (score between 0 and 100),
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (user_id, semana)
);

create table public.trips (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id         text not null,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- Row Level Security: each signed-in user can only see and change their own rows.
do $$
declare t text;
begin
  foreach t in array array['settings', 'daily_logs', 'transactions', 'weekly_reviews', 'trips'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format($p$create policy "own rows: select" on public.%I for select to authenticated using ((select auth.uid()) = user_id)$p$, t);
    execute format($p$create policy "own rows: insert" on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)$p$, t);
    execute format($p$create policy "own rows: update" on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)$p$, t);
    execute format($p$create policy "own rows: delete" on public.%I for delete to authenticated using ((select auth.uid()) = user_id)$p$, t);
  end loop;
end $$;
