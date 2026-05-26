// Phase 2 homepage preview only. Real residence inventory ships from Supabase in
// Phase 3.5 via getPublicResidences() — vendor/source fields are never present here.
import { HOMEPAGE_MEDIA } from "./media";

export type ResidencePreviewItem = {
  slug: string;
  title: string;
  publicLocationLabel: string;
  bedrooms: number;
  maxGuests: number;
  nightlyRateFrom: number;
  image: string;
  alt: string;
};

export const RESIDENCES_PREVIEW: ReadonlyArray<ResidencePreviewItem> = [
  {
    slug: "star-island-5br-villa",
    title: "Star Island Villa",
    publicLocationLabel: "Star Island",
    bedrooms: 5,
    maxGuests: 10,
    nightlyRateFrom: 4800,
    image: HOMEPAGE_MEDIA.residence1.placeholder,
    alt: HOMEPAGE_MEDIA.residence1.alt,
  },
  {
    slug: "south-of-fifth-penthouse",
    title: "South of Fifth Penthouse",
    publicLocationLabel: "South of Fifth",
    bedrooms: 3,
    maxGuests: 6,
    nightlyRateFrom: 2200,
    image: HOMEPAGE_MEDIA.residence2.placeholder,
    alt: HOMEPAGE_MEDIA.residence2.alt,
  },
  {
    slug: "coral-gables-4br-house",
    title: "Coral Gables House",
    publicLocationLabel: "Coral Gables",
    bedrooms: 4,
    maxGuests: 8,
    nightlyRateFrom: 1800,
    image: HOMEPAGE_MEDIA.residence3.placeholder,
    alt: HOMEPAGE_MEDIA.residence3.alt,
  },
];
