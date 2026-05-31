# Pulse — Supabase Schema Reference

> Supabase project: Pulse (aihgejwdvkvngjwttxij, us-east-1)
> PostgreSQL 17.6.1.127
> All tables in `public` schema with RLS enabled.

---

## Enums

### user_role

```sql
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'agent', 'viewer');
```

### service_type

```sql
CREATE TYPE service_type AS ENUM (
  'car', 'jet', 'yacht', 'jet_ski', 'chauffeur',
  'restaurant', 'nightlife', 'concierge', 'residence', 'other'
);
```

Important: `experience` is NOT in this enum. The frontend `experience` service type is mapped to `concierge` before DB write via `DB_SERVICE_MAP` in `/api/requests/route.ts`. No migration required.

### lead_status

```sql
CREATE TYPE lead_status AS ENUM (
  'new', 'contacted', 'qualified', 'quoted',
  'booked', 'completed', 'lost', 'closed', 'archived'
);
```

### vehicle_status

```sql
CREATE TYPE vehicle_status AS ENUM ('available', 'on_trip', 'maintenance', 'retired');
```

### residence_source_type

```sql
CREATE TYPE residence_source_type AS ENUM ('ical', 'api', 'scrape', 'manual');
```

### residence_markup_type

```sql
CREATE TYPE residence_markup_type AS ENUM ('flat', 'percent');
```

### residence_status

```sql
CREATE TYPE residence_status AS ENUM ('available', 'unavailable', 'retired');
```

### residence_request_status

```sql
CREATE TYPE residence_request_status AS ENUM ('new', 'contacted', 'quoted', 'booked', 'lost');
```

### residence_booking_status

```sql
CREATE TYPE residence_booking_status AS ENUM (
  'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
);
```

---

## Tables

### public.users

Internal admin/staff users. References `auth.users` (Supabase Auth). RLS enabled.

| Column     | Type        | Notes                  |
| ---------- | ----------- | ---------------------- |
| id         | uuid        | PK, FK → auth.users.id |
| email      | text        | unique                 |
| full_name  | text        | nullable               |
| phone      | text        | nullable               |
| role       | user_role   | default 'viewer'       |
| avatar_url | text        | nullable               |
| is_active  | boolean     | default true           |
| created_at | timestamptz | default now()          |
| updated_at | timestamptz | default now()          |

Roles: `owner`, `admin`, `agent`, `viewer`.

Not yet used in application code — auth is currently `ADMIN_PASSWORD` cookie. Phase 5 will migrate to this table for role-based access.

### public.vehicles

Vehicle inventory in Supabase (not yet used by frontend — frontend uses flat-file `cars.ts`). RLS enabled.

| Column           | Type           | Notes                           |
| ---------------- | -------------- | ------------------------------- |
| id               | uuid           | PK, default `gen_random_uuid()` |
| slug             | text           | unique                          |
| make             | text           |                                 |
| model            | text           |                                 |
| year             | integer        |                                 |
| trim             | text           | nullable                        |
| body_style       | text           | nullable                        |
| color_exterior   | text           | nullable                        |
| color_interior   | text           | nullable                        |
| horsepower       | integer        | nullable                        |
| zero_sixty       | numeric        | nullable                        |
| top_speed        | integer        | nullable                        |
| transmission     | text           | nullable                        |
| drivetrain       | text           | nullable                        |
| seats            | integer        | nullable                        |
| daily_rate       | numeric        | nullable                        |
| weekly_rate      | numeric        | nullable                        |
| weekend_rate     | numeric        | nullable                        |
| included_miles   | integer        | nullable                        |
| delivery_fee     | numeric        | nullable                        |
| status           | vehicle_status | default 'available'             |
| current_location | text           | nullable                        |
| description      | text           | nullable                        |
| gallery          | jsonb          | default '[]'                    |
| hero_image_url   | text           | nullable                        |
| hero_video_url   | text           | nullable                        |
| is_featured      | boolean        | default false                   |
| display_order    | integer        | default 0                       |
| created_at       | timestamptz    | default now()                   |
| updated_at       | timestamptz    | default now()                   |

Rows: 0 (inventory migration not done yet — frontend uses flat-file `data/inventory/cars.ts`)

### public.leads

Primary leads/CRM table. RLS enabled. 2 rows as of schema audit.

| Column            | Type         | Notes                                                           |
| ----------------- | ------------ | --------------------------------------------------------------- |
| id                | uuid         | PK, default `gen_random_uuid()`                                 |
| full_name         | text         | required                                                        |
| email             | text         | required                                                        |
| phone             | text         | nullable                                                        |
| service_type      | service_type | default 'other' — enum does NOT include 'experience'            |
| vehicle_id        | uuid         | nullable, FK → vehicles.id                                      |
| start_date        | date         | nullable                                                        |
| end_date          | date         | nullable                                                        |
| party_size        | integer      | nullable                                                        |
| budget_tier       | text         | nullable                                                        |
| message           | text         | nullable — client-submitted message + serialized service fields |
| source            | text         | default 'website'                                               |
| utm_source        | text         | nullable                                                        |
| utm_medium        | text         | nullable                                                        |
| utm_campaign      | text         | nullable                                                        |
| utm_content       | text         | nullable                                                        |
| utm_term          | text         | nullable                                                        |
| referrer_url      | text         | nullable                                                        |
| landing_page      | text         | nullable — slug or /request                                     |
| status            | lead_status  | default 'new'                                                   |
| lost_reason       | text         | nullable                                                        |
| owner_id          | uuid         | nullable, FK → users.id                                         |
| client_id         | uuid         | nullable                                                        |
| last_contacted_at | timestamptz  | nullable                                                        |
| admin_notes       | text         | nullable — added Phase 1 CRM                                    |
| assigned_to       | text         | nullable — added Phase 1 CRM (text, not FK, for simplicity)     |
| created_at        | timestamptz  | default now()                                                   |
| updated_at        | timestamptz  | default now()                                                   |

**What the API writes:**
`full_name`, `email`, `phone`, `service_type` (remapped if 'experience' → 'concierge'), `start_date`, `message` (serialized service details + client notes), `source = "website_request"`, `landing_page` (asset slug or `/request`), `status = "new"`

**Fields not written by current API:** `vehicle_id`, `end_date`, `party_size`, `budget_tier`, UTM fields, `referrer_url`, `owner_id`, `client_id`, `last_contacted_at`

**Admin-only fields:** `admin_notes`, `assigned_to` — written via PATCH `/api/admin/leads/[id]/notes`

**Status pipeline:** `new` → `contacted` → `qualified` → `quoted` → `booked` → `completed` / `lost` / `closed` / `archived`

### public.bookings

General bookings table (all service types). Created Phase 1 CRM. RLS enabled.

| Column       | Type        | Notes                                               |
| ------------ | ----------- | --------------------------------------------------- |
| id           | uuid        | PK, default `gen_random_uuid()`                     |
| lead_id      | uuid        | nullable, FK → leads.id ON DELETE SET NULL          |
| service_type | text        | required — free text (not enum)                     |
| client_name  | text        | required                                            |
| phone        | text        | nullable                                            |
| email        | text        | required                                            |
| start_date   | date        | nullable                                            |
| end_date     | date        | nullable                                            |
| asset_title  | text        | nullable — e.g., "Lamborghini Urus", "Ferretti 780" |
| notes        | text        | nullable — admin booking notes                      |
| status       | text        | default 'pending' — CHECK constraint                |
| created_at   | timestamptz | default now()                                       |
| updated_at   | timestamptz | default now() — auto-stamped by trigger             |

**Status values** (CHECK constraint):
`pending`, `confirmed`, `in_progress`, `completed`, `cancelled`

**Trigger:** `bookings_updated_at` BEFORE UPDATE sets `updated_at = now()`

**RLS policy:** `bookings_deny_public` RESTRICTIVE FOR ALL TO public USING (false). Service role bypasses.

When a booking is created: POST `/api/admin/bookings` also sets `leads.status = 'booked'` for the linked lead.

### public.residences

Residence inventory in Supabase. RLS enabled. 0 rows (inventory not yet migrated).

| Column                | Type                  | Notes                                     |
| --------------------- | --------------------- | ----------------------------------------- |
| id                    | uuid                  | PK                                        |
| slug                  | text                  | unique                                    |
| title                 | text                  |                                           |
| internal_source_name  | text                  | nullable — NEVER expose publicly          |
| internal_source_url   | text                  | nullable — NEVER expose publicly          |
| external_property_id  | text                  | nullable — NEVER expose publicly          |
| source_calendar_url   | text                  | nullable — iCal URL for availability sync |
| source_type           | residence_source_type | default 'manual'                          |
| address_private       | text                  | nullable — NEVER expose publicly          |
| base_rate_internal    | numeric               | nullable — NEVER expose publicly          |
| markup_type           | residence_markup_type | nullable                                  |
| markup_value          | numeric               | nullable                                  |
| neighborhood          | text                  | nullable                                  |
| public_location_label | text                  | nullable — what clients see               |
| bedrooms              | integer               | default 0                                 |
| bathrooms             | integer               | default 0                                 |
| max_guests            | integer               | default 0                                 |
| nightly_rate_from     | numeric               | nullable                                  |
| final_rate_display    | numeric               | nullable                                  |
| min_stay              | integer               | nullable                                  |
| amenities             | text[]                | default '{}'                              |
| description           | text                  | nullable                                  |
| gallery               | jsonb                 | default '[]'                              |
| hero_image_url        | text                  | nullable                                  |
| status                | residence_status      | default 'available'                       |
| is_featured           | boolean               | default false                             |
| display_order         | integer               | default 0                                 |
| created_at            | timestamptz           |                                           |
| updated_at            | timestamptz           |                                           |

**Public projection rule:** When querying residences for public display, NEVER select: `internal_source_name`, `internal_source_url`, `external_property_id`, `source_calendar_url`, `address_private`, `base_rate_internal`, `markup_type`, `markup_value`.

### public.residence_requests

Links residence inquiries to leads. RLS enabled. 0 rows.

| Column       | Type                     | Notes                        |
| ------------ | ------------------------ | ---------------------------- |
| id           | uuid                     | PK                           |
| lead_id      | uuid                     | nullable, FK → leads.id      |
| residence_id | uuid                     | nullable, FK → residences.id |
| start_date   | date                     | nullable                     |
| end_date     | date                     | nullable                     |
| guests       | integer                  | nullable                     |
| budget       | numeric                  | nullable                     |
| message      | text                     | nullable                     |
| status       | residence_request_status | default 'new'                |
| created_at   | timestamptz              |                              |
| updated_at   | timestamptz              |                              |

### public.residence_availability

Availability calendar for residences. RLS enabled. 0 rows.

| Column         | Type                  | Notes              |
| -------------- | --------------------- | ------------------ |
| id             | uuid                  | PK                 |
| residence_id   | uuid                  | FK → residences.id |
| date           | date                  |                    |
| available      | boolean               | default true       |
| nightly_rate   | numeric               | nullable           |
| min_stay       | integer               | nullable           |
| source         | residence_source_type | default 'manual'   |
| last_synced_at | timestamptz           | default now()      |

Populated by `/api/residences/sync` route (requires `SYNC_SECRET` + written permission from vendor).

### public.residence_bookings

Confirmed residence bookings. RLS enabled. 0 rows.

| Column             | Type                     | Notes                                           |
| ------------------ | ------------------------ | ----------------------------------------------- |
| id                 | uuid                     | PK                                              |
| client_id          | uuid                     | nullable, FK → ???                              |
| residence_id       | uuid                     | FK → residences.id                              |
| start_date         | date                     | required                                        |
| end_date           | date                     | required                                        |
| guests             | integer                  | nullable                                        |
| base_cost_internal | numeric                  | nullable — NEVER expose                         |
| client_price       | numeric                  | nullable                                        |
| margin             | numeric                  | GENERATED — (client_price - base_cost_internal) |
| deposit_amount     | numeric                  | nullable                                        |
| deposit_status     | text                     | nullable                                        |
| status             | residence_booking_status | default 'pending'                               |
| notes              | text                     | nullable                                        |
| created_at         | timestamptz              |                                                 |
| updated_at         | timestamptz              |                                                 |

Note: This is residence-specific. The general `public.bookings` table (Phase 1 CRM) handles all service types.

---

## Foreign Key Relationships

```
leads.owner_id        → users.id
leads.vehicle_id      → vehicles.id
leads.client_id       → (no FK constraint — reserved for future clients table)
bookings.lead_id      → leads.id (ON DELETE SET NULL)
residence_requests.lead_id      → leads.id
residence_requests.residence_id → residences.id
residence_availability.residence_id → residences.id
residence_bookings.residence_id → residences.id
users.id              → auth.users.id
```

---

## Migrations Applied

### Initial schema (pre-Phase 1)

`users`, `vehicles`, `leads`, `residences`, `residence_availability`, `residence_requests`, `residence_bookings` tables. All enums defined above. RLS enabled on all tables.

### Phase 1 CRM (crm_phase1_bookings_lead_notes)

Applied: May 31, 2026

```sql
-- Add admin columns to leads
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS assigned_to text;

-- Create general bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id            uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id       uuid        REFERENCES public.leads(id) ON DELETE SET NULL,
  service_type  text        NOT NULL,
  client_name   text        NOT NULL,
  phone         text,
  email         text        NOT NULL,
  start_date    date,
  end_date      date,
  asset_title   text,
  notes         text,
  status        text        NOT NULL DEFAULT 'pending',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bookings_status_check
    CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled'))
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_deny_public" ON public.bookings
  AS RESTRICTIVE FOR ALL TO public USING (false);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

---

## Pending / Future Migrations

### Phase 5 — Add 'experience' to service_type enum (optional)

```sql
ALTER TYPE service_type ADD VALUE 'experience';
```

Currently not needed — frontend maps `experience` → `concierge` in API.

### Phase 5 — Supabase Auth integration

No migration needed. `users` table already has `id FK → auth.users.id`.

### Phase 7 — Inventory migration

```sql
-- Migrate flat-file cars to vehicles table
-- INSERT INTO public.vehicles (...) VALUES (...);
-- (15 car records from data/inventory/cars.ts)
```

### Future — Clients table

```sql
CREATE TABLE public.clients (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   text NOT NULL,
  email       text UNIQUE,
  phone       text,
  notes       text,
  total_spent numeric DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
```

Then add `leads.client_id` FK → clients.id.

### Future — Activity log

```sql
CREATE TABLE public.lead_activities (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    uuid REFERENCES leads(id) ON DELETE CASCADE,
  type       text NOT NULL, -- 'note', 'status_change', 'email_sent', 'call_logged'
  content    text,
  created_by text,
  created_at timestamptz DEFAULT now()
);
```

### Future — Quote line items

```sql
CREATE TABLE public.booking_lines (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  uuid REFERENCES bookings(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity    integer DEFAULT 1,
  unit_price  numeric,
  created_at  timestamptz DEFAULT now()
);
```

---

## Query Patterns

### Fetch all leads for CRM (admin server component)

```ts
const { data: leads } = await supabase
  .from("leads")
  .select(
    "id, full_name, phone, email, service_type, message, admin_notes, assigned_to, start_date, created_at, status",
  )
  .order("created_at", { ascending: false });
```

### Fetch all bookings for CRM

```ts
const { data: bookings } = await supabase
  .from("bookings")
  .select(
    "id, lead_id, service_type, client_name, phone, email, start_date, end_date, asset_title, notes, status, created_at",
  )
  .order("created_at", { ascending: false });
```

### Insert a new lead (from request form)

```ts
await supabase.from("leads").insert({
  full_name,
  email,
  phone,
  service_type: DB_SERVICE_MAP[serviceType] ?? serviceType ?? "other",
  start_date: preferredDate ?? null,
  message: combinedNotes || null,
  source: "website_request",
  landing_page: assetSlug ?? "/request",
  status: "new",
});
```

### Update lead status

```ts
await supabase.from("leads").update({ status }).eq("id", id);
```

### Update lead admin notes

```ts
await supabase.from("leads").update({ admin_notes, assigned_to }).eq("id", id);
```

### Create booking + mark lead as booked

```ts
// Create booking
await supabase.from("bookings").insert({ lead_id, service_type, client_name, ... });

// Mark lead
await supabase.from("leads").update({ status: "booked" }).eq("id", lead_id);
```

### Update booking status

```ts
await supabase.from("bookings").update({ status }).eq("id", id);
```

---

## RLS Notes

All tables have RLS enabled. The service role key used in `getSupabaseAdmin()` bypasses RLS entirely — all queries from server-side admin code have full access.

Public anon access: currently not used in the frontend. All Supabase reads are server-side with service role.

The `bookings_deny_public` RESTRICTIVE policy ensures the bookings table is completely inaccessible to any unauthenticated or anon client — an additional safety layer on top of the fact that we don't expose the anon key to the browser for this table.
