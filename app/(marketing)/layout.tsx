import Nav from "@/components/marketing/Nav";
import Footer from "@/components/marketing/Footer";
import {
  buildLocalBusinessJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/schema";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = [
    buildOrganizationJsonLd(),
    buildWebSiteJsonLd(),
    buildLocalBusinessJsonLd(),
  ];
  return (
    <>
      <Nav />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
