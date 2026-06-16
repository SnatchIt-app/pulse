import { getSupabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import AssetsClient from "./AssetsClient";

export type Asset = {
  id: string;
  name: string;
  service_type: string;
  status: string;
  description: string | null;
  slug: string | null;
  cover_image: string | null;
  gallery: string[];
  public_url: string | null;
  source_inventory_type: string | null;
  source_slug: string | null;
  created_at: string;
  // Phase: public publishing
  is_public: boolean;
  public_brand: string | null;
  public_subtitle: string | null;
  public_description: string | null;
  public_sort_order: number;
  public_featured: boolean;
  show_on_homepage: boolean;
};

export default async function AssetsPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return (
      <main className="px-8 py-16">
        <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse CRM · Assets</p>
        <h1 className="mt-3 font-display text-4xl text-paper">Assets</h1>
        <p className="text-paper/50 mt-10 text-sm">Supabase env vars not configured.</p>
      </main>
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: assets, error } = await supabase
    .from("assets")
    .select(
      "id, name, service_type, status, description, slug, cover_image, gallery, public_url, source_inventory_type, source_slug, created_at, is_public, public_brand, public_subtitle, public_description, public_sort_order, public_featured, show_on_homepage",
    )
    .order("source_inventory_type", { nullsFirst: false })
    .order("name");

  return (
    <main className="min-h-screen px-6 pb-24 pt-16 md:px-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">Pulse CRM</p>
          <h1 className="mt-2 font-display text-4xl text-paper">Assets</h1>
        </div>
        <Link
          href="/admin"
          className="text-paper/35 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-paper"
        >
          ← Admin
        </Link>
      </div>

      {error && <p className="mt-8 text-sm text-red-400">Database error: {error.message}</p>}
      {!error && (
        <AssetsClient
          initialAssets={(assets ?? []).map((a) => ({
            ...a,
            gallery: Array.isArray(a.gallery) ? (a.gallery as string[]) : [],
            is_public: Boolean(a.is_public),
            public_brand: a.public_brand ?? null,
            public_subtitle: a.public_subtitle ?? null,
            public_description: a.public_description ?? null,
            public_sort_order: typeof a.public_sort_order === "number" ? a.public_sort_order : 0,
            public_featured: Boolean(a.public_featured),
            show_on_homepage: Boolean(a.show_on_homepage),
          }))}
        />
      )}
    </main>
  );
}
