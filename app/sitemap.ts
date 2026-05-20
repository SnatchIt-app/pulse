import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

// Static routes. Dynamic /fleet/[slug] + /residences/[slug] entries are
// added in Phase 3 / 3.5 once Supabase inventory is seeded.
const STATIC_ROUTES = [
  "/",
  "/fleet",
  "/jets",
  "/yachts",
  "/jet-skis",
  "/chauffeur",
  "/restaurants",
  "/nightlife",
  "/concierge",
  "/residences",
  "/experiences",
  "/about",
  "/contact",
  "/request",
  "/legal/terms",
  "/legal/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
