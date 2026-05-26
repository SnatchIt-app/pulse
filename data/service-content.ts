// Per-service template content. Placeholder strings — final copy drops in cleanly.
import { HOMEPAGE_MEDIA } from "./media";
import type { RouteKey } from "@/lib/keywords";

export type ServiceContent = {
  route: RouteKey;
  eyebrow: string;
  heading: string;
  opener: string; // 2–3 sentence entity opener — AEO-friendly
  included: ReadonlyArray<{ title: string; body: string }>;
  experiences: ReadonlyArray<{ title: string; body: string; from?: string }>;
  heroImage: string;
  heroAlt: string;
  schema: { name: string; description: string };
};

export const SERVICE_CONTENT = {
  jets: {
    route: "/jets",
    eyebrow: "Pulse Jets",
    heading: "Private jet charter from Miami.",
    opener:
      "Pulse arranges private jet charters from Miami across the U.S., the Caribbean, and Latin America. Light, midsize, super-mid, and long-range aircraft on call — booked, briefed, and on the ramp inside hours.",
    included: [
      {
        title: "On-demand aircraft",
        body: "Light to ultra-long-range, selected to fit your route and group.",
      },
      {
        title: "Ground on both ends",
        body: "Chauffeur pickup and drop-off coordinated into the same itinerary.",
      },
      {
        title: "Catering & briefings",
        body: "Provisioning, manifests, customs handled by Pulse so you don't.",
      },
    ],
    experiences: [
      { title: "Miami → Aspen", body: "Long-weekend ski run.", from: "from $48,000" },
      { title: "Miami → Bahamas", body: "Day-trip island hop.", from: "from $9,800" },
      { title: "Miami → Cabo", body: "Marquee weekends.", from: "from $62,000" },
    ],
    heroImage: HOMEPAGE_MEDIA.editorial.placeholder,
    heroAlt: "Pulse private jet at Miami Opa-Locka FBO at dusk.",
    schema: {
      name: "Private Jet Charter from Miami",
      description:
        "Private jet charter from Miami via Pulse. On-demand, light to ultra-long-range.",
    },
  },
  yachts: {
    route: "/yachts",
    eyebrow: "Pulse Yachts",
    heading: "Yacht charter in Miami.",
    opener:
      "Pulse runs day, multi-day, and event charters from Miami's leading marinas. Curated fleet, vetted crews, watersports and chef-grade provisioning when you want them.",
    included: [
      {
        title: "Crew & fuel",
        body: "Captain and crew on board. Fuel included within an agreed range.",
      },
      { title: "Watersports", body: "Tubes, toys, paddleboards, jet skis — added on request." },
      { title: "Marina pickup", body: "We pick the marina that fits your party." },
    ],
    experiences: [
      { title: "Bay day · 65ft", body: "Full-day Biscayne Bay run.", from: "from $4,800" },
      { title: "Bimini overnight · 85ft", body: "One-night island trip.", from: "from $24,000" },
      { title: "Sunset cruise · 80ft", body: "3-hour sundown charter.", from: "from $3,200" },
    ],
    heroImage: HOMEPAGE_MEDIA.editorial.placeholder,
    heroAlt: "Luxury motor yacht on Biscayne Bay at golden hour.",
    schema: {
      name: "Yacht Charter in Miami",
      description:
        "Yacht charter and day experiences in Miami via Pulse — curated vessels, vetted crews.",
    },
  },
  "jet-skis": {
    route: "/jet-skis",
    eyebrow: "Pulse Jet Skis",
    heading: "Jet ski rental in Miami.",
    opener:
      "Pulse delivers jet skis across Miami, Miami Beach, and the major hotel marinas. Hourly, half-day, and full-day sessions with a quick handoff and a discreet team.",
    included: [
      { title: "Delivery", body: "To most Miami and Miami Beach docks." },
      { title: "Briefing & safety", body: "Quick onboarding by a Pulse team member." },
      { title: "Fuel option", body: "Optional refuel package on multi-hour sessions." },
    ],
    experiences: [
      { title: "1-hour rip", body: "Quick run around the bay.", from: "from $220" },
      { title: "Half-day", body: "Bay + barrier-island circuit.", from: "from $640" },
      { title: "Full-day", body: "All-day, includes refuel.", from: "from $1,100" },
    ],
    heroImage: HOMEPAGE_MEDIA.editorial.placeholder,
    heroAlt: "Jet ski moving across calm Miami bay water at midday.",
    schema: {
      name: "Jet Ski Rental in Miami",
      description: "Jet ski rentals delivered across Miami and Miami Beach via Pulse.",
    },
  },
  chauffeur: {
    route: "/chauffeur",
    eyebrow: "Pulse Chauffeur",
    heading: "Private chauffeur in Miami.",
    opener:
      "Pulse runs a discreet private-chauffeur program across Miami. Executive sedans, extended SUVs, and Sprinter limos with vetted drivers — hourly, transfer, day-rate, or multi-day.",
    included: [
      { title: "Vetted drivers", body: "Professional, discreet, and dressed to match the brief." },
      {
        title: "Right vehicle",
        body: "Sedan, SUV, or Sprinter — chosen for party size and luggage.",
      },
      { title: "Itinerary support", body: "Coordinated with the rest of your Pulse stay." },
    ],
    experiences: [
      { title: "Airport transfer", body: "MIA / FLL pickup, doorstep drop.", from: "from $180" },
      { title: "Hourly", body: "On-call across Miami.", from: "from $120/hr" },
      { title: "Full-day", body: "Eight-hour day-rate.", from: "from $1,400" },
    ],
    heroImage: HOMEPAGE_MEDIA.editorial.placeholder,
    heroAlt: "Black executive SUV parked at a Miami hotel motor lobby.",
    schema: {
      name: "Private Chauffeur Service in Miami",
      description: "Discreet, professional chauffeur service across Miami via Pulse.",
    },
  },
  restaurants: {
    route: "/restaurants",
    eyebrow: "Pulse Dining",
    heading: "VIP reservations in Miami.",
    opener:
      "Pulse books the hardest tables in Miami via a concierge network built over years of relationships. South Beach, Brickell, Wynwood, the Design District — same-night to long lead.",
    included: [
      { title: "Right table, right time", body: "Placement and timing matter — we handle both." },
      {
        title: "Direct host channel",
        body: "Your reservation lands with a named host, not a queue.",
      },
      {
        title: "Private rooms",
        body: "Buy-outs and private rooms when the occasion calls for it.",
      },
    ],
    experiences: [
      { title: "Marquee weekend", body: "F1, Art Basel, NYE table programs." },
      { title: "Private buyout", body: "Full or partial restaurant takeovers." },
      { title: "Tasting routing", body: "Multi-stop progressive dinner across the city." },
    ],
    heroImage: HOMEPAGE_MEDIA.editorial.placeholder,
    heroAlt: "Editorial Miami restaurant interior at golden hour.",
    schema: {
      name: "VIP Restaurant Reservations in Miami",
      description: "Hard-to-book tables at Miami's top restaurants via Pulse's concierge network.",
    },
  },
  nightlife: {
    route: "/nightlife",
    eyebrow: "Pulse Nightlife",
    heading: "VIP club access in Miami.",
    opener:
      "Pulse runs table service, bottle programs, and host introductions across Miami's top venues. South Beach, Wynwood, downtown — booked end-to-end, with chauffeur in and out.",
    included: [
      {
        title: "Tables & bottles",
        body: "Reserved tables and bottle minimums handled in advance.",
      },
      { title: "Host introductions", body: "We hand you off to a named host on arrival." },
      { title: "Chauffeur loop", body: "Rolling pickup and drop-off across your evening." },
    ],
    experiences: [
      { title: "LIV Saturday", body: "Marquee table programs." },
      { title: "Wynwood late-night", body: "Curated multi-venue routing." },
      { title: "Yacht-to-club", body: "Bay sunset into club table service." },
    ],
    heroImage: HOMEPAGE_MEDIA.editorial.placeholder,
    heroAlt: "Editorial nightclub interior, low warm light, no people.",
    schema: {
      name: "VIP Nightlife & Club Access in Miami",
      description: "Tables, bottle service, and host introductions at Miami's top clubs via Pulse.",
    },
  },
} satisfies Record<string, ServiceContent>;
