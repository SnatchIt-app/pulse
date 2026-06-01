import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activity";
import { createTask } from "@/lib/tasks";
import { requireWriteAccess } from "@/lib/auth";

const VALID_STATUSES = ["pending", "confirmed", "in_progress", "completed", "cancelled"] as const;

const Body = z.object({ status: z.enum(VALID_STATUSES) });

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

  // Fetch booking for activity logging + follow-up automation
  const { data: booking } = await supabase
    .from("bookings")
    .select("lead_id, asset_title, client_name, status")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("bookings").update({ status: parsed.status }).eq("id", id);

  if (error) {
    console.error("[bookings/status] Update error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  if (booking?.lead_id) {
    await logActivity(
      booking.lead_id,
      "booking_status_changed",
      `Booking status changed to ${parsed.status}${booking.asset_title ? ` — ${booking.asset_title}` : ""}`,
    );
  }

  // Follow-up automation: on completion (transition into "completed"), create a
  // review/referral task due 7 days later.
  if (parsed.status === "completed" && booking?.status !== "completed") {
    const due = new Date();
    due.setDate(due.getDate() + 7);
    const who = booking?.client_name ? ` — ${booking.client_name}` : "";
    await createTask({
      title: `Follow up for review & referral${who}`,
      description: booking?.asset_title
        ? `Post-trip follow-up for ${booking.asset_title}.`
        : "Post-trip follow-up: request a review and referral.",
      due_at: due.toISOString(),
      entity_type: "booking",
      entity_id: id,
    });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
