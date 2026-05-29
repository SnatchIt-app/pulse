// JSON-LD builders. PUBLIC-FACING ONLY — never accept vendor/internal fields.
// Render via:
//   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(x) }} />

import { SITE_URL } from "./utils";

const PULSE = {
  name: "Pulse",
  url: SITE_URL,
  areaServed: [
    "Miami",
    "Miami Beach",
    "Brickell",
    "South Beach",
    "Wynwood",
    "Design District",
    "Coral Gables",
  ],
  address: { addressLocality: "Miami", addressRegion: "FL", addressCountry: "US" },
  telephone: "+1-000-000-0000",
  email: "hello@pulse.example.com",
} as const;

const cities = () => PULSE.areaServed.map((name) => ({ "@type": "City", name }));

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: PULSE.name,
    url: PULSE.url,
    address: { "@type": "PostalAddress", ...PULSE.address },
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: PULSE.name,
    url: PULSE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${PULSE.url}/fleet?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: PULSE.name,
    url: PULSE.url,
    image: `${PULSE.url}/api/og`,
    telephone: PULSE.telephone,
    email: PULSE.email,
    address: { "@type": "PostalAddress", ...PULSE.address },
    areaServed: cities(),
    priceRange: "$$$$",
  };
}

export function buildServiceJsonLd(input: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    provider: { "@type": "Organization", name: PULSE.name, url: PULSE.url },
    areaServed: cities(),
    url: `${PULSE.url}${input.path}`,
  };
}

export function buildFaqPageJsonLd(items: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function buildBreadcrumbJsonLd(crumbs: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${PULSE.url}${c.path}`,
    })),
  };
}

export type PublicVehicle = {
  slug: string;
  make: string;
  model: string;
  year: number;
  bodyStyle: string;
  seats: number;
  transmission: string;
  dailyRateFrom: number;
};

export function buildVehicleJsonLd(v: PublicVehicle) {
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${v.year} ${v.make} ${v.model}`,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    modelDate: String(v.year),
    bodyType: v.bodyStyle,
    seatingCapacity: v.seats,
    vehicleTransmission: v.transmission,
    url: `${PULSE.url}/fleet/${v.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: v.dailyRateFrom,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: v.dailyRateFrom,
        priceCurrency: "USD",
        unitText: "DAY",
      },
      availability: "https://schema.org/InStock",
    },
  };
}

// Residences — PUBLIC PROJECTION ONLY. Never pass _source, address_private, or price fields.
// All residences are quote_only — no price is stored or exposed publicly.
export type PublicResidence = {
  slug: string;
  title: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: ReadonlyArray<string>;
};

export function buildLodgingBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: `${PULSE.name} Residences`,
    url: `${PULSE.url}/residences`,
    address: { "@type": "PostalAddress", ...PULSE.address },
    areaServed: cities(),
  };
}

export function buildAccommodationJsonLd(r: PublicResidence) {
  return {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: r.title,
    url: `${PULSE.url}/residences/${r.slug}`,
    numberOfBedrooms: r.bedrooms,
    numberOfBathroomsTotal: r.bathrooms,
    occupancy: { "@type": "QuantitativeValue", maxValue: r.maxGuests, unitCode: "C62" },
    amenityFeature: r.amenities.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: r.neighborhood,
      addressRegion: "FL",
      addressCountry: "US",
    },
  };
}
