-- Pulse core schema — Phase 1: users, vehicles, leads. RLS on.
-- Idempotent-ish: guarded with "if not exists" where Postgres allows.

-- Supabase ships pgcrypto preinstalled (in the `extensions` schema) which provides
-- gen_random_uuid(). We declare it idempotently to be explicit; we do NOT depend on
-- uuid-ossp / uuid_generate_v4 (not available in some Supabase projects).
create extension if not exists pgcrypto with schema extensions;

do $$ begin
  create type lead_status as enum ('new','contacted','qualified','quoted','booked','completed','lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type vehicle_status as enum ('available','on_trip','maintenance','retired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('owner','admin','agent','viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_type as enum
    ('car','jet','yacht','jet_ski','chauffeur','restaurant','nightlife','concierge','residence','other');
exception when duplicate_object then null; end $$;

create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  role user_role not null default 'viewer',
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  make text not null,
  model text not null,
  year int not null,
  trim text,
  body_style text,
  color_exterior text,
  color_interior text,
  horsepower int,
  zero_sixty numeric,
  top_speed int,
  transmission text,
  drivetrain text,
  seats int,
  daily_rate numeric,
  weekly_rate numeric,
  weekend_rate numeric,
  included_miles int,
  delivery_fee numeric,
  status vehicle_status not null default 'available',
  current_location text,
  description text,
  gallery jsonb not null default '[]'::jsonb,
  hero_image_url text,
  hero_video_url text,
  is_featured boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  service_type service_type not null default 'other',
  vehicle_id uuid references public.vehicles(id) on delete set null,
  start_date date,
  end_date date,
  party_size int,
  budget_tier text,
  message text,
  source text not null default 'website',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer_url text,
  landing_page text,
  status lead_status not null default 'new',
  lost_reason text,
  owner_id uuid references public.users(id) on delete set null,
  client_id uuid,
  last_contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists users_touch on public.users;
create trigger users_touch before update on public.users
  for each row execute function public.touch_updated_at();
drop trigger if exists vehicles_touch on public.vehicles;
create trigger vehicles_touch before update on public.vehicles
  for each row execute function public.touch_updated_at();
drop trigger if exists leads_touch on public.leads;
create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

alter table public.users enable row level security;
alter table public.vehicles enable row level security;
alter table public.leads enable row level security;

drop policy if exists "Public read available vehicles" on public.vehicles;
create policy "Public read available vehicles" on public.vehicles
  for select to anon, authenticated
  using (status = 'available');

drop policy if exists "Staff read leads" on public.leads;
create policy "Staff read leads" on public.leads
  for select to authenticated
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('owner','admin','agent')));

drop policy if exists "Self read user row" on public.users;
create policy "Self read user row" on public.users
  for select to authenticated using (id = auth.uid());
