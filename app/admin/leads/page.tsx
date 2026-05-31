import { getSupabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import LeadsClient from "./LeadsClient";

export default async function LeadsPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return (
      <main className="px-8 py-16">
        <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse CRM · Leads</p>
        <h1 className="mt-3 font-display text-4xl text-paper">Leads</h1>
        <p className="text-paper/50 mt-10 text-sm">
          Supabase env vars not configured.{" "}
          <span className="text-paper/30">
            Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
          </span>
        </p>
      </main>
    );
  }

  const supabase = getSupabaseAdmin();
  const [{ data: leads, error }, { data: assets }] = await Promise.all([
    supabase
      .from("leads")
      .select(
        "id, full_name, phone, email, service_type, message, admin_notes, assigned_to, start_date, created_at, status",
      )
      .order("created_at", { ascending: false }),
    supabase.from("assets").select("id, name, service_type, status").order("name"),
  ]);

  return (
    <main className="min-h-screen px-6 pb-24 pt-16 md:px-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse CRM</p>
          <h1 className="mt-2 font-display text-4xl text-paper">Leads</h1>
        </div>
        <Link
          href="/admin"
          className="text-paper/35 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          ← Admin
        </Link>
      </div>

      {error && <p className="mt-8 text-sm text-red-400">Database error: {error.message}</p>}

      {!error && <LeadsClient initialLeads={leads ?? []} assets={assets ?? []} />}
    </main>
  );
}
