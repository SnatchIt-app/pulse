import { getSupabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";

const SERVICE_LABELS: Record<string, string> = {
  car: "Exotic Cars",
  jet: "Private Jets",
  yacht: "Yachts",
  jet_ski: "Jet Skis",
  chauffeur: "Chauffeur",
  restaurant: "Dining",
  nightlife: "Nightlife",
  concierge: "Concierge",
  residence: "Residences",
  other: "Other",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const PAYMENT_LABELS: Record<string, string> = {
  none: "None",
  pending: "Pending",
  deposit_paid: "Deposit Paid",
  paid: "Paid",
  refunded: "Refunded",
};

type RevenueBooking = {
  id: string;
  service_type: string;
  status: string;
  client_name: string;
  asset_title: string | null;
  quoted_amount: number | null;
  deposit_amount: number | null;
  final_amount: number | null;
  payment_status: string | null;
  created_at: string;
};

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

// Recognized value of a booking = final if set, else quoted.
function bookingValue(b: RevenueBooking): number {
  return b.final_amount ?? b.quoted_amount ?? 0;
}

async function getRevenue() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, service_type, status, client_name, asset_title, quoted_amount, deposit_amount, final_amount, payment_status, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };

  const bookings = (data ?? []) as RevenueBooking[];
  const active = bookings.filter((b) => b.status !== "cancelled");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // This month — recognized value of bookings created this month
  const thisMonthValue = active
    .filter((b) => new Date(b.created_at) >= monthStart)
    .reduce((sum, b) => sum + bookingValue(b), 0);

  // Total booked value (all non-cancelled)
  const bookedValue = active.reduce((sum, b) => sum + bookingValue(b), 0);

  // Paid value
  const paidValue = active
    .filter((b) => b.payment_status === "paid")
    .reduce((sum, b) => sum + bookingValue(b), 0);

  // Pending deposits — deposit amounts where payment not yet at deposit_paid/paid
  const pendingDeposits = active
    .filter((b) => b.payment_status === "pending" || b.payment_status === "none")
    .reduce((sum, b) => sum + (b.deposit_amount ?? 0), 0);

  // By service type
  const byService = new Map<string, number>();
  for (const b of active) {
    byService.set(b.service_type, (byService.get(b.service_type) ?? 0) + bookingValue(b));
  }
  const serviceRows = Array.from(byService.entries())
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  // By status
  const byStatus = new Map<string, number>();
  for (const b of active) {
    byStatus.set(b.status, (byStatus.get(b.status) ?? 0) + bookingValue(b));
  }
  const statusRows = Array.from(byStatus.entries())
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  // Recent paid bookings
  const recentPaid = active.filter((b) => b.payment_status === "paid").slice(0, 6);

  return {
    thisMonthValue,
    bookedValue,
    paidValue,
    pendingDeposits,
    serviceRows,
    statusRows,
    recentPaid,
  };
}

function BigStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-paper/10 border p-6">
      <p className="text-paper/35 text-[9px] uppercase tracking-[0.24em]">{label}</p>
      <p className="mt-3 font-display text-4xl text-paper">{fmt(value)}</p>
    </div>
  );
}

export default async function RevenuePage() {
  const r = await getRevenue();

  return (
    <main className="min-h-screen px-6 pb-24 pt-16 md:px-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse CRM</p>
          <h1 className="mt-2 font-display text-4xl text-paper">Revenue</h1>
        </div>
        <Link
          href="/admin"
          className="text-paper/35 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          ← Admin
        </Link>
      </div>

      {!r ? (
        <p className="text-paper/50 mt-10 text-sm">Supabase env vars not configured.</p>
      ) : "error" in r ? (
        <p className="mt-8 text-sm text-red-400">Database error: {r.error}</p>
      ) : (
        <div className="mt-12 space-y-10">
          <p className="text-paper/25 -mb-6 text-[10px]">
            Manual tracking. Recognized value uses the final amount when set, otherwise the quote.
          </p>

          {/* Headline stats */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <BigStat label="This Month" value={r.thisMonthValue} />
            <BigStat label="Booked Value" value={r.bookedValue} />
            <BigStat label="Paid Value" value={r.paidValue} />
            <BigStat label="Pending Deposits" value={r.pendingDeposits} />
          </section>

          {/* Breakdown */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* By service */}
            <section>
              <p className="text-paper/25 mb-3 text-[9px] uppercase tracking-[0.22em]">
                Revenue by Service
              </p>
              {r.serviceRows.length > 0 ? (
                <div className="space-y-2">
                  {r.serviceRows.map(([service, value]) => (
                    <div
                      key={service}
                      className="border-paper/[0.07] flex items-center justify-between border-b py-2.5"
                    >
                      <span className="text-paper/55 text-[11px] uppercase tracking-[0.16em]">
                        {SERVICE_LABELS[service] ?? service}
                      </span>
                      <span className="font-display text-base text-paper">{fmt(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-paper/30 text-sm">No revenue recorded yet.</p>
              )}
            </section>

            {/* By status */}
            <section>
              <p className="text-paper/25 mb-3 text-[9px] uppercase tracking-[0.22em]">
                Revenue by Status
              </p>
              {r.statusRows.length > 0 ? (
                <div className="space-y-2">
                  {r.statusRows.map(([status, value]) => (
                    <div
                      key={status}
                      className="border-paper/[0.07] flex items-center justify-between border-b py-2.5"
                    >
                      <span className="text-paper/55 text-[11px] uppercase tracking-[0.16em]">
                        {STATUS_LABELS[status] ?? status}
                      </span>
                      <span className="font-display text-base text-paper">{fmt(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-paper/30 text-sm">No revenue recorded yet.</p>
              )}
            </section>
          </div>

          {/* Recent paid */}
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <p className="text-paper/25 text-[9px] uppercase tracking-[0.22em]">
                Recent Paid Bookings
              </p>
              <Link
                href="/admin/bookings"
                className="text-paper/25 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
              >
                Bookings →
              </Link>
            </div>
            {r.recentPaid.length > 0 ? (
              <div className="space-y-2">
                {r.recentPaid.map((b) => (
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
                      <p className="font-display text-base text-emerald-300">
                        {fmt(bookingValue(b))}
                      </p>
                      <p className="text-paper/30 mt-0.5 text-[9px] uppercase tracking-[0.15em]">
                        {PAYMENT_LABELS[b.payment_status ?? "none"]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-paper/30 text-sm">No paid bookings yet.</p>
            )}
          </section>

          {/* Quick links */}
          <div className="border-paper/10 flex flex-wrap gap-6 border-t pt-8">
            {[
              { href: "/admin/bookings", label: "Bookings" },
              { href: "/admin/dashboard", label: "Dashboard" },
              { href: "/admin/tasks", label: "Tasks" },
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
