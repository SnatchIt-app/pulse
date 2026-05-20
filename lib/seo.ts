import type { Metadata } from "next";
import { KEYWORDS, type RouteKey } from "./keywords";
import { SITE_URL, absoluteUrl } from "./utils";

type BuildMetadataInput = {
  route?: RouteKey;
  title?: string;
  description?: string;
  path: string;
  ogImagePath?: string;
  keywords?: readonly string[];
  noindex?: boolean;
};

export function buildMetadata({
  route,
  title,
  description,
  path,
  ogImagePath,
  keywords,
  noindex = false,
}: BuildMetadataInput): Metadata {
  const fallback = route ? KEYWORDS[route] : null;
  const rawTitle = title ?? fallback?.title ?? "Pulse";
  // Control the title absolutely so the root "%s — Pulse" template never
  // double-applies the brand. Append brand once when not already present.
  const resolvedTitle = rawTitle.includes("Pulse") ? rawTitle : `${rawTitle} — Pulse`;
  const resolvedDescription = description ?? fallback?.description ?? "";
  const resolvedKeywords =
    keywords ?? (fallback ? [fallback.primary, ...fallback.secondary] : undefined);
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(ogImagePath ?? "/api/og");

  return {
    title: { absolute: resolvedTitle },
    description: resolvedDescription,
    keywords: resolvedKeywords ? [...resolvedKeywords] : undefined,
    alternates: { canonical },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: "Pulse",
      locale: "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export const SITE = { url: SITE_URL, name: "Pulse" };
