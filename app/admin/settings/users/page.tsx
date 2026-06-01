import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getAdminUser, canManageUsers } from "@/lib/auth";
import UsersClient from "./UsersClient";

export type AdminUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
};

export default async function UsersPage() {
  const me = await getAdminUser();
  if (!me || !canManageUsers(me.role)) redirect("/admin");

  const admin = getSupabaseAdmin();
  const { data: users, error } = await admin
    .from("users")
    .select("id, email, full_name, role, is_active, created_at")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen px-6 pb-24 pt-16 md:px-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">
            Pulse CRM · Settings
          </p>
          <h1 className="mt-2 font-display text-4xl text-paper">Team & Access</h1>
        </div>
        <Link
          href="/admin"
          className="text-paper/35 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          ← Admin
        </Link>
      </div>

      {error && <p className="mt-8 text-sm text-red-400">Database error: {error.message}</p>}
      {!error && (
        <UsersClient
          initialUsers={(users ?? []) as AdminUserRow[]}
          currentUserId={me.id}
          currentRole={me.role}
        />
      )}
    </main>
  );
}
