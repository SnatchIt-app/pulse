import Link from "next/link";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import CarCard from "./CarCard";
import PublishedAssetCard from "./PublishedAssetCard";
import { cars } from "@/data/inventory/cars";
import {
  dedupeAgainstFlatFile,
  getPublishedAssetsByService,
  type PublishedAsset,
} from "@/lib/inventory/published-assets";

// Pinned flat-file cars on the homepage rail. Always rendered (slugs must
// exist in data/inventory/cars.ts). CRM-published cars with
// `show_on_homepage = true` are merged in and the combined set is sorted by
// featured DESC, public_sort_order ASC, name ASC.
const PINNED_SLUGS = [
  "Lamborghini-Urus-GreyBrown",
  "Lamborghini-Huracan-Spyder-BlackBlack",
  "McLaren-GT-GreenBlack",
] as const;

const pinned = PINNED_SLUGS.map((slug) => {
  const car = cars.find((c) => c.slug === slug);
  if (!car) throw new Error(`[FeaturedFleet] slug not found in inventory: ${slug}`);
  return car;
});

type CarItem = (typeof cars)[number];
type MergedItem =
  | {
      kind: "flatfile";
      key: string;
      data: CarItem;
      featured: boolean;
      sortOrder: number;
      name: string;
    }
  | {
      kind: "published";
      key: string;
      data: PublishedAsset;
      featured: boolean;
      sortOrder: number;
      name: string;
    };

export default async function FeaturedFleet() {
  const homepageCars = dedupeAgainstFlatFile(
    await getPublishedAssetsByService("car", { homepageOnly: true }),
    pinned.map((c) => c.slug),
  );

  const merged: MergedItem[] = [
    ...pinned.map<MergedItem>((c) => ({
      kind: "flatfile",
      key: `f-${c.slug}`,
      data: c,
      featured: false,
      sortOrder: 0,
      name: `${c.make} ${c.model}`,
    })),
    ...homepageCars.map<MergedItem>((p) => ({
      kind: "published",
      key: `p-${p.id}`,
      data: p,
      featured: p.public_featured,
      sortOrder: p.public_sort_order,
      name: p.name,
    })),
  ].sort((a, b) => {
    const f = Number(b.featured) - Number(a.featured);
    if (f !== 0) return f;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.name.localeCompare(b.name);
  });

  return (
    <Section className="bg-paper">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">The Fleet</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] sm:text-5xl md:text-6xl">
              Exotic and supercars, ready in Miami.
            </h2>
          </div>
          <Link
            href="/fleet"
            className="text-ink/80 shrink-0 text-[11px] uppercase tracking-[0.22em] underline underline-offset-8 hover:text-ink"
          >
            View the full fleet →
          </Link>
        </div>
        <MotionStagger className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {merged.map((item) => (
            <MotionStaggerItem key={item.key}>
              {item.kind === "flatfile" ? (
                <CarCard car={item.data} />
              ) : (
                <PublishedAssetCard asset={item.data} />
              )}
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </Container>
    </Section>
  );
}
