import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { cars } from "@/data/inventory/cars";
import { jets } from "@/data/inventory/jets";
import { yachts } from "@/data/inventory/yachts";
import { residences } from "@/data/inventory/residences";

type AssetRow = {
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

function buildSeedRows(): AssetRow[] {
  const rows: AssetRow[] = [];

  for (const car of cars) {
    rows.push({
      name: `${car.make} ${car.model} — ${car.color_label}`,
      service_type: "car",
      status: "available",
      description: car.body_style ? `${car.body_style} · ${car.color_label}` : car.color_label,
      slug: car.slug,
      cover_image: car.images?.[0] ?? null,
      public_url: `/fleet/${car.slug}`,
      source_inventory_type: "car",
      source_slug: car.slug,
      gallery: [],
    });
  }

  for (const jet of jets) {
    rows.push({
      name: jet.name,
      service_type: "jet",
      status: "available",
      description: `${jet.category} · up to ${jet.capacity} passengers`,
      slug: jet.slug,
      cover_image: jet.images?.[0] ?? null,
      public_url: `/jets/${jet.slug}`,
      source_inventory_type: "jet",
      source_slug: jet.slug,
      gallery: [],
    });
  }

  for (const yacht of yachts) {
    const displayName = yacht.model ? `${yacht.make} ${yacht.model}` : (yacht.name ?? yacht.make);
    rows.push({
      name: displayName,
      service_type: "yacht",
      status: "available",
      description: yacht.length_ft ? `Motor yacht · ${yacht.length_ft} ft` : "Motor yacht",
      slug: yacht.slug,
      cover_image: yacht.images?.[0] ?? null,
      public_url: `/yachts/${yacht.slug}`,
      source_inventory_type: "yacht",
      source_slug: yacht.slug,
      gallery: [],
    });
  }

  for (const res of residences) {
    rows.push({
      name: res.title,
      service_type: "residence",
      status: "available",
      description: `${res.bedrooms} BR / ${res.bathrooms} BA · ${res.maxGuests} guests · ${res.neighborhood}`,
      slug: res.slug,
      cover_image: res.images?.[0] ?? null,
      public_url: `/residences/${res.slug}`,
      source_inventory_type: "residence",
      source_slug: res.slug,
      gallery: [],
    });
  }

  return rows;
}

export async function POST() {
  const supabase = getSupabaseAdmin();
  const seedRows = buildSeedRows();

  // Fetch existing assets keyed by source_slug
  const { data: existing, error: fetchErr } = await supabase
    .from("assets")
    .select("id, source_slug, status, cover_image, gallery")
    .not("source_slug", "is", null);

  if (fetchErr) {
    console.error("[assets/sync] Fetch error:", fetchErr.message);
    return NextResponse.json(
      { ok: false, error: fetchErr.message },
      { status: 500 },
    );
  }

  type ExistingRow = {
    id: string;
    source_slug: string;
    status: string;
    cover_image: string | null;
    gallery: unknown;
  };

  const existingMap = new Map<string, ExistingRow>(
    (existing ?? []).map((a) => [String(a.source_slug), a as ExistingRow]),
  );

  const toInsert = seedRows.filter((r) => !existingMap.has(r.source_slug));
  const toUpdate = seedRows.filter((r) => existingMap.has(r.source_slug));

  // Insert new assets
  if (toInsert.length > 0) {
    const { error } = await supabase.from("assets").insert(toInsert);
    if (error) {
      console.error("[assets/sync] Insert error:", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
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
            cover_image: ex.cover_image ?? seed.cover_image,
            gallery: existingGallery.length > 0 ? existingGallery : seed.gallery,
            // status intentionally NOT updated
          })
          .eq("id", ex.id);
      }),
    );

    const failed = results.filter((r) => r.error);
    if (failed.length > 0) {
      const msg = failed[0]?.error?.message ?? "update_failed";
      console.error("[assets/sync] Update error:", msg);
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    inserted: toInsert.length,
    updated: toUpdate.length,
    total: seedRows.length,
  });
}
