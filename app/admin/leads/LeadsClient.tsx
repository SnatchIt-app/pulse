"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import QuickAddTask from "@/components/admin/QuickAddTask";
import { tomorrowISO } from "@/lib/dates";

const MIN_BOOKING_DATE = tomorrowISO();

// ─── Types ────────────────────────────────────────────────────────────────────

export type Lead = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string;
  service_type: string;
  message: string | null;
  admin_notes: string | null;
  assigned_to: string | null;
  start_date: string | null;
  created_at: string;
  status: string;
};

export type AssetOption = {
  id: string;
  name: string;
  service_type: string;
  status: string;
  cover_image: string | null;
  source_slug: string | null;
};

type Activity = {
  id: string;
  type: string;
  content: string;
  created_by: string | null;
  created_at: string;
};

type FilterValue = "all" | "new" | "contacted" | "quoted" | "booked" | "closed" | "archived";

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
  experience: "Experience",
  other: "Other",
};

const ACTIVITY_DOT: Record<string, string> = {
  lead_created: "bg-emerald-400",
  status_changed: "bg-amber-400",
  note_updated: "bg-paper/40",
  converted_to_booking: "bg-violet-400",
  booking_status_changed: "bg-sky-300",
  client_created: "bg-emerald-300",
  payment_status_changed: "bg-emerald-400",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Lead Drawer ──────────────────────────────────────────────────────────────

type ConvertData = {
  asset_title: string;
  asset_id: string;
  start_date: string;
  end_date: string;
  notes: string;
};

function LeadDrawer({
  lead,
  assets,
  onClose,
  onStatusChange,
  onLeadUpdate,
}: {
  lead: Lead;
  assets: AssetOption[];
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onLeadUpdate: (id: string, patch: Partial<Lead>) => void;
}) {
  const [tab, setTab] = useState<"details" | "convert" | "timeline">("details");
  const [notes, setNotes] = useState(lead.admin_notes ?? "");
  const [assigned, setAssigned] = useState(lead.assigned_to ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);

  const [convertData, setConvertData] = useState<ConvertData>({
    asset_title: "",
    asset_id: "",
    start_date: lead.start_date ?? "",
    end_date: "",
    notes: "",
  });
  const [converting, setConverting] = useState(false);
  const [convertSuccess, setConvertSuccess] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  // Reset state when lead changes
  useEffect(() => {
    setNotes(lead.admin_notes ?? "");
    setAssigned(lead.assigned_to ?? "");
    setTab("details");
    setConvertSuccess(false);
    setConvertError(null);
    setNotesSaved(false);
    setActivities([]);
  }, [lead.id, lead.admin_notes, lead.assigned_to]);

  // Fetch activities when timeline tab opens
  useEffect(() => {
    if (tab !== "timeline") return;
    let cancelled = false;
    setActivitiesLoading(true);
    fetch(`/api/admin/leads/${lead.id}/activities`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.ok) setActivities(data.activities);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setActivitiesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab, lead.id]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const saveNotes = useCallback(async () => {
    setSavingNotes(true);
    setNotesSaved(false);
    setNotesError(null);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: notes, assigned_to: assigned }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setNotesError(data.error === "read_only" ? "Read-only access." : "Could not save.");
        return;
      }
      onLeadUpdate(lead.id, { admin_notes: notes, assigned_to: assigned });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch {
      setNotesError("Could not save.");
    } finally {
      setSavingNotes(false);
    }
  }, [lead.id, notes, assigned, onLeadUpdate]);

  async function handleConvert() {
    setConverting(true);
    setConvertError(null);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          service_type: lead.service_type,
          client_name: lead.full_name,
          phone: lead.phone,
          email: lead.email,
          asset_title: convertData.asset_title || undefined,
          asset_id: convertData.asset_id || undefined,
          start_date: convertData.start_date || undefined,
          end_date: convertData.end_date || undefined,
          notes: convertData.notes || undefined,
          status: "pending",
        }),
      });

      if (res.status === 409) {
        const data = await res.json();
        const c = data.conflict;
        setConvertError(
          `Conflict: "${c.client_name}" has this asset from ${c.start_date} to ${c.end_date}. Choose different dates or a different asset.`,
        );
        return;
      }

      if (res.status === 400) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        setConvertError(data?.message ?? "Please check the booking dates and try again.");
        return;
      }

      if (!res.ok) throw new Error("server_error");

      await onStatusChange(lead.id, "booked");
      setConvertSuccess(true);
    } catch {
      setConvertError("Something went wrong. Please try again.");
    } finally {
      setConverting(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-paper/40 text-[9px] uppercase tracking-[0.24em]">Lead</p>
          <h2 className="mt-1 font-display text-2xl text-paper">{lead.full_name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-paper/40 mt-1 shrink-0 text-lg transition-opacity hover:text-paper"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="border-paper/10 mt-6 flex gap-6 border-b pb-3">
        {(["details", "convert", "timeline"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${
              tab === t
                ? "border-b border-paper pb-[3px] text-paper"
                : "text-paper/35 hover:text-paper/60"
            }`}
          >
            {t === "details" ? "Details" : t === "convert" ? "Convert" : "Timeline"}
          </button>
        ))}
      </div>

      {/* ── Details tab ─────────────────────────────────────────────────────── */}
      {tab === "details" && (
        <div className="mt-6 space-y-6">
          {/* Contact */}
          <div className="space-y-3">
            <Row label="Email">
              <a
                href={`mailto:${lead.email}`}
                className="text-paper/80 transition-opacity hover:text-paper"
              >
                {lead.email}
              </a>
            </Row>
            <Row label="Phone">
              {lead.phone ? (
                <a href={`tel:${lead.phone}`} className="text-paper/80 hover:text-paper">
                  {lead.phone}
                </a>
              ) : (
                <span className="text-paper/30">—</span>
              )}
            </Row>
            <Row label="Service">{SERVICE_LABELS[lead.service_type] ?? lead.service_type}</Row>
            <Row label="Created">{formatDate(lead.created_at)}</Row>
            {lead.start_date && <Row label="Req. Date">{lead.start_date}</Row>}
          </div>

          {/* Status */}
          <div>
            <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Status</p>
            <div className="relative inline-flex items-center">
              <select
                value={lead.status}
                onChange={(e) => onStatusChange(lead.id, e.target.value)}
                className={`cursor-pointer appearance-none border bg-transparent py-1.5 pl-3 pr-7 text-[10px] uppercase tracking-[0.18em] outline-none transition-colors ${STATUS_COLORS[lead.status] ?? "border-paper/10 text-paper/40"}`}
              >
                {ALL_STATUSES.map((s) => (
                  <option
                    key={s}
                    value={s}
                    className="bg-graphite text-sm normal-case tracking-normal text-paper"
                  >
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <span className="text-paper/30 pointer-events-none absolute right-2 text-[8px]">
                ↓
              </span>
            </div>
          </div>

          {/* Client message */}
          {lead.message && (
            <div>
              <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">
                Client Message
              </p>
              <p className="text-paper/65 whitespace-pre-wrap text-[11px] leading-relaxed">
                {lead.message}
              </p>
            </div>
          )}

          {/* Admin notes */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">Admin Notes</p>
              {notesSaved && (
                <span className="text-[9px] uppercase tracking-[0.18em] text-emerald-400">
                  Saved
                </span>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              rows={4}
              placeholder="Internal notes — not visible to the client."
              className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full resize-none border bg-transparent p-3 text-[12px] leading-relaxed text-paper outline-none transition-colors"
            />
          </div>

          {/* Assigned to */}
          <div>
            <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Assigned To</p>
            <input
              type="text"
              value={assigned}
              onChange={(e) => setAssigned(e.target.value)}
              onBlur={saveNotes}
              placeholder="Specialist name…"
              className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
            />
          </div>

          {savingNotes && (
            <p className="text-paper/30 text-[9px] uppercase tracking-[0.18em]">Saving…</p>
          )}
          {notesError && <p className="text-[11px] text-red-400">{notesError}</p>}

          {/* Follow-up task */}
          <div className="border-paper/10 border-t pt-5">
            <QuickAddTask entityType="lead" entityId={lead.id} defaultAssignee={lead.assigned_to} />
          </div>
        </div>
      )}

      {/* ── Convert tab ─────────────────────────────────────────────────────── */}
      {tab === "convert" && (
        <div className="mt-6">
          {convertSuccess ? (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                Booking created
              </p>
              <p className="text-paper/70 mt-3 text-sm leading-relaxed">
                Lead status updated to <strong className="text-paper">Booked</strong>. A new booking
                record has been created.
              </p>
              <Link
                href="/admin/bookings"
                className="border-paper/20 text-paper/70 hover:border-paper/40 mt-6 inline-block border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-paper"
              >
                View Bookings →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-paper/55 text-[11px] leading-relaxed">
                Pre-fills from the lead. Add service details to create the booking record.
              </p>

              {/* Pre-filled read-only */}
              <div className="border-paper/10 space-y-2 border p-4">
                <Row label="Client">{lead.full_name}</Row>
                <Row label="Email">{lead.email}</Row>
                <Row label="Service">{SERVICE_LABELS[lead.service_type] ?? lead.service_type}</Row>
              </div>

              {/* Asset dropdown */}
              {assets.length > 0 && (
                <ConvertField label="Asset — enables conflict detection">
                  <div className="relative flex items-center">
                    <select
                      value={convertData.asset_id}
                      onChange={(e) => {
                        const id = e.target.value;
                        const asset = assets.find((a) => a.id === id);
                        setConvertData((d) => ({
                          ...d,
                          asset_id: id,
                          asset_title: asset?.name ?? d.asset_title,
                        }));
                      }}
                      className="border-paper/15 focus:border-paper/35 w-full cursor-pointer appearance-none border-b bg-transparent py-2 pr-6 text-sm text-paper outline-none transition-colors"
                    >
                      <option value="" className="text-paper/50 bg-graphite">
                        — no asset —
                      </option>
                      {assets.map((a) => (
                        <option key={a.id} value={a.id} className="bg-graphite text-paper">
                          {a.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-paper/30 pointer-events-none absolute right-1 text-[8px]">
                      ↓
                    </span>
                  </div>
                </ConvertField>
              )}

              {/* Asset title (manual if no assets) */}
              <ConvertField
                label={
                  assets.length > 0
                    ? "Asset Label (overrides selection)"
                    : "Asset / Vehicle / Vessel"
                }
              >
                <input
                  type="text"
                  value={convertData.asset_title}
                  onChange={(e) => setConvertData((d) => ({ ...d, asset_title: e.target.value }))}
                  placeholder="e.g. Lamborghini Urus, Ferretti 780…"
                  className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
                />
              </ConvertField>

              <div className="grid grid-cols-2 gap-4">
                <ConvertField label="Start Date">
                  <input
                    type="date"
                    min={MIN_BOOKING_DATE}
                    value={convertData.start_date}
                    onChange={(e) => setConvertData((d) => ({ ...d, start_date: e.target.value }))}
                    className="border-paper/15 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
                  />
                </ConvertField>
                <ConvertField label="End Date">
                  <input
                    type="date"
                    min={convertData.start_date || MIN_BOOKING_DATE}
                    value={convertData.end_date}
                    onChange={(e) => setConvertData((d) => ({ ...d, end_date: e.target.value }))}
                    className="border-paper/15 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
                  />
                </ConvertField>
              </div>

              <ConvertField label="Booking Notes">
                <textarea
                  value={convertData.notes}
                  onChange={(e) => setConvertData((d) => ({ ...d, notes: e.target.value }))}
                  rows={3}
                  placeholder="Internal booking notes…"
                  className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full resize-none border bg-transparent p-3 text-[12px] leading-relaxed text-paper outline-none transition-colors"
                />
              </ConvertField>

              {convertError && (
                <p className="border border-red-400/20 bg-red-400/5 p-3 text-[11px] leading-relaxed text-red-400">
                  {convertError}
                </p>
              )}

              <button
                type="button"
                onClick={handleConvert}
                disabled={converting}
                className="w-full bg-paper py-3 text-[10px] uppercase tracking-[0.24em] text-ink transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {converting ? "Creating…" : "Create Booking"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Timeline tab ────────────────────────────────────────────────────── */}
      {tab === "timeline" && (
        <div className="mt-6">
          {activitiesLoading ? (
            <p className="text-paper/30 text-[10px] uppercase tracking-[0.18em]">Loading…</p>
          ) : activities.length === 0 ? (
            <p className="text-paper/35 text-sm">No activity recorded yet.</p>
          ) : (
            <div className="space-y-0">
              {activities.map((a) => (
                <div
                  key={a.id}
                  className="border-paper/[0.07] flex gap-3 border-b py-4 last:border-0"
                >
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${ACTIVITY_DOT[a.type] ?? "bg-paper/30"}`}
                  />
                  <div>
                    <p className="text-paper/80 text-[12px] leading-relaxed">{a.content}</p>
                    <p className="text-paper/30 mt-1 text-[10px]">{formatDate(a.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-paper/35 w-20 shrink-0 text-[9px] uppercase tracking-[0.2em]">
        {label}
      </span>
      <span className="text-paper/80 text-[12px] leading-relaxed">{children}</span>
    </div>
  );
}

function ConvertField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">{label}</p>
      {children}
    </div>
  );
}

// ─── Add Lead Drawer ──────────────────────────────────────────────────────────

const LEAD_SERVICE_OPTIONS = [
  "car",
  "yacht",
  "jet",
  "jet_ski",
  "chauffeur",
  "restaurant",
  "nightlife",
  "residence",
  "experience",
  "concierge",
  "other",
] as const;

const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: "manual", label: "Manual Entry" },
  { value: "phone", label: "Phone Call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "referral", label: "Referral" },
  { value: "website", label: "Website" },
  { value: "other", label: "Other" },
];

const ADD_STATUS_OPTIONS = ["new", "contacted", "qualified", "quoted"] as const;

function AddLeadDrawer({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (lead: Lead) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState<string>("car");
  const [startDate, setStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [source, setSource] = useState("manual");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("new");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSave() {
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          service_type: serviceType,
          start_date: startDate || undefined,
          notes: notes.trim() || undefined,
          source,
          assigned_to: assignedTo.trim() || undefined,
          status,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === "read_only"
            ? "Read-only access."
            : (data.message ?? "Could not add lead. Please try again."),
        );
        return;
      }
      onCreated(data.lead as Lead);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-paper/40 text-[9px] uppercase tracking-[0.24em]">New Lead</p>
          <h2 className="mt-1 font-display text-2xl text-paper">Add Lead</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-paper/40 mt-1 shrink-0 text-lg transition-opacity hover:text-paper"
        >
          ✕
        </button>
      </div>

      <p className="text-paper/45 mt-3 text-[11px] leading-relaxed">
        For inquiries from phone, WhatsApp, Instagram, referrals, or direct conversations.
      </p>

      <div className="mt-6 space-y-5">
        <ConvertField label="Full Name">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="First & last name"
            className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
          />
        </ConvertField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ConvertField label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
            />
          </ConvertField>
          <ConvertField label="Phone">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 …"
              className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
            />
          </ConvertField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ConvertField label="Service">
            <div className="relative">
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="border-paper/15 focus:border-paper/35 w-full cursor-pointer appearance-none border-b bg-transparent py-2 pr-6 text-sm text-paper outline-none transition-colors"
              >
                {LEAD_SERVICE_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-graphite text-paper">
                    {SERVICE_LABELS[s] ?? s}
                  </option>
                ))}
              </select>
              <span className="text-paper/30 pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[8px]">
                ↓
              </span>
            </div>
          </ConvertField>
          <ConvertField label="Source">
            <div className="relative">
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="border-paper/15 focus:border-paper/35 w-full cursor-pointer appearance-none border-b bg-transparent py-2 pr-6 text-sm text-paper outline-none transition-colors"
              >
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-graphite text-paper">
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="text-paper/30 pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[8px]">
                ↓
              </span>
            </div>
          </ConvertField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ConvertField label="Requested Date">
            <input
              type="date"
              min={MIN_BOOKING_DATE}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-paper/15 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
            />
          </ConvertField>
          <ConvertField label="Status">
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border-paper/15 focus:border-paper/35 w-full cursor-pointer appearance-none border-b bg-transparent py-2 pr-6 text-sm text-paper outline-none transition-colors"
              >
                {ADD_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-graphite text-paper">
                    {STATUS_LABELS[s] ?? s}
                  </option>
                ))}
              </select>
              <span className="text-paper/30 pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[8px]">
                ↓
              </span>
            </div>
          </ConvertField>
        </div>

        <ConvertField label="Assigned Specialist">
          <input
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Specialist name…"
            className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
          />
        </ConvertField>

        <ConvertField label="Notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="What is the client looking for?"
            className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full resize-none border bg-transparent p-3 text-[12px] leading-relaxed text-paper outline-none transition-colors"
          />
        </ConvertField>

        {error && <p className="text-[11px] text-red-400">{error}</p>}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-paper py-3 text-[10px] uppercase tracking-[0.24em] text-ink transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {saving ? "Adding…" : "Add Lead"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeadsClient({
  initialLeads,
  assets,
}: {
  initialLeads: Lead[];
  assets: AssetOption[];
}) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleLeadCreated = useCallback((lead: Lead) => {
    setLeads((ls) => [lead, ...ls]);
    setShowAdd(false);
  }, []);

  const counts = useMemo(
    () =>
      COUNT_CARDS.map((card) => ({
        ...card,
        count: leads.filter((l) => l.status === card.status).length,
      })),
    [leads],
  );

  const visible = useMemo(() => {
    let rows = leads;
    if (filter !== "all") rows = rows.filter((l) => l.status === filter);
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

  const handleStatusChange = useCallback(
    async (id: string, next: string) => {
      const prev = leads.find((l) => l.id === id)?.status;
      if (!prev || prev === next) return;

      setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: next } : l)));
      setSelectedLead((sl) => (sl?.id === id ? { ...sl, status: next } : sl));
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
        setSelectedLead((sl) => (sl?.id === id ? { ...sl, status: prev } : sl));
        setUpdateError("Status update failed — reverted. Please try again.");
      }
    },
    [leads],
  );

  const handleLeadUpdate = useCallback((id: string, patch: Partial<Lead>) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    setSelectedLead((sl) => (sl?.id === id ? { ...sl, ...patch } : sl));
  }, []);

  const closeDrawer = useCallback(() => setSelectedLead(null), []);

  // ── Render ──────────────────────────────────────────────────────────────────

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

      {/* Search + Add */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, or phone…"
          className="placeholder:text-paper/25 border-paper/20 focus:border-paper/50 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors sm:max-w-sm"
        />
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="border-paper/25 text-paper/70 hover:border-paper/50 ml-auto border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-paper"
        >
          + Add Lead
        </button>
      </div>

      {/* Filter tabs */}
      <div className="border-paper/10 mt-6 flex flex-wrap gap-x-6 gap-y-2 border-b pb-4">
        {FILTER_OPTIONS.map((f) => {
          const count =
            f.value === "all" ? leads.length : leads.filter((l) => l.status === f.value).length;
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
          <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-paper/10 border-b">
                {["Date", "Name", "Phone", "Email", "Service", "Status", "Message", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      className="text-paper/35 pb-3 pr-6 text-[9px] font-normal uppercase tracking-[0.22em]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {visible.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-paper/[0.06] hover:bg-paper/[0.03] border-b transition-colors"
                >
                  <td className="text-paper/50 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="whitespace-nowrap py-4 pr-6 font-display text-base text-paper">
                    {lead.full_name}
                  </td>
                  <td className="text-paper/65 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {lead.phone ?? "—"}
                  </td>
                  <td className="text-paper/65 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {lead.email}
                  </td>
                  <td className="whitespace-nowrap py-4 pr-6">
                    <span className="text-paper/50 text-[9px] uppercase tracking-[0.18em]">
                      {SERVICE_LABELS[lead.service_type] ?? lead.service_type}
                    </span>
                  </td>
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
                  <td className="text-paper/55 max-w-xs py-4 pr-6 text-[11px] leading-relaxed">
                    {truncate(lead.message)}
                  </td>
                  <td className="whitespace-nowrap py-4 pr-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLead(lead)}
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
          {search.trim() || filter !== "all" ? "No matching leads." : "No leads yet."}
        </p>
      )}

      {/* ── Add Lead drawer ───────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className={`bg-ink/70 fixed inset-0 z-40 transition-opacity duration-[360ms] ${
          showAdd ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setShowAdd(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add lead"
        className={`fixed right-0 top-0 z-50 h-screen w-full overflow-hidden bg-graphite shadow-2xl transition-transform duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[520px] ${
          showAdd ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {showAdd && (
          <AddLeadDrawer onClose={() => setShowAdd(false)} onCreated={handleLeadCreated} />
        )}
      </div>

      {/* ── Backdrop ──────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className={`bg-ink/70 fixed inset-0 z-40 transition-opacity duration-[360ms] ${
          selectedLead ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
      />

      {/* ── Drawer ────────────────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={selectedLead ? `Lead: ${selectedLead.full_name}` : undefined}
        className={`fixed right-0 top-0 z-50 h-screen w-full overflow-hidden bg-graphite shadow-2xl transition-transform duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[520px] ${
          selectedLead ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedLead && (
          <LeadDrawer
            lead={selectedLead}
            assets={assets}
            onClose={closeDrawer}
            onStatusChange={handleStatusChange}
            onLeadUpdate={handleLeadUpdate}
          />
        )}
      </div>
    </div>
  );
}
