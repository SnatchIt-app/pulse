import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activity";
import { requireWriteAccess } from "@/lib/auth";

const PAYMENT_STATUSES = ["none", "pending", "deposit_paid", "paid", "refunded"] as const;

const Body = z.object({
  quoted_amount: z.number().nonnegative().nullable().optional(),
  deposit_amount: z.number().nonnegative().nullable().optional(),
  final_amount: z.number().nonnegative().nullable().optional(),
  payment_status: z.enum(PAYMENT_STATUSES).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: booking } = await supabase
    .from("bookings")
    .select("lead_id, asset_title")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("bookings").update(parsed).eq("id", id);
  if (error) {
    console.error("[bookings/revenue] error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  if (booking?.lead_id && parsed.payment_status) {
    await logActivity(
      booking.lead_id,
      "payment_status_changed",
      `Payment status set to ${parsed.payment_status.replace("_", " ")}${
        booking.asset_title ? ` — ${booking.asset_title}` : ""
      }`,
    );
  }

  return NextResponse.json({ ok: true });
}
