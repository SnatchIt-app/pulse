import { getSupabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import ClientsClient from "./ClientsClient";

export type Client = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  tags: string[];
  notes: string | null;
  booking_count: number;
  last_booking_at: string | null;
  created_at: string;
};

export default async function ClientsPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return (
      <main className="px-8 py-16">
        <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse CRM · Clients</p>
        <h1 className="mt-3 font-display text-4xl text-paper">Clients</h1>
        <p className="text-paper/50 mt-10 text-sm">Supabase env vars not configured.</p>
      </main>
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, full_name, email, phone, tags, notes, booking_count, last_booking_at, created_at")
    .order("booking_count", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen px-6 pb-24 pt-16 md:px-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse CRM</p>
          <h1 className="mt-2 font-display text-4xl text-paper">Clients</h1>
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
        <ClientsClient
          initialClients={(clients ?? []).map((c) => ({
            ...c,
            tags: Array.isArray(c.tags) ? (c.tags as string[]) : [],
          }))}
        />
      )}
    </main>
  );
}
