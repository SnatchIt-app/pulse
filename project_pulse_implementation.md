# Pulse — Implementation Reference

> Source of truth for development continuity. Update after each phase.
> Project location: /Users/josetascon/Pulse exotics/Pulse exotics/pulse

---

## Company Overview

Pulse is a luxury mobility and concierge company.

Services:
- Exotic & supercar rentals (Pulse-owned + partner inventory)
- Private jet charters (partner fulfilled)
- Luxury yacht charters (partner fulfilled)
- Luxury residences & villa rentals (partner fulfilled — MWR source, never expose)
- Chauffeur services (partner fulfilled)
- Restaurant reservations (partner fulfilled)
- Nightlife access (partner fulfilled)
- Concierge services (partner fulfilled)
- Curated multi-service experiences (new service type, maps to concierge in DB)

Launch market: Miami, Florida.
Do NOT hardcode as Miami-only. Future expansion expected.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Package manager | pnpm |
| Database | Supabase (PostgreSQL) |
| Email | Resend |
| Hosting | Vercel |
| Architecture | Monolithic Next.js |
| Inventory | Flat-file (future: Supabase migration) |

---

## Design System

| Token | Value |
|---|---|
| Background (paper) | #f6f2ec |
| Ink | #0a0a0a |
| Graphite | #16161a |
| Bone | #ede7dc |
| Brass | CSS var --color-brass |
| Display font | var(--font-display), ui-serif, serif |
| Sans font | var(--font-sans), system-ui |
| Transition duration | 480ms (duration-pulse) |
| Timing function | cubic-bezier(0.16, 1, 0.3, 1) (ease-pulse) |
| Max container | 1440px |

Reference brands: Aman, Four Seasons Private Jet, VistaJet, NetJets, Rolls-Royce, Bentley, Embark Beyond, Exclusive Resorts, Velocity Black.

Never: flashy, cheap, rental-company aesthetics, fake pricing, fake availability, fake testimonials.

---

## Architecture

```
app/
  layout.tsx — Root layout: GA4, Meta Pixel scripts
  icon.tsx — 32×32 favicon via ImageResponse ("P" on black)
  apple-icon.tsx — 180×180 apple-touch-icon
  manifest.ts — Web app manifest
  sitemap.ts — Dynamic sitemap (all static + detail pages)
  robots.ts — robots.txt with AEO crawler allowlist
  not-found.tsx — 404 page (no nav — known issue)
  error.tsx — Global error boundary
  (auth)/
    login/ — Password login page
  (marketing)/
    layout.tsx — Nav + Footer + WhatsApp button
    page.tsx — Homepage
    about/page.tsx
    contact/page.tsx — Phone + email + request CTA
    experiences/page.tsx — Full 6-section experience page
    fleet/
      page.tsx — Car listing (SSG)
      [slug]/page.tsx — Car detail (SSG, 15 slugs)
    jets/
      page.tsx — Jet listing (SSG)
      [slug]/page.tsx — Jet detail (SSG, 3 slugs)
    yachts/
      page.tsx — Yacht listing (SSG)
      [slug]/page.tsx — Yacht detail (SSG, 4 slugs — clean)
    residences/
      page.tsx — Residence listing (SSG)
      [slug]/page.tsx — Residence detail (SSG, 8 slugs)
    concierge/page.tsx
    chauffeur/page.tsx
    restaurants/page.tsx
    nightlife/page.tsx
    jet-skis/page.tsx
    request/page.tsx — Dynamic: reads URL params for pre-selection
    legal/
      privacy/page.tsx — Production privacy policy (10 sections)
      terms/page.tsx — Production terms of service (10 sections)
  admin/
    layout.tsx — noindex, dark bg
    page.tsx — CRM hub (live lead + booking counts)
    leads/
      page.tsx — SSR lead list
      LeadsClient.tsx — "use client", drawer, status, notes, convert
    bookings/
      page.tsx — SSR booking list
      BookingsClient.tsx — "use client", status, search, filter
    residences/page.tsx — Placeholder
  api/
    requests/route.ts — POST public lead submission
    residence-requests/route.ts — POST residence-specific requests
    residences/sync/route.ts — Residence availability sync
    og/route.ts — Default OG image
    og/[slug]/route.ts — Per-vehicle OG image
    admin/
      login/route.ts — POST password auth → cookie
      leads/[id]/status/route.ts — PATCH lead status
      leads/[id]/notes/route.ts — PATCH admin_notes + assigned_to
      bookings/route.ts — POST create booking
      bookings/[id]/status/route.ts — PATCH booking status

components/
  marketing/
    Nav.tsx — "use client", hamburger mobile menu, drawer
    Footer.tsx
    Logo.tsx
    Hero.tsx
    Marquee.tsx
    FeaturedFleet.tsx
    ServiceRail.tsx
    TrustPillars.tsx
    EditorialBlock.tsx
    ResidencesPreview.tsx
    ConciergeCTA.tsx
    CarCard.tsx
    JetCard.tsx
    YachtCard.tsx
    ResidenceCard.tsx
    RequestForm.tsx — "use client", react-hook-form + zod
    ServicePageTemplate.tsx
    FaqBlock.tsx
    EntityOpener.tsx
    WhatsAppFloatingButton.tsx — "use client", fixed bottom-right
  shared/
    Analytics.tsx — AnalyticsProvider, TrackView, TrackLink
    Container.tsx
    Section.tsx
    MotionFade.tsx
    MotionStagger.tsx
  ui/
    Button.tsx
    Input.tsx
    Textarea.tsx
    Card.tsx
    Badge.tsx

lib/
  analytics.ts — GA4 + Meta Pixel helpers (all safe no-ops dev/SSR)
  email.ts — Resend sendLeadNotification (server-only)
  schema.ts — JSON-LD builders
  seo.ts — buildMetadata helper
  keywords.ts — Keyword matrix per route
  utils.ts — cn(), SITE_URL, absoluteUrl()
  supabase/
    admin.ts — getSupabaseAdmin() — server-only

data/
  inventory/
    cars.ts — 15 Car records (flat-file)
    jets.ts — 3 Jet records (flat-file)
    yachts.ts — 4 Yacht records (clean slugs, images ref old dirs)
    residences.ts — 8 Residence records (no vendor strings)
  faqs.ts — FAQ content per service key
  service-content.ts — Service page content
  trust-pillars.ts
  media.ts
  fleet-preview.ts
  residences-preview.ts

middleware.ts — Admin auth gate (cookie check)
next.config.ts — reactStrictMode, avif/webp, yacht redirects
tailwind.config.ts
```

---

## Inventory

### Cars — 15 Vehicles (Flat File)

All slugs use PascalCase with color labels. All images at `/public/fleet/[slug]/cover.jpg`.

| Slug | Make | Model |
|---|---|---|
| Rolls-Royce-Cullinan-BlackBlack-Teal | Rolls-Royce | Cullinan |
| Rolls-Royce-Cullinan-BlackBlack | Rolls-Royce | Cullinan |
| Rolls-Royce-Dawn-BlackBlack | Rolls-Royce | Dawn |
| Rolls-Royce-Dawn-BlackRed | Rolls-Royce | Dawn |
| Lamborghini-Urus-GreyBrown | Lamborghini | Urus |
| Lamborghini-Huracan-Spyder-BlackBlack | Lamborghini | Huracan Spyder |
| Lamborghini-Huracan-Spyder-Balloon-WhiteRed | Lamborghini | Huracan Spyder |
| Lamborghini-Huracan-EVO-GreenBlack | Lamborghini | Huracan EVO |
| Lamborghini-Huracan-EVO-Spyder-Blu-Glauco-Black | Lamborghini | Huracan EVO Spyder |
| Lamborghini-Huracan-YellowBlack | Lamborghini | Huracan |
| Bentley-Bentayga-W12-Speed-BlackBlack-Orange | Bentley | Bentayga W12 Speed |
| Bentley-Continental-Convertible-W12-Speed-BlackBlack-Orange | Bentley | Continental Convertible |
| McLaren-GT-GreenBlack | McLaren | GT |
| McLaren-GT-OrangeBlack | McLaren | GT |
| McLaren-GT-BlackBlack | McLaren | GT |

Homepage vehicles: Lamborghini Urus, Lamborghini Huracan, McLaren GT.

### Jets — 3 Aircraft (Flat File)

| Slug | Name | Category | Capacity |
|---|---|---|---|
| citation-650 | Citation 650 | Midsize Jet | 8 |
| gulfstream-g4 | Gulfstream G4 | Heavy Jet | 12 |
| hawker-800xp | Hawker 800XP | Midsize Jet | 8 |

### Yachts — 4 Vessels (Flat File — Clean Slugs)

IMPORTANT: Slugs were cleaned from internal/vendor names. Image paths still reference old directories. 301 redirects in next.config.ts.

| Slug | Make | Model | Image path |
|---|---|---|---|
| ferretti-780 | Ferretti | 780 | /yachts/ferretti-780-hsy/cover.jpg |
| azimut-72 | Azimut | 72 | /yachts/azimut-72-mancusa/cover.jpg |
| princess-88 | Princess | 88 | /yachts/princess-88-praying-for-overtime/cover.jpg |
| sunseeker-92 | Sunseeker | 92 | /yachts/sunseeker-92-rmm-job/cover.jpg |

Internal source references (NOT in compiled output):
- ferretti-780 → HSY
- azimut-72 → Mancusa
- princess-88 → Praying For Overtime
- sunseeker-92 → RMM JOB

### Residences — 8 Properties (Flat File)

Source: Miami World Rental (MWR). Booking refs in source comments only. NEVER expose MWR, booking refs, or vendor strings publicly.

| Slug | Neighborhood |
|---|---|
| south-beach-townhouse | South Beach |
| miami-beach-townhouse | Miami Beach |
| design-district-estate | Design District |
| miami-pool-estate | Miami |
| miami-villa-6br | Miami |
| design-district-villa-6br | Design District |
| buena-vista-home | Buena Vista |
| design-district-garden-home | Design District |

---

## Public Pages

| Route | Type | Status | Schema |
|---|---|---|---|
| / | Static | OK | Org + LocalBusiness + WebSite |
| /fleet | Static | OK | — |
| /fleet/[slug] (×15) | SSG | OK | Breadcrumb + Vehicle |
| /jets | Static | OK | — |
| /jets/[slug] (×3) | SSG | OK | Breadcrumb |
| /yachts | Static | OK | — |
| /yachts/[slug] (×4) | SSG | OK | Breadcrumb |
| /residences | Static | OK | Service + LodgingBusiness + FAQ |
| /residences/[slug] (×8) | SSG | OK | Breadcrumb + Accommodation |
| /experiences | Static | OK | Service + FAQ |
| /concierge | Static | OK | Service + FAQ |
| /chauffeur | Static | OK | — |
| /restaurants | Static | OK | — |
| /nightlife | Static | OK | — |
| /jet-skis | Static | OK | — |
| /about | Static | OK | — |
| /contact | Static | OK | — |
| /request | Dynamic (SSR) | OK | — |
| /legal/privacy | Static | OK | — |
| /legal/terms | Static | OK | — |

Missing Service schema: /fleet, /jets, /yachts, /chauffeur, /restaurants, /nightlife, /jet-skis (medium priority)

---

## Admin Pages

| Route | Type | Status |
|---|---|---|
| /login | Static | OK — password form |
| /admin | SSR | OK — live lead + booking counts |
| /admin/leads | SSR + Client | OK — full CRM with drawer |
| /admin/bookings | SSR + Client | OK — bookings list |
| /admin/residences | Static | placeholder |

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| /api/requests | POST | Public lead submission → Supabase + Resend |
| /api/residence-requests | POST | Residence-specific lead submission |
| /api/residences/sync | GET/POST | Residence availability sync (SYNC_SECRET protected) |
| /api/og | GET | Default OG image (ImageResponse) |
| /api/og/[slug] | GET | Per-vehicle OG image |
| /api/admin/login | POST | Password auth → pulse_admin_session cookie |
| /api/admin/leads/[id]/status | PATCH | Update lead status |
| /api/admin/leads/[id]/notes | PATCH | Update admin_notes + assigned_to |
| /api/admin/bookings | POST | Create booking from lead |
| /api/admin/bookings/[id]/status | PATCH | Update booking status |

All /api/admin/* routes (except login) protected by middleware (cookie check).

---

## Request Form

### Service Types

| Value | Label | DB mapping |
|---|---|---|
| car | Exotic Car | car |
| yacht | Yacht Charter | yacht |
| jet | Private Jet | jet |
| jet_ski | Jet Skis | jet_ski |
| chauffeur | Chauffeur | chauffeur |
| restaurant | Dining & Reservations | restaurant |
| nightlife | Nightlife | nightlife |
| residence | Residence | residence |
| experience | Experience | concierge (mapped in API) |
| concierge | Concierge / Other | concierge |

`experience` is mapped to `concierge` in the DB via `DB_SERVICE_MAP` in the API route. No DB migration needed.

### URL Parameter Pre-selection

| URL Param | Effect |
|---|---|
| ?vehicle=[slug]&title=[name] | Pre-selects car, shows vehicle chip |
| ?yacht=[slug]&title=[name] | Pre-selects yacht, shows yacht chip |
| ?jet=[slug]&title=[name] | Pre-selects jet, shows jet chip |
| ?residence=[slug]&title=[name] | Pre-selects residence, shows residence chip |
| ?service=experience&experience=[slug] | Pre-selects experience, shows experience chip, pre-populates occasion |
| ?service=concierge | Pre-selects concierge |

### Service-Specific Fields

- Car/Chauffeur: pickupLocation, deliveryLocation, startDate, endDate, driverAge
- Jet: departureCity, arrivalCity, departureDate, returnDate, passengerCount
- Yacht/Jet Ski: charterDate, charterDuration, yachtGuestCount, preferredMarina
- Residence: checkIn, checkOut, residenceGuestCount, bedroomsNeeded
- Experience: occasionType (pre-filled from slug), experienceDate, experienceGuestCount, experienceLocation
- Concierge/Restaurant/Nightlife: requestType, conciergeLocation, conciergeDate

All service-specific fields serialized into the `message` column. No additional DB columns needed.

---

## Navigation

Desktop links: Fleet, Jets, Yachts, Residences, Concierge, Experiences, About, Contact
Right: Request Access (button)

Mobile: hamburger → full-screen paper overlay with staggered display-font links + Request Access button + phone + email at bottom.
Close on: route change, Escape key, backdrop click (nav uses usePathname hook).

---

## WhatsApp Button

- Phone: +17869188895
- URL: https://wa.me/17869188895?text=Hi%20Pulse%2C%20I%27m%20interested%20in%20arranging%20a%20luxury%20experience.
- Design: black bg, paper text, no green — consistent with brand
- Desktop: rectangular (sharp corners) with WhatsApp SVG + "WHATSAPP" label
- Mobile: circular icon only
- Position: fixed bottom-6 right-6 (md: bottom-8 right-8), z-40
- Mounted in marketing layout — all public pages only
- Analytics: fires `whatsapp_click` GA4 + Meta Pixel event

---

## SEO

### Sitemap

45+ URLs total. File: `app/sitemap.ts`.

Priority structure:
- / → 1.0 (daily)
- /fleet, /jets, /yachts, /residences → 0.9 (weekly)
- /concierge, /request → 0.8 (weekly/monthly)
- /chauffeur, /restaurants, /nightlife, /contact → 0.7 (weekly/monthly)
- /experiences → 0.75 (weekly)
- /jet-skis, /about → 0.6 (weekly/monthly)
- detail pages → 0.85 (monthly)
- /legal/* → 0.3 (monthly)
- /experiences omitted when stub — now included

### Robots

AEO crawlers explicitly allowed: GPTBot, ClaudeBot, PerplexityBot, Google-Extended.
Blocked: /admin/, /api/

### Metadata System

`lib/seo.ts` — `buildMetadata()` accepts route key or custom title/description.
`lib/keywords.ts` — keyword matrix per RouteKey.

Every page: title, description, keywords, canonical, OG, Twitter card.
Root layout: metadataBase set to SITE_URL.

CRITICAL: NEXT_PUBLIC_SITE_URL must be set in Vercel. Falls back to localhost:3000.

### Schema Coverage

- Organization, WebSite, LocalBusiness: every marketing page (via layout)
- Service: /residences, /concierge, /experiences
- FAQPage: /residences, /concierge, /experiences
- Breadcrumb: all detail pages (/fleet/[slug], /jets/[slug], etc.)
- Vehicle: /fleet/[slug]
- Accommodation: /residences/[slug]
- LodgingBusiness: /residences

Contact in schema (lib/schema.ts):
- telephone: "+1-786-918-8895"
- email: "pulsexotics@exoticsinfo.com"

### Google Search Console

Verification file: `/public/googlee1a08364bbb0bc7e.html`
Serves at: https://pulse.luxury/googlee1a08364bbb0bc7e.html

---

## Analytics

### GA4
Measurement ID: G-G52Y1TQ8TM
Status: installed, page views + custom events active.
Production only (isProd check).

### Meta Pixel
Status: script installed, NEXT_PUBLIC_META_PIXEL_ID not yet configured.

### Events Implemented

| Event | Trigger |
|---|---|
| page_view | Every route change (AnalyticsProvider) |
| vehicle_view | Vehicle detail page mount |
| vehicle_request_click | Form mount with vehicleSlug |
| vehicle_lead_submit | Successful vehicle form submission |
| yacht_view | Yacht detail page mount |
| yacht_request_click | Form mount with yachtSlug |
| yacht_lead_submit | Successful yacht form submission |
| jet_view | Jet detail page mount |
| jet_request_click | Form mount with jetSlug |
| jet_lead_submit | Successful jet form submission |
| residence_view | Residence detail page mount |
| residence_request_click | Form mount with residenceSlug |
| residence_lead_submit | Successful residence form submission |
| experience_request_click | Form mount with experienceSlug |
| experience_lead_submit | Successful experience form submission |
| concierge_lead_submit | Successful concierge/restaurant/nightlife form submission |
| request_form_submit | Any form submit (with service_type param) |
| request_form_success | Any successful form submission |
| whatsapp_click | WhatsApp button click |

---

## Favicon & App Icon

- `app/icon.tsx` → 32×32 PNG via ImageResponse — black bg, paper "P" (Georgia serif)
- `app/apple-icon.tsx` → 180×180 PNG — same
- `app/manifest.ts` → web app manifest (serves at /manifest.webmanifest)
- Name: "Pulse", theme_color: "#0a0a0a", background: "#f6f2ec"

---

## Contact Information

- Phone: (786) 918-8895 | +17869188895
- Email: pulsexotics@exoticsinfo.com

Used in:
- Contact page
- Mobile nav drawer (bottom)
- Schema (lib/schema.ts)
- Email notifications (lib/email.ts SERVICE_LABELS)

---

## Domain

Recommended: `pulse.luxury` ($32/yr via Vercel domains)
Backup .com: `pulsemaison.com` ($11.25/yr)

Status: Domain selection completed. Purchase + Vercel connection pending.

Additional available domains checked (real-time, May 2026):
- pulsecurated.com ($11.25)
- pulseescape.com ($11.25)
- pulseescapes.com ($11.25)
- pulsealtitude.com ($11.25)
- pulseserene.com ($11.25)
- pulseyacht.com ($11.25)

Unavailable: pulse.com, pulsemobility.com, pulseluxury.com, pulsegroup.com, pulsejet.com, pulse.co, pulse.global, pulse.vip, thepulse.com, pulseglobal.com, and 30+ others.

---

## Deployment

Hosting: Vercel
Repo: local (push triggers auto-deploy)

Required Vercel env vars (not yet confirmed set):
- NEXT_PUBLIC_SITE_URL=https://pulse.luxury
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY (if needed)
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_PASSWORD
- RESEND_API_KEY
- LEAD_NOTIFY_EMAIL
- RESEND_FROM_EMAIL
- NEXT_PUBLIC_GA_MEASUREMENT_ID=G-G52Y1TQ8TM
- NEXT_PUBLIC_META_PIXEL_ID

---

## CRM Status

### Auth
Current: ADMIN_PASSWORD env var → sets `pulse_admin_session` cookie (8hr, httpOnly, SameSite: lax).
Future (Phase 5): Replace with Supabase Auth.

Middleware: protects all /admin/* and /api/admin/* except /api/admin/login.

### Lead Pipeline
New → Contacted → Qualified → Quoted → Booked → Completed / Lost / Closed / Archived

### Lead Drawer (Phase 1)
- Click "Details →" on any lead row
- Slide-in panel (520px desktop, full-screen mobile), z-50
- Tabs: Details | Convert to Booking
- Details tab: email, phone, service, created, status dropdown, client message, admin notes (textarea, saves on blur with "Saved" flash), assigned_to field
- Convert tab: pre-filled read-only (name, email, service) + editable asset_title, start_date, end_date, notes → creates booking → marks lead as "booked"
- Escape key + backdrop click close drawer

### Bookings
- POST /api/admin/bookings creates record + sets lead.status = "booked"
- /admin/bookings shows table with status dropdown (pending → confirmed → in_progress → completed → cancelled)
- Count cards: Pending, Confirmed, In Progress, Completed
- Search by client name, email, phone, asset

---

## Experiences Page

Route: /experiences

Sections:
1. Hero — "Miami's most complete luxury weekend." + CTA → /request?service=concierge
2. Intro statement (display font, full-width)
3. 8 experience cards (4-col grid desktop, brass accent top border)
4. Process section (dark bg, 3 numbered steps)
5. FAQ (5 items via FaqBlock)
6. CTA — "Your occasion. Our concierge."

Experiences:
- Supercar Weekend → /request?service=experience&experience=supercar-weekend
- Yacht Day → /request?service=experience&experience=yacht-day
- Jet + Residence Stay → /request?service=experience&experience=jet-residence-stay
- Birthday Experience → /request?service=experience&experience=birthday-experience
- Bachelor & Bachelorette → /request?service=experience&experience=bachelor-bachelorette
- Art Basel → /request?service=experience&experience=art-basel-experience
- F1 Miami → /request?service=experience&experience=f1-miami-experience
- Ultra Experience → /request?service=experience&experience=ultra-experience

---

## Completed Phases

| Phase | Status |
|---|---|
| Fleet (15 vehicles, SSG, detail pages, request flow) | OK |
| Jets (3 jets, SSG, detail pages, request flow) | OK |
| Yachts (4 yachts, SSG, detail pages, request flow, clean slugs) | OK |
| Residences (8, SSG, detail pages, request flow) | OK |
| Homepage (Hero, Marquee, FeaturedFleet, ServiceRail, TrustPillars, Editorial, ResidencesPreview, ConciergeCTA) | OK |
| About page | OK |
| Contact page (real phone + email) | OK |
| Request form (all service types + experience) | OK |
| Legal pages (production-ready Privacy + Terms) | OK |
| Supabase leads integration | OK |
| Resend email notifications | OK |
| Admin CRM — leads | OK |
| Admin CRM — lead drawer + notes + assignment | OK |
| Admin CRM — convert to booking | OK |
| Admin CRM — bookings page | OK |
| Admin hub (live counts) | OK |
| SEO (sitemap, robots, metadata, canonical, OG, Twitter) | OK |
| JSON-LD schema (Org, LocalBusiness, WebSite, Vehicle, Accommodation, Service, FAQ, Breadcrumb) | OK |
| GA4 analytics | OK |
| Mobile navigation (hamburger drawer) | OK |
| Favicon + apple-touch-icon + manifest | OK |
| WhatsApp floating button | OK |
| Experiences page (full) | OK |
| Experiences in nav + request form | OK |
| Domain research (pulse.luxury identified) | OK |
| Google Search Console verification file | OK |
| Launch Readiness Phase 1 | OK |
| CRM Phase 1 | OK |
| Yacht slug cleanup + redirects | OK |

---

## Open Tasks

1. Deploy latest version to Vercel (git push)
2. Set NEXT_PUBLIC_SITE_URL=https://pulse.luxury in Vercel environment variables
3. Purchase pulse.luxury domain ($32/yr)
4. Connect domain to Vercel project
5. Verify Google Search Console after deploy
6. Configure Meta Pixel (set NEXT_PUBLIC_META_PIXEL_ID)
7. Verify Meta Pixel events in production
8. Verify GA4 events fire correctly in production
9. Verify Resend notifications in production
10. Verify production lead write to Supabase
11. Verify /admin/leads shows real data in production
12. Add Service schema to: /fleet, /jets, /yachts, /chauffeur, /restaurants, /nightlife, /jet-skis
13. Add Nav + Footer to 404 page (not-found.tsx)
14. Add Twitter card @handle when social accounts are created
15. Replace ADMIN_PASSWORD with Supabase Auth (Phase 5)
16. Migrate flat-file inventory to Supabase (future phase)
17. Residence availability sync (written permission from vendor required first)

---

## Recommended Next Phases

### Phase 2 — Production Verification
- Deploy, set env vars, verify all flows end-to-end

### Phase 3 — Meta Pixel + Ad Setup
- Configure NEXT_PUBLIC_META_PIXEL_ID
- Verify pixel fires on page_view and request_form_success
- Set up Meta retargeting audience

### Phase 4 — Service Schema Completion
- Add Service JSON-LD to all service pages missing it
- Add FAQ schema to jet, fleet, yacht pages
- Run Google Rich Results Test

### Phase 5 — Supabase Auth
- Replace ADMIN_PASSWORD with Supabase Auth
- Implement user roles from public.users table (owner/admin/agent/viewer)
- Use owner_id FK on leads for real assignment

### Phase 6 — CRM Phase 2
- Lead timeline / activity log
- Booking detail drawer (like lead drawer)
- Quote builder (line items for multi-service bookings)
- Client profiles module

### Phase 7 — Inventory Migration
- Migrate flat-file cars → vehicles table in Supabase
- Migrate jets and yachts to Supabase
- Admin inventory management UI

### Phase 8 — Residence Sync
- Obtain written permission from MWR
- Implement iCal sync via /api/residences/sync
- Show real-time availability on residence detail pages
