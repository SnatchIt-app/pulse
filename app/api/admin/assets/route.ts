import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const ASSET_STATUSES = ["available", "reserved", "maintenance", "inactive"] as const;

const CreateBody = z.object({
  name: z.string().min(1).max(200),
  service_type: z.string().min(1),
  status: z.enum(ASSET_STATUSES).default("available"),
  description: z.string().max(2000).optional(),
  slug: z.string().max(200).optional(),
  cover_image: z.string().max(500).optional(),
  gallery: z.array(z.string()).optional(),
  public_url: z.string().max(500).optional(),
  source_inventory_type: z.string().optional(),
  source_slug: z.string().max(200).optional(),
});

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("assets")
    .select(
      "id, name, service_type, status, description, slug, cover_image, gallery, public_url, source_inventory_type, source_slug, created_at",
    )
    .order("source_inventory_type", { nullsFirst: false })
    .order("name");

  if (error) {
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, assets: data });
}

export async function POST(req: Request) {
  let parsed: z.infer<typeof CreateBody>;
  try {
    parsed = CreateBody.parse(await req.json());
  } catch (err) {
    console.error("[assets] Validation error:", err);
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("assets")
    .insert({
      name: parsed.name,
      service_type: parsed.service_type,
      status: parsed.status,
      description: parsed.description ?? null,
      slug: parsed.slug ?? null,
      cover_image: parsed.cover_image ?? null,
      gallery: parsed.gallery ?? [],
      public_url: parsed.public_url ?? null,
      source_inventory_type: parsed.source_inventory_type ?? null,
      source_slug: parsed.source_slug ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[assets] Insert error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
