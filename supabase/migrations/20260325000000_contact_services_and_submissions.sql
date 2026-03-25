-- Contact form: store submissions + normalized services.
-- Safe to run multiple times (IF NOT EXISTS / ON CONFLICT).
--
-- Tables:
-- - contact_submissions: stores every submit payload + metadata
-- - contact_service_options: master list of selectable services ("What you need")
-- - contact_submission_services: join table (many-to-many)

-- Ensure UUID generation is available (Supabase usually has this already).
create extension if not exists pgcrypto;

-- 1) Master services list
create table if not exists public.contact_service_options (
  id text primary key,
  group_name text not null,
  label text not null,
  description text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists idx_contact_service_options_group on public.contact_service_options using btree (group_name);
create index if not exists idx_contact_service_options_active on public.contact_service_options using btree (is_active);

-- 2) Submissions (create if missing; otherwise alter to expected shape)
create table if not exists public.contact_submissions (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),

  -- Lead fields
  name text not null,
  email text not null,
  phone text null,
  company text null,
  website text null,
  message text null,
  budget_range text null,
  timeline text null,
  consent boolean not null default true,

  -- Selected services
  services_ids text[] not null default '{}'::text[],
  services_labels text[] not null default '{}'::text[],

  -- Metadata / anti-bot
  source text not null default 'contact_form',
  page_path text null,
  referrer text null,
  user_agent text null,
  ip_hash text null,
  time_to_submit_ms integer null,
  honeypot text null,
  is_bot boolean not null default false,
  bot_reason text null,
  status text not null default 'new',

  -- Raw payload for future debugging/backfills
  raw_payload jsonb not null default '{}'::jsonb,

  constraint contact_submissions_pkey primary key (id)
);

-- If the table existed previously with different columns, add missing ones.
alter table public.contact_submissions
  add column if not exists updated_at timestamp with time zone not null default now();
alter table public.contact_submissions
  add column if not exists consent boolean not null default true;
alter table public.contact_submissions
  add column if not exists services_ids text[] not null default '{}'::text[];
alter table public.contact_submissions
  add column if not exists services_labels text[] not null default '{}'::text[];
alter table public.contact_submissions
  add column if not exists raw_payload jsonb not null default '{}'::jsonb;
alter table public.contact_submissions
  add column if not exists source text not null default 'contact_form';
alter table public.contact_submissions
  add column if not exists page_path text null;
alter table public.contact_submissions
  add column if not exists referrer text null;
alter table public.contact_submissions
  add column if not exists user_agent text null;
alter table public.contact_submissions
  add column if not exists ip_hash text null;
alter table public.contact_submissions
  add column if not exists time_to_submit_ms integer null;
alter table public.contact_submissions
  add column if not exists honeypot text null;
alter table public.contact_submissions
  add column if not exists is_bot boolean not null default false;
alter table public.contact_submissions
  add column if not exists bot_reason text null;
alter table public.contact_submissions
  add column if not exists status text not null default 'new';

create index if not exists idx_contact_submissions_created_at on public.contact_submissions using btree (created_at);
create index if not exists idx_contact_submissions_status on public.contact_submissions using btree (status);
create index if not exists idx_contact_submissions_ip_hash on public.contact_submissions using btree (ip_hash);

-- 3) Join table: which services were selected for each submission
create table if not exists public.contact_submission_services (
  submission_id uuid not null,
  service_id text not null,
  created_at timestamp with time zone not null default now(),
  constraint contact_submission_services_pkey primary key (submission_id, service_id),
  constraint contact_submission_services_submission_fkey foreign key (submission_id) references public.contact_submissions (id) on delete cascade,
  constraint contact_submission_services_service_fkey foreign key (service_id) references public.contact_service_options (id) on delete restrict
);

create index if not exists idx_contact_submission_services_service on public.contact_submission_services using btree (service_id);

-- Seed / upsert service options (IDs match frontend)
insert into public.contact_service_options (id, group_name, label, description, sort_order, is_active)
values
  -- MLM & Direct Selling
  ('mlm_software','MLM & Direct Selling','MLM Software','Binary/Matrix/Board plans, genealogy, wallets, dashboards, apps.',10,true),
  ('direct_selling_software','MLM & Direct Selling','Direct Selling Software','Distributor onboarding, inventory, franchise, incentives, compliance.',20,true),
  ('consulting_launch','MLM & Direct Selling','Consulting & Business Setup','Company registration, plan design, SOPs, training & rollout support.',30,true),

  -- Software Development
  ('custom_software','Software Development','Custom Software Development','Web apps, portals, automation, integrations.',10,true),
  ('web_development','Software Development','Web Development','Fast websites, landing pages, performance + SEO foundations.',20,true),
  ('mobile_apps','Software Development','Mobile App Development','Android/iOS apps for customers, distributors, and admins.',30,true),
  ('portals_ecommerce','Software Development','Shopping/Travel Portals','Shopping portal & travel portal development with integrations.',40,true),
  ('api_integrations','Software Development','API & Payment Integrations','Payment gateways, SMS/WhatsApp, e-commerce, analytics, CRMs.',50,true),

  -- Digital Marketing
  ('seo','Digital Marketing','SEO Services','On-page, technical SEO, content, reporting.',10,true),
  ('sem_smo','Digital Marketing','SEM / SMO','Ads + social growth with measurable ROI.',20,true),
  ('messaging_marketing','Digital Marketing','WhatsApp / SMS / Email Marketing','Automations, templates, campaigns, segmentation.',30,true),
  ('content_writing','Digital Marketing','Content Writing','Blogs, landing pages, website copy aligned to SEO intent.',40,true),

  -- Design & Creative
  ('uiux','Design & Creative','UI/UX & Web Design','Modern UI, conversions, accessibility, brand consistency.',10,true),
  ('graphic_brand','Design & Creative','Graphic / Logo / Brand','Logo, corporate identity, creatives, print-ready assets.',20,true),
  ('brochure_print','Design & Creative','Brochure / Posters / Printing','Brochures, flyers, posters, digital printing services.',30,true),

  -- Products / Brands
  ('aiml','Products / Brands','AIMLM Software (Product)','Existing product—support, onboarding, upgrades, customization.',10,true),
  ('tripgate','Products / Brands','Tripgate.in (Product)','Travel product—setup, integrations, or business onboarding.',20,true),
  ('verifizy','Products / Brands','Verifizy (Product)','Verification product—integrations, onboarding, support.',30,true),

  -- Other
  ('support_maintenance','Other','Support & Maintenance','Monitoring, updates, security hardening, SLA.',10,true),
  ('not_sure','Other','Not sure (Help me choose)','Tell us your goal—we’ll recommend the best service stack.',20,true)
on conflict (id) do update set
  group_name = excluded.group_name,
  label = excluded.label,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

