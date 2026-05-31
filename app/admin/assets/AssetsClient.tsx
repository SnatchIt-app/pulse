"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import type { Asset } from "./page";

// ─── Constants ────────────────────────────────────────────────────────────────

const ASSET_STATUSES = ["available", "reserved", "maintenance", "inactive"] as const;
type AssetStatus = (typeof ASSET_STATUSES)[number];

type InventoryFilter = "all" | "car" | "jet" | "yacht" | "residence";

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

const INVENTORY_FILTER_OPTIONS: { value: InventoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "car", label: "Cars" },
  { value: "jet", label: "Jets" },
  { value: "yacht", label: "Yachts" },
  { value: "residence", label: "Residences" },
];

// ─── Form State ───────────────────────────────────────────────────────────────

type FormData = {
  name: string;
  service_type: string;
  status: AssetStatus;
  description: string;
  cover_image: string;
  gallery: string[];
  public_url: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  service_type: "car",
  status: "available",
  description: "",
  cover_image: "",
  gallery: [],
  public_url: "",
};

function assetToForm(a: Asset): FormData {
  return {
    name: a.name,
    service_type: a.service_type,
    status: a.status as AssetStatus,
    description: a.description ?? "",
    cover_image: a.cover_image ?? "",
    gallery: a.gallery,
    public_url: a.public_url ?? "",
  };
}

// ─── Asset Card ───────────────────────────────────────────────────────────────

function AssetCard({
  asset,
  onEdit,
  onDeleteRequest,
  isDeletePending,
  onDeleteConfirm,
  onDeleteCancel,
}: {
  asset: Asset;
  onEdit: () => void;
  onDeleteRequest: () => void;
  isDeletePending: boolean;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}) {
  return (
    <div className="group border border-paper/10 bg-graphite">
      {/* Cover image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-ink">
        {asset.cover_image ? (
          <Image
            src={asset.cover_image}
            alt={asset.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-[9px] uppercase tracking-[0.22em] text-paper/15">No Image</p>
          </div>
        )}
        {/* Status badge */}
        <span
          className={`absolute right-3 top-3 border px-2 py-0.5 text-[8px] uppercase tracking-[0.15em] backdrop-blur-sm ${
            STATUS_COLORS[asset.status] ?? "border-paper/10 text-paper/30"
          } bg-ink/60`}
        >
          {STATUS_LABELS[asset.status] ?? asset.status}
        </span>
      </div>

      {/* Card body */}
      <div className="p-4">
        <p className="font-display text-[17px] leading-snug text-paper">{asset.name}</p>
        <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-paper/40">
          {SERVICE_LABELS[asset.service_type] ?? asset.service_type}
        </p>
        {asset.description && (
          <p className="mt-2 text-[10px] leading-relaxed text-paper/35">{asset.description}</p>
        )}

        {/* Gallery count */}
        {asset.gallery.length > 0 && (
          <p className="mt-1 text-[9px] text-paper/20">
            +{asset.gallery.length} gallery image{asset.gallery.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-4 border-t border-paper/[0.07] pt-4">
          <button
            type="button"
            onClick={onEdit}
            className="text-[9px] uppercase tracking-[0.18em] text-paper/40 transition-colors hover:text-paper"
          >
            Edit
          </button>
          {asset.public_url && (
            <a
              href={asset.public_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] uppercase tracking-[0.18em] text-paper/25 transition-colors hover:text-paper/60"
            >
              View ↗
            </a>
          )}
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
                className="text-[9px] uppercase tracking-[0.18em] text-paper/25 transition-colors hover:text-paper"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={onDeleteRequest}
              className="ml-auto text-[9px] uppercase tracking-[0.18em] text-paper/15 transition-colors hover:text-red-400"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
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
  onSaved: (saved: Asset) => void;
}) {
  const [form, setForm] = useState<FormData>(
    mode === "edit" && asset ? assetToForm(asset) : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image UI local state
  const [showCoverInput, setShowCoverInput] = useState(false);
  const [newGalleryPath, setNewGalleryPath] = useState("");
  const [showGalleryInput, setShowGalleryInput] = useState(false);

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addGalleryImage() {
    const path = newGalleryPath.trim();
    if (!path) return;
    setField("gallery", [...form.gallery, path]);
    setNewGalleryPath("");
    setShowGalleryInput(false);
  }

  function removeGalleryImage(index: number) {
    setField(
      "gallery",
      form.gallery.filter((_, i) => i !== index),
    );
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
      service_type: form.service_type,
      status: form.status,
      description: form.description.trim() || null,
      cover_image: form.cover_image.trim() || null,
      gallery: form.gallery,
      public_url: form.public_url.trim() || null,
    };

    try {
      let res: Response;
      if (mode === "create") {
        res = await fetch("/api/admin/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/assets/${asset!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("server_error");

      let savedAsset: Asset;
      if (mode === "create") {
        const json = await res.json();
        savedAsset = {
          id: String(json.id),
          ...payload,
          slug: null,
          source_inventory_type: null,
          source_slug: null,
          created_at: new Date().toISOString(),
        };
      } else {
        savedAsset = { ...asset!, ...payload };
      }

      onSaved(savedAsset);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const isInventoryAsset = mode === "edit" && !!asset?.source_slug;

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 md:p-8">
      {/* Header */}
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
          className="mt-1 shrink-0 text-lg text-paper/40 transition-opacity hover:text-paper"
        >
          ✕
        </button>
      </div>

      {/* Inventory source badge */}
      {isInventoryAsset && (
        <div className="mt-5 border border-paper/10 p-3">
          <p className="text-[9px] uppercase tracking-[0.18em] text-paper/35">
            Inventory asset ·{" "}
            <span className="normal-case tracking-normal text-paper/20">
              {asset?.source_inventory_type} / {asset?.source_slug}
            </span>
          </p>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {/* Name */}
        <DrawerField label="Name">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="e.g. Lamborghini Urus, Ferretti 780…"
            className="w-full border-b border-paper/15 bg-transparent py-2 text-sm text-paper outline-none transition-colors placeholder:text-paper/20 focus:border-paper/35"
          />
        </DrawerField>

        {/* Service + Status side by side */}
        <div className="grid grid-cols-2 gap-4">
          <DrawerField label="Service">
            <div className="relative">
              <select
                value={form.service_type}
                onChange={(e) => setField("service_type", e.target.value)}
                className="border-paper/15 focus:border-paper/35 w-full cursor-pointer appearance-none border-b bg-transparent py-2 pr-6 text-sm text-paper outline-none transition-colors"
              >
                {SERVICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-graphite text-paper">
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[8px] text-paper/30">
                ↓
              </span>
            </div>
          </DrawerField>

          <DrawerField label="Status">
            <div className="relative inline-flex items-center">
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value as AssetStatus)}
                className={`cursor-pointer appearance-none border bg-transparent py-1.5 pl-3 pr-7 text-[10px] uppercase tracking-[0.18em] outline-none transition-colors ${
                  STATUS_COLORS[form.status] ?? "border-paper/10 text-paper/40"
                }`}
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
              <span className="pointer-events-none absolute right-2 text-[8px] text-paper/30">
                ↓
              </span>
            </div>
          </DrawerField>
        </div>

        {/* ── Cover Image ──────────────────────────────────────────────── */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.22em] text-paper/35">Cover Image</p>
            {form.cover_image && !showCoverInput && (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCoverInput(true)}
                  className="text-[9px] uppercase tracking-[0.18em] text-paper/35 transition-colors hover:text-paper"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setField("cover_image", "");
                    setShowCoverInput(false);
                  }}
                  className="text-[9px] uppercase tracking-[0.18em] text-paper/20 transition-colors hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Thumbnail preview */}
          {form.cover_image && (
            <div className="relative mb-3 h-32 w-full overflow-hidden bg-ink">
              <Image
                src={form.cover_image}
                alt="Cover preview"
                fill
                sizes="480px"
                className="object-cover"
              />
            </div>
          )}

          {/* Path input — shown when no image or changing */}
          {(!form.cover_image || showCoverInput) && (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={form.cover_image}
                onChange={(e) => setField("cover_image", e.target.value)}
                onBlur={() => {
                  if (form.cover_image.trim()) setShowCoverInput(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") setShowCoverInput(false);
                }}
                placeholder="/fleet/slug/cover.jpg"
                autoFocus={showCoverInput}
                className="flex-1 border-b border-paper/15 bg-transparent py-2 font-mono text-[11px] text-paper/70 outline-none transition-colors focus:border-paper/35 focus:text-paper"
              />
              {showCoverInput && (
                <button
                  type="button"
                  onClick={() => setShowCoverInput(false)}
                  className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-paper/30 transition-colors hover:text-paper"
                >
                  Done
                </button>
              )}
            </div>
          )}

          {/* Placeholder — no image and input hidden */}
          {!form.cover_image && !showCoverInput && (
            <button
              type="button"
              onClick={() => setShowCoverInput(true)}
              className="flex w-full items-center justify-center border border-paper/15 py-6 text-[10px] uppercase tracking-[0.2em] text-paper/25 transition-colors hover:border-paper/30 hover:text-paper/50"
            >
              + Set Cover Image
            </button>
          )}
        </div>

        {/* ── Gallery ─────────────────────────────────────────────────── */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.22em] text-paper/35">Gallery</p>
            {form.gallery.length > 0 && (
              <span className="text-[9px] text-paper/20">
                {form.gallery.length} image{form.gallery.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Thumbnails grid */}
          {form.gallery.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-2">
              {form.gallery.map((path, i) => (
                <div key={i} className="group relative">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                    <Image
                      src={path}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute right-0.5 top-0.5 bg-ink/80 px-1.5 py-0.5 text-[9px] text-paper/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add image input */}
          {showGalleryInput ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newGalleryPath}
                onChange={(e) => setNewGalleryPath(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addGalleryImage();
                  if (e.key === "Escape") {
                    setNewGalleryPath("");
                    setShowGalleryInput(false);
                  }
                }}
                placeholder="/fleet/slug/photo.jpg"
                autoFocus
                className="flex-1 border-b border-paper/15 bg-transparent py-2 font-mono text-[11px] text-paper/70 outline-none transition-colors focus:border-paper/35 focus:text-paper"
              />
              <button
                type="button"
                onClick={addGalleryImage}
                className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-paper/40 transition-colors hover:text-paper"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewGalleryPath("");
                  setShowGalleryInput(false);
                }}
                className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-paper/20 transition-colors hover:text-paper"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowGalleryInput(true)}
              className="text-[9px] uppercase tracking-[0.18em] text-paper/25 transition-colors hover:text-paper/60"
            >
              + Add Image
            </button>
          )}
        </div>

        {/* ── Notes ───────────────────────────────────────────────────── */}
        <DrawerField label="Notes">
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={3}
            placeholder="Internal notes about this asset…"
            className="w-full resize-none border border-paper/15 bg-transparent p-3 text-[12px] leading-relaxed text-paper outline-none transition-colors placeholder:text-paper/20 focus:border-paper/35"
          />
        </DrawerField>

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

function DrawerField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[9px] uppercase tracking-[0.22em] text-paper/35">{label}</p>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AssetsClient({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [filter, setFilter] = useState<InventoryFilter>("all");
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Asset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const visible = useMemo(() => {
    if (filter === "all") return assets;
    return assets.filter((a) => a.source_inventory_type === filter);
  }, [assets, filter]);

  const counts = useMemo(
    () => ({
      all: assets.length,
      car: assets.filter((a) => a.source_inventory_type === "car").length,
      jet: assets.filter((a) => a.source_inventory_type === "jet").length,
      yacht: assets.filter((a) => a.source_inventory_type === "yacht").length,
      residence: assets.filter((a) => a.source_inventory_type === "residence").length,
    }),
    [assets],
  );

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

  async function handleSync() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/admin/assets/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setSyncMsg({ ok: false, text: data.error ?? "Sync failed — check server logs." });
        return;
      }

      // Refresh assets list
      const refreshed = await fetch("/api/admin/assets");
      const refreshData = await refreshed.json();
      if (refreshData.ok) {
        setAssets(
          (refreshData.assets as Asset[]).map((a) => ({
            ...a,
            gallery: Array.isArray(a.gallery) ? a.gallery : [],
          })),
        );
      }

      setSyncMsg({
        ok: true,
        text: `Synced — ${data.inserted} new, ${data.updated} updated.`,
      });
    } catch (err) {
      setSyncMsg({ ok: false, text: "Sync failed — check server logs." });
      console.error("[assets] sync error:", err);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(null), 5000);
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mt-8 flex flex-wrap items-center gap-y-3">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {INVENTORY_FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`transition-colors ${
                filter === f.value
                  ? "border-b border-paper pb-px text-[10px] uppercase tracking-[0.2em] text-paper"
                  : "text-[10px] uppercase tracking-[0.2em] text-paper/35 hover:text-paper/60"
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-[9px] opacity-50">({counts[f.value]})</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-3">
          {syncMsg && (
            <p className={`text-[10px] ${syncMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
              {syncMsg.text}
            </p>
          )}
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="border border-paper/20 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-paper/50 transition-colors hover:border-paper/40 hover:text-paper disabled:opacity-40"
          >
            {syncing ? "Syncing…" : "Sync Inventory"}
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="border border-paper/25 px-4 py-1.5 text-[9px] uppercase tracking-[0.18em] text-paper/70 transition-colors hover:border-paper/50 hover:text-paper"
          >
            + Add
          </button>
        </div>
      </div>

      {deleteError && <p className="mt-3 text-[11px] text-red-400">{deleteError}</p>}

      {/* Card grid */}
      {visible.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onEdit={() => openEdit(asset)}
              onDeleteRequest={() => setDeleteTarget(asset.id)}
              isDeletePending={deleteTarget === asset.id}
              onDeleteConfirm={() => handleDelete(asset.id)}
              onDeleteCancel={() => setDeleteTarget(null)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-sm text-paper/35">
            {filter !== "all" ? "No assets in this category." : "No assets yet."}
          </p>
          {filter === "all" && assets.length === 0 && (
            <p className="mt-2 text-[11px] text-paper/20">
              Click{" "}
              <button
                type="button"
                onClick={handleSync}
                className="underline transition-opacity hover:opacity-60"
              >
                Sync Inventory
              </button>{" "}
              to import all public inventory automatically.
            </p>
          )}
        </div>
      )}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink/70 transition-opacity duration-[360ms] ${
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
