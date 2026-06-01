import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activity";
import { requireWriteAccess } from "@/lib/auth";

const VENDOR_STATUSES = ["not_needed", "pending", "confirmed", "cancelled"] as const;

const Body = z.object({
  vendor_id: z.string().uuid().nullable().optional(),
  vendor_status: z.enum(VENDOR_STATUSES).optional(),
  vendor_notes: z.string().max(4000).nullable().optional(),
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
    .select("lead_id, vendor_id, asset_title")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("bookings").update(parsed).eq("id", id);
  if (error) {
    console.error("[bookings/vendor] error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  // Activity logging — keyed off the linked lead when present.
  if (booking?.lead_id) {
    const suffix = booking.asset_title ? ` — ${booking.asset_title}` : "";

    if ("vendor_id" in parsed && parsed.vendor_id && parsed.vendor_id !== booking.vendor_id) {
      const { data: vendor } = await supabase
        .from("vendors")
        .select("name")
        .eq("id", parsed.vendor_id)
        .single();
      await logActivity(
        booking.lead_id,
        "vendor_assigned",
        `Vendor assigned${vendor?.name ? `: ${vendor.name}` : ""}${suffix}`,
      );
    }

    if (parsed.vendor_status) {
      await logActivity(
        booking.lead_id,
        "vendor_status_changed",
        `Vendor status set to ${parsed.vendor_status.replace("_", " ")}${suffix}`,
      );
    }

    if ("vendor_notes" in parsed && !("vendor_status" in parsed) && !("vendor_id" in parsed)) {
      await logActivity(booking.lead_id, "vendor_notes_updated", `Vendor notes updated${suffix}`);
    }
  }

  return NextResponse.json({ ok: true });
}
