# Pulse

Pulse website + CRM. Next.js App Router · TypeScript (strict) · Tailwind · Supabase · Vercel.

Source of truth: `../PULSE_PRD_AND_ARCHITECTURE.md`, `../PULSE_IMPLEMENTATION_CHECKLIST.md`.

## Commands

```
pnpm install
cp .env.local.example .env.local   # then fill in Supabase keys
pnpm dev                            # http://localhost:3000
pnpm typecheck
pnpm lint
pnpm format
pnpm build
pnpm check:no-vendor-leak          # run after pnpm build
```

## Phase status

Phase 1 only: scaffold, design tokens, SEO/AEO infra, marketing shell, route stubs,
admin placeholders, residences stubs + vendor-leak protection. No CRM, Stripe, scraping, or final copy.

## Guardrails

- Residence vendor/source data (`internal_source_*`, `address_private`, `base_rate_internal`,
  `markup_*`, `source_calendar_url`, `external_property_id`) is RLS-gated and never leaves the server.
  Public reads use `getPublicResidence()` / `PUBLIC_RESIDENCE_FIELDS` in `lib/supabase/server.ts`.
- `pnpm check:no-vendor-leak` fails the build if vendor identity appears in `.next/` or `public/`.
