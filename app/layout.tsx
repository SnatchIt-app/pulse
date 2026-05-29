import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@/styles/globals.css";
import { SITE_URL } from "@/lib/utils";
import { AnalyticsProvider } from "@/components/shared/Analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const isProd = process.env.NODE_ENV === "production";

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
      <body>
        {/* Page-view tracker — fires on every App Router route change */}
        <AnalyticsProvider />

        {children}

        {/* GA4 — production only, manual page views via AnalyticsProvider */}
        {isProd && GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${GA_ID}',{send_page_view:false});
            `}</Script>
          </>
        )}

        {/* Meta Pixel — production only, page views via AnalyticsProvider */}
        {isProd && META_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_ID}');
          `}</Script>
        )}
      </body>
    </html>
  );
}
