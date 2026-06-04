import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireWriteAccess } from "@/lib/auth";

const CATEGORIES = [
  "jet_broker",
  "yacht_operator",
  "residence_partner",
  "car_partner",
  "exotic_car_vendor",
  "fleet_partner",
  "chauffeur",
  "restaurant",
  "nightlife",
  "concierge",
  "photographer",
  "security",
  "other",
] as const;

const STATUSES = ["active", "inactive", "preferred"] as const;

const PatchBody = z.object({
  name: z.string().min(1).max(200).optional(),
  category: z.enum(CATEGORIES).optional(),
  contact_name: z.string().max(200).nullable().optional(),
  email: z.string().email().nullable().optional().or(z.literal("")),
  phone: z.string().max(50).nullable().optional(),
  notes: z.string().max(4000).nullable().optional(),
  reliability_score: z.number().int().min(1).max(5).nullable().optional(),
  status: z.enum(STATUSES).optional(),
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
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Normalize empty email string to null
  const patch = { ...parsed };
  if (patch.email === "") patch.email = null;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("vendors").update(patch).eq("id", id);
  if (error) {
    console.error("[vendors/patch] error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("vendors").delete().eq("id", id);
  if (error) {
    console.error("[vendors/delete] error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
