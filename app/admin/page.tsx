import { getSupabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";

async function getStats() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return null;
  }
  const supabase = getSupabaseAdmin();
  const [leadsRes, bookingsRes] = await Promise.all([
    supabase.from("leads").select("status"),
    supabase.from("bookings").select("status"),
  ]);
  return {
    leads: leadsRes.data ?? [],
    bookings: bookingsRes.data ?? [],
  };
}

export default async function AdminPage() {
  const stats = await getStats();

  const newLeads = stats?.leads.filter((l) => l.status === "new").length ?? 0;
  const quotedLeads = stats?.leads.filter((l) => l.status === "quoted").length ?? 0;
  const totalLeads = stats?.leads.length ?? 0;
  const pendingBookings = stats?.bookings.filter((b) => b.status === "pending").length ?? 0;
  const confirmedBookings = stats?.bookings.filter((b) => b.status === "confirmed").length ?? 0;
  const totalBookings = stats?.bookings.length ?? 0;

  return (
    <main className="min-h-screen px-6 pb-24 pt-16 md:px-12">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse</p>
          <h1 className="mt-2 font-display text-4xl text-paper">Command Center</h1>
        </div>
      </div>

      {/* Module grid */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Dashboard */}
        <Link
          href="/admin/dashboard"
          className="border-paper/10 hover:border-paper/25 group block border p-6 transition-colors duration-[320ms]"
        >
          <p className="text-paper/35 text-[9px] uppercase tracking-[0.24em]">Analytics</p>
          <p className="mt-4 font-display text-2xl text-paper">Dashboard</p>
          <p className="text-paper/25 group-hover:text-paper/50 mt-6 text-[10px] uppercase tracking-[0.2em] transition-colors">
            Open →
          </p>
        </Link>

        {/* Leads */}
        <Link
          href="/admin/leads"
          className="border-paper/10 hover:border-paper/25 group block border p-6 transition-colors duration-[320ms]"
        >
          <p className="text-paper/35 text-[9px] uppercase tracking-[0.24em]">Leads</p>
          <div className="mt-4 flex items-baseline gap-4">
            <p className="font-display text-5xl text-paper">{totalLeads}</p>
            {newLeads > 0 && (
              <span className="text-[10px] uppercase tracking-[0.18em] text-amber-400">
                {newLeads} new
              </span>
            )}
          </div>
          {quotedLeads > 0 && (
            <p className="text-paper/35 mt-2 text-[10px]">{quotedLeads} quoted</p>
          )}
          <p className="text-paper/25 group-hover:text-paper/50 mt-6 text-[10px] uppercase tracking-[0.2em] transition-colors">
            Open →
          </p>
        </Link>

        {/* Bookings */}
        <Link
          href="/admin/bookings"
          className="border-paper/10 hover:border-paper/25 group block border p-6 transition-colors duration-[320ms]"
        >
          <p className="text-paper/35 text-[9px] uppercase tracking-[0.24em]">Bookings</p>
          <div className="mt-4 flex items-baseline gap-4">
            <p className="font-display text-5xl text-paper">{totalBookings}</p>
            {pendingBookings > 0 && (
              <span className="text-[10px] uppercase tracking-[0.18em] text-amber-400">
                {pendingBookings} pending
              </span>
            )}
          </div>
          {confirmedBookings > 0 && (
            <p className="text-paper/35 mt-2 text-[10px]">{confirmedBookings} confirmed</p>
          )}
          <p className="text-paper/25 group-hover:text-paper/50 mt-6 text-[10px] uppercase tracking-[0.2em] transition-colors">
            Open →
          </p>
        </Link>

        {/* Assets */}
        <Link
          href="/admin/assets"
          className="border-paper/10 hover:border-paper/25 group block border p-6 transition-colors duration-[320ms]"
        >
          <p className="text-paper/35 text-[9px] uppercase tracking-[0.24em]">Assets</p>
          <p className="mt-4 font-display text-2xl text-paper">Fleet & Inventory</p>
          <p className="text-paper/25 group-hover:text-paper/50 mt-6 text-[10px] uppercase tracking-[0.2em] transition-colors">
            Open →
          </p>
        </Link>

        {/* Calendar */}
        <Link
          href="/admin/calendar"
          className="border-paper/10 hover:border-paper/25 group block border p-6 transition-colors duration-[320ms]"
        >
          <p className="text-paper/35 text-[9px] uppercase tracking-[0.24em]">Calendar</p>
          <p className="mt-4 font-display text-2xl text-paper">Booking Schedule</p>
          <p className="text-paper/25 group-hover:text-paper/50 mt-6 text-[10px] uppercase tracking-[0.2em] transition-colors">
            Open →
          </p>
        </Link>
      </div>

      {/* Footer nav */}
      <div className="border-paper/10 mt-16 flex flex-wrap gap-8 border-t pt-8">
        {[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/leads", label: "Leads" },
          { href: "/admin/bookings", label: "Bookings" },
          { href: "/admin/assets", label: "Assets" },
          { href: "/admin/calendar", label: "Calendar" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-paper/35 text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-paper"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
