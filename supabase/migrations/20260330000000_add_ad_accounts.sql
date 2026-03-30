-- Store connected advertising/reviews accounts per brand (Google, Meta, etc.)
-- Safe to run multiple times.

-- Ensure UUID generation is available (Supabase usually has this already).
create extension if not exists pgcrypto;

create table if not exists public.ad_accounts (
  id uuid not null default gen_random_uuid(),
  brand_id uuid not null,
  provider text not null,
  account_id text not null,
  account_name text not null,
  token_id uuid null,
  status text not null default 'connected'::text,
  connected_at timestamp with time zone not null default now(),
  disconnected_at timestamp with time zone null,
  constraint ad_accounts_pkey primary key (id),
  constraint ad_accounts_brand_id_provider_account_id_key unique (brand_id, provider, account_id),
  constraint ad_accounts_brand_id_fkey foreign key (brand_id) references public.brands (id) on delete cascade,
  constraint ad_accounts_token_id_fkey foreign key (token_id) references public.auth_tokens (id) on delete set null
);

create index if not exists idx_ad_accounts_brand on public.ad_accounts using btree (brand_id);
create index if not exists idx_ad_accounts_provider on public.ad_accounts using btree (provider);

