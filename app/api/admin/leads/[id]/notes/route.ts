import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activity";

const Body = z.object({
  admin_notes: z.string().max(4000).optional(),
  assigned_to: z.string().max(200).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Fetch current notes to detect if content actually changed
  const { data: current } = await supabase
    .from("leads")
    .select("admin_notes")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("leads")
    .update({ admin_notes: parsed.admin_notes, assigned_to: parsed.assigned_to })
    .eq("id", id);

  if (error) {
    console.error("[leads/notes] Update error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  if (
    parsed.admin_notes !== undefined &&
    parsed.admin_notes !== (current?.admin_notes ?? "")
  ) {
    await logActivity(id, "note_updated", "Admin note updated");
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
