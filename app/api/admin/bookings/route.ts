import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activity";

const Body = z.object({
  lead_id: z.string().uuid().optional(),
  service_type: z.string().min(1),
  client_name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  asset_title: z.string().optional(),
  asset_id: z.string().uuid().optional(),
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

  // Conflict detection — only when asset_id + both dates are provided
  if (parsed.asset_id && parsed.start_date && parsed.end_date) {
    const { data: conflicts } = await supabase
      .from("bookings")
      .select("id, client_name, start_date, end_date")
      .eq("asset_id", parsed.asset_id)
      .not("status", "eq", "cancelled")
      .lte("start_date", parsed.end_date)
      .gte("end_date", parsed.start_date);

    if (conflicts && conflicts.length > 0) {
      const c = conflicts[0]!;
      return NextResponse.json(
        {
          ok: false,
          error: "conflict",
          conflict: {
            id: c.id,
            client_name: c.client_name,
            start_date: c.start_date,
            end_date: c.end_date,
          },
        },
        { status: 409 },
      );
    }
  }

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
      asset_id: parsed.asset_id ?? null,
      notes: parsed.notes ?? null,
      status: parsed.status,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[bookings] Insert error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  if (parsed.lead_id) {
    await supabase.from("leads").update({ status: "booked" }).eq("id", parsed.lead_id);
    await logActivity(
      parsed.lead_id,
      "converted_to_booking",
      `Converted to booking${parsed.asset_title ? ` — ${parsed.asset_title}` : ""}`,
    );
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
