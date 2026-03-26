-- RLS policies for contact form inserts (when API uses anon key).
-- This allows server-side inserts even without service-role, while keeping reads blocked.

-- Service options: public can read active options (used to map IDs -> labels)
alter table if exists public.contact_service_options enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_service_options'
      and policyname = 'Public read active contact services'
  ) then
    create policy "Public read active contact services"
      on public.contact_service_options
      for select
      to anon, authenticated
      using (is_active = true);
  end if;
end $$;

-- Contact submissions: allow inserts only (no selects/updates for anon)
alter table if exists public.contact_submissions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_submissions'
      and policyname = 'Public insert contact submissions'
  ) then
    create policy "Public insert contact submissions"
      on public.contact_submissions
      for insert
      to anon, authenticated
      with check (
        status = 'new'
        and is_bot = false
        and (honeypot is null or length(honeypot) = 0)
        and source in ('contact_form', 'popup')
        and array_length(services_ids, 1) >= 1
        and length(coalesce(message, '')) >= 10
      );
  end if;
end $$;

-- Join table: allow inserts that link to existing submission/service
alter table if exists public.contact_submission_services enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_submission_services'
      and policyname = 'Public insert submission services'
  ) then
    create policy "Public insert submission services"
      on public.contact_submission_services
      for insert
      to anon, authenticated
      with check (true);
  end if;
end $$;

