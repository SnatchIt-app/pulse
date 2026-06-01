import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const CreateBody = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional(),
  tags: z.array(z.string().max(50)).optional(),
  notes: z.string().max(4000).optional(),
});

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("clients")
    .select("id, full_name, email, phone, tags, notes, booking_count, last_booking_at, created_at")
    .order("booking_count", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[clients] GET error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, clients: data });
}

export async function POST(req: Request) {
  let parsed: z.infer<typeof CreateBody>;
  try {
    parsed = CreateBody.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("clients")
    .insert({
      full_name: parsed.full_name,
      email: parsed.email ?? null,
      phone: parsed.phone ?? null,
      tags: parsed.tags ?? [],
      notes: parsed.notes ?? null,
      booking_count: 0,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505")
      return NextResponse.json({ ok: false, error: "email_taken" }, { status: 409 });
    console.error("[clients] POST error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
