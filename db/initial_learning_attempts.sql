-- Samajh v2: cloud storage only for learner-owned practice observations.
-- Hosted migration name: initial_learning_attempts.
create table public.learning_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  task_id text not null check (task_id in ('mic','share','blur','pdf','access','form','join','copy')),
  transfer boolean not null,
  hints integer not null check (hints between 0 and 10000),
  completed_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, task_id, transfer, hints, completed_at)
);

alter table public.learning_attempts enable row level security;
revoke all on public.learning_attempts from public, anon, authenticated;
grant select, insert, delete on public.learning_attempts to authenticated;

create policy "Read own practice observations" on public.learning_attempts
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own practice observations" on public.learning_attempts
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Delete own practice observations" on public.learning_attempts
  for delete to authenticated using ((select auth.uid()) = user_id);

-- No privileged functions, anonymous grants, file storage or arbitrary personal data.
-- These client-submitted records are learning observations, not competency certificates.
