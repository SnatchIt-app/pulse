// Pulse Journal — SEO articles. One source of truth for metadata, content, and FAQs.
// Each article renders through app/(marketing)/journal/[slug]/page.tsx.
// Keep copy plain-text (no HTML). Internal links live in `internalLinks` and the
// per-section `links` field so the article page renders real <Link> elements.

import type { FaqItem } from "./faqs";

export type JournalLink = { label: string; href: string };

export type JournalSection = {
  heading: string;
  // Each string is one paragraph.
  paragraphs: ReadonlyArray<string>;
  // Optional unordered list rendered under the paragraphs.
  bullets?: ReadonlyArray<string>;
};

export type JournalArticle = {
  slug: string;
  title: string; // SEO <title>
  h1: string;
  description: string; // SEO meta description
  category: string;
  datePublished: string; // ISO date
  dateModified?: string;
  readMinutes: number;
  primaryKeyword: string;
  keywords: ReadonlyArray<string>;
  // Short standfirst shown under the H1 and in the index card.
  excerpt: string;
  intro: ReadonlyArray<string>;
  sections: ReadonlyArray<JournalSection>;
  faqs: ReadonlyArray<FaqItem>;
  internalLinks: ReadonlyArray<JournalLink>;
  cta: { heading: string; body: string };
};

export const ARTICLES: ReadonlyArray<JournalArticle> = [
  {
    slug: "rent-exotic-car-miami-event-weekends",
    title: "How to Rent an Exotic Car in Miami During Major Event Weekends",
    h1: "How to Rent an Exotic Car in Miami During Major Event Weekends",
    description:
      "A practical guide to renting an exotic car in Miami during F1, Art Basel, and World Cup week: when to book, what gets taken first, deposits, delivery, and driving the city when it's full.",
    category: "Guides",
    datePublished: "2026-06-24",
    readMinutes: 7,
    primaryKeyword: "exotic car rental Miami event weekends",
    keywords: [
      "exotic car rental Miami event weekends",
      "rent a supercar Miami F1",
      "Art Basel exotic car rental Miami",
      "World Cup Miami car rental",
      "luxury car rental Miami event week",
    ],
    excerpt:
      "Event weekends are the hardest time to get the car you actually want in Miami. Here is how the timing, the deposits, and the logistics really work, and how to avoid the cars that are left over.",
    intro: [
      "Miami runs on event weekends. The Grand Prix in early May, World Cup matches at Hard Rock Stadium through the summer of 2026, Art Basel and Miami Art Week in early December, plus a steady run of fights, concerts, and boat shows in between. On those weekends the city fills, the calendar tightens, and the best exotic cars go first.",
      "Renting a supercar in Miami on a quiet Tuesday is simple. Renting one the same weekend a hundred thousand visitors land is a different job. This guide covers what actually changes during a major event, when to book, and how to end up with the car you want instead of whatever is left.",
    ],
    sections: [
      {
        heading: "Why event weekends change the rules",
        paragraphs: [
          "During a normal week, most reputable fleets in Miami have cars sitting idle. You can call on Thursday and drive a Lamborghini on Friday. Event weekends remove that slack. Demand spikes, the popular models book out, and rates move up with the season because everyone is chasing the same short window.",
          "The cars people fight over are predictable: the loud, photogenic ones. Lamborghini Huracán and Urus, Ferrari, McLaren, the Rolls-Royce and Bentley for arrivals. Those are the first to go. The deeper into an event weekend you book, the more you are choosing from what nobody else wanted.",
        ],
      },
      {
        heading: "Book earlier than you think",
        paragraphs: [
          "The single biggest mistake is treating an event-weekend rental like a normal one. For a marquee weekend, two to four weeks out is the right window. That is enough time to lock the exact model, color, and dates before they are gone, and to sort the deposit and driver verification without a rush.",
          "If you are inside a week, you can still get a car, but you are negotiating with the leftovers. Reserve the vehicle first and confirm the surrounding details after. Holding the car is what matters; everything else can be finalized once it is yours.",
        ],
      },
      {
        heading: "What gets booked first, and what is left if you wait",
        paragraphs: [
          "Think of it in tiers. The headline supercars and the chauffeur-friendly luxury sedans go first because they cover both jobs people want during an event: be seen, and arrive clean. Mid-tier sports cars hold availability a little longer. By the final days before a big weekend, you are usually left with higher mileage, less popular trims, or nothing at all in the category you wanted.",
          "If a specific car matters to you, name it early. If the experience matters more than the badge, stay flexible on model and you will have more room even close to the date.",
        ],
        bullets: [
          "Goes first: Lamborghini Huracán and Urus, Ferrari, McLaren, Rolls-Royce, Bentley.",
          "Holds longer: mid-tier sports cars, convertibles outside peak color choices.",
          "Last to go: higher-mileage units and less requested trims.",
        ],
      },
      {
        heading: "Delivery usually beats pickup during event traffic",
        paragraphs: [
          "Event weekends turn Miami traffic into a problem. Road closures around the autodrome during the Grand Prix, stadium routing during World Cup matches, and convention and beach congestion during Art Basel all make a trip to a rental counter a waste of your day.",
          "Delivery solves it. A good operator brings the car to your hotel, residence, or the airport corridor, fueled and ready, and collects it the same way at the end. You skip the counter, the parking, and the detour. When you book, confirm the delivery window and the exact handoff point so it lines up with your arrival.",
        ],
      },
      {
        heading: "Know the deposit, the deductible, and the mileage before you sign",
        paragraphs: [
          "Exotic rentals carry a refundable security deposit held against damage and tolls. The amount scales with the value of the car and is confirmed when you get your reservation summary, so there are no surprises at handoff. Expect to show a valid license, proof of insurance, and a matching payment card.",
          "Two numbers decide whether a rate is actually good: the daily mileage allowance and the cost per mile over it. Event weekends mean a lot of short hops across the city, and those miles add up faster than people expect. Ask for the included mileage and the overage rate up front, and ask how fuel and tolls are handled on return.",
        ],
      },
      {
        heading: "Driving the city when it is full",
        paragraphs: [
          "A supercar is the wrong tool for some parts of an event weekend. Stadium and circuit areas have heavy security, limited parking, and tow risk. For the match itself or a packed Art Basel evening, parking a six-figure car on the street is not worth it.",
          "The move most experienced visitors make is to split the weekend. Keep the exotic for the daytime drives, the photos, and the dinners where valet is reliable, and hand the harder logistics to a driver. That keeps the car doing what it is good at without turning your night into a parking problem.",
        ],
      },
      {
        heading: "When a chauffeur makes more sense than the keys",
        paragraphs: [
          "If your weekend is built around a single event with a fixed start time, a chauffeur is often the smarter booking for those hours. No parking, no DUI risk after dinner, no circling a closed stadium. You arrive at the door and leave when you want.",
          "Plenty of Pulse clients run both: an exotic car for the part of the weekend that is about the drive, and a chauffeur for match day or the late nights. The two are easy to combine when one team is handling the whole itinerary.",
        ],
      },
      {
        heading: "How Pulse handles event-weekend rentals",
        paragraphs: [
          "Pulse owns part of its exotic fleet directly and arranges additional vehicles and services through vetted partners, so availability during a busy weekend is handled across our network rather than a single lot. You tell us the dates and the car, and a specialist confirms what is realistic, delivers it where you are staying, and adds a chauffeur, jet, yacht, residence, or dinner reservations around it if you want the rest of the weekend handled too.",
          "Everything is quote-only and depends on the dates, the car, and live availability. The earlier you ask during an event window, the stronger the answer.",
        ],
      },
    ],
    faqs: [
      {
        q: "How far in advance should I rent an exotic car in Miami for an event weekend?",
        a: "For a marquee weekend like the Grand Prix, World Cup matches, or Art Basel, two to four weeks out is ideal. That window lets you lock the exact model and dates before they sell out. Inside a week you can still get a car, but you are choosing from what is left.",
      },
      {
        q: "Which exotic cars book out first during Miami event weekends?",
        a: "The headline supercars and luxury arrivals go first: Lamborghini Huracán and Urus, Ferrari, McLaren, Rolls-Royce, and Bentley. Mid-tier sports cars hold availability longer. If a specific car matters, reserve it early.",
      },
      {
        q: "Can the car be delivered to my hotel during an event weekend?",
        a: "Yes. Delivery is the better option during event traffic. Pulse delivers across Miami, Miami Beach, Brickell, and the airport corridor, fueled and ready, and collects the car the same way. Confirm the delivery window and handoff point when you book.",
      },
      {
        q: "What deposit and documents do I need to rent a supercar in Miami?",
        a: "Expect a refundable security deposit that scales with the value of the car, confirmed on your reservation summary. You will need a valid license, proof of insurance, and a matching payment card. Drivers are typically 25 or older.",
      },
      {
        q: "Is it better to rent an exotic car or hire a chauffeur for a major event?",
        a: "It depends on the day. A chauffeur is usually smarter for the event itself, with no parking, no closed-stadium routing, and no late-night driving. An exotic car is best for daytime drives, photos, and dinners. Many clients book both and combine them.",
      },
    ],
    internalLinks: [
      { label: "Browse the Pulse exotic fleet", href: "/fleet" },
      { label: "Private chauffeur service in Miami", href: "/chauffeur" },
      { label: "World Cup 26 experiences", href: "/experiences/world-cup" },
      { label: "Multi-service luxury experiences", href: "/experiences" },
      { label: "Pulse concierge", href: "/concierge" },
    ],
    cta: {
      heading: "Lock your car before the weekend fills.",
      body: "Tell Pulse the dates and the car you want. A specialist confirms availability, delivers it where you are staying, and handles the rest of the weekend if you want it. Quote-only, and a specialist responds within 15 minutes.",
    },
  },
];

export function getArticle(slug: string): JournalArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

// Newest first for the index.
export const ARTICLES_BY_DATE: ReadonlyArray<JournalArticle> = [...ARTICLES].sort(
  (a, b) => +new Date(b.datePublished) - +new Date(a.datePublished),
);
