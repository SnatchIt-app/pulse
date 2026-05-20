-- Pulse Residences.
-- Public projection: lib/supabase/server.ts -> PUBLIC_RESIDENCE_FIELDS.
-- Internal columns (internal_source_*, external_property_id, source_calendar_url,
-- source_type, address_private, base_rate_internal, markup_*) are vendor data —
-- never exposed publicly. RLS restricts full-row reads to owner/admin.

do $$ begin
  create type residence_status as enum ('available','unavailable','retired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type residence_source_type as enum ('ical','api','scrape','manual');
exception when duplicate_object then null; end $$;

do $$ begin
  create type residence_markup_type as enum ('flat','percent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type residence_request_status as enum ('new','contacted','quoted','booked','lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type residence_booking_status as enum ('pending','confirmed','in_progress','completed','cancelled');
exception when duplicate_object then null; end $$;

create table if not exists public.residences (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  -- INTERNAL-ONLY (vendor) — RLS-gated, never in public projection
  internal_source_name text,
  internal_source_url text,
  external_property_id text,
  source_calendar_url text,
  source_type residence_source_type not null default 'manual',
  address_private text,
  base_rate_internal numeric,
  markup_type residence_markup_type,
  markup_value numeric,
  -- PUBLIC
  neighborhood text,
  public_location_label text,
  bedrooms int not null default 0,
  bathrooms int not null default 0,
  max_guests int not null default 0,
  nightly_rate_from numeric,
  final_rate_display numeric,
  min_stay int,
  amenities text[] not null default '{}',
  description text,
  gallery jsonb not null default '[]'::jsonb,
  hero_image_url text,
  status residence_status not null default 'available',
  is_featured boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.residence_availability (
  id uuid primary key default uuid_generate_v4(),
  residence_id uuid not null references public.residences(id) on delete cascade,
  date date not null,
  available boolean not null default true,
  nightly_rate numeric,
  min_stay int,
  source residence_source_type not null default 'manual',
  last_synced_at timestamptz not null default now(),
  unique (residence_id, date)
);

create table if not exists public.residence_requests (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references public.leads(id) on delete set null,
  residence_id uuid references public.residences(id) on delete set null,
  start_date date,
  end_date date,
  guests int,
  budget numeric,
  message text,
  status residence_request_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.residence_bookings (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid,
  residence_id uuid not null references public.residences(id) on delete restrict,
  start_date date not null,
  end_date date not null,
  guests int,
  base_cost_internal numeric,
  client_price numeric,
  margin numeric generated always as (client_price - base_cost_internal) stored,
  deposit_amount numeric,
  deposit_status text,
  status residence_booking_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists residences_touch on public.residences;
create trigger residences_touch before update on public.residences
  for each row execute function public.touch_updated_at();
drop trigger if exists residence_requests_touch on public.residence_requests;
create trigger residence_requests_touch before update on public.residence_requests
  for each row execute function public.touch_updated_at();
drop trigger if exists residence_bookings_touch on public.residence_bookings;
create trigger residence_bookings_touch before update on public.residence_bookings
  for each row execute function public.touch_updated_at();

alter table public.residences enable row level security;
alter table public.residence_availability enable row level security;
alter table public.residence_requests enable row level security;
alter table public.residence_bookings enable row level security;

-- anon/authenticated may read available residence rows. The application restricts
-- the COLUMN set to PUBLIC_RESIDENCE_FIELDS; never select internal columns from a
-- public/anon code path. Staff (owner/admin) get full rows incl. vendor columns.
drop policy if exists "Public read available residences" on public.residences;
create policy "Public read available residences" on public.residences
  for select to anon, authenticated
  using (status = 'available');

drop policy if exists "Staff read residences full" on public.residences;
create policy "Staff read residences full" on public.residences
  for select to authenticated
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('owner','admin')));

drop policy if exists "Public read residence availability" on public.residence_availability;
create policy "Public read residence availability" on public.residence_availability
  for select to anon, authenticated using (true);

drop policy if exists "Staff read residence requests" on public.residence_requests;
create policy "Staff read residence requests" on public.residence_requests
  for select to authenticated
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('owner','admin','agent')));

drop policy if exists "Staff read residence bookings" on public.residence_bookings;
create policy "Staff read residence bookings" on public.residence_bookings
  for select to authenticated
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('owner','admin','agent')));
