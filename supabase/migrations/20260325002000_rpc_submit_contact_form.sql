-- RPC: submit_contact_form
-- Allows inserting a contact submission + selected services without requiring service-role key.
-- Uses SECURITY DEFINER to bypass RLS safely with server-side validation.

create or replace function public.submit_contact_form(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_name text;
  v_email text;
  v_phone text;
  v_company text;
  v_website text;
  v_message text;
  v_budget text;
  v_timeline text;
  v_consent boolean;
  v_source text;
  v_page_path text;
  v_referrer text;
  v_user_agent text;
  v_ip_hash text;
  v_time_ms integer;
  v_honeypot text;
  v_services_ids text[];
  v_services_labels text[];
begin
  v_name := nullif(trim(coalesce(payload->>'name','')), '');
  v_email := lower(nullif(trim(coalesce(payload->>'email','')), ''));
  v_phone := nullif(trim(coalesce(payload->>'phone','')), '');
  v_company := nullif(trim(coalesce(payload->>'company','')), '');
  v_website := nullif(trim(coalesce(payload->>'website','')), '');
  v_message := nullif(trim(coalesce(payload->>'message','')), '');
  v_budget := nullif(trim(coalesce(payload->>'budget_range','')), '');
  v_timeline := nullif(trim(coalesce(payload->>'timeline','')), '');
  v_consent := coalesce((payload->>'consent')::boolean, true);
  v_source := coalesce(nullif(trim(payload->>'source'), ''), 'contact_form');
  v_page_path := nullif(trim(coalesce(payload->>'page_path','')), '');
  v_referrer := nullif(trim(coalesce(payload->>'referrer','')), '');
  v_user_agent := nullif(trim(coalesce(payload->>'user_agent','')), '');
  v_ip_hash := nullif(trim(coalesce(payload->>'ip_hash','')), '');
  v_time_ms := nullif(trim(coalesce(payload->>'time_to_submit_ms','')), '')::int;
  v_honeypot := nullif(trim(coalesce(payload->>'honeypot','')), '');

  if v_name is null or length(v_name) < 2 then
    raise exception 'Invalid name';
  end if;
  if v_email is null or position('@' in v_email) = 0 then
    raise exception 'Invalid email';
  end if;
  if v_source not in ('contact_form','popup') then
    raise exception 'Invalid source';
  end if;
  if v_honeypot is not null then
    raise exception 'Blocked';
  end if;

  -- Services IDs array from JSON
  select coalesce(array_agg(value::text), '{}'::text[])
  into v_services_ids
  from jsonb_array_elements_text(coalesce(payload->'services_ids', '[]'::jsonb));

  if coalesce(array_length(v_services_ids, 1), 0) < 1 then
    raise exception 'Select at least one service';
  end if;

  if v_source = 'contact_form' then
    if v_message is null or length(v_message) < 10 then
      raise exception 'Message too short';
    end if;
  end if;

  -- Map service ids to labels (only active services)
  select coalesce(array_agg(coalesce(o.label, s.id) order by s.ord), '{}'::text[])
  into v_services_labels
  from unnest(v_services_ids) with ordinality as s(id, ord)
  left join public.contact_service_options o
    on o.id = s.id and o.is_active = true;

  insert into public.contact_submissions (
    name,
    email,
    phone,
    company,
    website,
    message,
    budget_range,
    timeline,
    consent,
    services_ids,
    services_labels,
    source,
    page_path,
    referrer,
    user_agent,
    ip_hash,
    time_to_submit_ms,
    honeypot,
    is_bot,
    bot_reason,
    status,
    raw_payload
  )
  values (
    v_name,
    v_email,
    v_phone,
    v_company,
    v_website,
    v_message,
    v_budget,
    v_timeline,
    v_consent,
    v_services_ids,
    v_services_labels,
    v_source,
    v_page_path,
    v_referrer,
    v_user_agent,
    v_ip_hash,
    v_time_ms,
    null,
    false,
    null,
    'new',
    coalesce(payload, '{}'::jsonb)
  )
  returning id into v_id;

  -- Insert join rows only for services that exist
  insert into public.contact_submission_services (submission_id, service_id)
  select v_id, o.id
  from public.contact_service_options o
  where o.id = any(v_services_ids);

  return v_id;
end;
$$;

-- Allow anon/authenticated to call RPC
grant execute on function public.submit_contact_form(jsonb) to anon, authenticated;