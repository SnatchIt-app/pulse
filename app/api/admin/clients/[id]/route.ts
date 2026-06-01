import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const PatchBody = z.object({
  full_name: z.string().min(1).max(200).optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  tags: z.array(z.string().max(50)).optional(),
  notes: z.string().max(4000).nullable().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  let parsed: z.infer<typeof PatchBody>;
  try {
    parsed = PatchBody.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("clients").update(parsed).eq("id", id);
  if (error) {
    console.error("[clients/patch] error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) {
    console.error("[clients/delete] error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
