"use client";

import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Booking = {
  id: string;
  lead_id: string | null;
  service_type: string;
  client_name: string;
  phone: string | null;
  email: string;
  start_date: string | null;
  end_date: string | null;
  asset_title: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

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

function truncate(str: string | null, max = 80) {
  if (!str) return "—";
  return str.length > max ? str.slice(0, max) + "…" : str;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);

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

  async function handleStatusChange(id: string, next: string) {
    const prev = bookings.find((b) => b.id === id)?.status;
    if (!prev || prev === next) return;

    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: next } : b)));
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
      setUpdateError("Status update failed — reverted.");
    }
  }

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
          className="placeholder:text-paper/25 border-paper/20 focus:border-paper/50 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors sm:max-w-sm"
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
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-paper/10 border-b">
                {["Created", "Client", "Service", "Asset", "Dates", "Status", "Notes"].map((h) => (
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
                  {/* Created */}
                  <td className="text-paper/50 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {formatCreated(booking.created_at)}
                  </td>
                  {/* Client */}
                  <td className="py-4 pr-6">
                    <p className="whitespace-nowrap font-display text-base text-paper">
                      {booking.client_name}
                    </p>
                    <p className="text-paper/45 mt-0.5 text-[10px]">{booking.email}</p>
                    {booking.phone && <p className="text-paper/40 text-[10px]">{booking.phone}</p>}
                  </td>
                  {/* Service */}
                  <td className="whitespace-nowrap py-4 pr-6">
                    <span className="text-paper/50 text-[9px] uppercase tracking-[0.18em]">
                      {SERVICE_LABELS[booking.service_type] ?? booking.service_type}
                    </span>
                  </td>
                  {/* Asset */}
                  <td className="text-paper/65 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {booking.asset_title ?? "—"}
                  </td>
                  {/* Dates */}
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
                  {/* Status */}
                  <td className="whitespace-nowrap py-4 pr-6">
                    <div className="relative inline-flex items-center">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`cursor-pointer appearance-none border bg-transparent py-1 pl-2 pr-6 text-[9px] uppercase tracking-[0.18em] outline-none transition-colors ${STATUS_COLORS[booking.status] ?? "border-paper/10 text-paper/40"}`}
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
                  {/* Notes */}
                  <td className="text-paper/55 max-w-[200px] py-4 pr-6 text-[11px] leading-relaxed">
                    {truncate(booking.notes)}
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
    </div>
  );
}
