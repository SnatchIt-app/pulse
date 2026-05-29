"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ComponentProps } from "react";
import { trackPageView } from "@/lib/analytics";

// ─── AnalyticsProvider ────────────────────────────────────────────────────────
// Mount once in root layout. Fires a page view on every App Router route
// change including initial mount — single source of page view events for
// GA4 and Meta Pixel (scripts init with send_page_view: false).

export function AnalyticsProvider() {
  const pathname = usePathname();
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

// ─── TrackView ────────────────────────────────────────────────────────────────
// Renders nothing. Drop into any server page to fire a named event once on
// client mount. Props are serialisable strings/objects — safe across the
// server→client boundary.
//
//   <TrackView event="vehicle_view" params={{ slug }} />

export function TrackView({
  event,
  params,
}: {
  event: string;
  params?: Record<string, string | number | boolean>;
}) {
  useEffect(() => {
    // Import is side-effect-only here; we call window APIs directly so the
    // typed helpers are not needed at this call site.
    if (process.env.NODE_ENV !== "production" || typeof window === "undefined") return;
    const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    if (GA_ID && window.gtag) window.gtag("event", event, params ?? {});
    if (META_ID && window.fbq) window.fbq("trackCustom", event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

// ─── TrackLink ────────────────────────────────────────────────────────────────
// Drop-in for <Link> that fires a named event on click.
// Props are serialisable — safe across the server→client boundary.
//
//   <TrackLink href={href} trackEvent="vehicle_request_click" trackParams={{ slug }}>

type TrackLinkProps = ComponentProps<typeof Link> & {
  trackEvent: string;
  trackParams?: Record<string, string | number | boolean>;
};

export function TrackLink({ trackEvent, trackParams, onClick, ...props }: TrackLinkProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (process.env.NODE_ENV !== "production" || typeof window === "undefined") {
      onClick?.(e);
      return;
    }
    const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    if (GA_ID && window.gtag) window.gtag("event", trackEvent, trackParams ?? {});
    if (META_ID && window.fbq) window.fbq("trackCustom", trackEvent, trackParams);
    onClick?.(e);
  }
  return <Link {...props} onClick={handleClick} />;
}
