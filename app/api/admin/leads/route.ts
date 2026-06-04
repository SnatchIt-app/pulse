import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireWriteAccess } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { normalizeDateOrNull, validateDateRange } from "@/lib/dates";

const SERVICE_TYPES = [
  "car",
  "yacht",
  "jet",
  "jet_ski",
  "chauffeur",
  "restaurant",
  "nightlife",
  "concierge",
  "residence",
  "experience",
  "other",
] as const;

const SOURCES = [
  "manual",
  "phone",
  "whatsapp",
  "instagram",
  "referral",
  "website",
  "other",
] as const;

const LEAD_STATUSES = [
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

// "experience" is a frontend-only label — stored as "concierge" in the DB.
const DB_SERVICE_MAP: Partial<Record<string, string>> = { experience: "concierge" };

const Body = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
  service_type: z.enum(SERVICE_TYPES).default("other"),
  start_date: z.string().optional(),
  notes: z.string().max(4000).optional(),
  source: z.enum(SOURCES).default("manual"),
  assigned_to: z.string().max(200).optional(),
  status: z.enum(LEAD_STATUSES).default("new"),
});

export async function POST(req: Request) {
  const denied = await requireWriteAccess();
  if (denied) return denied;

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Normalize + validate the start date (manual leads may be future requests).
  const startDate = normalizeDateOrNull(parsed.start_date);
  if (startDate !== null) {
    const dateError = validateDateRange(startDate, null);
    if (dateError) {
      return NextResponse.json(
        { ok: false, error: "invalid_date", message: dateError },
        { status: 400 },
      );
    }
  }

  const supabase = getSupabaseAdmin();
  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      full_name: parsed.full_name,
      email: parsed.email,
      phone: parsed.phone || null,
      service_type: DB_SERVICE_MAP[parsed.service_type] ?? parsed.service_type,
      start_date: startDate,
      message: parsed.notes?.trim() || null,
      source: parsed.source,
      assigned_to: parsed.assigned_to?.trim() || null,
      landing_page: "/admin/leads",
      status: parsed.status,
    })
    .select(
      "id, full_name, phone, email, service_type, message, admin_notes, assigned_to, start_date, created_at, status",
    )
    .single();

  if (error) {
    console.error("[admin/leads] Insert error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  if (lead?.id) {
    await logActivity(lead.id, "lead_created", `Lead added manually (${parsed.source})`);
  }

  return NextResponse.json({ ok: true, lead }, { status: 201 });
}
