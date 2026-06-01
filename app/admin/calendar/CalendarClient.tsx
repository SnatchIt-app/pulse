"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { CalendarBooking } from "./page";

// ─── Constants ────────────────────────────────────────────────────────────────

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const STATUS_CHIP: Record<string, string> = {
  pending: "bg-amber-400/15 text-amber-400 border-amber-400/20",
  confirmed: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20",
  in_progress: "bg-sky-300/15 text-sky-300 border-sky-300/20",
  completed: "bg-emerald-300/10 text-emerald-300 border-emerald-300/15",
  cancelled: "bg-red-400/10 text-red-400/60 border-red-400/15",
};

const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-400",
  confirmed: "bg-emerald-400",
  in_progress: "bg-sky-300",
  completed: "bg-emerald-300",
  cancelled: "bg-red-400/50",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const BOOKING_STATUSES = ["pending", "confirmed", "in_progress", "completed", "cancelled"] as const;

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

const SERVICE_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "car", label: "Cars" },
  { value: "jet", label: "Jets" },
  { value: "yacht", label: "Yachts" },
  { value: "residence", label: "Residences" },
  { value: "other", label: "Other" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
}

function formatShort(s: string) {
  return new Date(s + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function bookingsForDay(bookings: CalendarBooking[], day: Date): CalendarBooking[] {
  const d = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  return bookings.filter((b) => {
    if (!b.start_date) return false;
    const start = parseLocalDate(b.start_date);
    const end = b.end_date ? parseLocalDate(b.end_date) : start;
    return d >= start && d <= end;
  });
}

function buildGrid(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: Date[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push(new Date(year, month - 1, daysInPrev - i));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  let next = 1;
  while (cells.length % 7 !== 0) {
    cells.push(new Date(year, month + 1, next++));
  }
  return cells;
}

function isToday(d: Date) {
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

// ─── Booking Drawer ───────────────────────────────────────────────────────────

function BookingDrawer({
  booking,
  onClose,
  onStatusChange,
}: {
  booking: CalendarBooking;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 md:p-8">
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
        <Row label="Service">{SERVICE_LABELS[booking.service_type] ?? booking.service_type}</Row>
        {booking.asset_title && <Row label="Asset">{booking.asset_title}</Row>}
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
        <Row label="Dates">
          {booking.start_date ? (
            <>
              {formatShort(booking.start_date)}
              {booking.end_date && (
                <>
                  <span className="text-paper/30 mx-2">→</span>
                  {formatShort(booking.end_date)}
                </>
              )}
            </>
          ) : (
            "—"
          )}
        </Row>

        {/* Status */}
        <div>
          <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Status</p>
          <div className="relative inline-flex items-center">
            <select
              value={booking.status}
              onChange={(e) => onStatusChange(booking.id, e.target.value)}
              className={`cursor-pointer appearance-none border bg-transparent py-1.5 pl-3 pr-7 text-[10px] uppercase tracking-[0.18em] outline-none transition-colors ${
                STATUS_CHIP[booking.status] ?? "border-paper/10 text-paper/40"
              }`}
            >
              {BOOKING_STATUSES.map((s) => (
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

        {booking.notes && (
          <div>
            <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Notes</p>
            <p className="text-paper/65 whitespace-pre-wrap text-[11px] leading-relaxed">
              {booking.notes}
            </p>
          </div>
        )}

        {(booking.lead_id || booking.client_id) && (
          <div className="border-paper/10 border-t pt-4">
            {booking.lead_id && (
              <p className="text-paper/25 text-[9px] uppercase tracking-[0.18em]">Linked lead</p>
            )}
            {booking.client_id && (
              <p className="text-paper/25 mt-1 text-[9px] uppercase tracking-[0.18em]">
                Linked client
              </p>
            )}
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

// ─── Calendar Client ──────────────────────────────────────────────────────────

export default function CalendarClient({
  initialBookings,
}: {
  initialBookings: CalendarBooking[];
}) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [bookings, setBookings] = useState<CalendarBooking[]>(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);
  const [mobileSelectedDay, setMobileSelectedDay] = useState<Date | null>(null);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  const filteredBookings = useMemo(() => {
    let b = bookings;
    if (serviceFilter !== "all") {
      if (serviceFilter === "other") {
        b = b.filter((x) => !["car", "jet", "yacht", "residence"].includes(x.service_type));
      } else {
        b = b.filter((x) => x.service_type === serviceFilter);
      }
    }
    if (statusFilter !== "all") b = b.filter((x) => x.status === statusFilter);
    return b;
  }, [bookings, serviceFilter, statusFilter]);

  const grid = useMemo(() => buildGrid(year, month), [year, month]);

  const handleStatusChange = useCallback(
    async (id: string, status: string) => {
      const prev = bookings.find((b) => b.id === id)?.status;
      if (!prev || prev === status) return;

      setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
      setSelectedBooking((sb) => (sb?.id === id ? { ...sb, status } : sb));

      try {
        const res = await fetch(`/api/admin/bookings/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error("failed");
      } catch {
        setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: prev } : b)));
        setSelectedBooking((sb) => (sb?.id === id ? { ...sb, status: prev } : sb));
      }
    },
    [bookings],
  );

  const closeDrawer = useCallback(() => setSelectedBooking(null), []);

  const mobileDayBookings = useMemo(
    () => (mobileSelectedDay ? bookingsForDay(filteredBookings, mobileSelectedDay) : []),
    [filteredBookings, mobileSelectedDay],
  );

  const activeFilterCount = (serviceFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  return (
    <div>
      {/* Filters */}
      <div className="mt-6 space-y-2">
        {/* Service filter */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <p className="text-paper/25 w-12 shrink-0 text-[9px] uppercase tracking-[0.18em]">Type</p>
          {SERVICE_FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setServiceFilter(f.value)}
              className={`text-[9px] uppercase tracking-[0.18em] transition-colors ${
                serviceFilter === f.value ? "text-paper" : "text-paper/30 hover:text-paper/60"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {/* Status filter */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <p className="text-paper/25 w-12 shrink-0 text-[9px] uppercase tracking-[0.18em]">
            Status
          </p>
          {STATUS_FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`text-[9px] uppercase tracking-[0.18em] transition-colors ${
                statusFilter === f.value ? "text-paper" : "text-paper/30 hover:text-paper/60"
              }`}
            >
              {f.label}
            </button>
          ))}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setServiceFilter("all");
                setStatusFilter("all");
              }}
              className="text-paper/20 hover:text-paper/60 text-[9px] uppercase tracking-[0.18em] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Month nav */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={prevMonth}
          className="text-paper/40 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          ←
        </button>
        <p className="min-w-[180px] text-center font-display text-xl text-paper">
          {MONTH_NAMES[month]} {year}
        </p>
        <button
          type="button"
          onClick={nextMonth}
          className="text-paper/40 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          →
        </button>
        <button
          type="button"
          onClick={() => {
            setMonth(today.getMonth());
            setYear(today.getFullYear());
          }}
          className="text-paper/25 ml-4 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          Today
        </button>
        {activeFilterCount > 0 && (
          <span className="text-paper/30 text-[9px]">{filteredBookings.length} shown</span>
        )}
      </div>

      {/* Calendar grid */}
      <div className="mt-4">
        {/* Weekday headers */}
        <div className="border-paper/10 grid grid-cols-7 border-b pb-2">
          {WEEKDAYS.map((d) => (
            <p key={d} className="text-paper/30 text-center text-[9px] uppercase tracking-[0.18em]">
              {d}
            </p>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {grid.map((day, i) => {
            const isCurrentMonth = day.getMonth() === month;
            const dayBookings = bookingsForDay(filteredBookings, day);
            const today_ = isToday(day);

            return (
              <div
                key={i}
                className={`border-paper/[0.07] min-h-[80px] border-b border-r p-1.5 md:min-h-[100px] md:p-2 ${
                  isCurrentMonth ? "" : "opacity-25"
                } ${i % 7 === 0 ? "border-l" : ""}`}
              >
                {/* Day number */}
                <p
                  className={`mb-1 text-right text-[10px] md:text-[11px] ${
                    today_ ? "font-medium text-paper" : "text-paper/50"
                  }`}
                >
                  {today_ ? (
                    <span className="inline-block h-4 w-4 rounded-full bg-paper text-center text-[9px] leading-4 text-ink md:h-5 md:w-5 md:text-[10px] md:leading-5">
                      {day.getDate()}
                    </span>
                  ) : (
                    day.getDate()
                  )}
                </p>

                {/* Mobile: dots */}
                <div
                  className="flex flex-wrap gap-0.5 md:hidden"
                  onClick={() =>
                    setMobileSelectedDay(
                      mobileSelectedDay?.getTime() === day.getTime() ? null : day,
                    )
                  }
                >
                  {dayBookings.slice(0, 4).map((b) => (
                    <span
                      key={b.id}
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[b.status] ?? "bg-paper/30"}`}
                    />
                  ))}
                </div>

                {/* Desktop: chips */}
                <div className="hidden space-y-0.5 md:block">
                  {dayBookings.slice(0, 2).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBooking(b)}
                      className={`w-full truncate border px-1.5 py-0.5 text-left text-[9px] leading-tight transition-opacity hover:opacity-75 ${
                        STATUS_CHIP[b.status] ?? "border-paper/10 text-paper/40"
                      }`}
                    >
                      <span className="block truncate">{b.asset_title || b.client_name}</span>
                      {b.asset_title && (
                        <span className="block truncate text-[8px] opacity-60">
                          {b.client_name}
                        </span>
                      )}
                    </button>
                  ))}
                  {dayBookings.length > 2 && (
                    <p className="text-paper/30 pl-1 text-[8px]">+{dayBookings.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile day detail */}
      {mobileSelectedDay && mobileDayBookings.length > 0 && (
        <div className="border-paper/10 mt-4 border-t pt-4 md:hidden">
          <p className="text-paper/35 mb-3 text-[9px] uppercase tracking-[0.22em]">
            {mobileSelectedDay.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="space-y-2">
            {mobileDayBookings.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBooking(b)}
                className={`w-full border p-3 text-left transition-opacity hover:opacity-75 ${
                  STATUS_CHIP[b.status] ?? "border-paper/10"
                }`}
              >
                <p className="text-[11px] font-medium text-paper">
                  {b.asset_title || b.client_name}
                </p>
                <p className="text-paper/50 mt-0.5 text-[10px]">
                  {SERVICE_LABELS[b.service_type] ?? b.service_type} ·{" "}
                  {STATUS_LABELS[b.status] ?? b.status}
                </p>
                {b.asset_title && <p className="text-paper/35 text-[10px]">{b.client_name}</p>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {(["pending", "confirmed", "in_progress", "completed", "cancelled"] as const).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${STATUS_DOT[s]}`} />
            <span className="text-paper/35 text-[9px] uppercase tracking-[0.16em]">
              {STATUS_LABELS[s]}
            </span>
          </div>
        ))}
      </div>

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
        className={`fixed right-0 top-0 z-50 h-screen w-full overflow-hidden bg-graphite shadow-2xl transition-transform duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[440px] ${
          selectedBooking ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedBooking && (
          <BookingDrawer
            booking={selectedBooking}
            onClose={closeDrawer}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}
