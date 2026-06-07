import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireWriteAccess } from "@/lib/auth";

const ASSET_STATUSES = ["available", "reserved", "maintenance", "inactive"] as const;

const PatchBody = z.object({
  name: z.string().min(1).max(200).optional(),
  service_type: z.string().min(1).optional(),
  status: z.enum(ASSET_STATUSES).optional(),
  description: z.string().max(2000).nullable().optional(),
  cover_image: z.string().max(500).nullable().optional(),
  gallery: z.array(z.string()).optional(),
  public_url: z.string().max(500).nullable().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  let parsed: z.infer<typeof PatchBody>;
  try {
    parsed = PatchBody.parse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_payload", message: "Some fields are invalid. Please review." },
      { status: 400 },
    );
  }

  // Normalize: empty strings → null; gallery always a clean string array when present.
  const clean = (v: string | undefined | null) => {
    if (v === undefined) return undefined;
    const t = (v ?? "").trim();
    return t.length > 0 ? t : null;
  };
  const patch: Record<string, unknown> = {};
  if (parsed.name !== undefined) patch.name = parsed.name.trim();
  if (parsed.service_type !== undefined) patch.service_type = parsed.service_type.trim();
  if (parsed.status !== undefined) patch.status = parsed.status;
  if (parsed.description !== undefined) patch.description = clean(parsed.description);
  if (parsed.cover_image !== undefined) patch.cover_image = clean(parsed.cover_image);
  if (parsed.public_url !== undefined) patch.public_url = clean(parsed.public_url);
  if (parsed.gallery !== undefined) {
    patch.gallery = Array.isArray(parsed.gallery)
      ? parsed.gallery.filter((s) => !!s && s.trim())
      : [];
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("assets").update(patch).eq("id", id);

  if (error) {
    console.error("[assets/patch] update error", {
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
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("assets").delete().eq("id", id);

  if (error) {
    console.error("[assets/delete] Delete error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
