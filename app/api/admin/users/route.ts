import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getAdminUser, canManageUsers } from "@/lib/auth";

const ROLES = ["owner", "admin", "agent", "viewer"] as const;

const CreateBody = z.object({
  email: z.string().email(),
  full_name: z.string().max(200).optional(),
  role: z.enum(ROLES).default("viewer"),
});

export async function GET() {
  const me = await getAdminUser();
  if (!me || !me.is_active || !canManageUsers(me.role)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("users")
    .select("id, email, full_name, role, is_active, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[users] GET error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, users: data });
}

export async function POST(req: Request) {
  const me = await getAdminUser();
  if (!me || !me.is_active || !canManageUsers(me.role)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  let parsed: z.infer<typeof CreateBody>;
  try {
    parsed = CreateBody.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Only an owner may create another owner.
  if (parsed.role === "owner" && me.role !== "owner") {
    return NextResponse.json({ ok: false, error: "forbidden_owner" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();
  // Temporary password the inviting admin relays to the new user; they reset it
  // on first sign-in. Avoids requiring SMTP for invite emails.
  const tempPassword = `Pulse-${crypto.randomUUID()}`;

  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: parsed.full_name ?? null, role: parsed.role },
  });

  if (error || !data.user) {
    console.error("[users] createUser error:", error?.message);
    const taken = error?.message?.toLowerCase().includes("already");
    return NextResponse.json(
      { ok: false, error: taken ? "email_taken" : "create_failed" },
      { status: taken ? 409 : 500 },
    );
  }

  // Ensure the profile reflects the chosen role (defensive — a trigger also seeds it).
  await admin.from("users").upsert({
    id: data.user.id,
    email: parsed.email,
    full_name: parsed.full_name ?? null,
    role: parsed.role,
    is_active: true,
  });

  return NextResponse.json({ ok: true, id: data.user.id, tempPassword }, { status: 201 });
}
