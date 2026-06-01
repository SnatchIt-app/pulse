import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const CATEGORIES = [
  "jet_broker",
  "yacht_operator",
  "residence_partner",
  "chauffeur",
  "restaurant",
  "nightlife",
  "concierge",
  "photographer",
  "security",
  "other",
] as const;

const STATUSES = ["active", "inactive", "preferred"] as const;

const CreateBody = z.object({
  name: z.string().min(1).max(200),
  category: z.enum(CATEGORIES),
  contact_name: z.string().max(200).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(50).optional(),
  notes: z.string().max(4000).optional(),
  reliability_score: z.number().int().min(1).max(5).nullable().optional(),
  status: z.enum(STATUSES).default("active"),
});

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("vendors")
    .select(
      "id, name, category, contact_name, email, phone, notes, reliability_score, status, created_at",
    )
    .order("status", { ascending: true })
    .order("name");

  if (error) {
    console.error("[vendors] GET error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, vendors: data });
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
    .from("vendors")
    .insert({
      name: parsed.name,
      category: parsed.category,
      contact_name: parsed.contact_name || null,
      email: parsed.email || null,
      phone: parsed.phone || null,
      notes: parsed.notes || null,
      reliability_score: parsed.reliability_score ?? null,
      status: parsed.status,
    })
    .select(
      "id, name, category, contact_name, email, phone, notes, reliability_score, status, created_at",
    )
    .single();

  if (error) {
    console.error("[vendors] POST error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, vendor: data }, { status: 201 });
}
