#!/usr/bin/env tsx
/**
 * Pulse — Sync public inventory into the Supabase assets table.
 *
 * Usage:
 *   pnpm sync:assets
 *   npx tsx scripts/sync-assets-from-inventory.ts
 *
 * Reads .env.local automatically when present.
 * Inserts new assets, updates existing ones (identified by source_slug).
 * Preserves manual status edits, cover images, and gallery additions.
 * Does NOT require a unique index — safe to run before or after migrations.
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// ─── Load .env.local ──────────────────────────────────────────────────────────

try {
  const lines = readFileSync(".env.local", "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) process.env[key] = val;
  }
} catch {
  // .env.local absent — system env vars used
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "\nError: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Set them in .env.local or pass as environment variables.\n",
  );
  process.exit(1);
}

// ─── Asset Seed Data ──────────────────────────────────────────────────────────

type AssetSeed = {
  name: string;
  service_type: string;
  status: "available";
  description: string | null;
  slug: string;
  cover_image: string | null;
  public_url: string;
  source_inventory_type: string;
  source_slug: string;
  gallery: string[];
};

const ASSETS: AssetSeed[] = [
  // ── Cars (15) ──────────────────────────────────────────────────────────────
  {
    name: "Rolls-Royce Cullinan — Black / Black-Teal",
    service_type: "car",
    status: "available",
    description: "SUV · Black / Black-Teal",
    slug: "Rolls-Royce-Cullinan-BlackBlack-Teal",
    cover_image: "/fleet/Rolls-Royce-Cullinan-BlackBlack-Teal/cover.jpg",
    public_url: "/fleet/Rolls-Royce-Cullinan-BlackBlack-Teal",
    source_inventory_type: "car",
    source_slug: "Rolls-Royce-Cullinan-BlackBlack-Teal",
    gallery: [],
  },
  {
    name: "Rolls-Royce Cullinan — Black",
    service_type: "car",
    status: "available",
    description: "SUV · Black / Black",
    slug: "Rolls-Royce-Cullinan-BlackBlack",
    cover_image: "/fleet/Rolls-Royce-Cullinan-BlackBlack/cover.jpg",
    public_url: "/fleet/Rolls-Royce-Cullinan-BlackBlack",
    source_inventory_type: "car",
    source_slug: "Rolls-Royce-Cullinan-BlackBlack",
    gallery: [],
  },
  {
    name: "Rolls-Royce Dawn — Black",
    service_type: "car",
    status: "available",
    description: "Convertible · Black / Black",
    slug: "Rolls-Royce-Dawn-BlackBlack",
    cover_image: "/fleet/Rolls-Royce-Dawn-BlackBlack/cover.jpg",
    public_url: "/fleet/Rolls-Royce-Dawn-BlackBlack",
    source_inventory_type: "car",
    source_slug: "Rolls-Royce-Dawn-BlackBlack",
    gallery: [],
  },
  {
    name: "Rolls-Royce Dawn — Black / Red",
    service_type: "car",
    status: "available",
    description: "Convertible · Black / Red",
    slug: "Rolls-Royce-Dawn-BlackRed",
    cover_image: "/fleet/Rolls-Royce-Dawn-BlackRed/cover.jpg",
    public_url: "/fleet/Rolls-Royce-Dawn-BlackRed",
    source_inventory_type: "car",
    source_slug: "Rolls-Royce-Dawn-BlackRed",
    gallery: [],
  },
  {
    name: "Lamborghini Urus — Grey / Brown",
    service_type: "car",
    status: "available",
    description: "SUV · Grey / Brown",
    slug: "Lamborghini-Urus-GreyBrown",
    cover_image: "/fleet/Lamborghini-Urus-GreyBrown/cover.jpg",
    public_url: "/fleet/Lamborghini-Urus-GreyBrown",
    source_inventory_type: "car",
    source_slug: "Lamborghini-Urus-GreyBrown",
    gallery: [],
  },
  {
    name: "Lamborghini Huracan Spyder — Black",
    service_type: "car",
    status: "available",
    description: "Convertible/Spyder · Black / Black",
    slug: "Lamborghini-Huracan-Spyder-BlackBlack",
    cover_image: "/fleet/Lamborghini-Huracan-Spyder-BlackBlack/cover.jpg",
    public_url: "/fleet/Lamborghini-Huracan-Spyder-BlackBlack",
    source_inventory_type: "car",
    source_slug: "Lamborghini-Huracan-Spyder-BlackBlack",
    gallery: [],
  },
  {
    name: "Lamborghini Huracan Spyder — Balloon White / Red",
    service_type: "car",
    status: "available",
    description: "Convertible/Spyder · Balloon White / Red",
    slug: "Lamborghini-Huracan-Spyder-Balloon-WhiteRed",
    cover_image: "/fleet/Lamborghini-Huracan-Spyder-Balloon-WhiteRed/cover.jpg",
    public_url: "/fleet/Lamborghini-Huracan-Spyder-Balloon-WhiteRed",
    source_inventory_type: "car",
    source_slug: "Lamborghini-Huracan-Spyder-Balloon-WhiteRed",
    gallery: [],
  },
  {
    name: "Lamborghini Huracan EVO — Green / Black",
    service_type: "car",
    status: "available",
    description: "Coupé · Green / Black",
    slug: "Lamborghini-Huracan-EVO-GreenBlack",
    cover_image: "/fleet/Lamborghini-Huracan-EVO-GreenBlack/cover.jpg",
    public_url: "/fleet/Lamborghini-Huracan-EVO-GreenBlack",
    source_inventory_type: "car",
    source_slug: "Lamborghini-Huracan-EVO-GreenBlack",
    gallery: [],
  },
  {
    name: "Lamborghini Huracan EVO Spyder — Blu Glauco / Black",
    service_type: "car",
    status: "available",
    description: "Convertible/Spyder · Blu Glauco / Black",
    slug: "Lamborghini-Huracan-EVO-Spyder-Blu-Glauco-Black",
    cover_image: "/fleet/Lamborghini-Huracan-EVO-Spyder-Blu-Glauco-Black/cover.jpg",
    public_url: "/fleet/Lamborghini-Huracan-EVO-Spyder-Blu-Glauco-Black",
    source_inventory_type: "car",
    source_slug: "Lamborghini-Huracan-EVO-Spyder-Blu-Glauco-Black",
    gallery: [],
  },
  {
    name: "Lamborghini Huracan — Yellow / Black",
    service_type: "car",
    status: "available",
    description: "Coupé · Yellow / Black",
    slug: "Lamborghini-Huracan-YellowBlack",
    cover_image: "/fleet/Lamborghini-Huracan-YellowBlack/cover.jpg",
    public_url: "/fleet/Lamborghini-Huracan-YellowBlack",
    source_inventory_type: "car",
    source_slug: "Lamborghini-Huracan-YellowBlack",
    gallery: [],
  },
  {
    name: "Bentley Bentayga W12 Speed — Black / Black-Orange",
    service_type: "car",
    status: "available",
    description: "SUV · Black / Black-Orange",
    slug: "Bentley-Bentayga-W12-Speed-BlackBlack-Orange",
    cover_image: "/fleet/Bentley-Bentayga-W12-Speed-BlackBlack-Orange/cover.jpg",
    public_url: "/fleet/Bentley-Bentayga-W12-Speed-BlackBlack-Orange",
    source_inventory_type: "car",
    source_slug: "Bentley-Bentayga-W12-Speed-BlackBlack-Orange",
    gallery: [],
  },
  {
    name: "Bentley Continental Convertible W12 Speed — Black / Black-Orange",
    service_type: "car",
    status: "available",
    description: "Convertible · Black / Black-Orange",
    slug: "Bentley-Continental-Convertible-W12-Speed-BlackBlack-Orange",
    cover_image: "/fleet/Bentley-Continental-Convertible-W12-Speed-BlackBlack-Orange/cover.jpg",
    public_url: "/fleet/Bentley-Continental-Convertible-W12-Speed-BlackBlack-Orange",
    source_inventory_type: "car",
    source_slug: "Bentley-Continental-Convertible-W12-Speed-BlackBlack-Orange",
    gallery: [],
  },
  {
    name: "McLaren GT — Green / Black",
    service_type: "car",
    status: "available",
    description: "Coupé · Green / Black",
    slug: "McLaren-GT-GreenBlack",
    cover_image: "/fleet/McLaren-GT-GreenBlack/cover.jpg",
    public_url: "/fleet/McLaren-GT-GreenBlack",
    source_inventory_type: "car",
    source_slug: "McLaren-GT-GreenBlack",
    gallery: [],
  },
  {
    name: "McLaren GT — Orange / Black",
    service_type: "car",
    status: "available",
    description: "Coupé · Orange / Black",
    slug: "McLaren-GT-OrangeBlack",
    cover_image: "/fleet/McLaren-GT-OrangeBlack/cover.jpg",
    public_url: "/fleet/McLaren-GT-OrangeBlack",
    source_inventory_type: "car",
    source_slug: "McLaren-GT-OrangeBlack",
    gallery: [],
  },
  {
    name: "McLaren GT — Black",
    service_type: "car",
    status: "available",
    description: "Coupé · Black / Black",
    slug: "McLaren-GT-BlackBlack",
    cover_image: "/fleet/McLaren-GT-BlackBlack/cover.jpg",
    public_url: "/fleet/McLaren-GT-BlackBlack",
    source_inventory_type: "car",
    source_slug: "McLaren-GT-BlackBlack",
    gallery: [],
  },

  // ── Jets (3) ───────────────────────────────────────────────────────────────
  {
    name: "Citation 650",
    service_type: "jet",
    status: "available",
    description: "Midsize Jet · up to 8 passengers",
    slug: "citation-650",
    cover_image: "/jets/citation-650/cover.jpg",
    public_url: "/jets/citation-650",
    source_inventory_type: "jet",
    source_slug: "citation-650",
    gallery: [],
  },
  {
    name: "Gulfstream G4",
    service_type: "jet",
    status: "available",
    description: "Heavy Jet · up to 12 passengers",
    slug: "gulfstream-g4",
    cover_image: "/jets/gulfstream-g4/cover.jpg",
    public_url: "/jets/gulfstream-g4",
    source_inventory_type: "jet",
    source_slug: "gulfstream-g4",
    gallery: [],
  },
  {
    name: "Hawker 800XP",
    service_type: "jet",
    status: "available",
    description: "Midsize Jet · up to 8 passengers",
    slug: "hawker-800xp",
    cover_image: "/jets/hawker-800xp/cover.jpg",
    public_url: "/jets/hawker-800xp",
    source_inventory_type: "jet",
    source_slug: "hawker-800xp",
    gallery: [],
  },

  // ── Yachts (4) ─────────────────────────────────────────────────────────────
  {
    name: "Ferretti 780",
    service_type: "yacht",
    status: "available",
    description: "Motor yacht",
    slug: "ferretti-780",
    cover_image: "/yachts/ferretti-780-hsy/cover.jpg",
    public_url: "/yachts/ferretti-780",
    source_inventory_type: "yacht",
    source_slug: "ferretti-780",
    gallery: [],
  },
  {
    name: "Azimut 72",
    service_type: "yacht",
    status: "available",
    description: "Motor yacht · 72 ft",
    slug: "azimut-72",
    cover_image: "/yachts/azimut-72-mancusa/cover.jpg",
    public_url: "/yachts/azimut-72",
    source_inventory_type: "yacht",
    source_slug: "azimut-72",
    gallery: [],
  },
  {
    name: "Princess 88",
    service_type: "yacht",
    status: "available",
    description: "Motor yacht · 88 ft",
    slug: "princess-88",
    cover_image: "/yachts/princess-88-praying-for-overtime/cover.jpg",
    public_url: "/yachts/princess-88",
    source_inventory_type: "yacht",
    source_slug: "princess-88",
    gallery: [],
  },
  {
    name: "Sunseeker 92",
    service_type: "yacht",
    status: "available",
    description: "Motor yacht · 92 ft",
    slug: "sunseeker-92",
    cover_image: "/yachts/sunseeker-92-rmm-job/cover.jpg",
    public_url: "/yachts/sunseeker-92",
    source_inventory_type: "yacht",
    source_slug: "sunseeker-92",
    gallery: [],
  },

  // ── Residences (8) ─────────────────────────────────────────────────────────
  {
    name: "South Beach Townhouse",
    service_type: "residence",
    status: "available",
    description: "5 BR / 4 BA · 20 guests · South Beach",
    slug: "south-beach-townhouse",
    cover_image: "/residences/south-beach-townhouse/cover.jpg",
    public_url: "/residences/south-beach-townhouse",
    source_inventory_type: "residence",
    source_slug: "south-beach-townhouse",
    gallery: [],
  },
  {
    name: "Miami Beach Townhouse",
    service_type: "residence",
    status: "available",
    description: "4 BR / 4 BA · 20 guests · Miami Beach",
    slug: "miami-beach-townhouse",
    cover_image: "/residences/miami-beach-townhouse/cover.jpg",
    public_url: "/residences/miami-beach-townhouse",
    source_inventory_type: "residence",
    source_slug: "miami-beach-townhouse",
    gallery: [],
  },
  {
    name: "Design District Estate",
    service_type: "residence",
    status: "available",
    description: "5 BR / 3 BA · 12 guests · Design District",
    slug: "design-district-estate",
    cover_image: "/residences/design-district-estate/cover.jpg",
    public_url: "/residences/design-district-estate",
    source_inventory_type: "residence",
    source_slug: "design-district-estate",
    gallery: [],
  },
  {
    name: "Miami Pool Estate",
    service_type: "residence",
    status: "available",
    description: "4 BR / 5 BA · 12 guests · Miami",
    slug: "miami-pool-estate",
    cover_image: "/residences/miami-pool-estate/cover.jpg",
    public_url: "/residences/miami-pool-estate",
    source_inventory_type: "residence",
    source_slug: "miami-pool-estate",
    gallery: [],
  },
  {
    name: "Miami Villa",
    service_type: "residence",
    status: "available",
    description: "6 BR / 4 BA · 16 guests · Miami",
    slug: "miami-villa-6br",
    cover_image: "/residences/miami-villa-6br/cover.jpg",
    public_url: "/residences/miami-villa-6br",
    source_inventory_type: "residence",
    source_slug: "miami-villa-6br",
    gallery: [],
  },
  {
    name: "Design District Villa",
    service_type: "residence",
    status: "available",
    description: "6 BR / 4 BA · 14 guests · Design District",
    slug: "design-district-villa-6br",
    cover_image: "/residences/design-district-villa-6br/cover.jpg",
    public_url: "/residences/design-district-villa-6br",
    source_inventory_type: "residence",
    source_slug: "design-district-villa-6br",
    gallery: [],
  },
  {
    name: "Buena Vista Home",
    service_type: "residence",
    status: "available",
    description: "6 BR / 4 BA · 16 guests · Buena Vista",
    slug: "buena-vista-home",
    cover_image: "/residences/buena-vista-home/cover.jpg",
    public_url: "/residences/buena-vista-home",
    source_inventory_type: "residence",
    source_slug: "buena-vista-home",
    gallery: [],
  },
  {
    name: "Design District Garden Home",
    service_type: "residence",
    status: "available",
    description: "5 BR / 3 BA · 11 guests · Design District",
    slug: "design-district-garden-home",
    cover_image: "/residences/design-district-garden-home/cover.jpg",
    public_url: "/residences/design-district-garden-home",
    source_inventory_type: "residence",
    source_slug: "design-district-garden-home",
    gallery: [],
  },
];

// ─── Sync ─────────────────────────────────────────────────────────────────────

type ExistingAsset = {
  id: string;
  source_slug: string;
  status: string;
  cover_image: string | null;
  gallery: unknown;
};

async function main() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  console.log(`\nPulse Asset Sync — ${ASSETS.length} items from public inventory\n`);

  // Fetch existing assets keyed by source_slug
  const { data: existing, error: fetchErr } = await supabase
    .from("assets")
    .select("id, source_slug, status, cover_image, gallery")
    .not("source_slug", "is", null);

  if (fetchErr) {
    console.error("Failed to fetch existing assets:", fetchErr.message);
    if (fetchErr.message.includes("column") && fetchErr.message.includes("does not exist")) {
      console.error(
        "\nHint: Run the SQL migration first to add the required columns.\n" +
          "See the migration in the project documentation.\n",
      );
    }
    process.exit(1);
  }

  const existingMap = new Map<string, ExistingAsset>(
    (existing ?? []).map((a) => [String(a.source_slug), a as ExistingAsset]),
  );

  const toInsert = ASSETS.filter((a) => !existingMap.has(a.source_slug));
  const toUpdate = ASSETS.filter((a) => existingMap.has(a.source_slug));

  console.log(`  Found:  ${existingMap.size} existing`);
  console.log(`  New:    ${toInsert.length} to insert`);
  console.log(`  Update: ${toUpdate.length} to update (status + images preserved)\n`);

  // Insert new
  if (toInsert.length > 0) {
    const { error } = await supabase.from("assets").insert(toInsert);
    if (error) {
      console.error("Insert failed:", error.message);
      process.exit(1);
    }
    console.log(`  ✓ Inserted ${toInsert.length} new assets`);
  }

  // Update existing — preserve status, cover_image, gallery
  if (toUpdate.length > 0) {
    const results = await Promise.all(
      toUpdate.map((seed) => {
        const ex = existingMap.get(seed.source_slug)!;
        const existingGallery = Array.isArray(ex.gallery) ? (ex.gallery as string[]) : [];
        return supabase
          .from("assets")
          .update({
            name: seed.name,
            service_type: seed.service_type,
            description: seed.description,
            public_url: seed.public_url,
            slug: seed.slug,
            source_inventory_type: seed.source_inventory_type,
            // Preserve cover_image if already set by admin
            cover_image: ex.cover_image ?? seed.cover_image,
            // Preserve gallery if already has items
            gallery: existingGallery.length > 0 ? existingGallery : seed.gallery,
            // status is intentionally NOT updated
          })
          .eq("id", ex.id);
      }),
    );

    const failed = results.filter((r) => r.error);
    if (failed.length > 0) {
      console.error(`  ${failed.length} update(s) failed:`, failed[0]?.error?.message);
      process.exit(1);
    }
    console.log(`  ✓ Updated ${toUpdate.length} existing assets`);
  }

  if (toInsert.length > 0) {
    console.log("\n  New assets:");
    toInsert.forEach((a) => console.log(`    · ${a.name}`));
  }

  console.log("\n  Sync complete.\n");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
