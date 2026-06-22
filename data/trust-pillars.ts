export type TrustPillar = {
  key: string;
  label: string;
  heading: string;
  body: string;
};

export const TRUST_PILLARS: ReadonlyArray<TrustPillar> = [
  {
    key: "vetted",
    label: "Vetted",
    heading: "A vetted fleet, not a marketplace.",
    body: "Every vehicle, vessel, and residence Pulse offers is vetted before it reaches a client. We don't list everything. We list what we'd put a friend in.",
  },
  {
    key: "concierge",
    label: "24/7",
    heading: "A specialist replies within 15 minutes.",
    body: "Requests route to a Pulse specialist on call around the clock. You speak with a person, not a queue.",
  },
  {
    key: "discreet",
    label: "Discreet",
    heading: "Discretion is the brief.",
    body: "Pulse operates under strict client confidentiality. Where you stay, what you drive, and who you bring stay between us.",
  },
];
