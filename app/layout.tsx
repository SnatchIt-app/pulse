import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pulse — Luxury Mobility & Concierge, Miami",
    template: "%s — Pulse",
  },
  description:
    "Pulse — luxury mobility, residences, and concierge in Miami. Exotic cars, jets, yachts, chauffeur, and VIP access. On call.",
  applicationName: "Pulse",
  openGraph: {
    siteName: "Pulse",
    type: "website",
    locale: "en_US",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/api/og"] },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
