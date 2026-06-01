import { getSupabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import VendorsClient from "./VendorsClient";

export type Vendor = {
  id: string;
  name: string;
  category: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  reliability_score: number | null;
  status: string;
  created_at: string;
};

export default async function VendorsPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return (
      <main className="px-8 py-16">
        <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse CRM · Vendors</p>
        <h1 className="mt-3 font-display text-4xl text-paper">Vendors</h1>
        <p className="text-paper/50 mt-10 text-sm">Supabase env vars not configured.</p>
      </main>
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: vendors, error } = await supabase
    .from("vendors")
    .select(
      "id, name, category, contact_name, email, phone, notes, reliability_score, status, created_at",
    )
    .order("status", { ascending: true })
    .order("name");

  return (
    <main className="min-h-screen px-6 pb-24 pt-16 md:px-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse CRM</p>
          <h1 className="mt-2 font-display text-4xl text-paper">Vendors</h1>
        </div>
        <Link
          href="/admin"
          className="text-paper/35 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          ← Admin
        </Link>
      </div>

      {error && <p className="mt-8 text-sm text-red-400">Database error: {error.message}</p>}
      {!error && <VendorsClient initialVendors={vendors ?? []} />}
    </main>
  );
}
