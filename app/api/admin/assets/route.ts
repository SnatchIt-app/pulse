import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireWriteAccess } from "@/lib/auth";

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
  const denied = await requireWriteAccess();
  if (denied) return denied;

  let parsed: z.infer<typeof CreateBody>;
  try {
    parsed = CreateBody.parse(await req.json());
  } catch (err) {
    console.error("[assets] Validation error:", err);
    return NextResponse.json(
      { ok: false, error: "invalid_payload", message: "Some fields are invalid. Please review." },
      { status: 400 },
    );
  }

  // Build a clean insert row — never undefined; empty strings → null; gallery always an array.
  const clean = (v: string | undefined | null) => {
    const t = (v ?? "").trim();
    return t.length > 0 ? t : null;
  };
  const row = {
    name: parsed.name.trim(),
    service_type: parsed.service_type.trim(),
    status: parsed.status,
    description: clean(parsed.description),
    slug: clean(parsed.slug),
    cover_image: clean(parsed.cover_image),
    gallery: Array.isArray(parsed.gallery) ? parsed.gallery.filter((s) => !!s && s.trim()) : [],
    public_url: clean(parsed.public_url),
    source_inventory_type: clean(parsed.source_inventory_type),
    source_slug: clean(parsed.source_slug),
  };

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("assets").insert(row).select("id").single();

  if (error) {
    console.error("[assets] insert error", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json(
      { ok: false, error: "db_error", message: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
