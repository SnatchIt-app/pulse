import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type AdminRole = "owner" | "admin" | "agent" | "viewer";

export type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
  is_active: boolean;
};

const ROLES: AdminRole[] = ["owner", "admin", "agent", "viewer"];

function coerceRole(value: unknown): AdminRole {
  return ROLES.includes(value as AdminRole) ? (value as AdminRole) : "viewer";
}

/**
 * Returns the signed-in admin user with their CRM role, or null when there is
 * no valid Supabase session. The profile lookup uses the service-role client so
 * it is reliable regardless of RLS.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const sb = await getSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("users")
    .select("id, email, full_name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!data) {
    // Profile row not provisioned yet — treat as inactive viewer.
    return {
      id: user.id,
      email: user.email ?? "",
      full_name: null,
      role: "viewer",
      is_active: false,
    };
  }

  return {
    id: data.id as string,
    email: (data.email as string) ?? user.email ?? "",
    full_name: (data.full_name as string | null) ?? null,
    role: coerceRole(data.role),
    is_active: Boolean(data.is_active),
  };
}

export function canManageUsers(role: AdminRole): boolean {
  return role === "owner" || role === "admin";
}

export function canWrite(role: AdminRole): boolean {
  return role !== "viewer";
}

/**
 * In-handler authorization guard for admin mutation routes. Defense-in-depth so
 * authorization never rests solely on middleware. Returns a NextResponse to
 * return early when denied, or null when the caller may proceed.
 *
 * opts.manageUsers — require owner/admin (team management surface).
 */
export async function requireWriteAccess(opts?: {
  manageUsers?: boolean;
}): Promise<NextResponse | null> {
  const user = await getAdminUser();
  if (!user || !user.is_active) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (opts?.manageUsers) {
    if (!canManageUsers(user.role)) {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }
    return null;
  }
  if (!canWrite(user.role)) {
    return NextResponse.json({ ok: false, error: "read_only" }, { status: 403 });
  }
  return null;
}
