import { getSupabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import BookingsClient from "./BookingsClient";

export default async function BookingsPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return (
      <main className="px-8 py-16">
        <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">
          Pulse CRM · Bookings
        </p>
        <h1 className="mt-3 font-display text-4xl text-paper">Bookings</h1>
        <p className="text-paper/50 mt-10 text-sm">Supabase env vars not configured.</p>
      </main>
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "id, lead_id, service_type, client_name, phone, email, start_date, end_date, asset_title, notes, status, created_at",
    )
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen px-6 pb-24 pt-16 md:px-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse CRM</p>
          <h1 className="mt-2 font-display text-4xl text-paper">Bookings</h1>
        </div>
        <Link
          href="/admin"
          className="text-paper/35 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          ← Admin
        </Link>
      </div>

      {error && <p className="mt-8 text-sm text-red-400">Database error: {error.message}</p>}

      {!error && <BookingsClient initialBookings={bookings ?? []} />}
    </main>
  );
}
