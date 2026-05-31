"use client";

import { useState, useCallback } from "react";
import type { Asset } from "./page";

// ─── Constants ────────────────────────────────────────────────────────────────

const ASSET_STATUSES = ["available", "reserved", "maintenance", "inactive"] as const;
type AssetStatus = (typeof ASSET_STATUSES)[number];

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  maintenance: "Maintenance",
  inactive: "Inactive",
};

const STATUS_COLORS: Record<string, string> = {
  available: "text-emerald-400 border-emerald-400/30",
  reserved: "text-amber-400 border-amber-400/30",
  maintenance: "text-sky-300 border-sky-300/30",
  inactive: "text-paper/30 border-paper/15",
};

const SERVICE_OPTIONS = [
  { value: "car", label: "Exotic Car" },
  { value: "yacht", label: "Yacht" },
  { value: "jet", label: "Private Jet" },
  { value: "jet_ski", label: "Jet Skis" },
  { value: "chauffeur", label: "Chauffeur" },
  { value: "restaurant", label: "Dining" },
  { value: "nightlife", label: "Nightlife" },
  { value: "concierge", label: "Concierge" },
  { value: "residence", label: "Residence" },
  { value: "other", label: "Other" },
];

const SERVICE_LABELS: Record<string, string> = Object.fromEntries(
  SERVICE_OPTIONS.map((o) => [o.value, o.label]),
);

// ─── Form State ───────────────────────────────────────────────────────────────

type FormData = {
  name: string;
  service_type: string;
  status: AssetStatus;
  description: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  service_type: "car",
  status: "available",
  description: "",
};

function assetToForm(a: Asset): FormData {
  return {
    name: a.name,
    service_type: a.service_type,
    status: a.status as AssetStatus,
    description: a.description ?? "",
  };
}

// ─── Asset Drawer ─────────────────────────────────────────────────────────────

function AssetDrawer({
  mode,
  asset,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  asset: Asset | null;
  onClose: () => void;
  onSaved: (asset: Asset) => void;
}) {
  const [form, setForm] = useState<FormData>(
    mode === "edit" && asset ? assetToForm(asset) : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      let res: Response;
      if (mode === "create") {
        res = await fetch("/api/admin/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            service_type: form.service_type,
            status: form.status,
            description: form.description.trim() || undefined,
          }),
        });
      } else {
        res = await fetch(`/api/admin/assets/${asset!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            service_type: form.service_type,
            status: form.status,
            description: form.description.trim() || null,
          }),
        });
      }

      if (!res.ok) throw new Error("server_error");

      const saved: Asset =
        mode === "create"
          ? {
              id: (await res.json()).id,
              name: form.name.trim(),
              service_type: form.service_type,
              status: form.status,
              description: form.description.trim() || null,
              created_at: new Date().toISOString(),
            }
          : { ...asset!, ...form, description: form.description.trim() || null };

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
            {mode === "create" ? "New Asset" : "Edit Asset"}
          </p>
          <h2 className="mt-1 font-display text-2xl text-paper">
            {mode === "create" ? "Add Asset" : (asset?.name ?? "")}
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
        <div>
          <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Name</p>
          <input
            type="text"
            value={form.name}
            onChange={field("name")}
            placeholder="e.g. Lamborghini Urus, Ferretti 780…"
            className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
          />
        </div>

        {/* Service Type */}
        <div>
          <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Service Type</p>
          <div className="relative inline-flex w-full items-center">
            <select
              value={form.service_type}
              onChange={field("service_type")}
              className="border-paper/15 focus:border-paper/35 w-full cursor-pointer appearance-none border-b bg-transparent py-2 pr-6 text-sm text-paper outline-none transition-colors"
            >
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-graphite text-paper">
                  {o.label}
                </option>
              ))}
            </select>
            <span className="text-paper/30 pointer-events-none absolute right-1 text-[8px]">↓</span>
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">Status</p>
          <div className="relative inline-flex items-center">
            <select
              value={form.status}
              onChange={field("status")}
              className={`cursor-pointer appearance-none border bg-transparent py-1.5 pl-3 pr-7 text-[10px] uppercase tracking-[0.18em] outline-none transition-colors ${STATUS_COLORS[form.status]}`}
            >
              {ASSET_STATUSES.map((s) => (
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

        {/* Description */}
        <div>
          <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">
            Description <span className="text-paper/20 normal-case tracking-normal">optional</span>
          </p>
          <textarea
            value={form.description}
            onChange={field("description")}
            rows={3}
            placeholder="Internal notes about this asset…"
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
          {saving ? "Saving…" : mode === "create" ? "Add Asset" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AssetsClient({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Asset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setDrawerMode("create");
  }, []);

  const openEdit = useCallback((asset: Asset) => {
    setEditTarget(asset);
    setDrawerMode("edit");
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerMode(null);
    setEditTarget(null);
  }, []);

  const handleSaved = useCallback(
    (saved: Asset) => {
      if (drawerMode === "create") {
        setAssets((prev) => [...prev, saved].sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        setAssets((prev) => prev.map((a) => (a.id === saved.id ? saved : a)));
      }
      closeDrawer();
    },
    [drawerMode, closeDrawer],
  );

  async function handleDelete(id: string) {
    setDeleteError(null);
    const prev = assets;
    setAssets((a) => a.filter((x) => x.id !== id));
    setDeleteTarget(null);

    try {
      const res = await fetch(`/api/admin/assets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
    } catch {
      setAssets(prev);
      setDeleteError("Delete failed. Please try again.");
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-paper/35 text-[10px] uppercase tracking-[0.2em]">
          {assets.length} asset{assets.length !== 1 ? "s" : ""}
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="border-paper/25 text-paper/70 hover:border-paper/50 border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-paper"
        >
          + Add Asset
        </button>
      </div>

      {deleteError && <p className="mt-3 text-[11px] text-red-400">{deleteError}</p>}

      {/* Table */}
      {assets.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-paper/10 border-b">
                {["Name", "Service", "Status", "Description", ""].map((h) => (
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
              {assets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-paper/[0.06] hover:bg-paper/[0.03] border-b transition-colors"
                >
                  <td className="whitespace-nowrap py-4 pr-6 font-display text-base text-paper">
                    {asset.name}
                  </td>
                  <td className="whitespace-nowrap py-4 pr-6">
                    <span className="text-paper/50 text-[9px] uppercase tracking-[0.18em]">
                      {SERVICE_LABELS[asset.service_type] ?? asset.service_type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-4 pr-6">
                    <span
                      className={`border px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] ${STATUS_COLORS[asset.status] ?? "border-paper/10 text-paper/30"}`}
                    >
                      {STATUS_LABELS[asset.status] ?? asset.status}
                    </span>
                  </td>
                  <td className="text-paper/45 max-w-xs py-4 pr-6 text-[11px]">
                    {asset.description
                      ? asset.description.length > 80
                        ? asset.description.slice(0, 80) + "…"
                        : asset.description
                      : "—"}
                  </td>
                  <td className="whitespace-nowrap py-4 pr-2">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => openEdit(asset)}
                        className="text-paper/30 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
                      >
                        Edit
                      </button>
                      {deleteTarget === asset.id ? (
                        <span className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(asset.id)}
                            className="text-[9px] uppercase tracking-[0.18em] text-red-400 transition-colors hover:text-red-300"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(null)}
                            className="text-paper/25 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(asset.id)}
                          className="text-paper/20 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-red-400"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-paper/35 mt-12 text-sm">
          No assets yet. Add your first asset to enable conflict detection on bookings.
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
          <AssetDrawer
            mode={drawerMode}
            asset={editTarget}
            onClose={closeDrawer}
            onSaved={handleSaved}
          />
        )}
      </div>
    </div>
  );
}
