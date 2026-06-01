"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { AdminRole } from "@/lib/auth";

const ROLE_LABELS: Record<AdminRole, string> = {
  owner: "Owner",
  admin: "Admin",
  agent: "Agent",
  viewer: "Viewer",
};

export default function AdminHeader({ email, role }: { email: string; role: AdminRole }) {
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await getSupabaseBrowser().auth.signOut();
    } catch {
      // Even if the network sign-out fails, route away so the user is not stranded.
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  const canManage = role === "owner" || role === "admin";

  return (
    <header className="border-paper/10 flex items-center justify-between border-b px-6 py-3 md:px-12">
      <Link
        href="/admin"
        className="text-paper/70 text-[11px] uppercase tracking-[0.24em] transition-colors hover:text-paper"
      >
        Pulse · Admin
      </Link>

      <div className="flex items-center gap-5">
        {canManage && (
          <Link
            href="/admin/settings/users"
            className="text-paper/35 text-[9px] uppercase tracking-[0.2em] transition-colors hover:text-paper"
          >
            Users
          </Link>
        )}
        <span className="text-paper/35 hidden text-[9px] uppercase tracking-[0.18em] sm:inline">
          {email}
        </span>
        <span
          className={`border px-2 py-0.5 text-[8px] uppercase tracking-[0.18em] ${
            role === "viewer"
              ? "border-amber-400/40 text-amber-400"
              : "border-paper/20 text-paper/50"
          }`}
        >
          {role === "viewer" ? "Viewer · Read-only" : ROLE_LABELS[role]}
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="text-paper/35 text-[9px] uppercase tracking-[0.2em] transition-colors hover:text-paper disabled:opacity-40"
        >
          {signingOut ? "…" : "Sign Out"}
        </button>
      </div>
    </header>
  );
}
