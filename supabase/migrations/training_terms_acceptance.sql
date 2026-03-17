-- Training Terms Acceptance tracking
-- Records when users accept the Training Materials Terms of Use (with version tracking)

create table if not exists training_terms_acceptance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  terms_version text not null default '1.0',
  accepted_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);

-- Index for fast lookups by user
create index if not exists idx_training_terms_user on training_terms_acceptance(user_id);

-- Unique constraint: one acceptance per user per version
create unique index if not exists idx_training_terms_user_version on training_terms_acceptance(user_id, terms_version);

-- RLS
alter table training_terms_acceptance enable row level security;

-- Experts can read and insert their own acceptance records
create policy "Users can view own terms acceptance"
  on training_terms_acceptance for select
  using (auth.uid() = user_id);

create policy "Users can accept terms"
  on training_terms_acceptance for insert
  with check (auth.uid() = user_id);

-- Admins/staff can view all acceptance records
create policy "Admins can view all terms acceptance"
  on training_terms_acceptance for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'staff')
    )
  );
