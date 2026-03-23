-- SOP Training Hub: staff_profiles, sop_training_progress, sop_quiz_attempts
-- Run against your Supabase project via the SQL editor or CLI.

-- 1. staff_profiles ----------------------------------------------------------
create table if not exists public.staff_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null,
  role       text not null check (role in ('Case Coordinator','Account Manager','Billing/Finance','Admin')),
  hire_date  date default current_date,
  created_at timestamptz default now()
);

alter table public.staff_profiles enable row level security;

create policy "Staff read own profile"
  on public.staff_profiles for select
  using (auth.uid() = id);

create policy "Admins read all staff profiles"
  on public.staff_profiles for select
  using (
    exists (
      select 1 from public.staff_profiles sp
      where sp.id = auth.uid() and sp.role = 'Admin'
    )
  );

create policy "Admins insert staff profiles"
  on public.staff_profiles for insert
  with check (
    exists (
      select 1 from public.staff_profiles sp
      where sp.id = auth.uid() and sp.role = 'Admin'
    )
  );

-- 2. sop_training_progress ---------------------------------------------------
create table if not exists public.sop_training_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  module_id       text not null,
  completed       boolean default false,
  quiz_score      integer default 0,
  attempts        integer default 0,
  last_attempt_at timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique (user_id, module_id)
);

alter table public.sop_training_progress enable row level security;

create policy "Users read own sop training progress"
  on public.sop_training_progress for select
  using (auth.uid() = user_id);

create policy "Users insert own sop training progress"
  on public.sop_training_progress for insert
  with check (auth.uid() = user_id);

create policy "Users update own sop training progress"
  on public.sop_training_progress for update
  using (auth.uid() = user_id);

create policy "Admins read all sop training progress"
  on public.sop_training_progress for select
  using (
    exists (
      select 1 from public.staff_profiles sp
      where sp.id = auth.uid() and sp.role = 'Admin'
    )
  );

-- Auto-update updated_at on row change
create or replace function public.sop_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_sop_training_progress_updated_at
  before update on public.sop_training_progress
  for each row execute function public.sop_set_updated_at();

-- 3. sop_quiz_attempts -------------------------------------------------------
create table if not exists public.sop_quiz_attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  module_id    text not null,
  score        integer not null,
  answers      jsonb not null default '[]'::jsonb,
  attempted_at timestamptz default now()
);

alter table public.sop_quiz_attempts enable row level security;

create policy "Users read own sop quiz attempts"
  on public.sop_quiz_attempts for select
  using (auth.uid() = user_id);

create policy "Users insert own sop quiz attempts"
  on public.sop_quiz_attempts for insert
  with check (auth.uid() = user_id);

create policy "Admins read all sop quiz attempts"
  on public.sop_quiz_attempts for select
  using (
    exists (
      select 1 from public.staff_profiles sp
      where sp.id = auth.uid() and sp.role = 'Admin'
    )
  );

-- 4. sop_training_overview view ----------------------------------------------
create or replace view public.sop_training_overview as
select
  sp.id          as user_id,
  sp.full_name,
  sp.role,
  sp.hire_date,
  tp.module_id,
  tp.completed,
  tp.quiz_score,
  tp.attempts,
  tp.completed_at,
  tp.last_attempt_at
from public.staff_profiles sp
left join public.sop_training_progress tp on tp.user_id = sp.id;

-- 5. Indexes -----------------------------------------------------------------
create index if not exists idx_sop_training_progress_user_id
  on public.sop_training_progress (user_id);

create index if not exists idx_sop_training_progress_module_id
  on public.sop_training_progress (module_id);

create index if not exists idx_sop_quiz_attempts_user_id
  on public.sop_quiz_attempts (user_id);

create index if not exists idx_sop_quiz_attempts_module_id
  on public.sop_quiz_attempts (module_id);
