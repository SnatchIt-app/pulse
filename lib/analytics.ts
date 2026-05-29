/**
 * Pulse Analytics — GA4 + Meta Pixel tracking.
 *
 * All functions are safe no-ops when:
 *   - NODE_ENV !== "production"
 *   - env var is not set
 *   - window is not defined (SSR)
 *
 * No third-party packages. Uses window.gtag / window.fbq directly.
 * Both APIs queue commands before the script fully loads, so early
 * calls are replayed automatically.
 *
 * Setup (.env.local / deployment environment):
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXXXX
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const isProd = process.env.NODE_ENV === "production";
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// ─── Core ─────────────────────────────────────────────────────────────────────

/**
 * Fire a GA4 config hit + Meta Pixel PageView.
 * Called by AnalyticsProvider on every App Router route change.
 */
export function trackPageView(url: string): void {
  if (!isProd || typeof window === "undefined") return;
  if (GA_ID && window.gtag) {
    window.gtag("config", GA_ID, { page_path: url });
  }
  if (META_ID && window.fbq) {
    window.fbq("track", "PageView");
  }
}

/** Internal — fires a GA4 custom event + Meta Pixel trackCustom. */
function fire(event: string, params?: Record<string, unknown>): void {
  if (!isProd || typeof window === "undefined") return;
  if (GA_ID && window.gtag) {
    window.gtag("event", event, params ?? {});
  }
  if (META_ID && window.fbq) {
    window.fbq("trackCustom", event, params);
  }
}

// ─── Vehicle ──────────────────────────────────────────────────────────────────

export const trackVehicleView = (slug: string): void => fire("vehicle_view", { slug });

export const trackVehicleRequest = (slug: string): void => fire("vehicle_request_click", { slug });

export const trackVehicleLead = (slug: string): void => fire("vehicle_lead_submit", { slug });

// ─── Yacht ────────────────────────────────────────────────────────────────────

export const trackYachtView = (slug: string): void => fire("yacht_view", { slug });

export const trackYachtRequest = (slug: string): void => fire("yacht_request_click", { slug });

export const trackYachtLead = (slug: string): void => fire("yacht_lead_submit", { slug });

// ─── Jet ──────────────────────────────────────────────────────────────────────

export const trackJetView = (slug: string): void => fire("jet_view", { slug });

export const trackJetRequest = (slug: string): void => fire("jet_request_click", { slug });

export const trackJetLead = (slug: string): void => fire("jet_lead_submit", { slug });

// ─── Residence ────────────────────────────────────────────────────────────────

export const trackResidenceView = (slug: string): void => fire("residence_view", { slug });

export const trackResidenceRequest = (slug: string): void =>
  fire("residence_request_click", { slug });

export const trackResidenceLead = (slug: string): void => fire("residence_lead_submit", { slug });

// ─── Concierge ────────────────────────────────────────────────────────────────

export const trackConciergeLead = (): void => fire("concierge_lead_submit");

// ─── General form ─────────────────────────────────────────────────────────────

export const trackFormSubmit = (serviceType: string): void =>
  fire("request_form_submit", { service_type: serviceType });

export const trackFormSuccess = (serviceType: string): void =>
  fire("request_form_success", { service_type: serviceType });
