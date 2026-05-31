import type { Yacht } from "@/types/inventory";

// Internal source references (NOT in compiled output — internal ops only):
//   ferretti-780  →  internal ref: HSY
//   azimut-72     →  vessel name: Mancusa
//   princess-88   →  vessel name: Praying For Overtime
//   sunseeker-92  →  vessel name: RMM JOB
//
// Image paths retain original directory names (filesystem identifiers).
// Old slugs redirect to new clean slugs via next.config.ts redirects.

export const yachts: Yacht[] = [
  {
    slug: "ferretti-780",
    make: "Ferretti",
    model: "780",
    quote_only: true,
    asset_count: 3,
    images: ["/yachts/ferretti-780-hsy/cover.jpg"],
  },
  {
    slug: "azimut-72",
    make: "Azimut",
    model: "72",
    length_ft: 72,
    quote_only: true,
    asset_count: 4,
    images: ["/yachts/azimut-72-mancusa/cover.jpg"],
  },
  {
    slug: "princess-88",
    make: "Princess",
    model: "88",
    length_ft: 88,
    quote_only: true,
    asset_count: 3,
    images: ["/yachts/princess-88-praying-for-overtime/cover.jpg"],
  },
  {
    slug: "sunseeker-92",
    make: "Sunseeker",
    model: "92",
    length_ft: 92,
    quote_only: true,
    asset_count: 5,
    images: ["/yachts/sunseeker-92-rmm-job/cover.jpg"],
  },
];
