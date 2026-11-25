-- All fixtures and operations below are rolled back in a subtransaction.
do $$
declare
  author uuid := gen_random_uuid();
  other_user uuid := gen_random_uuid();
  reviewer uuid := gen_random_uuid();
  draft uuid;
  changed integer;
begin
  begin
    insert into auth.users(id) values (author),(other_user),(reviewer);
    insert into public.practice_reviewers(user_id) values (reviewer);

    set local role authenticated;
    perform set_config('request.jwt.claim.sub',author::text,true);
    perform set_config('request.jwt.claims',json_build_object('sub',author,'role','authenticated')::text,true);
    insert into public.practice_submissions(pack,title,goal,steps,success_check,credit)
      values('files','Synthetic policy practice','Open a test file safely.',array['Open folder','Find the file','Read the name'],'The name matches its label.','Example author')
      returning id into draft;
    if not exists(select 1 from public.practice_submissions where id = draft and status = 'pending') then raise exception 'Author cannot see pending row'; end if;
    update public.practice_submissions set status = 'published' where id = draft;
    get diagnostics changed = row_count;
    if changed <> 0 then raise exception 'Author bypassed moderation'; end if;
    begin
      perform public.review_practice(draft,'publish');
      raise exception 'Author could call reviewer action';
    exception when insufficient_privilege then null;
    end;
    begin
      insert into public.practice_submissions(owner_id,pack,title,goal,steps,success_check)
        values(other_user,'files','Attempted ownership change','Test ownership enforcement.',array['One step','Two steps','Three steps'],'Permission must be denied.');
      raise exception 'Author could set another owner';
    exception when insufficient_privilege then null;
    end;

    perform set_config('request.jwt.claim.sub',other_user::text,true);
    perform set_config('request.jwt.claims',json_build_object('sub',other_user,'role','authenticated')::text,true);
    if exists(select 1 from public.practice_submissions where id = draft) then raise exception 'Second account saw private submission'; end if;
    if exists(select 1 from public.community_practices where id = draft) then raise exception 'Draft was published prematurely'; end if;

    set local role anon;
    perform set_config('request.jwt.claim.sub','',true);
    perform set_config('request.jwt.claims','{"role":"anon"}',true);
    begin
      perform 1 from public.practice_submissions where id = draft;
      raise exception 'Anonymous visitor could select submissions';
    exception when insufficient_privilege then null;
    end;
    if exists(select 1 from public.community_practices where id = draft) then raise exception 'Anonymous visitor saw draft'; end if;

    set local role authenticated;
    perform set_config('request.jwt.claim.sub',reviewer::text,true);
    perform set_config('request.jwt.claims',json_build_object('sub',reviewer,'role','authenticated')::text,true);
    perform public.review_practice(draft,'publish');

    set local role anon;
    perform set_config('request.jwt.claim.sub','',true);
    perform set_config('request.jwt.claims','{"role":"anon"}',true);
    if not exists(select 1 from public.community_practices where id = draft and credit = 'Example author') then raise exception 'Published card not visible to guests'; end if;

    set local role authenticated;
    perform set_config('request.jwt.claim.sub',other_user::text,true);
    perform set_config('request.jwt.claims',json_build_object('sub',other_user,'role','authenticated')::text,true);
    insert into public.practice_reports(practice_id,reason) values(draft,'unclear');
    begin
      insert into public.practice_reports(practice_id,reason) values(draft,'unsafe');
      raise exception 'Duplicate report was accepted';
    exception when unique_violation then null;
    end;
    if exists(select 1 from public.practice_reports where practice_id = draft) then raise exception 'A non-reviewer could read reports'; end if;

    perform set_config('request.jwt.claim.sub',reviewer::text,true);
    perform set_config('request.jwt.claims',json_build_object('sub',reviewer,'role','authenticated')::text,true);
    if not exists(select 1 from public.practice_reports where practice_id = draft) then raise exception 'Reviewer cannot see report'; end if;
    perform public.review_practice(draft,'archive');
    if exists(select 1 from public.community_practices where id = draft) then raise exception 'Archived card remained public'; end if;
    if exists(select 1 from public.practice_reports where practice_id = draft) then raise exception 'Archive did not clear its reports'; end if;
    reset role;

    raise exception using errcode = 'ZX007', message = 'Test completed; roll back all fixtures';
  exception when sqlstate 'ZX007' then
    if exists(select 1 from auth.users where id in (author,other_user,reviewer)) then raise exception 'Fixture rollback did not occur'; end if;
  end;
end;
$$;
select 'PASS: author isolation, anonymous read boundary, reviewer publication, report and archive; fixtures rolled back' as result;
