// City/service keyword matrix (PRD §3.14.7). Used by generateMetadata + alt helpers.
// Placement is natural in titles/H1/H2/body — never stuffed.

export type RouteKey =
  | "/"
  | "/fleet"
  | "/jets"
  | "/yachts"
  | "/jet-skis"
  | "/chauffeur"
  | "/restaurants"
  | "/nightlife"
  | "/concierge"
  | "/residences"
  | "/experiences"
  | "/about"
  | "/contact"
  | "/request";

export type KeywordEntry = {
  primary: string;
  secondary: readonly string[];
  title: string;
  description: string;
};

export const KEYWORDS: Record<RouteKey, KeywordEntry> = {
  "/": {
    primary: "luxury mobility Miami",
    secondary: ["exotic car rental Miami", "luxury concierge Miami"],
    title: "Pulse | Luxury Mobility & Concierge, Miami",
    description:
      "Pulse is a Miami luxury mobility and concierge company. Exotic cars, private jets, yachts, residences, chauffeur, and VIP access, on call.",
  },
  "/fleet": {
    primary: "exotic car rental Miami",
    secondary: ["supercar rental Miami Beach", "luxury car rental Miami"],
    title: "Exotic & Supercar Fleet in Miami",
    description:
      "Pulse's fleet of exotic and supercars for rental in Miami: Lamborghini, Ferrari, McLaren, Rolls-Royce, Bentley.",
  },
  "/jets": {
    primary: "private jet charter Miami",
    secondary: ["private jet rental Miami"],
    title: "Private Jet Charter from Miami",
    description:
      "Private jet charter from Miami via Pulse. Citation, Phenom, Global, with on-call concierge.",
  },
  "/yachts": {
    primary: "yacht charter Miami",
    secondary: ["yacht rental Miami Beach", "luxury yacht Miami"],
    title: "Yacht Charter in Miami",
    description:
      "Yacht charter and day experiences in Miami. Vetted boats, captain and crew, on-water concierge.",
  },
  "/jet-skis": {
    primary: "jet ski rental Miami",
    secondary: ["jet ski rental Miami Beach"],
    title: "Jet Ski Rental in Miami",
    description: "Jet ski rentals across Miami and Miami Beach, delivered to your dock or hotel.",
  },
  "/chauffeur": {
    primary: "private chauffeur Miami",
    secondary: ["luxury chauffeur Miami", "black car service Miami"],
    title: "Private Chauffeur Service in Miami",
    description: "Private, professional chauffeur service across Miami.",
  },
  "/restaurants": {
    primary: "VIP restaurant reservations Miami",
    secondary: ["hard-to-book restaurants Miami"],
    title: "VIP Restaurant Reservations in Miami",
    description:
      "Last-minute and hard-to-book tables at Miami's top restaurants, via Pulse's concierge network.",
  },
  "/nightlife": {
    primary: "VIP nightlife Miami",
    secondary: ["club table service Miami Beach", "bottle service Miami"],
    title: "VIP Nightlife & Club Access in Miami",
    description: "Tables, bottle service, and guest-list access at Miami's top clubs.",
  },
  "/concierge": {
    primary: "luxury concierge Miami",
    secondary: ["VIP concierge Miami"],
    title: "Pulse Concierge | Tell Us What You Want",
    description: "Tell Pulse what you need. We'll handle it. Private, on-call concierge in Miami.",
  },
  "/residences": {
    primary: "luxury homes Miami",
    secondary: [
      "luxury villa rental Miami",
      "private residence Miami",
      "Miami luxury stays",
      "mansion rental Miami",
    ],
    title: "Pulse Residences | Luxury Homes in Miami",
    description:
      "Pulse Residences is a private selection of luxury homes and stays across Miami, Miami Beach, Brickell, and beyond.",
  },
  "/experiences": {
    primary: "luxury experiences Miami",
    secondary: [
      "F1 Miami concierge packages",
      "Art Basel Miami concierge",
      "luxury weekend packages Miami",
      "yacht and supercar Miami",
    ],
    title: "Luxury Experiences in Miami | Pulse",
    description:
      "Pulse arranges multi-service luxury experiences in Miami: supercar weekends, yacht days, private jet stays, Art Basel, F1, and private occasions. Quote-only, handled by one specialist.",
  },
  "/about": {
    primary: "Pulse Miami",
    secondary: [],
    title: "About Pulse",
    description: "Pulse: luxury mobility, residences, and concierge in Miami.",
  },
  "/contact": {
    primary: "contact Pulse Miami",
    secondary: [],
    title: "Contact Pulse",
    description: "Reach the Pulse team. 24/7 concierge.",
  },
  "/request": {
    primary: "request booking Miami",
    secondary: [],
    title: "Request",
    description: "Tell Pulse what you need. A specialist replies within 15 minutes.",
  },
};
