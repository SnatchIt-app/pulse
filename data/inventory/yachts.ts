import type { Yacht } from "@/types/inventory";

export const yachts: Yacht[] = [
  {
    slug: "ferretti-780-hsy",
    make: "Ferretti",
    model: "780",
    source_tag: "HSY",
    quote_only: true,
    asset_count: 3,
    images: ["/yachts/ferretti-780-hsy/cover.jpg"],
  },
  {
    slug: "azimut-72-mancusa",
    make: "Azimut",
    length_ft: 72,
    name: "Mancusa",
    quote_only: true,
    asset_count: 4,
    images: ["/yachts/azimut-72-mancusa/cover.jpg"],
  },
  {
    slug: "princess-88-praying-for-overtime",
    make: "Princess",
    length_ft: 88,
    name: "Praying For Overtime",
    quote_only: true,
    asset_count: 3,
    images: ["/yachts/princess-88-praying-for-overtime/cover.jpg"],
  },
  {
    slug: "sunseeker-92-rmm-job",
    make: "Sunseeker",
    length_ft: 92,
    name: "RMM JOB",
    quote_only: true,
    asset_count: 5,
    images: ["/yachts/sunseeker-92-rmm-job/cover.jpg"],
  },
];
