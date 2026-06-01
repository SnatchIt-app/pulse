"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import QuickAddTask from "@/components/admin/QuickAddTask";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Booking = {
  id: string;
  lead_id: string | null;
  client_id: string | null;
  service_type: string;
  client_name: string;
  phone: string | null;
  email: string;
  start_date: string | null;
  end_date: string | null;
  asset_title: string | null;
  asset_id: string | null;
  notes: string | null;
  status: string;
  quoted_amount: number | null;
  deposit_amount: number | null;
  final_amount: number | null;
  payment_status: string | null;
  created_at: string;
};

const PAYMENT_STATUSES = ["none", "pending", "deposit_paid", "paid", "refunded"] as const;

const PAYMENT_LABELS: Record<string, string> = {
  none: "None",
  pending: "Pending",
  deposit_paid: "Deposit Paid",
  paid: "Paid",
  refunded: "Refunded",
};

const PAYMENT_COLORS: Record<string, string> = {
  none: "text-paper/30 border-paper/15",
  pending: "text-amber-400 border-amber-400/30",
  deposit_paid: "text-sky-300 border-sky-300/30",
  paid: "text-emerald-400 border-emerald-400/30",
  refunded: "text-red-400 border-red-400/25",
};

function fmtMoney(n: number | null): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

type StatusFilter = "all" | "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES = ["pending", "confirmed", "in_progress", "completed", "cancelled"] as const;

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-400 border-amber-400/30",
  confirmed: "text-emerald-400 border-emerald-400/30",
  in_progress: "text-sky-300 border-sky-300/30",
  completed: "text-emerald-300 border-emerald-300/20",
  cancelled: "text-red-400 border-red-400/25",
};

const SERVICE_LABELS: Record<string, string> = {
  car: "Exotic Car",
  yacht: "Yacht",
  jet: "Private Jet",
  jet_ski: "Jet Skis",
  chauffeur: "Chauffeur",
  restaurant: "Dining",
  nightlife: "Nightlife",
  concierge: "Concierge",
  residence: "Residence",
  experience: "Experience",
  other: "Other",
};

const COUNT_STATUSES: StatusFilter[] = ["pending", "confirmed", "in_progress", "completed"];

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

function formatCreated(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  });
}

// ─── Booking Drawer ───────────────────────────────────────────────────────────

function BookingDrawer({
  booking,
  onClose,
  onStatusChange,
  onRevenueChange,
}: {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onRevenueChange: (id: string, patch: Partial<Booking>) => void;
}) {
  const [quoted, setQuoted] = useState(booking.quoted_amount?.toString() ?? "");
  const [deposit, setDeposit] = useState(booking.deposit_amount?.toString() ?? "");
  const [final, setFinal] = useState(booking.final_amount?.toString() ?? "");
  const [savingRevenue, setSavingRevenue] = useState(false);
  const [revenueSaved, setRevenueSaved] = useState(false);

  useEffect(() => {
    setQuoted(booking.quoted_amount?.toString() ?? "");
    setDeposit(booking.deposit_amount?.toString() ?? "");
    setFinal(booking.final_amount?.toString() ?? "");
  }, [booking.id, booking.quoted_amount, booking.deposit_amount, booking.final_amount]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toNum(s: string): number | null {
    const t = s.trim();
    if (!t) return null;
    const n = Number(t);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }

  async function saveRevenue(patch: Partial<Booking>) {
    setSavingRevenue(true);
    setRevenueSaved(false);
    try {
      const body: Record<string, unknown> = {};
      if ("quoted_amount" in patch) body.quoted_amount = patch.quoted_amount;
      if ("deposit_amount" in patch) body.deposit_amount = patch.deposit_amount;
      if ("final_amount" in patch) body.final_amount = patch.final_amount;
      if ("payment_status" in patch) body.payment_status = patch.payment_status;

      const res = await fetch(`/api/admin/bookings/${booking.id}/revenue`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("failed");
      onRevenueChange(booking.id, patch);
      setRevenueSaved(true);
      setTimeout(() => setRevenueSaved(false), 2000);
    } finally {
      setSavingRevenue(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-paper/40 text-[9px] uppercase tracking-[0.24em]">Booking</p>
          <h2 className="mt-1 font-display text-2xl text-paper">{booking.client_name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-paper/40 mt-1 shrink-0 text-lg transition-opacity hover:text-paper"
        >
          ✕
        </button>
      </div>

      <div className="mt-8 space-y-5">
        {/* Contact */}
        <Row label="Email">
          <a href={`mailto:${booking.email}`} className="text-paper/80 hover:text-paper">
            {booking.email}
          </a>
        </Row>
        {booking.phone && (
          <Row label="Phone">
            <a href={`tel:${booking.phone}`} className="text-paper/80 hover:text-paper">
              {booking.phone}
            </a>
          </Row>
        )}

        {/* Booking details */}
        <Row label="Service">{SERVICE_LABELS[booking.service_type] ?? booking.service_type}</Row>
        {booking.asset_title && <Row label="Asset">{booking.asset_title}</Row>}
        <Row label="Dates">
          {booking.start_date ? (
            <>
              {formatDate(booking.start_date)}
              {booking.end_date && (
                <>
                  <span className="text-paper/30 mx-2">→</span>
                  {formatDate(booking.end_date)}
                </>
              )}
            </>
          ) : (
            "—"
          )}
        </Row>
        <Row label="Created">{formatCreated(booking.created_at)}</Row>

        {/* Status */}
        <div>
          <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Status</p>
          <div className="relative inline-flex items-center">
            <select
              value={booking.status}
              onChange={(e) => void onStatusChange(booking.id, e.target.value)}
              className={`cursor-pointer appearance-none border bg-transparent py-1.5 pl-3 pr-7 text-[10px] uppercase tracking-[0.18em] outline-none transition-colors ${
                STATUS_COLORS[booking.status] ?? "border-paper/10 text-paper/40"
              }`}
            >
              {STATUSES.map((s) => (
                <option
                  key={s}
                  value={s}
                  className="bg-graphite text-sm normal-case tracking-normal text-paper"
                >
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <span className="text-paper/30 pointer-events-none absolute right-2 text-[8px]">↓</span>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div>
            <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Notes</p>
            <p className="text-paper/65 whitespace-pre-wrap text-[11px] leading-relaxed">
              {booking.notes}
            </p>
          </div>
        )}

        {/* Revenue */}
        <div className="border-paper/10 border-t pt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">Revenue</p>
            {revenueSaved && (
              <span className="text-[9px] uppercase tracking-[0.18em] text-emerald-400">Saved</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Quoted", value: quoted, set: setQuoted, key: "quoted_amount" as const },
              { label: "Deposit", value: deposit, set: setDeposit, key: "deposit_amount" as const },
              { label: "Final", value: final, set: setFinal, key: "final_amount" as const },
            ].map((f) => (
              <div key={f.key}>
                <p className="text-paper/25 mb-1 text-[8px] uppercase tracking-[0.18em]">
                  {f.label}
                </p>
                <div className="border-paper/15 focus-within:border-paper/35 flex items-center border-b transition-colors">
                  <span className="text-paper/30 text-[11px]">$</span>
                  <input
                    type="number"
                    min="0"
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    onBlur={() => void saveRevenue({ [f.key]: toNum(f.value) } as Partial<Booking>)}
                    placeholder="0"
                    className="placeholder:text-paper/20 w-full bg-transparent py-1.5 pl-1 text-[12px] text-paper outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Payment status */}
          <div className="mt-4">
            <p className="text-paper/25 mb-2 text-[8px] uppercase tracking-[0.18em]">
              Payment Status
            </p>
            <div className="relative inline-flex items-center">
              <select
                value={booking.payment_status ?? "none"}
                onChange={(e) => void saveRevenue({ payment_status: e.target.value })}
                className={`cursor-pointer appearance-none border bg-transparent py-1.5 pl-3 pr-7 text-[10px] uppercase tracking-[0.18em] outline-none transition-colors ${
                  PAYMENT_COLORS[booking.payment_status ?? "none"] ??
                  "border-paper/10 text-paper/40"
                }`}
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option
                    key={s}
                    value={s}
                    className="bg-graphite text-sm normal-case tracking-normal text-paper"
                  >
                    {PAYMENT_LABELS[s]}
                  </option>
                ))}
              </select>
              <span className="text-paper/30 pointer-events-none absolute right-2 text-[8px]">
                ↓
              </span>
            </div>
          </div>
          {savingRevenue && (
            <p className="text-paper/30 mt-2 text-[9px] uppercase tracking-[0.18em]">Saving…</p>
          )}
        </div>

        {/* Follow-up task */}
        <div className="border-paper/10 border-t pt-5">
          <QuickAddTask entityType="booking" entityId={booking.id} />
        </div>

        {/* Links */}
        {(booking.lead_id || booking.client_id) && (
          <div className="border-paper/10 border-t pt-4">
            <div className="space-y-2">
              {booking.lead_id && (
                <p className="text-paper/25 text-[9px] uppercase tracking-[0.18em]">Linked lead</p>
              )}
              {booking.client_id && (
                <p className="text-paper/25 text-[9px] uppercase tracking-[0.18em]">
                  Linked client
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-paper/35 w-16 shrink-0 text-[9px] uppercase tracking-[0.2em]">
        {label}
      </span>
      <span className="text-paper/80 text-[12px] leading-relaxed">{children}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const counts = useMemo(
    () =>
      COUNT_STATUSES.map((s) => ({
        status: s,
        label: STATUS_LABELS[s],
        count: bookings.filter((b) => b.status === s).length,
      })),
    [bookings],
  );

  const visible = useMemo(() => {
    let rows = bookings;
    if (filter !== "all") rows = rows.filter((b) => b.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      rows = rows.filter(
        (b) =>
          b.client_name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          (b.phone ?? "").includes(q) ||
          (b.asset_title ?? "").toLowerCase().includes(q),
      );
    }
    return rows;
  }, [bookings, filter, search]);

  const handleStatusChange = useCallback(
    async (id: string, next: string) => {
      const prev = bookings.find((b) => b.id === id)?.status;
      if (!prev || prev === next) return;

      setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: next } : b)));
      setSelectedBooking((sb) => (sb?.id === id ? { ...sb, status: next } : sb));
      setUpdateError(null);

      try {
        const res = await fetch(`/api/admin/bookings/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
        if (!res.ok) throw new Error("failed");
      } catch {
        setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: prev } : b)));
        setSelectedBooking((sb) => (sb?.id === id ? { ...sb, status: prev } : sb));
        setUpdateError("Status update failed — reverted.");
      }
    },
    [bookings],
  );

  const handleRevenueChange = useCallback((id: string, patch: Partial<Booking>) => {
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    setSelectedBooking((sb) => (sb?.id === id ? { ...sb, ...patch } : sb));
  }, []);

  const closeDrawer = useCallback(() => setSelectedBooking(null), []);

  return (
    <div>
      {/* Count cards */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map((card) => (
          <button
            key={card.status}
            onClick={() =>
              setFilter((f) => (f === card.status ? "all" : (card.status as StatusFilter)))
            }
            className={`border p-4 text-left transition-colors duration-[320ms] ${
              filter === card.status
                ? "border-paper/40 bg-paper/5"
                : "border-paper/10 hover:border-paper/25"
            }`}
          >
            <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">{card.label}</p>
            <p className="mt-2 font-display text-3xl text-paper">{card.count}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-8">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search client, email, or asset…"
          className="border-paper/20 placeholder:text-paper/25 focus:border-paper/50 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors sm:max-w-sm"
        />
      </div>

      {/* Filter tabs */}
      <div className="border-paper/10 mt-6 flex flex-wrap gap-x-6 gap-y-2 border-b pb-4">
        {FILTER_OPTIONS.map((f) => {
          const count =
            f.value === "all"
              ? bookings.length
              : bookings.filter((b) => b.status === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`transition-colors ${
                filter === f.value
                  ? "border-b border-paper pb-1 text-[10px] uppercase tracking-[0.2em] text-paper"
                  : "text-paper/35 hover:text-paper/60 text-[10px] uppercase tracking-[0.2em]"
              }`}
            >
              {f.label}
              {count > 0 && <span className="ml-1.5 text-[9px] opacity-50">({count})</span>}
            </button>
          );
        })}
      </div>

      {updateError && <p className="mt-4 text-[11px] text-red-400">{updateError}</p>}

      {/* Table */}
      {visible.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[1140px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-paper/10 border-b">
                {[
                  "Created",
                  "Client",
                  "Service",
                  "Asset",
                  "Dates",
                  "Status",
                  "Value",
                  "Payment",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-paper/35 pb-3 pr-6 text-[9px] font-normal uppercase tracking-[0.22em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-paper/[0.06] hover:bg-paper/[0.03] border-b transition-colors"
                >
                  <td className="text-paper/50 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {formatCreated(booking.created_at)}
                  </td>
                  <td className="py-4 pr-6">
                    <p className="whitespace-nowrap font-display text-base text-paper">
                      {booking.client_name}
                    </p>
                    <p className="text-paper/45 mt-0.5 text-[10px]">{booking.email}</p>
                    {booking.phone && <p className="text-paper/40 text-[10px]">{booking.phone}</p>}
                  </td>
                  <td className="whitespace-nowrap py-4 pr-6">
                    <span className="text-paper/50 text-[9px] uppercase tracking-[0.18em]">
                      {SERVICE_LABELS[booking.service_type] ?? booking.service_type}
                    </span>
                  </td>
                  <td className="text-paper/65 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {booking.asset_title ?? "—"}
                  </td>
                  <td className="text-paper/55 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {booking.start_date ? (
                      <>
                        {formatDate(booking.start_date)}
                        {booking.end_date && <span className="text-paper/30 mx-1">→</span>}
                        {booking.end_date && formatDate(booking.end_date)}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="whitespace-nowrap py-4 pr-6">
                    <div className="relative inline-flex items-center">
                      <select
                        value={booking.status}
                        onChange={(e) => void handleStatusChange(booking.id, e.target.value)}
                        className={`cursor-pointer appearance-none border bg-transparent py-1 pl-2 pr-6 text-[9px] uppercase tracking-[0.18em] outline-none transition-colors ${
                          STATUS_COLORS[booking.status] ?? "border-paper/10 text-paper/40"
                        }`}
                      >
                        {STATUSES.map((s) => (
                          <option
                            key={s}
                            value={s}
                            className="bg-graphite text-sm normal-case tracking-normal text-paper"
                          >
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      <span className="text-paper/30 pointer-events-none absolute right-1.5 text-[8px]">
                        ↓
                      </span>
                    </div>
                  </td>
                  <td className="text-paper/65 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {fmtMoney(booking.final_amount ?? booking.quoted_amount)}
                  </td>
                  <td className="whitespace-nowrap py-4 pr-6">
                    <span
                      className={`border px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] ${
                        PAYMENT_COLORS[booking.payment_status ?? "none"] ??
                        "border-paper/10 text-paper/30"
                      }`}
                    >
                      {PAYMENT_LABELS[booking.payment_status ?? "none"]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-4 pr-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(booking)}
                      className="text-paper/30 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
                    >
                      Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-paper/35 mt-12 text-sm">
          {search.trim() || filter !== "all" ? "No matching bookings." : "No bookings yet."}
        </p>
      )}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`bg-ink/70 fixed inset-0 z-40 transition-opacity duration-[360ms] ${
          selectedBooking ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed right-0 top-0 z-50 h-screen w-full overflow-hidden bg-graphite shadow-2xl transition-transform duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[480px] ${
          selectedBooking ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedBooking && (
          <BookingDrawer
            booking={selectedBooking}
            onClose={closeDrawer}
            onStatusChange={handleStatusChange}
            onRevenueChange={handleRevenueChange}
          />
        )}
      </div>
    </div>
  );
}
