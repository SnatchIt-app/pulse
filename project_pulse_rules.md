# Pulse — Permanent Project Rules

> These rules are non-negotiable and apply to every prompt, implementation, and code change.
> New Claude sessions must read and apply all rules before writing any code.

---

## Core Business Rules

1. **Never invent inventory.** All vehicles, jets, yachts, residences are from flat-file data only. Do not generate new inventory records.
2. **Never invent pricing.** No rates, minimums, or price ranges in public-facing output.
3. **Never invent availability.** No calendars, available dates, or booking slots.
4. **Everything is quote-only.** No instant booking. No "Book Now." No confirmation flows without human approval.
5. **No fake testimonials.** No reviews, no star ratings, no client quotes unless explicitly provided by the client.
6. **No vendor references in public output.** Miami World Rental, MWR, HSY, Mancusa, Praying For Overtime, RMM JOB, and any other vendor/partner identifiers must never appear in compiled output. See vendor leak rules.

---

## Vendor Leak Rules

The `pnpm check:no-vendor-leak` script scans `.next/` and `public/` for banned strings:

```
miamiworldrental | miami world rental | \bmwr\b | avantio | provided by | partner property | third-party | external supplier
```

**Rules:**

- Banned strings must never appear in any public-facing file, compiled output, HTML, JS, CSS, JSON, RSC, or XML.
- Vendor references in source files (e.g., comments in residences.ts) are acceptable ONLY if confirmed they are excluded from compiled output.
- Third-party (hyphenated) is banned — use "independent," "vetted," or "partner operators" instead.
- Run `pnpm check:no-vendor-leak` after every build. Block deployment if it fails.

---

## Deployment Rules

Every implementation must pass all five checks before deployment:

```bash
pnpm format
pnpm typecheck
pnpm lint
pnpm build
pnpm check:no-vendor-leak
```

Do not skip any check. Do not use `--no-verify` or any bypass.

---

## Security Rules

- `SUPABASE_SERVICE_ROLE_KEY` must remain server-only. Never import in client components. Never expose to the browser. File `lib/supabase/admin.ts` imports `server-only`.
- All `/api/admin/*` routes (except `/api/admin/login`) are protected by `middleware.ts` which checks the `pulse_admin_session` cookie.
- Admin pages (`/admin/*`) redirect to `/login` if session cookie is absent.
- The `pulse_admin_session` cookie is `httpOnly`, `SameSite: lax`, `path: /`, `maxAge: 28800` (8 hours).
- Never expose Supabase service role key, admin password, or Resend API key in client code.
- All leads data is server-side only. Client components receive pre-fetched data as props.
- RLS is enabled on all Supabase tables. Service role bypasses RLS (admin client only).

---

## Supabase Rules

- Always use `getSupabaseAdmin()` from `lib/supabase/admin.ts` for server-side reads/writes.
- Never use the Supabase client in client components.
- Server-side queries only in API routes and Server Components.
- The `experience` service type frontend value maps to `concierge` in the DB (no DB enum change required). Mapping handled in `app/api/requests/route.ts` via `DB_SERVICE_MAP`.
- For Stripe webhook deployment (future): JWT verification must always be disabled.

---

## SEO Rules

- Every public page must have: title, description, canonical, openGraph, twitter card.
- Use `buildMetadata()` from `lib/seo.ts` for all pages.
- `NEXT_PUBLIC_SITE_URL` must be set to the production domain in Vercel. All canonical URLs, OG URLs, and sitemap entries depend on it.
- The sitemap must include all dynamic detail pages: `/fleet/[slug]` (×15), `/jets/[slug]` (×3), `/yachts/[slug]` (×4), `/residences/[slug]` (×8).
- `/experiences` must only be in the sitemap when it has real content (currently it does).
- Admin pages must have `noindex: true` (set in admin layout metadata).
- AEO crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) are explicitly allowed in `robots.ts`.

---

## CRM Rules

- Lead notes (`admin_notes`) and assignment (`assigned_to`) are admin-only fields never shown to clients.
- The `experience` service type is displayed as "Experience" in the CRM but stored as `concierge` in the DB.
- Converting a lead to a booking: POST `/api/admin/bookings` → creates booking record → marks `lead.status = "booked"`.
- Booking statuses: `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`.
- Lead statuses: `new`, `contacted`, `qualified`, `quoted`, `booked`, `completed`, `lost`, `closed`, `archived`.
- All admin API routes use optimistic updates with rollback on failure.

---

## Inventory Rules

- Flat-file inventory lives in `data/inventory/`. Do not add DB calls for inventory until migration is planned.
- Car slugs: PascalCase with color labels (e.g., `Rolls-Royce-Cullinan-BlackBlack`).
- Yacht slugs: clean lowercase (e.g., `ferretti-780`). Internal names never shown publicly.
- Yacht image paths still reference old filesystem directories — do not rename image directories without updating the `images` field in `yachts.ts`.
- Yacht 301 redirects in `next.config.ts` handle old vendor slugs → new clean slugs.
- Residence slugs: lowercase hyphenated. No vendor language.
- Never import `_source`, internal booking refs, vendor names, or partner URLs in public components.

---

## Design Rules

- Follow Pulse luxury aesthetic: editorial, minimal, premium, high trust.
- Never use: rounded buttons (sharp corners), bright colors, flashy animations, gradient banners, "BEST PRICE" language, rental-company visual patterns.
- Color palette: paper (#f6f2ec), ink (#0a0a0a), graphite (#16161a), bone (#ede7dc), brass.
- Display font: serif via `--font-display` CSS variable.
- Transition duration: 480ms (`duration-pulse`). Timing: `cubic-bezier(0.16, 1, 0.3, 1)` (`ease-pulse`).
- Use `duration-pulse` and `ease-pulse` for all hover/transition effects.
- Typography: all-caps labels use `text-[10px] uppercase tracking-[0.22em]` (or similar).
- Admin UI: dark (`bg-ink`), paper text, graphite drawer backgrounds.
- WhatsApp button: never bright green. Black bg, paper text.
- Emojis: only if user explicitly requests them.

---

## Coding Conventions

- Use `pnpm` exclusively. Never `npm` or `yarn`.
- All new components: TypeScript. No `.js` files in `app/` or `components/`.
- Client components: `"use client"` directive at top.
- Server components: default (no directive needed).
- Import aliases: use `@/` for all project imports.
- No `any` types without explicit justification.
- Zod schemas for all API request validation.
- React Hook Form + Zod for all forms.
- Service-role Supabase client: always `import "server-only"` in the file.
- All analytics calls: safe no-ops outside production or when `window` is undefined.
- JSON-LD: always emit via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />`.
- `buildMetadata()` must be called with both `route` (for keywords) and `path` (for canonical).
- Format: `pnpm format` uses Prettier. Always run before committing.

---

## Response Rules (Future Prompts)

When responding to implementation requests:

1. Always provide exact terminal commands first.
2. Then provide implementation.
3. Keep responses concise.
4. Optimize for execution speed.
5. Read all relevant files before writing any code.
6. Never modify files that were not explicitly requested.
7. End every implementation response with:
   - Commands to run
   - Exact next step

All future Claude prompts must end with:

```
no summary
no file changes
```

Unless explicitly told otherwise.

---

## Language Rules

- Use "request" and "arrange" — not "book" or "reserve" (unless unavoidable in legal copy).
- Use "specialist" — not "agent" or "rep."
- Use "quote-only" — not "pricing available on request" or "call for price."
- Use "Pulse curates" or "Pulse arranges" — not "we offer" or "we provide."
- Use "independent operators" — not "third-party" (banned by vendor leak check).
- Do not say "Miami-only." Do not hardcode Miami as the only market.

---

## File Change Protocol

- Never create `.md` or `README` files unless explicitly requested.
- Never add emojis to files unless user explicitly requests it.
- Never amend prior commits — always create new commits.
- Never `git push --force` to main/master.
- Never skip hooks with `--no-verify`.
