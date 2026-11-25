create table public.practice_reviewers (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table public.practice_submissions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  pack text not null check (pack in ('files','meetings','sharing','safety')),
  title text not null check (char_length(btrim(title)) between 5 and 80),
  goal text not null check (char_length(btrim(goal)) between 8 and 240),
  steps text[] not null check (cardinality(steps) between 3 and 5 and array_ndims(steps) = 1
    and array_position(steps,null) is null and char_length(array_to_string(steps,' ')) <= 1104
    and array_to_string(steps,' ') !~* 'https?://|www\.|<|>'),
  success_check text not null check (char_length(btrim(success_check)) between 8 and 240),
  credit text not null default '' check (char_length(credit) <= 40),
  status text not null default 'pending' check (status in ('pending','published','declined','archived')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  check (concat_ws(' ',title,goal,success_check,credit) !~* 'https?://|www\.|<|>')
);

create table public.community_practices (
  id uuid primary key references public.practice_submissions(id) on delete cascade,
  pack text not null check (pack in ('files','meetings','sharing','safety')),
  title text not null,
  goal text not null,
  steps text[] not null,
  success_check text not null,
  credit text not null,
  reviewed_at timestamptz not null default now()
);

create table public.practice_reports (
  practice_id uuid not null references public.community_practices(id) on delete cascade,
  reporter_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  reason text not null check (reason in ('unclear','unsafe','outdated','other')),
  created_at timestamptz not null default now(),
  primary key (practice_id, reporter_id)
);

create index practice_submissions_owner_created_idx on public.practice_submissions(owner_id, created_at desc);
create index practice_submissions_review_queue_idx on public.practice_submissions(created_at) where status = 'pending';
create index community_practices_reviewed_idx on public.community_practices(reviewed_at desc);
create index practice_reports_reporter_idx on public.practice_reports(reporter_id);

alter table public.practice_reviewers enable row level security;
alter table public.practice_submissions enable row level security;
alter table public.community_practices enable row level security;
alter table public.practice_reports enable row level security;

revoke all on public.practice_reviewers, public.practice_submissions, public.community_practices, public.practice_reports from public, anon, authenticated;
grant select on public.practice_reviewers to authenticated;
grant select on public.practice_submissions to authenticated;
grant insert (pack,title,goal,steps,success_check,credit) on public.practice_submissions to authenticated;
grant update (status,reviewed_at) on public.practice_submissions to authenticated;
grant select on public.community_practices to anon, authenticated;
grant insert, delete on public.community_practices to authenticated;
grant select, delete on public.practice_reports to authenticated;
grant insert (practice_id,reason) on public.practice_reports to authenticated;

create policy reviewer_reads_own_membership on public.practice_reviewers for select to authenticated
  using (user_id = (select auth.uid()));
create policy read_own_or_review_submissions on public.practice_submissions for select to authenticated
  using (owner_id = (select auth.uid()) or (select exists(select 1 from public.practice_reviewers where user_id = auth.uid())));
create policy author_submits_pending on public.practice_submissions for insert to authenticated
  with check (owner_id = (select auth.uid()) and status = 'pending' and reviewed_at is null);
create policy reviewer_updates_state on public.practice_submissions for update to authenticated
  using ((select exists(select 1 from public.practice_reviewers where user_id = auth.uid())))
  with check ((select exists(select 1 from public.practice_reviewers where user_id = auth.uid())));
create policy read_public_catalog on public.community_practices for select to anon, authenticated using (true);
create policy reviewer_publishes on public.community_practices for insert to authenticated
  with check ((select exists(select 1 from public.practice_reviewers where user_id = auth.uid())));
create policy reviewer_unpublishes on public.community_practices for delete to authenticated
  using ((select exists(select 1 from public.practice_reviewers where user_id = auth.uid())));
create policy report_own on public.practice_reports for insert to authenticated
  with check (reporter_id = (select auth.uid()));
create policy reviewer_reads_reports on public.practice_reports for select to authenticated
  using ((select exists(select 1 from public.practice_reviewers where user_id = auth.uid())));
create policy reviewer_resolves_reports on public.practice_reports for delete to authenticated
  using ((select exists(select 1 from public.practice_reviewers where user_id = auth.uid())));

-- Enforce contribution limits and step shape even on direct Data API writes.
create function public.check_practice_submission() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if exists (select 1 from unnest(new.steps) as step(body) where char_length(btrim(body)) not between 3 and 220) then
    raise exception 'Every step needs 3–220 characters' using errcode = '23514';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.owner_id::text, 813));
  if (select count(*) from public.practice_submissions where owner_id = new.owner_id and created_at > now() - interval '1 day') >= 5 then
    raise exception 'Daily contribution limit reached' using errcode = '23514';
  end if;
  if (select count(*) from public.practice_submissions where owner_id = new.owner_id and status = 'pending') >= 3 then
    raise exception 'Finish review of pending contributions first' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function public.check_practice_submission() from public, anon, authenticated;
create trigger check_practice_submission before insert on public.practice_submissions
  for each row execute function public.check_practice_submission();

-- This invoker routine needs the same reviewer grants/policies as direct reads.
create function public.review_practice(practice uuid, decision text) returns void
language plpgsql security invoker set search_path = '' as $$
declare
  entry public.practice_submissions;
begin
  if not exists(select 1 from public.practice_reviewers where user_id = auth.uid()) then
    raise exception 'Reviewer access required' using errcode = '42501';
  end if;
  if decision = 'archive' then
    update public.practice_submissions set status = 'archived', reviewed_at = now()
      where id = practice and status = 'published' returning * into entry;
    if not found then raise exception 'Practice is not published' using errcode = '22023'; end if;
    delete from public.community_practices where id = practice;
  elsif decision in ('publish','decline') then
    update public.practice_submissions set status = case when decision = 'publish' then 'published' else 'declined' end, reviewed_at = now()
      where id = practice and status = 'pending' returning * into entry;
    if not found then raise exception 'Practice is not pending review' using errcode = '22023'; end if;
    if decision = 'publish' then
      insert into public.community_practices(id,pack,title,goal,steps,success_check,credit,reviewed_at)
        values(entry.id,entry.pack,entry.title,entry.goal,entry.steps,entry.success_check,entry.credit,entry.reviewed_at);
    end if;
  else
    raise exception 'Unknown review decision' using errcode = '22023';
  end if;
end;
$$;
revoke all on function public.review_practice(uuid,text) from public, anon, authenticated;
grant execute on function public.review_practice(uuid,text) to authenticated;
