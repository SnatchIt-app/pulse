import { getSupabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";

function noEnv() {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

async function getMetrics() {
  if (noEnv()) return null;

  const supabase = getSupabaseAdmin();
  const now = new Date();
  const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [leadsRes, bookingsRes, leads7dRes, leads30dRes, bookings7dRes, bookings30dRes] =
    await Promise.all([
      supabase.from("leads").select("status"),
      supabase.from("bookings").select("status"),
      supabase.from("leads").select("id").gte("created_at", d7),
      supabase.from("leads").select("id").gte("created_at", d30),
      supabase.from("bookings").select("id").gte("created_at", d7),
      supabase.from("bookings").select("id").gte("created_at", d30),
    ]);

  const leads = leadsRes.data ?? [];
  const bookings = bookingsRes.data ?? [];

  return {
    newLeads: leads.filter((l) => l.status === "new").length,
    qualifiedLeads: leads.filter((l) => l.status === "qualified").length,
    activeBookings: bookings.filter((b) =>
      ["pending", "confirmed", "in_progress"].includes(b.status),
    ).length,
    completedBookings: bookings.filter((b) => b.status === "completed").length,
    totalLeads: leads.length,
    totalBookings: bookings.length,
    leads7d: leads7dRes.data?.length ?? 0,
    leads30d: leads30dRes.data?.length ?? 0,
    bookings7d: bookings7dRes.data?.length ?? 0,
    bookings30d: bookings30dRes.data?.length ?? 0,
  };
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="border-paper/10 border p-6">
      <p className="text-paper/35 text-[9px] uppercase tracking-[0.24em]">{label}</p>
      <p className="mt-3 font-display text-5xl text-paper">{value}</p>
      {sub && <p className="text-paper/30 mt-2 text-[10px]">{sub}</p>}
    </div>
  );
}

function PeriodRow({
  label,
  leads,
  bookings,
}: {
  label: string;
  leads: number;
  bookings: number;
}) {
  return (
    <div className="border-paper/10 border p-6">
      <p className="text-paper/35 mb-4 text-[9px] uppercase tracking-[0.24em]">{label}</p>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-paper/25 text-[9px] uppercase tracking-[0.2em]">New Leads</p>
          <p className="mt-2 font-display text-3xl text-paper">{leads}</p>
        </div>
        <div>
          <p className="text-paper/25 text-[9px] uppercase tracking-[0.2em]">New Bookings</p>
          <p className="mt-2 font-display text-3xl text-paper">{bookings}</p>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const m = await getMetrics();

  return (
    <main className="min-h-screen px-6 pb-24 pt-16 md:px-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse CRM</p>
          <h1 className="mt-2 font-display text-4xl text-paper">Dashboard</h1>
        </div>
        <Link
          href="/admin"
          className="text-paper/35 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          ← Admin
        </Link>
      </div>

      {!m ? (
        <p className="text-paper/50 mt-10 text-sm">Supabase env vars not configured.</p>
      ) : (
        <div className="mt-12 space-y-4">
          {/* Status totals */}
          <div>
            <p className="text-paper/25 mb-3 text-[9px] uppercase tracking-[0.22em]">
              Current Status
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="New Leads" value={m.newLeads} sub={`${m.totalLeads} total`} />
              <StatCard label="Qualified" value={m.qualifiedLeads} sub="leads" />
              <StatCard
                label="Active Bookings"
                value={m.activeBookings}
                sub={`${m.totalBookings} total`}
              />
              <StatCard label="Completed" value={m.completedBookings} sub="bookings" />
            </div>
          </div>

          {/* Period metrics */}
          <div>
            <p className="text-paper/25 mb-3 mt-8 text-[9px] uppercase tracking-[0.22em]">
              Activity
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PeriodRow label="Last 7 Days" leads={m.leads7d} bookings={m.bookings7d} />
              <PeriodRow label="Last 30 Days" leads={m.leads30d} bookings={m.bookings30d} />
            </div>
          </div>

          {/* Quick links */}
          <div className="border-paper/10 mt-12 flex flex-wrap gap-6 border-t pt-8">
            {[
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
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
