import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getAdminUser, canManageUsers } from "@/lib/auth";

const ROLES = ["owner", "admin", "agent", "viewer"] as const;

const PatchBody = z.object({
  role: z.enum(ROLES).optional(),
  is_active: z.boolean().optional(),
  full_name: z.string().max(200).nullable().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  const me = await getAdminUser();
  if (!me || !me.is_active || !canManageUsers(me.role)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  let parsed: z.infer<typeof PatchBody>;
  try {
    parsed = PatchBody.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Only an owner may grant or revoke the owner role.
  if (parsed.role === "owner" && me.role !== "owner") {
    return NextResponse.json({ ok: false, error: "forbidden_owner" }, { status: 403 });
  }
  // Guard against locking yourself out.
  if (id === me.id && parsed.is_active === false) {
    return NextResponse.json({ ok: false, error: "cannot_deactivate_self" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { error } = await admin.from("users").update(parsed).eq("id", id);
  if (error) {
    console.error("[users/patch] error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  // Keep auth metadata role in sync (used by the signup trigger / future reads).
  if (parsed.role) {
    await admin.auth.admin.updateUserById(id, { user_metadata: { role: parsed.role } });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  const me = await getAdminUser();
  if (!me || !me.is_active || !canManageUsers(me.role)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  if (id === me.id) {
    return NextResponse.json({ ok: false, error: "cannot_delete_self" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  // Remove the profile first, then the auth user.
  await admin.from("users").delete().eq("id", id);
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) {
    console.error("[users/delete] error:", error.message);
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
