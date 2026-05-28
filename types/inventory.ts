export type LuxuryTier = "ultra-luxury";

export interface Car {
  slug: string;
  make: string;
  model: string;
  exterior_color: string;
  interior_color: string | null;
  color_label: string;
  body_style?: string;
  luxury_tier: LuxuryTier;
  homepage_worthy: boolean;
  needs_review?: boolean;
  quote_only: true;
  /** Verified local paths under /public/fleet/[slug]/. Absent = placeholder shown. */
  images?: string[];
}

export interface CarIndex {
  generated: string;
  count: number;
  vehicles: Car[];
}

export interface Yacht {
  slug: string;
  make: string;
  model?: string;
  name?: string;
  length_ft?: number;
  source_tag?: string;
  quote_only: true;
  asset_count: number;
}

export interface YachtIndex {
  generated: string;
  count: number;
  yachts: Yacht[];
}
