import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Pulse",
  description: "How Pulse collects, uses, and protects your personal information.",
  path: "/legal/privacy",
});

const EFFECTIVE_DATE = "May 29, 2025";
const CONTACT_EMAIL = "pulsexotics@exoticsinfo.com";

export default function PrivacyPage() {
  return (
    <Section className="bg-paper pb-32 pt-32 md:pb-40 md:pt-40">
      <Container>
        <div className="max-w-2xl">
          <p className="text-ink/45 text-[10px] uppercase tracking-[0.24em]">Legal</p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl">Privacy Policy</h1>
          <p className="text-ink/50 mt-4 text-sm">Effective {EFFECTIVE_DATE}</p>

          <div className="prose-pulse mt-16 space-y-12 text-sm leading-relaxed">
            {/* 1 */}
            <div>
              <h2 className="font-display text-xl">1. About this policy</h2>
              <p className="text-ink/70 mt-4">
                Pulse (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates this website
                and arranges luxury mobility and concierge services. This policy explains what
                personal data we collect when you interact with our site or submit a service
                request, and how we use and protect that data.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="font-display text-xl">2. Data we collect</h2>
              <p className="text-ink/70 mt-4">
                When you submit a request or inquiry through this site, we collect the information
                you provide: your name, email address, phone number, preferred service, travel or
                booking dates, and any additional details included in your message. We do not
                collect payment card data through this site.
              </p>
              <p className="text-ink/70 mt-4">
                We also collect standard usage data through analytics tools (Google Analytics, Meta
                Pixel) including device type, pages visited, and interaction events. This data is
                aggregated and does not identify you individually.
              </p>
            </div>

            {/* 3 */}
            <div>
              <h2 className="font-display text-xl">3. How we use your data</h2>
              <p className="text-ink/70 mt-4">We use your personal data to:</p>
              <ul className="text-ink/70 mt-3 list-none space-y-2 pl-0">
                {[
                  "Respond to your service inquiry",
                  "Arrange the service you requested, including coordinating with independent operators",
                  "Send you follow-up communications directly related to your request",
                  "Improve our services and website experience",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-ink/30 mt-px">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-ink/70 mt-4">
                We do not use your data for unrelated marketing communications without your explicit
                consent.
              </p>
            </div>

            {/* 4 */}
            <div>
              <h2 className="font-display text-xl">4. Data sharing</h2>
              <p className="text-ink/70 mt-4">
                We share your information only with the independent service operators required to
                fulfill your specific request, such as charter operators, fleet partners, or
                residence managers. We do not sell, rent, or otherwise disclose your personal data
                to unrelated third parties.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="font-display text-xl">5. Data retention</h2>
              <p className="text-ink/70 mt-4">
                Inquiry and lead data is retained for up to 24 months from the date of submission.
                After this period, data is permanently deleted unless an active service relationship
                requires continued retention.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="font-display text-xl">6. Cookies and analytics</h2>
              <p className="text-ink/70 mt-4">
                This site uses Google Analytics and Meta Pixel to understand site traffic and
                improve our service. These tools may set cookies on your device. You may opt out of
                analytics tracking at any time through your browser settings or by using the Google
                Analytics opt-out browser add-on.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="font-display text-xl">7. Your rights</h2>
              <p className="text-ink/70 mt-4">
                You have the right to request access to, correction of, or deletion of any personal
                data we hold about you. To exercise these rights, contact us at the email below. We
                will respond within 30 days.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="font-display text-xl">8. Security</h2>
              <p className="text-ink/70 mt-4">
                We implement appropriate technical and organizational measures to protect your
                personal data against unauthorized access, loss, or disclosure. All data
                transmissions are encrypted via HTTPS.
              </p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="font-display text-xl">9. Changes to this policy</h2>
              <p className="text-ink/70 mt-4">
                We may update this policy from time to time. Material changes will be reflected by
                an updated effective date at the top of this page.
              </p>
            </div>

            {/* 10 */}
            <div className="border-ink/10 border-t pt-10">
              <h2 className="font-display text-xl">Contact</h2>
              <p className="text-ink/70 mt-4">
                For any questions about this policy or to exercise your data rights:
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2 block text-ink transition-opacity hover:opacity-60"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
