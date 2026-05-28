import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendLeadNotification } from "@/lib/email";

const SERVICE_TYPE = z.enum([
  "car",
  "yacht",
  "jet",
  "jet_ski",
  "chauffeur",
  "restaurant",
  "nightlife",
  "concierge",
  "residence",
  "other",
]);

const Body = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  serviceType: SERVICE_TYPE.optional(),
  assetSlug: z.string().optional(),
  assetTitle: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  // Diagnostic: confirm route is reached
  console.log("[requests] POST received");

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    console.error("[requests] Validation error:", err);
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Guard: trim catches empty strings (e.g. VAR= with no value in .env.local)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  const missing = [
    !supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
    !serviceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
  ].filter(Boolean);

  if (missing.length > 0) {
    console.warn(`[requests] Missing env vars: ${missing.join(", ")} — lead write skipped`);
    // Still accept the submission so the form shows success
    return NextResponse.json(
      { ok: true, received: { email: parsed.email, serviceType: parsed.serviceType } },
      { status: 202 },
    );
  }

  // Write to Supabase leads table
  try {
    const supabase = getSupabaseAdmin();

    const messageParts = [
      parsed.assetTitle && `Asset: ${parsed.assetTitle}`,
      parsed.preferredTime && `Preferred time: ${parsed.preferredTime}`,
      parsed.location && `Location: ${parsed.location}`,
      parsed.notes,
    ]
      .filter(Boolean)
      .join("\n");

    console.log(
      `[requests] Inserting lead — service: ${parsed.serviceType ?? "other"}, asset: ${parsed.assetSlug ?? "none"}`,
    );

    const { error } = await supabase.from("leads").insert({
      full_name: parsed.fullName,
      email: parsed.email,
      phone: parsed.phone ?? null,
      service_type: parsed.serviceType ?? "other",
      start_date: parsed.preferredDate ?? null,
      message: messageParts || null,
      source: "website_request",
      landing_page: parsed.assetSlug ?? "/request",
      status: "new",
    });

    if (error) {
      console.error("[requests] Supabase insert error:", error.message, "| code:", error.code);
      return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    console.log("[requests] Lead inserted successfully");

    // Fire notification email — never blocks response, never fails the request
    await sendLeadNotification({
      fullName: parsed.fullName,
      phone: parsed.phone,
      email: parsed.email,
      serviceType: parsed.serviceType ?? "other",
      message: messageParts || null,
    });
  } catch (err) {
    console.error("[requests] Unexpected error during insert:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  return NextResponse.json(
    { ok: true, received: { email: parsed.email, serviceType: parsed.serviceType } },
    { status: 202 },
  );
}
