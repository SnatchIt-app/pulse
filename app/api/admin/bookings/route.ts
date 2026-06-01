import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activity";
import { requireWriteAccess } from "@/lib/auth";
import { normalizeDate, isValidYMD, isFutureDate, isAfter } from "@/lib/dates";

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
  quoted_amount: z.number().nonnegative().optional(),
  deposit_amount: z.number().nonnegative().optional(),
  final_amount: z.number().nonnegative().optional(),
  payment_status: z.enum(["none", "pending", "deposit_paid", "paid", "refunded"]).default("none"),
});

export async function POST(req: Request) {
  const denied = await requireWriteAccess();
  if (denied) return denied;

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    console.error("[bookings] Validation error:", err);
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Normalize blank dates to null so the date columns never receive "".
  const startDate = normalizeDate(parsed.start_date);
  const endDate = normalizeDate(parsed.end_date);

  // Validate dates: same-day/past start is rejected; end must follow start.
  if (startDate !== null) {
    if (!isValidYMD(startDate)) {
      return NextResponse.json(
        { ok: false, error: "invalid_date", message: "Please enter a valid start date." },
        { status: 400 },
      );
    }
    if (!isFutureDate(startDate)) {
      return NextResponse.json(
        {
          ok: false,
          error: "invalid_date",
          message:
            "Start date must be at least tomorrow — same-day and past dates are not allowed.",
        },
        { status: 400 },
      );
    }
  }
  if (endDate !== null) {
    if (!isValidYMD(endDate)) {
      return NextResponse.json(
        { ok: false, error: "invalid_date", message: "Please enter a valid end date." },
        { status: 400 },
      );
    }
    if (startDate && !isAfter(endDate, startDate)) {
      return NextResponse.json(
        { ok: false, error: "invalid_date", message: "End date must be after the start date." },
        { status: 400 },
      );
    }
  }

  // Conflict detection — only when asset_id + both dates are provided
  if (parsed.asset_id && startDate && endDate) {
    const { data: conflicts } = await supabase
      .from("bookings")
      .select("id, client_name, start_date, end_date")
      .eq("asset_id", parsed.asset_id)
      .not("status", "eq", "cancelled")
      .lte("start_date", endDate)
      .gte("end_date", startDate);

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

  // Find or create client by email
  let clientId: string | null = null;
  let clientCreated = false;
  try {
    const { data: existing } = await supabase
      .from("clients")
      .select("id, booking_count")
      .eq("email", parsed.email)
      .maybeSingle();

    if (existing) {
      clientId = existing.id;
      await supabase
        .from("clients")
        .update({
          booking_count: (existing.booking_count ?? 0) + 1,
          last_booking_at: new Date().toISOString(),
        })
        .eq("id", clientId);
    } else {
      const { data: newClient } = await supabase
        .from("clients")
        .insert({
          full_name: parsed.client_name,
          email: parsed.email,
          phone: parsed.phone ?? null,
          booking_count: 1,
          last_booking_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (newClient) {
        clientId = newClient.id;
        clientCreated = true;
      }
    }
  } catch {
    // Client table may not exist yet — booking proceeds without client_id
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      lead_id: parsed.lead_id ?? null,
      client_id: clientId,
      service_type: parsed.service_type,
      client_name: parsed.client_name,
      phone: parsed.phone ?? null,
      email: parsed.email,
      start_date: startDate,
      end_date: endDate,
      asset_title: parsed.asset_title ?? null,
      asset_id: parsed.asset_id ?? null,
      notes: parsed.notes ?? null,
      status: parsed.status,
      quoted_amount: parsed.quoted_amount ?? null,
      deposit_amount: parsed.deposit_amount ?? null,
      final_amount: parsed.final_amount ?? null,
      payment_status: parsed.payment_status,
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
    if (clientCreated) {
      await logActivity(
        parsed.lead_id,
        "client_created",
        `Client profile created — ${parsed.client_name}`,
      );
    }
  }

  return NextResponse.json({ ok: true, id: data.id, client_id: clientId }, { status: 201 });
}
