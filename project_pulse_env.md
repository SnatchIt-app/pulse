# Pulse — Environment Variables Reference

> All environment variables used in the Pulse project.
> Production values set in Vercel project settings.
> Local values in `.env.local` (gitignored).

---

## Critical: SITE_URL

```
NEXT_PUBLIC_SITE_URL=https://pulse.luxury
```

**This is the most important env var for production.**

Used in:
- `lib/utils.ts` — `SITE_URL` constant, fallback to `http://localhost:3000`
- `app/layout.tsx` — `metadataBase: new URL(SITE_URL)`
- `app/sitemap.ts` — all sitemap URLs via `absoluteUrl()`
- `lib/schema.ts` — all JSON-LD `@url` fields
- `lib/seo.ts` — canonical URL construction
- `lib/email.ts` — admin URL in notification emails

**If not set in Vercel**: every canonical URL, OG image URL, sitemap entry, and schema URL points to `http://localhost:3000`. This silently destroys SEO.

---

## Supabase

```
NEXT_PUBLIC_SUPABASE_URL=https://aihgejwdvkvngjwttxij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key — safe for browser]
SUPABASE_SERVICE_ROLE_KEY=[service role key — NEVER expose to browser]
```

**Project details:**
- Project name: Pulse
- Project ID: aihgejwdvkvngjwttxij
- Region: us-east-1
- Database host: db.aihgejwdvkvngjwttxij.supabase.co
- PostgreSQL: 17.6.1.127

**Usage:**
- `NEXT_PUBLIC_SUPABASE_URL` — used in `lib/supabase/admin.ts` to create the service role client
- `SUPABASE_SERVICE_ROLE_KEY` — server-only. Used in `lib/supabase/admin.ts`. Bypasses RLS. Never import in client components.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — in `.env.local.example` but not currently used in application code (service role only pattern)

**Security rule:** `SUPABASE_SERVICE_ROLE_KEY` must never appear in browser-accessible code. File `lib/supabase/admin.ts` imports `server-only` to enforce this at build time.

---

## Admin Authentication

```
ADMIN_PASSWORD=[password]
```

**Purpose:** Validates POST `/api/admin/login`. When password matches, sets `pulse_admin_session` cookie.

**Cookie spec:**
- Name: `pulse_admin_session`
- Value: `"1"`
- `httpOnly: true`
- `sameSite: "lax"`
- `path: "/"`
- `maxAge: 28800` (8 hours)

**Future:** Replace with Supabase Auth (Phase 5). The `public.users` table already exists in Supabase with owner/admin/agent/viewer roles.

---

## Email (Resend)

```
RESEND_API_KEY=[key from resend.com]
LEAD_NOTIFY_EMAIL=[email to receive new lead notifications]
RESEND_FROM_EMAIL=Pulse notifications@pulse.luxury
```

**Usage:** `lib/email.ts` — `sendLeadNotification()`. Called from `/api/requests` and `/api/residence-requests` after successful Supabase insert.

**Behavior:**
- Never throws — all errors are logged and swallowed. The caller is never blocked.
- If `RESEND_API_KEY` or `LEAD_NOTIFY_EMAIL` are missing: notification skipped, warning logged.
- If `RESEND_FROM_EMAIL` is missing: falls back to `onboarding@resend.dev` (Resend account owner only).

**Email subject format:** `New Pulse Lead — [Service Label]`

**Service labels in email:**
- car → "Exotic Car"
- yacht → "Yacht Charter"
- jet → "Private Jet"
- jet_ski → "Jet Skis"
- chauffeur → "Chauffeur"
- restaurant → "Dining & Reservations"
- nightlife → "Nightlife"
- concierge → "Concierge"
- residence → "Residence"
- experience → "Experience"
- other → "Other"

---

## Analytics

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-G52Y1TQ8TM
NEXT_PUBLIC_META_PIXEL_ID=[meta pixel ID — not yet configured]
```

**GA4:**
- Measurement ID: G-G52Y1TQ8TM
- Status: installed and active in production
- Script: loaded via `next/script` with `strategy="afterInteractive"` in root layout
- Page views: manual (`send_page_view: false` in gtag config, fired by AnalyticsProvider)
- Custom events: all via `lib/analytics.ts` `fire()` function

**Meta Pixel:**
- Status: script installed in root layout, ID not yet configured
- Set `NEXT_PUBLIC_META_PIXEL_ID` in Vercel to activate
- Page views: fired by AnalyticsProvider alongside GA4

**Analytics pattern:** All functions in `lib/analytics.ts` are safe no-ops when:
- `NODE_ENV !== "production"`
- `typeof window === "undefined"` (SSR)
- The relevant env var is not set

---

## Sync / Webhooks

```
SYNC_SECRET=[secret token]
SLACK_OPS_WEBHOOK=[Slack webhook URL — optional]
```

**SYNC_SECRET:** Protects `/api/residences/sync` route. Used for residence availability sync trigger. Requires written permission from vendor before activating.

**SLACK_OPS_WEBHOOK:** Optional. Referenced in `.env.local.example`. Not currently active in application code.

---

## Local Development (.env.local.example)

```env
# Public (safe to expose to the browser)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Server-only (never expose to the browser)
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
SLACK_OPS_WEBHOOK=

# Residences availability sync (Phase 6). Protects /api/residences/sync.
SYNC_SECRET=
```

Note: `ADMIN_PASSWORD`, `LEAD_NOTIFY_EMAIL`, `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, and `NEXT_PUBLIC_META_PIXEL_ID` are not in `.env.local.example` — add manually for local testing.

---

## Vercel Environment Variables — Production Checklist

| Variable | Status | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Must set | Set to `https://pulse.luxury` |
| `NEXT_PUBLIC_SUPABASE_URL` | Must set | From Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Not currently used in code |
| `SUPABASE_SERVICE_ROLE_KEY` | Must set | From Supabase → Settings → API |
| `ADMIN_PASSWORD` | Must set | Choose strong password |
| `RESEND_API_KEY` | Must set | From resend.com |
| `LEAD_NOTIFY_EMAIL` | Must set | Where to receive lead emails |
| `RESEND_FROM_EMAIL` | Must set | Verified Resend sender domain |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Known | `G-G52Y1TQ8TM` |
| `NEXT_PUBLIC_META_PIXEL_ID` | Not yet configured | Get from Meta Events Manager |
| `SYNC_SECRET` | Optional | Only needed for residence sync |
| `SLACK_OPS_WEBHOOK` | Optional | Not in active use |

---

## Domain Configuration

Target domain: `pulse.luxury`

DNS setup (via Vercel):

1. Purchase domain (`pulse.luxury` at $32/yr via Vercel domains)
2. In Vercel project → Settings → Domains → Add `pulse.luxury`
3. Vercel auto-provisions SSL
4. Set `NEXT_PUBLIC_SITE_URL=https://pulse.luxury` in Vercel env vars
5. Redeploy after env var change

Google Search Console:

- Verification file: `/public/googlee1a08364bbb0bc7e.html`
- Serves at: `https://pulse.luxury/googlee1a08364bbb0bc7e.html`
- Content: `google-site-verification: googlee1a08364bbb0bc7e.html`
- Status: file in place, domain connection pending

Sitemap URL (post-deploy):

`https://pulse.luxury/sitemap.xml`

Robots URL:

`https://pulse.luxury/robots.txt`
