# Pulse Analytics Setup

## Environment variables

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXXXX
```

Add to `.env.local` for local testing (with a dev GA4 property) and to your
deployment environment (Vercel / hosting) for production.

Both are optional. All tracking is a no-op when either var is missing or when
`NODE_ENV !== "production"`.

## GA4

1. Go to [analytics.google.com](https://analytics.google.com) → Admin → Data Streams → Web
2. Copy the Measurement ID (`G-XXXXXXXXXX`)
3. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID`

GA4 DebugView: install the **Google Analytics Debugger** Chrome extension, then
open DebugView in GA4. No code changes needed.

## Meta Pixel

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager)
2. Create or select a Pixel → copy the Pixel ID
3. Set `NEXT_PUBLIC_META_PIXEL_ID`

## How it works

- Scripts loaded once in `app/layout.tsx` (`strategy="afterInteractive"`, production only)
- GA4 initialises with `send_page_view: false`
- `AnalyticsProvider` fires `trackPageView` on every App Router route change
  (including initial mount) — single source of page view events, no duplicates

## Tracking helpers (`lib/analytics.ts`)

```ts
// Vehicle
trackVehicleView(slug); // fires on fleet detail page mount
trackVehicleRequest(slug); // fires on "Request a Quote" click / form mount
trackVehicleLead(slug); // fires on successful lead submission

// Yacht
trackYachtView(slug);
trackYachtRequest(slug);
trackYachtLead(slug);

// Jet
trackJetView(slug);
trackJetRequest(slug);
trackJetLead(slug);

// Residence
trackResidenceView(slug);
trackResidenceRequest(slug);
trackResidenceLead(slug);

// Concierge
trackConciergeLead();

// General form
trackFormSubmit(serviceType); // fires on form submit attempt
trackFormSuccess(serviceType); // fires on API success
```
