import { getSupabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";

function noEnv() {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

const ACTIVITY_DOT: Record<string, string> = {
  lead_created: "bg-emerald-400",
  status_changed: "bg-amber-400",
  note_updated: "bg-paper/40",
  converted_to_booking: "bg-violet-400",
  booking_status_changed: "bg-sky-300",
  client_created: "bg-emerald-300",
  payment_status_changed: "bg-emerald-400",
};

function fmtMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

const SERVICE_LABELS: Record<string, string> = {
  car: "Car",
  jet: "Jet",
  yacht: "Yacht",
  jet_ski: "Jet Ski",
  chauffeur: "Chauffeur",
  restaurant: "Dining",
  nightlife: "Nightlife",
  concierge: "Concierge",
  residence: "Residence",
  experience: "Experience",
  other: "Other",
};

const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-400",
  confirmed: "text-emerald-400",
  in_progress: "text-sky-300",
  completed: "text-emerald-300",
  cancelled: "text-red-400/60",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

async function getMetrics() {
  if (noEnv()) return null;

  const supabase = getSupabaseAdmin();

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  const thisMonthStart = new Date(now);
  thisMonthStart.setUTCDate(1);
  thisMonthStart.setUTCHours(0, 0, 0, 0);
  const monthISO = thisMonthStart.toISOString();

  const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const todayDate = now.toISOString().split("T")[0]!;
  const endOfTodayISO = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59),
  ).toISOString();

  const [
    leadsRes,
    bookingsRes,
    leadsToday,
    bookingsToday,
    leads7d,
    leads30d,
    bookings7d,
    bookings30d,
    upcomingRes,
    activityRes,
    clientsTotalRes,
    clientsMonthRes,
    tasksRes,
    revenueRes,
  ] = await Promise.all([
    supabase.from("leads").select("status"),
    supabase.from("bookings").select("status"),
    supabase.from("leads").select("id").gte("created_at", todayISO),
    supabase.from("bookings").select("id").gte("created_at", todayISO),
    supabase.from("leads").select("id").gte("created_at", d7),
    supabase.from("leads").select("id").gte("created_at", d30),
    supabase.from("bookings").select("id").gte("created_at", d7),
    supabase.from("bookings").select("id").gte("created_at", d30),
    supabase
      .from("bookings")
      .select("id, client_name, service_type, asset_title, start_date, end_date, status")
      .gte("start_date", todayDate)
      .neq("status", "cancelled")
      .neq("status", "completed")
      .order("start_date")
      .limit(5),
    supabase
      .from("lead_activities")
      .select("id, type, content, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("clients").select("id"),
    supabase.from("clients").select("id").gte("created_at", monthISO),
    supabase.from("tasks").select("id, due_at, status").neq("status", "done"),
    supabase
      .from("bookings")
      .select("status, created_at, quoted_amount, final_amount, deposit_amount, payment_status")
      .neq("status", "cancelled"),
  ]);

  const leads = leadsRes.data ?? [];
  const bookings = bookingsRes.data ?? [];

  // Tasks
  const openTasks = (tasksRes.data ?? []) as {
    id: string;
    due_at: string | null;
    status: string;
  }[];
  const overdueTasks = openTasks.filter((t) => t.due_at && new Date(t.due_at) < todayStart).length;
  const todayTasks = openTasks.filter(
    (t) =>
      t.due_at && new Date(t.due_at) >= todayStart && new Date(t.due_at) <= new Date(endOfTodayISO),
  ).length;

  // Revenue
  const revBookings = (revenueRes.data ?? []) as {
    status: string;
    created_at: string;
    quoted_amount: number | null;
    final_amount: number | null;
    deposit_amount: number | null;
    payment_status: string | null;
  }[];
  const monthBookedValue = revBookings
    .filter((b) => new Date(b.created_at) >= thisMonthStart)
    .reduce((sum, b) => sum + (b.final_amount ?? b.quoted_amount ?? 0), 0);
  const pendingDeposits = revBookings
    .filter(
      (b) => b.payment_status === "pending" || b.payment_status === "none" || !b.payment_status,
    )
    .reduce((sum, b) => sum + (b.deposit_amount ?? 0), 0);

  return {
    // Status totals
    newLeads: leads.filter((l) => l.status === "new").length,
    qualifiedLeads: leads.filter((l) => l.status === "qualified").length,
    activeBookings: bookings.filter((b) =>
      ["pending", "confirmed", "in_progress"].includes(b.status),
    ).length,
    completedBookings: bookings.filter((b) => b.status === "completed").length,
    totalLeads: leads.length,
    totalBookings: bookings.length,
    // Today
    leadsToday: leadsToday.data?.length ?? 0,
    bookingsToday: bookingsToday.data?.length ?? 0,
    // Periods
    leads7d: leads7d.data?.length ?? 0,
    leads30d: leads30d.data?.length ?? 0,
    bookings7d: bookings7d.data?.length ?? 0,
    bookings30d: bookings30d.data?.length ?? 0,
    // Upcoming bookings list
    upcoming: (upcomingRes.data ?? []) as {
      id: string;
      client_name: string;
      service_type: string;
      asset_title: string | null;
      start_date: string | null;
      end_date: string | null;
      status: string;
    }[],
    // Activity feed
    activity: (activityRes.data ?? []) as {
      id: string;
      type: string;
      content: string;
      created_at: string;
    }[],
    // Clients
    clientsTotal: clientsTotalRes.data?.length ?? 0,
    clientsThisMonth: clientsMonthRes.data?.length ?? 0,
    // Tasks + revenue
    overdueTasks,
    todayTasks,
    monthBookedValue,
    pendingDeposits,
  };
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="border-paper/10 border p-6">
      <p className="text-paper/35 text-[9px] uppercase tracking-[0.24em]">{label}</p>
      <p className="mt-3 font-display text-5xl text-paper">{value}</p>
      {sub && <p className="text-paper/30 mt-2 text-[10px]">{sub}</p>}
    </div>
  );
}

function SmallCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="border-paper/10 border p-4">
      <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">{label}</p>
      <p
        className={`mt-2 font-display text-3xl ${accent && value > 0 ? "text-amber-400" : "text-paper"}`}
      >
        {value}
      </p>
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
        <div className="mt-12 space-y-10">
          {/* Status overview */}
          <section>
            <p className="text-paper/25 mb-3 text-[9px] uppercase tracking-[0.22em]">Overview</p>
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
          </section>

          {/* Today + Clients */}
          <section>
            <p className="text-paper/25 mb-3 text-[9px] uppercase tracking-[0.22em]">
              Today & Clients
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SmallCard label="Leads Today" value={m.leadsToday} accent />
              <SmallCard label="Bookings Today" value={m.bookingsToday} accent />
              <SmallCard label="Total Clients" value={m.clientsTotal} />
              <SmallCard label="Clients This Month" value={m.clientsThisMonth} />
            </div>
          </section>

          {/* Tasks + Revenue */}
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <p className="text-paper/25 text-[9px] uppercase tracking-[0.22em]">
                Follow-ups & Revenue
              </p>
              <Link
                href="/admin/tasks"
                className="text-paper/25 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
              >
                Tasks →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SmallCard label="Overdue Tasks" value={m.overdueTasks} accent />
              <SmallCard label="Due Today" value={m.todayTasks} accent />
              <div className="border-paper/10 border p-4">
                <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">Month Booked</p>
                <p className="mt-2 font-display text-2xl text-paper">
                  {fmtMoney(m.monthBookedValue)}
                </p>
              </div>
              <div className="border-paper/10 border p-4">
                <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">
                  Pending Deposits
                </p>
                <p
                  className={`mt-2 font-display text-2xl ${
                    m.pendingDeposits > 0 ? "text-amber-400" : "text-paper"
                  }`}
                >
                  {fmtMoney(m.pendingDeposits)}
                </p>
              </div>
            </div>
          </section>

          {/* Activity periods */}
          <section>
            <p className="text-paper/25 mb-3 text-[9px] uppercase tracking-[0.22em]">Activity</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: "Last 7 Days", leads: m.leads7d, bookings: m.bookings7d },
                { label: "Last 30 Days", leads: m.leads30d, bookings: m.bookings30d },
              ].map((p) => (
                <div key={p.label} className="border-paper/10 border p-5">
                  <p className="text-paper/35 mb-4 text-[9px] uppercase tracking-[0.24em]">
                    {p.label}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-paper/25 text-[9px] uppercase tracking-[0.2em]">Leads</p>
                      <p className="mt-1 font-display text-3xl text-paper">{p.leads}</p>
                    </div>
                    <div>
                      <p className="text-paper/25 text-[9px] uppercase tracking-[0.2em]">
                        Bookings
                      </p>
                      <p className="mt-1 font-display text-3xl text-paper">{p.bookings}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming bookings */}
          {m.upcoming.length > 0 && (
            <section>
              <div className="mb-3 flex items-baseline justify-between">
                <p className="text-paper/25 text-[9px] uppercase tracking-[0.22em]">
                  Upcoming Bookings
                </p>
                <Link
                  href="/admin/calendar"
                  className="text-paper/25 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
                >
                  Calendar →
                </Link>
              </div>
              <div className="space-y-2">
                {m.upcoming.map((b) => (
                  <div
                    key={b.id}
                    className="border-paper/[0.07] flex items-center justify-between border px-4 py-3"
                  >
                    <div>
                      <p className="font-display text-[15px] text-paper">{b.client_name}</p>
                      <p className="text-paper/40 mt-0.5 text-[10px]">
                        {SERVICE_LABELS[b.service_type] ?? b.service_type}
                        {b.asset_title && ` · ${b.asset_title}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-paper/60 text-[11px]">
                        {b.start_date ? formatDate(b.start_date) : "—"}
                        {b.end_date && (
                          <span className="text-paper/30"> → {formatDate(b.end_date)}</span>
                        )}
                      </p>
                      <p
                        className={`mt-0.5 text-[9px] uppercase tracking-[0.15em] ${
                          BOOKING_STATUS_COLORS[b.status] ?? "text-paper/40"
                        }`}
                      >
                        {b.status.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent activity */}
          {m.activity.length > 0 && (
            <section>
              <p className="text-paper/25 mb-3 text-[9px] uppercase tracking-[0.22em]">
                Recent Activity
              </p>
              <div className="space-y-0">
                {m.activity.map((a) => (
                  <div
                    key={a.id}
                    className="border-paper/[0.07] flex items-start gap-3 border-b py-3 last:border-0"
                  >
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        ACTIVITY_DOT[a.type] ?? "bg-paper/30"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-paper/70 truncate text-[11px]">{a.content}</p>
                    </div>
                    <p className="text-paper/25 shrink-0 text-[9px]">{formatTime(a.created_at)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick links */}
          <div className="border-paper/10 flex flex-wrap gap-6 border-t pt-8">
            {[
              { href: "/admin/leads", label: "Leads" },
              { href: "/admin/bookings", label: "Bookings" },
              { href: "/admin/clients", label: "Clients" },
              { href: "/admin/tasks", label: "Tasks" },
              { href: "/admin/revenue", label: "Revenue" },
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
