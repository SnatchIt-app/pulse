import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import { cars } from "@/data/inventory/cars";
import { jets } from "@/data/inventory/jets";
import { yachts } from "@/data/inventory/yachts";
import { residences } from "@/data/inventory/residences";
import { ARTICLES } from "@/data/journal";

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC: ReadonlyArray<{
  path: string;
  priority: number;
  freq: SitemapEntry["changeFrequency"];
}> = [
  { path: "/", priority: 1.0, freq: "daily" },
  { path: "/fleet", priority: 0.9, freq: "weekly" },
  { path: "/jets", priority: 0.9, freq: "weekly" },
  { path: "/yachts", priority: 0.9, freq: "weekly" },
  { path: "/residences", priority: 0.9, freq: "weekly" },
  { path: "/concierge", priority: 0.8, freq: "weekly" },
  { path: "/request", priority: 0.8, freq: "monthly" },
  { path: "/chauffeur", priority: 0.7, freq: "weekly" },
  { path: "/restaurants", priority: 0.7, freq: "weekly" },
  { path: "/nightlife", priority: 0.7, freq: "weekly" },
  { path: "/contact", priority: 0.7, freq: "monthly" },
  { path: "/experiences", priority: 0.75, freq: "weekly" },
  { path: "/experiences/world-cup", priority: 0.8, freq: "weekly" },
  { path: "/jet-skis", priority: 0.6, freq: "weekly" },
  { path: "/about", priority: 0.6, freq: "monthly" },
  { path: "/journal", priority: 0.7, freq: "weekly" },
  { path: "/legal/terms", priority: 0.3, freq: "monthly" },
  { path: "/legal/privacy", priority: 0.3, freq: "monthly" },
  // /experiences — full page, included above
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC.map(({ path, priority, freq }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));

  const fleetEntries: MetadataRoute.Sitemap = cars.map((car) => ({
    url: absoluteUrl(`/fleet/${car.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const jetEntries: MetadataRoute.Sitemap = jets.map((jet) => ({
    url: absoluteUrl(`/jets/${jet.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const yachtEntries: MetadataRoute.Sitemap = yachts.map((yacht) => ({
    url: absoluteUrl(`/yachts/${yacht.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const residenceEntries: MetadataRoute.Sitemap = residences.map((r) => ({
    url: absoluteUrl(`/residences/${r.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const journalEntries: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: absoluteUrl(`/journal/${a.slug}`),
    lastModified: new Date(a.dateModified ?? a.datePublished),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...fleetEntries,
    ...jetEntries,
    ...yachtEntries,
    ...residenceEntries,
    ...journalEntries,
  ];
}
