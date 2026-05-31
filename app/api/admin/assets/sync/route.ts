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

function buildRows(): AssetRow[] {
  const rows: AssetRow[] = [];

  for (const car of cars) {
    rows.push({
      name: `${car.make} ${car.model} — ${car.color_label}`,
      service_type: "car",
      status: "available",
      description: car.body_style
        ? `${car.body_style} · ${car.exterior_color} exterior / ${car.interior_color ?? "—"} interior`
        : null,
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
  const rows = buildRows();

  // Fetch existing statuses to preserve manual edits
  const { data: existing } = await supabase
    .from("assets")
    .select("source_slug, status")
    .not("source_slug", "is", null);

  const existingStatus = new Map<string, string>(
    (existing ?? []).map((a) => [String(a.source_slug), String(a.status)]),
  );

  const existingSlugs = new Set(existingStatus.keys());
  const inserted = rows.filter((r) => !existingSlugs.has(r.source_slug)).length;
  const updated = rows.filter((r) => existingSlugs.has(r.source_slug)).length;

  const finalRows = rows.map((r) => ({
    ...r,
    status: (existingStatus.get(r.source_slug) as "available") ?? r.status,
  }));

  const { error } = await supabase.from("assets").upsert(finalRows, { onConflict: "source_slug" });

  if (error) {
    console.error("[assets/sync] Upsert error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, inserted, updated, total: rows.length });
}
