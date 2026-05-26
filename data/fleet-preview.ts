// Phase 2 homepage preview only. Real fleet inventory ships from Supabase in Phase 3.
import { HOMEPAGE_MEDIA } from "./media";

export type FleetPreviewItem = {
  slug: string;
  make: string;
  model: string;
  year: number;
  dailyRateFrom: number;
  image: string;
  alt: string;
};

export const FLEET_PREVIEW: ReadonlyArray<FleetPreviewItem> = [
  {
    slug: "lamborghini-urus-2024-black",
    make: "Lamborghini",
    model: "Urus",
    year: 2024,
    dailyRateFrom: 1800,
    image: HOMEPAGE_MEDIA.featured1.placeholder,
    alt: HOMEPAGE_MEDIA.featured1.alt,
  },
  {
    slug: "ferrari-488-spider-2022-rosso",
    make: "Ferrari",
    model: "488 Spider",
    year: 2022,
    dailyRateFrom: 2400,
    image: HOMEPAGE_MEDIA.featured2.placeholder,
    alt: HOMEPAGE_MEDIA.featured2.alt,
  },
  {
    slug: "rolls-royce-cullinan-2023-arctic-white",
    make: "Rolls-Royce",
    model: "Cullinan",
    year: 2023,
    dailyRateFrom: 2900,
    image: HOMEPAGE_MEDIA.featured3.placeholder,
    alt: HOMEPAGE_MEDIA.featured3.alt,
  },
  {
    slug: "mclaren-720s-2022-papaya",
    make: "McLaren",
    model: "720S",
    year: 2022,
    dailyRateFrom: 2600,
    image: HOMEPAGE_MEDIA.featured4.placeholder,
    alt: HOMEPAGE_MEDIA.featured4.alt,
  },
];

export const FLEET_MARQUEE: ReadonlyArray<string> = [
  "LAMBORGHINI URUS",
  "FERRARI 488 SPIDER",
  "ROLLS-ROYCE CULLINAN",
  "McLAREN 720S",
  "BENTLEY CONTINENTAL GT",
  "PORSCHE 911 TURBO S",
  "ASTON MARTIN DBX",
  "ROLLS-ROYCE GHOST",
  "FERRARI SF90",
  "LAMBORGHINI HURACÁN",
];
