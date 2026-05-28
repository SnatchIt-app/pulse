"use client";

import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Lead = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string;
  service_type: string;
  message: string | null;
  created_at: string;
  status: string;
};

type FilterValue =
  | "all"
  | "new"
  | "contacted"
  | "quoted"
  | "booked"
  | "closed"
  | "archived";

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "booked", label: "Booked" },
  { value: "closed", label: "Closed" },
  { value: "archived", label: "Archived" },
];

const COUNT_CARDS: { status: string; label: string }[] = [
  { status: "new", label: "New" },
  { status: "contacted", label: "Contacted" },
  { status: "quoted", label: "Quoted" },
  { status: "booked", label: "Booked" },
];

// All valid status values (includes legacy enum values for existing data)
const ALL_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "quoted",
  "booked",
  "completed",
  "lost",
  "closed",
  "archived",
] as const;

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  quoted: "Quoted",
  booked: "Booked",
  completed: "Completed",
  lost: "Lost",
  closed: "Closed",
  archived: "Archived",
};

// Text + border color classes per status (on dark bg-ink background)
const STATUS_COLORS: Record<string, string> = {
  new: "text-paper/55 border-paper/20",
  contacted: "text-amber-400 border-amber-400/30",
  qualified: "text-sky-300 border-sky-300/30",
  quoted: "text-violet-400 border-violet-400/30",
  booked: "text-emerald-400 border-emerald-400/30",
  completed: "text-emerald-300 border-emerald-300/20",
  lost: "text-red-400 border-red-400/25",
  closed: "text-paper/30 border-paper/10",
  archived: "text-paper/20 border-paper/10",
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
  other: "Other",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
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

function truncate(str: string | null, max = 120) {
  if (!str) return "—";
  return str.length > max ? str.slice(0, max) + "…" : str;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Count cards — always computed from full leads set (not filtered)
  const counts = useMemo(
    () =>
      COUNT_CARDS.map((card) => ({
        ...card,
        count: leads.filter((l) => l.status === card.status).length,
      })),
    [leads],
  );

  // Filtered + searched rows
  const visible = useMemo(() => {
    let rows = leads;
    if (filter !== "all") {
      rows = rows.filter((l) => l.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      rows = rows.filter(
        (l) =>
          l.full_name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.phone ?? "").toLowerCase().includes(q),
      );
    }
    return rows;
  }, [leads, filter, search]);

  // Optimistic status update
  async function handleStatusChange(id: string, next: string) {
    const prev = leads.find((l) => l.id === id)?.status;
    if (!prev || prev === next) return;

    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: next } : l)));
    setUpdateError(null);

    try {
      const res = await fetch(`/api/admin/leads/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: prev } : l)));
      setUpdateError("Status update failed — reverted. Please try again.");
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Count cards */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map((card) => (
          <button
            key={card.status}
            onClick={() =>
              setFilter((f) => (f === card.status ? "all" : (card.status as FilterValue)))
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
          placeholder="Search name, email, or phone…"
          className="placeholder:text-paper/25 w-full border-b border-paper/20 bg-transparent py-2 text-sm text-paper outline-none transition-colors focus:border-paper/50 sm:max-w-sm"
        />
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-b border-paper/10 pb-4">
        {FILTER_OPTIONS.map((f) => {
          const count =
            f.value === "all"
              ? leads.length
              : leads.filter((l) => l.status === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`transition-colors ${
                filter === f.value
                  ? "border-b border-paper pb-1 text-[10px] uppercase tracking-[0.2em] text-paper"
                  : "text-[10px] uppercase tracking-[0.2em] text-paper/35 hover:text-paper/60"
              }`}
            >
              {f.label}
              {count > 0 && (
                <span className="ml-1.5 text-[9px] opacity-50">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Optimistic update error */}
      {updateError && (
        <p className="mt-4 text-[11px] text-red-400">{updateError}</p>
      )}

      {/* Table */}
      {visible.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-paper/10 border-b">
                {["Date", "Name", "Phone", "Email", "Service", "Status", "Message"].map((h) => (
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
              {visible.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-paper/[0.06] hover:bg-paper/[0.03] border-b transition-colors"
                >
                  {/* Date */}
                  <td className="text-paper/50 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {formatDate(lead.created_at)}
                  </td>
                  {/* Name */}
                  <td className="whitespace-nowrap py-4 pr-6 font-display text-base text-paper">
                    {lead.full_name}
                  </td>
                  {/* Phone */}
                  <td className="text-paper/65 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {lead.phone ?? "—"}
                  </td>
                  {/* Email */}
                  <td className="text-paper/65 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {lead.email}
                  </td>
                  {/* Service */}
                  <td className="whitespace-nowrap py-4 pr-6">
                    <span className="text-paper/50 text-[9px] uppercase tracking-[0.18em]">
                      {SERVICE_LABELS[lead.service_type] ?? lead.service_type}
                    </span>
                  </td>
                  {/* Status dropdown */}
                  <td className="whitespace-nowrap py-4 pr-6">
                    <div className="relative inline-flex items-center">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`cursor-pointer appearance-none border bg-transparent py-1 pl-2 pr-6 text-[9px] uppercase tracking-[0.18em] outline-none transition-colors ${STATUS_COLORS[lead.status] ?? "border-paper/10 text-paper/40"}`}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option
                            key={s}
                            value={s}
                            className="bg-graphite normal-case tracking-normal text-sm text-paper"
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
                  {/* Message */}
                  <td className="text-paper/55 max-w-xs py-4 pr-6 text-[11px] leading-relaxed">
                    {truncate(lead.message)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-paper/35 mt-12 text-sm">
          {search.trim() || filter !== "all" ? "No matching leads." : "No leads yet."}
        </p>
      )}
    </div>
  );
}
