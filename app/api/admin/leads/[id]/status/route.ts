import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// Full enum — includes legacy values (qualified, completed, lost) for backward compat
const VALID_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "quoted",
  "booked",
  "completed",
  "lost",
  "closed",
  "archived",
] as const;

const Body = z.object({ status: z.enum(VALID_STATUSES) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("leads").update({ status: parsed.status }).eq("id", id);

  if (error) {
    console.error("[leads/status] Update error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
