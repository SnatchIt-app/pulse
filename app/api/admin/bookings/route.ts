import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const Body = z.object({
  lead_id: z.string().uuid().optional(),
  service_type: z.string().min(1),
  client_name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  asset_title: z.string().optional(),
  notes: z.string().max(4000).optional(),
  status: z
    .enum(["pending", "confirmed", "in_progress", "completed", "cancelled"])
    .default("pending"),
});

export async function POST(req: Request) {
  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    console.error("[bookings] Validation error:", err);
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      lead_id: parsed.lead_id ?? null,
      service_type: parsed.service_type,
      client_name: parsed.client_name,
      phone: parsed.phone ?? null,
      email: parsed.email,
      start_date: parsed.start_date ?? null,
      end_date: parsed.end_date ?? null,
      asset_title: parsed.asset_title ?? null,
      notes: parsed.notes ?? null,
      status: parsed.status,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[bookings] Insert error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  // If a lead_id was provided, mark the lead as booked
  if (parsed.lead_id) {
    await supabase.from("leads").update({ status: "booked" }).eq("id", parsed.lead_id);
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
