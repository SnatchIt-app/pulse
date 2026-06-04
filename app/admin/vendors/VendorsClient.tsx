"use client";

import { useState, useMemo, useCallback } from "react";
import type { Vendor } from "./page";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = [
  { value: "jet_broker", label: "Jet Broker" },
  { value: "yacht_operator", label: "Yacht Operator" },
  { value: "residence_partner", label: "Residence Partner" },
  { value: "car_partner", label: "Car Partner" },
  { value: "exotic_car_vendor", label: "Exotic Car Vendor" },
  { value: "fleet_partner", label: "Fleet Partner" },
  { value: "chauffeur", label: "Chauffeur" },
  { value: "restaurant", label: "Restaurant" },
  { value: "nightlife", label: "Nightlife" },
  { value: "concierge", label: "Concierge" },
  { value: "photographer", label: "Photographer" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
];

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((o) => [o.value, o.label]),
);

const STATUSES = ["active", "preferred", "inactive"] as const;
type VendorStatus = (typeof STATUSES)[number];

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  preferred: "Preferred",
  inactive: "Inactive",
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-400 border-emerald-400/30",
  preferred: "text-amber-400 border-amber-400/30",
  inactive: "text-paper/30 border-paper/15",
};

type CategoryFilter = "all" | string;
type StatusFilterValue = "all" | VendorStatus;

// ─── Form ─────────────────────────────────────────────────────────────────────

type FormData = {
  name: string;
  category: string;
  contact_name: string;
  email: string;
  phone: string;
  notes: string;
  reliability_score: number | null;
  status: VendorStatus;
};

const EMPTY_FORM: FormData = {
  name: "",
  category: "jet_broker",
  contact_name: "",
  email: "",
  phone: "",
  notes: "",
  reliability_score: null,
  status: "active",
};

function vendorToForm(v: Vendor): FormData {
  return {
    name: v.name,
    category: v.category,
    contact_name: v.contact_name ?? "",
    email: v.email ?? "",
    phone: v.phone ?? "",
    notes: v.notes ?? "",
    reliability_score: v.reliability_score,
    status: v.status as VendorStatus,
  };
}

// ─── Reliability Stars ────────────────────────────────────────────────────────

function ReliabilityStars({
  score,
  onChange,
}: {
  score: number | null;
  onChange?: (n: number | null) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(score === n ? null : n)}
          className={`text-[13px] leading-none transition-colors ${
            onChange ? "cursor-pointer" : "cursor-default"
          } ${score != null && n <= score ? "text-amber-400" : "text-paper/20"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── Vendor Card ──────────────────────────────────────────────────────────────

function VendorCard({
  vendor,
  onEdit,
  onDeleteRequest,
  isDeletePending,
  onDeleteConfirm,
  onDeleteCancel,
}: {
  vendor: Vendor;
  onEdit: () => void;
  onDeleteRequest: () => void;
  isDeletePending: boolean;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}) {
  return (
    <div className="border-paper/10 border bg-graphite p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-[17px] text-paper">{vendor.name}</p>
          <p className="text-paper/40 mt-1 text-[9px] uppercase tracking-[0.18em]">
            {CATEGORY_LABELS[vendor.category] ?? vendor.category}
          </p>
        </div>
        <span
          className={`shrink-0 border px-2 py-0.5 text-[8px] uppercase tracking-[0.15em] ${
            STATUS_COLORS[vendor.status] ?? "border-paper/10 text-paper/30"
          }`}
        >
          {STATUS_LABELS[vendor.status] ?? vendor.status}
        </span>
      </div>

      {/* Contact */}
      <div className="mt-4 space-y-1">
        {vendor.contact_name && <p className="text-paper/65 text-[11px]">{vendor.contact_name}</p>}
        {vendor.email && (
          <a
            href={`mailto:${vendor.email}`}
            className="text-paper/50 block truncate text-[11px] transition-colors hover:text-paper"
          >
            {vendor.email}
          </a>
        )}
        {vendor.phone && (
          <a
            href={`tel:${vendor.phone}`}
            className="text-paper/50 block text-[11px] transition-colors hover:text-paper"
          >
            {vendor.phone}
          </a>
        )}
        {!vendor.contact_name && !vendor.email && !vendor.phone && (
          <p className="text-paper/25 text-[11px]">No contact info</p>
        )}
      </div>

      {/* Reliability */}
      {vendor.reliability_score != null && (
        <div className="mt-3">
          <ReliabilityStars score={vendor.reliability_score} />
        </div>
      )}

      {/* Actions */}
      <div className="border-paper/[0.07] mt-4 flex items-center gap-4 border-t pt-4">
        <button
          type="button"
          onClick={onEdit}
          className="text-paper/40 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          Edit
        </button>
        {isDeletePending ? (
          <span className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={onDeleteConfirm}
              className="text-[9px] uppercase tracking-[0.18em] text-red-400 transition-colors hover:text-red-300"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={onDeleteCancel}
              className="text-paper/25 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={onDeleteRequest}
            className="text-paper/15 ml-auto text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-red-400"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Vendor Drawer ────────────────────────────────────────────────────────────

function VendorDrawer({
  mode,
  vendor,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  vendor: Vendor | null;
  onClose: () => void;
  onSaved: (v: Vendor) => void;
}) {
  const [form, setForm] = useState<FormData>(
    mode === "edit" && vendor ? vendorToForm(vendor) : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      category: form.category,
      contact_name: form.contact_name.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      notes: form.notes.trim() || null,
      reliability_score: form.reliability_score,
      status: form.status,
    };

    try {
      let res: Response;
      if (mode === "create") {
        res = await fetch("/api/admin/vendors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/vendors/${vendor!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("failed");

      let saved: Vendor;
      if (mode === "create") {
        const json = await res.json();
        saved = json.vendor as Vendor;
      } else {
        saved = { ...vendor!, ...payload };
      }
      onSaved(saved);
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
          <p className="text-paper/40 text-[9px] uppercase tracking-[0.24em]">
            {mode === "create" ? "New Vendor" : "Edit Vendor"}
          </p>
          <h2 className="mt-1 font-display text-2xl text-paper">
            {mode === "create" ? "Add Vendor" : (vendor?.name ?? "")}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-paper/40 mt-1 shrink-0 text-lg transition-opacity hover:text-paper"
        >
          ✕
        </button>
      </div>

      <div className="mt-8 space-y-6">
        {/* Name */}
        <Field label="Name">
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Vendor or company name…"
            className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
          />
        </Field>

        {/* Category + Status */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="border-paper/15 focus:border-paper/35 w-full cursor-pointer appearance-none border-b bg-transparent py-2 pr-6 text-sm text-paper outline-none transition-colors"
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-graphite text-paper">
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="text-paper/30 pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[8px]">
                ↓
              </span>
            </div>
          </Field>

          <Field label="Status">
            <div className="relative inline-flex items-center">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as VendorStatus)}
                className={`w-full cursor-pointer appearance-none border bg-transparent py-1.5 pl-3 pr-7 text-[10px] uppercase tracking-[0.18em] outline-none transition-colors ${
                  STATUS_COLORS[form.status] ?? "border-paper/10 text-paper/40"
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
              <span className="text-paper/30 pointer-events-none absolute right-2 text-[8px]">
                ↓
              </span>
            </div>
          </Field>
        </div>

        {/* Contact name */}
        <Field label="Contact Name">
          <input
            type="text"
            value={form.contact_name}
            onChange={(e) => set("contact_name", e.target.value)}
            placeholder="Primary contact…"
            className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
          />
        </Field>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="contact@example.com"
              className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 …"
              className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
            />
          </Field>
        </div>

        {/* Reliability */}
        <Field label="Reliability Score">
          <ReliabilityStars
            score={form.reliability_score}
            onChange={(n) => set("reliability_score", n)}
          />
        </Field>

        {/* Notes */}
        <Field label="Notes">
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            placeholder="Internal notes about this vendor…"
            className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full resize-none border bg-transparent p-3 text-[12px] leading-relaxed text-paper outline-none transition-colors"
          />
        </Field>

        {error && <p className="text-[11px] text-red-400">{error}</p>}

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="w-full bg-paper py-3 text-[10px] uppercase tracking-[0.24em] text-ink transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {saving ? "Saving…" : mode === "create" ? "Add Vendor" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">{label}</p>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VendorsClient({ initialVendors }: { initialVendors: Vendor[] }) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Vendor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const usedCategories = useMemo(() => {
    const set = new Set(vendors.map((v) => v.category));
    return CATEGORY_OPTIONS.filter((o) => set.has(o.value));
  }, [vendors]);

  const visible = useMemo(() => {
    let rows = vendors;
    if (categoryFilter !== "all") rows = rows.filter((v) => v.category === categoryFilter);
    if (statusFilter !== "all") rows = rows.filter((v) => v.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      rows = rows.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          (v.contact_name ?? "").toLowerCase().includes(q) ||
          (v.email ?? "").toLowerCase().includes(q) ||
          (v.phone ?? "").includes(q),
      );
    }
    return rows;
  }, [vendors, categoryFilter, statusFilter, search]);

  const counts = useMemo(
    () => ({
      total: vendors.length,
      preferred: vendors.filter((v) => v.status === "preferred").length,
      active: vendors.filter((v) => v.status === "active").length,
    }),
    [vendors],
  );

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setDrawerMode("create");
  }, []);

  const openEdit = useCallback((v: Vendor) => {
    setEditTarget(v);
    setDrawerMode("edit");
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerMode(null);
    setEditTarget(null);
  }, []);

  const handleSaved = useCallback(
    (saved: Vendor) => {
      setVendors((prev) => {
        const exists = prev.some((v) => v.id === saved.id);
        const next = exists ? prev.map((v) => (v.id === saved.id ? saved : v)) : [...prev, saved];
        return next.sort((a, b) => a.name.localeCompare(b.name));
      });
      closeDrawer();
    },
    [closeDrawer],
  );

  async function handleDelete(id: string) {
    setDeleteError(null);
    const prev = vendors;
    setVendors((vs) => vs.filter((v) => v.id !== id));
    setDeleteTarget(null);
    try {
      const res = await fetch(`/api/admin/vendors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
    } catch {
      setVendors(prev);
      setDeleteError("Delete failed. Please try again.");
    }
  }

  return (
    <div>
      {/* Count cards */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        {[
          { label: "Total Vendors", value: counts.total },
          { label: "Preferred", value: counts.preferred },
          { label: "Active", value: counts.active },
        ].map((card) => (
          <div key={card.label} className="border-paper/10 border p-4">
            <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">{card.label}</p>
            <p className="mt-2 font-display text-3xl text-paper">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, contact, email…"
          className="border-paper/20 placeholder:text-paper/25 focus:border-paper/50 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors sm:max-w-xs"
        />
        <button
          type="button"
          onClick={openCreate}
          className="border-paper/25 text-paper/70 hover:border-paper/50 ml-auto border px-4 py-1.5 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          + Add Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="mt-5 space-y-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="text-paper/25 w-14 shrink-0 text-[9px] uppercase tracking-[0.18em]">
            Category
          </span>
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`text-[9px] uppercase tracking-[0.18em] transition-colors ${
              categoryFilter === "all" ? "text-paper" : "text-paper/30 hover:text-paper/60"
            }`}
          >
            All
          </button>
          {usedCategories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategoryFilter(c.value)}
              className={`text-[9px] uppercase tracking-[0.18em] transition-colors ${
                categoryFilter === c.value ? "text-paper" : "text-paper/30 hover:text-paper/60"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="text-paper/25 w-14 shrink-0 text-[9px] uppercase tracking-[0.18em]">
            Status
          </span>
          {(["all", "preferred", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`text-[9px] uppercase tracking-[0.18em] transition-colors ${
                statusFilter === s ? "text-paper" : "text-paper/30 hover:text-paper/60"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {deleteError && <p className="mt-3 text-[11px] text-red-400">{deleteError}</p>}

      {/* Cards */}
      {visible.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onEdit={() => openEdit(vendor)}
              onDeleteRequest={() => setDeleteTarget(vendor.id)}
              isDeletePending={deleteTarget === vendor.id}
              onDeleteConfirm={() => void handleDelete(vendor.id)}
              onDeleteCancel={() => setDeleteTarget(null)}
            />
          ))}
        </div>
      ) : (
        <p className="text-paper/35 mt-12 text-sm">
          {search.trim() || categoryFilter !== "all" || statusFilter !== "all"
            ? "No matching vendors."
            : "No vendors yet. Add your fulfillment partners to track jet, yacht, residence, and concierge bookings."}
        </p>
      )}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`bg-ink/70 fixed inset-0 z-40 transition-opacity duration-[360ms] ${
          drawerMode ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed right-0 top-0 z-50 h-screen w-full overflow-hidden bg-graphite shadow-2xl transition-transform duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[480px] ${
          drawerMode ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {drawerMode && (
          <VendorDrawer
            mode={drawerMode}
            vendor={editTarget}
            onClose={closeDrawer}
            onSaved={handleSaved}
          />
        )}
      </div>
    </div>
  );
}
