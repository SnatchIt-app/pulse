import { getSupabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import CalendarClient from "./CalendarClient";

export type CalendarBooking = {
  id: string;
  client_name: string;
  email: string;
  phone: string | null;
  service_type: string;
  asset_title: string | null;
  asset_id: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  notes: string | null;
};

export default async function CalendarPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return (
      <main className="px-8 py-16">
        <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">
          Pulse CRM · Calendar
        </p>
        <h1 className="mt-3 font-display text-4xl text-paper">Calendar</h1>
        <p className="text-paper/50 mt-10 text-sm">Supabase env vars not configured.</p>
      </main>
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "id, client_name, email, phone, service_type, asset_title, asset_id, start_date, end_date, status, notes",
    )
    .not("start_date", "is", null)
    .order("start_date", { ascending: true });

  return (
    <main className="min-h-screen px-6 pb-24 pt-16 md:px-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse CRM</p>
          <h1 className="mt-2 font-display text-4xl text-paper">Calendar</h1>
        </div>
        <Link
          href="/admin"
          className="text-paper/35 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          ← Admin
        </Link>
      </div>

      {error && <p className="mt-8 text-sm text-red-400">Database error: {error.message}</p>}
      {!error && <CalendarClient initialBookings={bookings ?? []} />}
    </main>
  );
}
