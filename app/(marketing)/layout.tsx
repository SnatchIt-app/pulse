import Nav from "@/components/marketing/Nav";
import Footer from "@/components/marketing/Footer";
import WhatsAppFloatingButton from "@/components/marketing/WhatsAppFloatingButton";
import {
  buildLocalBusinessJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/schema";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = [buildOrganizationJsonLd(), buildWebSiteJsonLd(), buildLocalBusinessJsonLd()];
  return (
    <>
      <Nav />
      <main className="min-h-screen">{children}</main>
      <Footer />
      {/* Floating contact — fixed bottom-right, z-40 (below sticky nav z-50) */}
      <WhatsAppFloatingButton />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
