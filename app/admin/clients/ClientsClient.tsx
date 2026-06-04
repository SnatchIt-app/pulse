"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { Client } from "./page";
import QuickAddTask from "@/components/admin/QuickAddTask";

// ─── Types ────────────────────────────────────────────────────────────────────

type HistoryBooking = {
  id: string;
  service_type: string;
  asset_title: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
};

type HistoryLead = {
  id: string;
  service_type: string;
  status: string;
  created_at: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

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

const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-400",
  confirmed: "text-emerald-400",
  in_progress: "text-sky-300",
  completed: "text-emerald-300",
  cancelled: "text-red-400/60",
};

const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "text-paper/55",
  contacted: "text-amber-400",
  qualified: "text-sky-300",
  quoted: "text-violet-400",
  booked: "text-emerald-400",
  completed: "text-emerald-300",
  lost: "text-red-400",
  closed: "text-paper/30",
  archived: "text-paper/20",
};

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

// ─── Tag Pill ─────────────────────────────────────────────────────────────────

function TagPill({ tag, onRemove }: { tag: string; onRemove?: () => void }) {
  return (
    <span className="border-paper/20 text-paper/50 group flex items-center gap-1 border px-2 py-0.5 text-[8px] uppercase tracking-[0.15em]">
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
        >
          ×
        </button>
      )}
    </span>
  );
}

// ─── Client Drawer ────────────────────────────────────────────────────────────

function ClientDrawer({
  client,
  onClose,
  onUpdate,
}: {
  client: Client;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Client>) => void;
}) {
  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile");
  const [tags, setTags] = useState<string[]>(client.tags);
  const [notes, setNotes] = useState(client.notes ?? "");
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyBookings, setHistoryBookings] = useState<HistoryBooking[] | null>(null);
  const [historyLeads, setHistoryLeads] = useState<HistoryLead[] | null>(null);

  useEffect(() => {
    setTags(client.tags);
    setNotes(client.notes ?? "");
    setActiveTab("profile");
    setHistoryBookings(null);
    setHistoryLeads(null);
    setShowTagInput(false);
    setNewTag("");
    setNotesSaved(false);
  }, [client.id, client.tags, client.notes]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (activeTab !== "history" || historyBookings !== null) return;
    let cancelled = false;
    setHistoryLoading(true);
    fetch(`/api/admin/clients/${client.id}/history`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.ok) {
          setHistoryBookings(data.bookings);
          setHistoryLeads(data.leads);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab, client.id, historyBookings]);

  async function savePatch(patch: Partial<Pick<Client, "tags" | "notes">>): Promise<boolean> {
    setSaveError(null);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error === "read_only" ? "Read-only access." : "Could not save.");
        return false;
      }
      onUpdate(client.id, patch);
      return true;
    } catch {
      setSaveError("Could not save.");
      return false;
    }
  }

  async function saveNotes() {
    setSavingNotes(true);
    setNotesSaved(false);
    try {
      const ok = await savePatch({ notes: notes.trim() || null });
      if (ok) {
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 2000);
      }
    } finally {
      setSavingNotes(false);
    }
  }

  async function addTag() {
    const t = newTag.trim().toLowerCase();
    if (!t || tags.includes(t)) {
      setNewTag("");
      setShowTagInput(false);
      return;
    }
    const next = [...tags, t];
    setTags(next);
    setNewTag("");
    setShowTagInput(false);
    const ok = await savePatch({ tags: next });
    if (!ok) setTags(tags); // revert
  }

  async function removeTag(tag: string) {
    const prev = tags;
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    const ok = await savePatch({ tags: next });
    if (!ok) setTags(prev); // revert
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-paper/40 text-[9px] uppercase tracking-[0.24em]">Client</p>
          <h2 className="mt-1 font-display text-2xl text-paper">{client.full_name}</h2>
          {client.email && <p className="text-paper/45 mt-0.5 text-[11px]">{client.email}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-paper/40 mt-1 shrink-0 text-lg transition-opacity hover:text-paper"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="border-paper/10 mt-6 flex gap-6 border-b pb-3">
        {(["profile", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${
              activeTab === t
                ? "border-b border-paper pb-[3px] text-paper"
                : "text-paper/35 hover:text-paper/60"
            }`}
          >
            {t === "profile" ? "Profile" : "History"}
          </button>
        ))}
      </div>

      {/* ── Profile ─────────────────────────────────────────────────────── */}
      {activeTab === "profile" && (
        <div className="mt-6 space-y-6">
          {/* Contact info */}
          <div className="space-y-3">
            {client.email && (
              <Row label="Email">
                <a href={`mailto:${client.email}`} className="text-paper/80 hover:text-paper">
                  {client.email}
                </a>
              </Row>
            )}
            {client.phone && (
              <Row label="Phone">
                <a href={`tel:${client.phone}`} className="text-paper/80 hover:text-paper">
                  {client.phone}
                </a>
              </Row>
            )}
            <Row label="Since">{formatDate(client.created_at)}</Row>
            <Row label="Bookings">{String(client.booking_count)}</Row>
            {client.last_booking_at && <Row label="Last">{formatDate(client.last_booking_at)}</Row>}
          </div>

          {/* Tags */}
          <div>
            <p className="text-paper/35 mb-3 text-[9px] uppercase tracking-[0.22em]">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <TagPill key={tag} tag={tag} onRemove={() => void removeTag(tag)} />
              ))}
              {showTagInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        void addTag();
                      }
                      if (e.key === "Escape") {
                        setNewTag("");
                        setShowTagInput(false);
                      }
                    }}
                    placeholder="e.g. vip"
                    autoFocus
                    className="border-paper/15 focus:border-paper/35 w-24 border-b bg-transparent py-0.5 text-[10px] text-paper outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => void addTag()}
                    className="text-paper/40 text-[9px] uppercase tracking-[0.16em] hover:text-paper"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewTag("");
                      setShowTagInput(false);
                    }}
                    className="text-paper/20 text-[9px] hover:text-paper"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTagInput(true)}
                  className="text-paper/25 hover:text-paper/60 text-[9px] uppercase tracking-[0.18em] transition-colors"
                >
                  + Tag
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">Notes</p>
              {notesSaved && (
                <span className="text-[9px] uppercase tracking-[0.18em] text-emerald-400">
                  Saved
                </span>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => void saveNotes()}
              rows={4}
              placeholder="Internal notes — not visible to the client."
              className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full resize-none border bg-transparent p-3 text-[12px] leading-relaxed text-paper outline-none transition-colors"
            />
            {savingNotes && (
              <p className="text-paper/30 mt-1 text-[9px] uppercase tracking-[0.18em]">Saving…</p>
            )}
            {saveError && <p className="mt-1 text-[11px] text-red-400">{saveError}</p>}
          </div>

          {/* Follow-up task */}
          <div className="border-paper/10 border-t pt-5">
            <QuickAddTask entityType="client" entityId={client.id} />
          </div>
        </div>
      )}

      {/* ── History ─────────────────────────────────────────────────────── */}
      {activeTab === "history" && (
        <div className="mt-6">
          {historyLoading ? (
            <p className="text-paper/30 text-[10px] uppercase tracking-[0.18em]">Loading…</p>
          ) : (
            <div className="space-y-8">
              {/* Bookings history */}
              <div>
                <p className="text-paper/35 mb-3 text-[9px] uppercase tracking-[0.22em]">
                  Bookings
                  {historyBookings && (
                    <span className="text-paper/20 ml-1.5">({historyBookings.length})</span>
                  )}
                </p>
                {!historyBookings || historyBookings.length === 0 ? (
                  <p className="text-paper/30 text-sm">No bookings found.</p>
                ) : (
                  <div className="space-y-2">
                    {historyBookings.map((b) => (
                      <div key={b.id} className="border-paper/[0.07] border p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[11px] text-paper">
                            {b.asset_title ?? SERVICE_LABELS[b.service_type] ?? b.service_type}
                          </p>
                          <span
                            className={`shrink-0 text-[9px] uppercase tracking-[0.15em] ${
                              BOOKING_STATUS_COLORS[b.status] ?? "text-paper/40"
                            }`}
                          >
                            {b.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-paper/35 mt-1 text-[9px]">
                          {SERVICE_LABELS[b.service_type] ?? b.service_type}
                          {b.start_date && ` · ${formatDate(b.start_date)}`}
                          {b.end_date && ` → ${formatDate(b.end_date)}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Leads history */}
              <div>
                <p className="text-paper/35 mb-3 text-[9px] uppercase tracking-[0.22em]">
                  Leads
                  {historyLeads && (
                    <span className="text-paper/20 ml-1.5">({historyLeads.length})</span>
                  )}
                </p>
                {!historyLeads || historyLeads.length === 0 ? (
                  <p className="text-paper/30 text-sm">No leads found.</p>
                ) : (
                  <div className="space-y-2">
                    {historyLeads.map((l) => (
                      <div
                        key={l.id}
                        className="border-paper/[0.07] flex items-center justify-between border px-3 py-2"
                      >
                        <p className="text-[11px] text-paper">
                          {SERVICE_LABELS[l.service_type] ?? l.service_type}
                        </p>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[9px] uppercase tracking-[0.15em] ${
                              LEAD_STATUS_COLORS[l.status] ?? "text-paper/40"
                            }`}
                          >
                            {l.status}
                          </span>
                          <span className="text-paper/25 text-[9px]">
                            {formatDate(l.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
      <span className="text-paper/35 w-16 shrink-0 text-[9px] uppercase tracking-[0.2em]">
        {label}
      </span>
      <span className="text-paper/80 text-[12px] leading-relaxed">{children}</span>
    </div>
  );
}

// ─── Add Client Drawer ────────────────────────────────────────────────────────

function AddClientDrawer({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (client: Client) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function commitTag() {
    const t = newTag.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setNewTag("");
  }

  async function handleSave() {
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          tags,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === "read_only"
            ? "Read-only access."
            : data.error === "email_taken"
              ? "A client with that email already exists."
              : "Could not add client. Please try again.",
        );
        return;
      }
      onCreated({
        id: String(data.id),
        full_name: fullName.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        tags,
        notes: notes.trim() || null,
        booking_count: 0,
        last_booking_at: null,
        created_at: new Date().toISOString(),
      });
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
          <p className="text-paper/40 text-[9px] uppercase tracking-[0.24em]">New Client</p>
          <h2 className="mt-1 font-display text-2xl text-paper">Add Client</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-paper/40 mt-1 shrink-0 text-lg transition-opacity hover:text-paper"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Full Name</p>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="First & last name"
            className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
            />
          </div>
          <div>
            <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Phone</p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 …"
              className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Tags</p>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}
              />
            ))}
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  commitTag();
                }
              }}
              onBlur={commitTag}
              placeholder="e.g. vip"
              className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-24 border-b bg-transparent py-0.5 text-[11px] text-paper outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Internal notes — not visible to the client."
            className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full resize-none border bg-transparent p-3 text-[12px] leading-relaxed text-paper outline-none transition-colors"
          />
        </div>

        {error && <p className="text-[11px] text-red-400">{error}</p>}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-paper py-3 text-[10px] uppercase tracking-[0.24em] text-ink transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {saving ? "Adding…" : "Add Client"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClientsClient({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleCreated = useCallback((client: Client) => {
    setClients((cs) => [client, ...cs]);
    setShowAdd(false);
  }, []);

  const visible = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase().trim();
    return clients.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.phone ?? "").includes(q),
    );
  }, [clients, search]);

  const counts = useMemo(
    () => ({
      total: clients.length,
      withBookings: clients.filter((c) => c.booking_count > 0).length,
      vip: clients.filter((c) => c.tags.includes("vip")).length,
    }),
    [clients],
  );

  const handleUpdate = useCallback((id: string, patch: Partial<Client>) => {
    setClients((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    setSelectedClient((sc) => (sc?.id === id ? { ...sc, ...patch } : sc));
  }, []);

  const closeDrawer = useCallback(() => setSelectedClient(null), []);

  return (
    <div>
      {/* Count cards */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        {[
          { label: "Total Clients", value: counts.total },
          { label: "With Bookings", value: counts.withBookings },
          { label: "VIP Tagged", value: counts.vip },
        ].map((card) => (
          <div key={card.label} className="border-paper/10 border p-4">
            <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">{card.label}</p>
            <p className="mt-2 font-display text-3xl text-paper">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Add */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, or phone…"
          className="border-paper/20 placeholder:text-paper/25 focus:border-paper/50 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors sm:max-w-sm"
        />
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="border-paper/25 text-paper/70 hover:border-paper/50 ml-auto border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-paper"
        >
          + Add Client
        </button>
      </div>

      {/* Table */}
      {visible.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-paper/10 border-b">
                {["Client", "Email", "Tags", "Bookings", "Last Booking", ""].map((h) => (
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
              {visible.map((client) => (
                <tr
                  key={client.id}
                  className="border-paper/[0.06] hover:bg-paper/[0.03] border-b transition-colors"
                >
                  <td className="py-4 pr-6">
                    <p className="whitespace-nowrap font-display text-base text-paper">
                      {client.full_name}
                    </p>
                    {client.phone && (
                      <p className="text-paper/40 mt-0.5 text-[10px]">{client.phone}</p>
                    )}
                  </td>
                  <td className="text-paper/65 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {client.email ?? "—"}
                  </td>
                  <td className="py-4 pr-6">
                    <div className="flex flex-wrap gap-1.5">
                      {client.tags.slice(0, 3).map((tag) => (
                        <TagPill key={tag} tag={tag} />
                      ))}
                      {client.tags.length > 3 && (
                        <span className="text-paper/25 text-[9px]">+{client.tags.length - 3}</span>
                      )}
                      {client.tags.length === 0 && (
                        <span className="text-paper/20 text-[9px]">—</span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-4 pr-6 text-[11px]">
                    {client.booking_count > 0 ? (
                      <span className="text-emerald-400">{client.booking_count}</span>
                    ) : (
                      <span className="text-paper/35">0</span>
                    )}
                  </td>
                  <td className="text-paper/50 whitespace-nowrap py-4 pr-6 text-[11px]">
                    {formatDate(client.last_booking_at)}
                  </td>
                  <td className="whitespace-nowrap py-4 pr-2">
                    <button
                      type="button"
                      onClick={() => setSelectedClient(client)}
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
          {search.trim()
            ? "No matching clients."
            : "No clients yet. Clients are created automatically when leads are converted to bookings."}
        </p>
      )}

      {/* Add Client drawer */}
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
        aria-label="Add client"
        className={`fixed right-0 top-0 z-50 h-screen w-full overflow-hidden bg-graphite shadow-2xl transition-transform duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[480px] ${
          showAdd ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {showAdd && <AddClientDrawer onClose={() => setShowAdd(false)} onCreated={handleCreated} />}
      </div>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`bg-ink/70 fixed inset-0 z-40 transition-opacity duration-[360ms] ${
          selectedClient ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed right-0 top-0 z-50 h-screen w-full overflow-hidden bg-graphite shadow-2xl transition-transform duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[480px] ${
          selectedClient ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedClient && (
          <ClientDrawer client={selectedClient} onClose={closeDrawer} onUpdate={handleUpdate} />
        )}
      </div>
    </div>
  );
}
