"use client";

import { useState, useMemo, useCallback, useRef } from "react";
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
    <div className="border-paper/10 group border bg-graphite">
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
            <p className="text-paper/15 text-[9px] uppercase tracking-[0.22em]">No Image</p>
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
        <p className="text-paper/40 mt-1 text-[9px] uppercase tracking-[0.18em]">
          {SERVICE_LABELS[asset.service_type] ?? asset.service_type}
        </p>
        {asset.description && (
          <p className="text-paper/35 mt-2 text-[10px] leading-relaxed">{asset.description}</p>
        )}

        {/* Gallery count */}
        {asset.gallery.length > 0 && (
          <p className="text-paper/20 mt-1 text-[9px]">
            +{asset.gallery.length} gallery image{asset.gallery.length !== 1 ? "s" : ""}
          </p>
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
          {asset.public_url && (
            <a
              href={asset.public_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper/25 hover:text-paper/60 text-[9px] uppercase tracking-[0.18em] transition-colors"
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

  // Image upload state
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function uploadFile(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/assets/upload", { method: "POST", body });
    const json = await res.json().catch(() => ({}) as { url?: string; message?: string });
    if (!res.ok || !json?.url) {
      throw new Error(
        res.status === 403
          ? "You do not have permission to upload images."
          : (json?.message ?? "Image upload failed. Please try again."),
      );
    }
    return json.url as string;
  }

  async function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImageError(null);
    setCoverUploading(true);
    try {
      const url = await uploadFile(file);
      setField("cover_image", url);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Image upload failed. Please try again.");
    } finally {
      setCoverUploading(false);
    }
  }

  async function handleGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setImageError(null);
    setGalleryUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        urls.push(await uploadFile(file));
      }
      setForm((f) => ({ ...f, gallery: [...f.gallery, ...urls] }));
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Image upload failed. Please try again.");
    } finally {
      setGalleryUploading(false);
    }
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

      if (!res.ok) {
        type ApiError = {
          error?: string;
          message?: string;
          issues?: Array<{ path: string; message: string }>;
        };
        const empty: ApiError = {};
        const data: ApiError = await res.json().catch(() => empty);
        const detail =
          data.issues && data.issues.length > 0
            ? data.issues
                .map((i: { path: string; message: string }) => `${i.path}: ${i.message}`)
                .join("; ")
            : null;
        setError(
          data.error === "read_only"
            ? "Read-only access — you cannot save changes."
            : (detail ?? data.message ?? "Could not save the asset. Please try again."),
        );
        return; // keep the drawer open with all typed values intact
      }

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
          className="text-paper/40 mt-1 shrink-0 text-lg transition-opacity hover:text-paper"
        >
          ✕
        </button>
      </div>

      {/* Inventory asset note (no slugs/paths) */}
      {isInventoryAsset && (
        <div className="border-paper/10 mt-5 border p-3">
          <p className="text-paper/35 text-[9px] uppercase tracking-[0.18em]">
            Synced from inventory
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
            className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full border-b bg-transparent py-2 text-sm text-paper outline-none transition-colors"
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
              <span className="text-paper/30 pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[8px]">
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
              <span className="text-paper/30 pointer-events-none absolute right-2 text-[8px]">
                ↓
              </span>
            </div>
          </DrawerField>
        </div>

        {/* ── Cover Image ──────────────────────────────────────────────── */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">Cover Image</p>
            {form.cover_image && (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={coverUploading}
                  className="text-paper/35 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper disabled:opacity-40"
                >
                  {coverUploading ? "Uploading…" : "Change Image"}
                </button>
                <button
                  type="button"
                  onClick={() => setField("cover_image", "")}
                  disabled={coverUploading}
                  className="text-paper/20 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-red-400 disabled:opacity-40"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* Hidden input shared by Upload / Change */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverFile}
            className="hidden"
          />

          {/* Thumbnail preview */}
          {form.cover_image ? (
            <div className="relative mb-1 h-32 w-full overflow-hidden bg-ink">
              <Image
                src={form.cover_image}
                alt="Cover preview"
                fill
                sizes="480px"
                className="object-cover"
              />
            </div>
          ) : (
            <label
              className={`border-paper/15 text-paper/25 hover:border-paper/30 hover:text-paper/50 flex w-full cursor-pointer items-center justify-center border py-8 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                coverUploading ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {coverUploading ? "Uploading…" : "Upload Image"}
              <input type="file" accept="image/*" onChange={handleCoverFile} className="hidden" />
            </label>
          )}
        </div>

        {/* ── Gallery ─────────────────────────────────────────────────── */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-paper/35 text-[9px] uppercase tracking-[0.22em]">Gallery</p>
            {form.gallery.length > 0 && (
              <span className="text-paper/20 text-[9px]">
                {form.gallery.length} image{form.gallery.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Thumbnails grid */}
          {form.gallery.length > 0 ? (
            <div className="mb-3 grid grid-cols-3 gap-2">
              {form.gallery.map((url, i) => (
                <div key={i} className="group relative">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                    <Image src={url} alt="" fill sizes="160px" className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="bg-ink/80 text-paper/40 absolute right-0.5 top-0.5 px-1.5 py-0.5 text-[9px] opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-paper/20 mb-3 text-[10px]">No gallery images yet.</p>
          )}

          {/* Add images */}
          <label
            className={`text-paper/35 inline-flex cursor-pointer text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper ${
              galleryUploading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {galleryUploading ? "Uploading…" : "+ Add Images"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryFiles}
              className="hidden"
            />
          </label>
        </div>

        {imageError && <p className="text-[11px] text-red-400">{imageError}</p>}

        {/* ── Notes ───────────────────────────────────────────────────── */}
        <DrawerField label="Notes">
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={3}
            placeholder="Internal notes about this asset…"
            className="border-paper/15 placeholder:text-paper/20 focus:border-paper/35 w-full resize-none border bg-transparent p-3 text-[12px] leading-relaxed text-paper outline-none transition-colors"
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
      <p className="text-paper/35 mb-2 text-[9px] uppercase tracking-[0.22em]">{label}</p>
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

  // Category filter is keyed on service_type (canonical, populated for BOTH
  // manual rows and synced rows). source_inventory_type is set only by sync.
  const visible = useMemo(() => {
    if (filter === "all") return assets;
    return assets.filter((a) => a.service_type === filter);
  }, [assets, filter]);

  const counts = useMemo(
    () => ({
      all: assets.length,
      car: assets.filter((a) => a.service_type === "car").length,
      jet: assets.filter((a) => a.service_type === "jet").length,
      yacht: assets.filter((a) => a.service_type === "yacht").length,
      residence: assets.filter((a) => a.service_type === "residence").length,
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
                  : "text-paper/35 hover:text-paper/60 text-[10px] uppercase tracking-[0.2em]"
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
            className="border-paper/20 text-paper/50 hover:border-paper/40 border px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper disabled:opacity-40"
          >
            {syncing ? "Syncing…" : "Sync Inventory"}
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="border-paper/25 text-paper/70 hover:border-paper/50 border px-4 py-1.5 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Admin-only note — CRM assets are internal */}
      <p className="text-paper/30 mt-3 text-[10px] leading-relaxed">
        CRM assets are used for bookings and operations. Public website inventory is managed
        separately.
      </p>

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
          <p className="text-paper/35 text-sm">
            {filter !== "all" ? "No assets in this category." : "No assets yet."}
          </p>
          {filter === "all" && assets.length === 0 && (
            <p className="text-paper/20 mt-2 text-[11px]">
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
