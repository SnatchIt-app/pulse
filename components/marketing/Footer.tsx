import Link from "next/link";

const cols: ReadonlyArray<{
  heading: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}> = [
  {
    heading: "Services",
    links: [
      { label: "Fleet", href: "/fleet" },
      { label: "Jets", href: "/jets" },
      { label: "Yachts", href: "/yachts" },
      { label: "Jet Skis", href: "/jet-skis" },
      { label: "Chauffeur", href: "/chauffeur" },
      { label: "Residences", href: "/residences" },
      { label: "Concierge", href: "/concierge" },
    ],
  },
  {
    heading: "Pulse",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Request", href: "/request" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-ink/10 mt-32 border-t bg-paper">
      <div className="mx-auto grid max-w-container grid-cols-1 gap-12 px-6 py-20 md:grid-cols-4 md:px-24">
        <div>
          <p className="font-display text-2xl">Pulse</p>
          <p className="text-ink/60 mt-4 text-sm">Luxury mobility &amp; concierge. Miami.</p>
        </div>
        {cols.map((c) => (
          <div key={c.heading}>
            <p className="text-ink/60 text-xs uppercase tracking-[0.2em]">{c.heading}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-opacity hover:opacity-60">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-ink/10 text-ink/50 border-t px-6 py-6 text-center text-xs">
        © {new Date().getFullYear()} Pulse
      </div>
    </footer>
  );
}
